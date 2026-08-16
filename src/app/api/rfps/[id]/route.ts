export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { Pool } from "pg"
import { NextResponse } from "next/server"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect()
    const result = await client.query("SELECT * FROM rfps WHERE id = $1", [params.id])
    client.release()
    if (!result.rows.length) {
      return NextResponse.json({ error: "RFP not found" }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("RFP error:", error.message)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}