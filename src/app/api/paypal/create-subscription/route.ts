import { NextRequest, NextResponse } from "next/server";

const PAYPAL_API_BASE = process.env.NODE_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

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
    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Plan ID required" }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();

    // Create subscription
    const res = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `sub-${Date.now()}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        application_context: {
          brand_name: "ClaimMiner",
          locale: "en-US",
          shipping_preference: "NO_SHIPPING",
          user_action: "SUBSCRIBE_NOW",
          payment_method: {
            payer_selected: "PAYPAL",
            payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
          },
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("PayPal create subscription error:", data);
      return NextResponse.json({ error: data.message || "Failed to create subscription" }, { status: 500 });
    }

    return NextResponse.json({
      subscriptionId: data.id,
      approvalUrl: data.links.find((l: any) => l.rel === "approve")?.href,
    });
  } catch (error: any) {
    console.error("PayPal API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
