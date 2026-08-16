export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const result = await sql`SELECT * FROM rfps ORDER BY id DESC`
    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error("RFPs error:", error.message)
    return NextResponse.json([], { status: 200 })
  }
}