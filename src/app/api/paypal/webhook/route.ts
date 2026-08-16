import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const PAYPAL_API_BASE = process.env.NODE_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function verifyWebhookSignature(
  headers: Headers,
  body: string
): Promise<boolean> {
  try {
    const transmissionId = headers.get("paypal-transmission-id");
    const certUrl = headers.get("paypal-cert-url");
    const authAlgo = headers.get("paypal-auth-algo");
    const transmissionSig = headers.get("paypal-transmission-sig");
    const transmissionTime = headers.get("paypal-transmission-time");

    if (!transmissionId || !certUrl || !authAlgo || !transmissionSig || !transmissionTime) {
      return false;
    }

    const accessToken = await getPayPalAccessToken();

    const verifyRes = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: JSON.parse(body),
      }),
    });

    const verifyData = await verifyRes.json();
    return verifyData.verification_status === "SUCCESS";
  } catch {
    return false;
  }
}

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headers = req.headers;

    // In production, verify the webhook signature
    // const isValid = await verifyWebhookSignature(headers, body);
    // if (!isValid) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

    const event = JSON.parse(body);
    const eventType = event.event_type;
    const resource = event.resource;

    console.log("PayPal webhook:", eventType, resource?.id);

    if (eventType === "BILLING.SUBSCRIPTION.CREATED" || eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const subscriptionId = resource.id;
      const planId = resource.plan_id;
      const status = resource.status; // ACTIVE, APPROVED, etc.
      const subscriber = resource.subscriber;
      const userEmail = subscriber?.email_address;
      const startTime = resource.start_time;
      const nextBillingTime = resource.billing_info?.next_billing_time;

      // Map plan_id to plan name
      const planMap: Record<string, string> = {
        [process.env.PAYPAL_PLAN_STARTER || ""]: "starter",
        [process.env.PAYPAL_PLAN_PRO || ""]: "pro",
        [process.env.PAYPAL_PLAN_ENTERPRISE || ""]: "enterprise",
      };
      const planName = planMap[planId] || "starter";

      // Update or insert subscription
      await pool.query(
        `INSERT INTO subscriptions (user_id, plan, status, paypal_subscription_id, paypal_plan_id, current_period_start, current_period_end)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (paypal_subscription_id) 
         DO UPDATE SET status = $3, plan = $2, current_period_start = $6, current_period_end = $7, updated_at = NOW()`,
        [userEmail || "unknown", planName, status.toLowerCase(), subscriptionId, planId, startTime, nextBillingTime]
      );
    }

    if (eventType === "BILLING.SUBSCRIPTION.CANCELLED" || eventType === "BILLING.SUBSCRIPTION.SUSPENDED") {
      const subscriptionId = resource.id;
      await pool.query(
        `UPDATE subscriptions SET status = $1, updated_at = NOW() WHERE paypal_subscription_id = $2`,
        [eventType === "BILLING.SUBSCRIPTION.CANCELLED" ? "cancelled" : "suspended", subscriptionId]
      );
    }

    if (eventType === "BILLING.SUBSCRIPTION.PAYMENT.FAILED") {
      const subscriptionId = resource.id;
      await pool.query(
        `UPDATE subscriptions SET status = 'past_due', updated_at = NOW() WHERE paypal_subscription_id = $1`,
        [subscriptionId]
      );
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
