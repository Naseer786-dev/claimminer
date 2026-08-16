export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await sql`SELECT * FROM rfps WHERE id = ${params.id}`
    if (!result.rows.length) {
      return NextResponse.json({ error: "RFP not found" }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("RFP error:", error.message)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}