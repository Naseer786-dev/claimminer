import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    plan: "free",
    status: "active",
    current_period_end: null,
    paypal_subscription_id: null,
  });
}