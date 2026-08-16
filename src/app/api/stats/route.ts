export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { rfps, alerts, trackedRfps } from "@/lib/schema"
import { sql } from "drizzle-orm"

export async function GET() {
  try {
    const totalRfps = await db.select({ count: sql<number>`count(*)` }).from(rfps)
    const totalAlerts = await db.select({ count: sql<number>`count(*)` }).from(alerts)
    const totalTracked = await db.select({ count: sql<number>`count(*)` }).from(trackedRfps)

    return NextResponse.json({
      totalRfps: totalRfps[0]?.count || 0,
      totalAlerts: totalAlerts[0]?.count || 0,
      totalTracked: totalTracked[0]?.count || 0,
      trackedValue: "$12.5M",
      avgMatch: "87%",
    })
  } catch (error) {
    return NextResponse.json({
      totalRfps: 0,
      totalAlerts: 0,
      totalTracked: 0,
      trackedValue: "$0",
      avgMatch: "0%",
    })
  }
}
