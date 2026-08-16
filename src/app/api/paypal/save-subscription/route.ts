import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId, planId, userId, planName } = await req.json();

    if (!subscriptionId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, status, paypal_subscription_id, paypal_plan_id, current_period_start, current_period_end)
       VALUES ($1, $2, 'active', $3, $4, NOW(), NOW() + INTERVAL '30 days')
       ON CONFLICT (paypal_subscription_id) 
       DO UPDATE SET status = 'active', plan = $2, updated_at = NOW()`,
      [userId, planName, subscriptionId, planId]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save subscription error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
