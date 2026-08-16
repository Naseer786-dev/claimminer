export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const rfpsCount = await sql`SELECT COUNT(*) as count FROM rfps`
    const alertsCount = await sql`SELECT COUNT(*) as count FROM alerts`
    const trackedCount = await sql`SELECT COUNT(*) as count FROM tracked_rfps`

    return NextResponse.json({
      totalRfps: parseInt(rfpsCount.rows[0]?.count || "0"),
      totalAlerts: parseInt(alertsCount.rows[0]?.count || "0"),
      totalTracked: parseInt(trackedCount.rows[0]?.count || "0"),
      trackedValue: "$12.5M",
      avgMatch: "87%",
    })
  } catch (error: any) {
    console.error("Stats error:", error.message)
    return NextResponse.json({
      totalRfps: 0, totalAlerts: 0, totalTracked: 0,
      trackedValue: "$0", avgMatch: "0%",
    })
  }
}