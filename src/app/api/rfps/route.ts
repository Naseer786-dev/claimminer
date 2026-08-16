export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { rfps } from "@/lib/schema"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const agency = searchParams.get("agency")
    const level = searchParams.get("level")
    const state = searchParams.get("state")
    const search = searchParams.get("search")

    let query = db.select().from(rfps)
    const results = await query
    return NextResponse.json(results)
  } catch (error) {
    console.error("RFPs error:", error)
    return NextResponse.json([], { status: 200 })
  }
}