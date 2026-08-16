export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { rfps } from "@/lib/schema"
import { sql } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const agency = searchParams.get("agency")
    const level = searchParams.get("level")
    const state = searchParams.get("state")
    const search = searchParams.get("search")
    const minValue = searchParams.get("minValue")

    let query = db.select().from(rfps)

    const conditions = []
    if (agency && agency !== "all") conditions.push(sql`${rfps.agencyLevel} = ${agency}`)
    if (level && level !== "all") conditions.push(sql`${rfps.agencyLevel} = ${level}`)
    if (state && state !== "all") conditions.push(sql`${rfps.state} = ${state}`)
    if (search) conditions.push(sql`${rfps.title} ILIKE ${"%" + search + "%"}`)
    if (minValue) conditions.push(sql`${rfps.value} >= ${minValue}`)

    const results = await query
    return NextResponse.json(results)
  } catch (error) {
    console.error("RFPs error:", error)
    return NextResponse.json({ error: "Failed to fetch RFPs" }, { status: 500 })
  }
}
