import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Gracefully return free plan for missing/invalid userId
    if (!userId || userId === "undefined" || userId === "null") {
      return NextResponse.json({
        plan: "free",
        status: "active",
        current_period_end: null,
        paypal_subscription_id: null,
      });
    }

    // If you have a database, query it here. Otherwise return free plan.
    return NextResponse.json({
      plan: "free",
      status: "active",
      current_period_end: null,
      paypal_subscription_id: null,
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    return NextResponse.json({
      plan: "free",
      status: "active",
      current_period_end: null,
      paypal_subscription_id: null,
    });
  }
}