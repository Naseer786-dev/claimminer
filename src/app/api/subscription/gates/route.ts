import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Plan limits configuration
const PLAN_LIMITS = {
  free: {
    maxRfpsVisible: 5,
    maxAlerts: 0,
    canExport: false,
    canApiAccess: false,
    maxTeamSeats: 1,
  },
  starter: {
    maxRfpsVisible: 50,
    maxAlerts: 5,
    canExport: true,
    canApiAccess: false,
    maxTeamSeats: 1,
  },
  pro: {
    maxRfpsVisible: 999999,
    maxAlerts: 20,
    canExport: true,
    canApiAccess: true,
    maxTeamSeats: 3,
  },
  enterprise: {
    maxRfpsVisible: 999999,
    maxAlerts: 999999,
    canExport: true,
    canApiAccess: true,
    maxTeamSeats: 999999,
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const feature = searchParams.get("feature"); // rfps, alerts, export, api, team

    if (!userId) {
      return NextResponse.json({ allowed: false, reason: "No user ID", limits: PLAN_LIMITS.free });
    }

    // Get user's subscription
    const result = await pool.query(
      `SELECT plan, status FROM subscriptions WHERE user_id = $1 AND status = 'active' ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    const plan = result.rows[0]?.plan || "free";
    const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;

    // Check specific feature
    let allowed = true;
    let reason = "";
    let currentUsage = 0;

    if (feature === "export") {
      allowed = limits.canExport;
      reason = allowed ? "" : "Export requires Starter plan or higher";
    } else if (feature === "api") {
      allowed = limits.canApiAccess;
      reason = allowed ? "" : "API access requires Professional plan or higher";
    } else if (feature === "alerts") {
      // Count user's alerts
      const alertResult = await pool.query(
        `SELECT COUNT(*) as count FROM alerts WHERE user_id = $1`,
        [userId]
      );
      currentUsage = parseInt(alertResult.rows[0]?.count || "0");
      allowed = currentUsage < limits.maxAlerts;
      reason = allowed ? "" : `Alert limit reached (${limits.maxAlerts}). Upgrade to add more.`;
    }

    return NextResponse.json({
      allowed,
      reason,
      plan,
      limits,
      currentUsage,
      feature,
    });
  } catch (error: any) {
    console.error("Feature gate error:", error);
    return NextResponse.json({ allowed: false, reason: error.message }, { status: 500 });
  }
}
