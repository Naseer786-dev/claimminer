import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // FIX: Return free plan if no userId (prevents 400 error)
    if (!userId || userId === "undefined" || userId === "null") {
      return NextResponse.json({
        plan: "free",
        status: "active",
        current_period_end: null,
        paypal_subscription_id: null,
      });
    }

    const result = await pool.query(
      `SELECT plan, status, paypal_subscription_id, current_period_end 
       FROM subscriptions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        plan: "free",
        status: "active",
        current_period_end: null,
        paypal_subscription_id: null,
      });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Subscription status error:", error);
    // FIX: Return free plan on error so page doesn't break
    return NextResponse.json({
      plan: "free",
      status: "active",
      current_period_end: null,
      paypal_subscription_id: null,
    });
  }
}
