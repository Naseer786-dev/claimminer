export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { rfps } from "@/lib/schema"

export async function GET(req: Request) {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL?.substring(0, 50))
    const results = await db.select().from(rfps)
    console.log("RFPs found:", results.length)
    return NextResponse.json(results)
  } catch (error: any) {
    console.error("RFPs ERROR:", error.message, error.stack)
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack,
      db_url: process.env.DATABASE_URL?.substring(0, 50)
    }, { status: 500 })
  }
}