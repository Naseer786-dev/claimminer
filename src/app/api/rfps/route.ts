export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { Pool } from "pg"
import { NextResponse } from "next/server"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET(req: Request) {
  try {
    const client = await pool.connect()
    const result = await client.query("SELECT * FROM rfps ORDER BY id DESC")
    client.release()
    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error("RFPs error:", error.message)
    return NextResponse.json([], { status: 200 })
  }
}