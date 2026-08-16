export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { auth } from "@clerk/nextjs/server"
import { Pool } from "pg"
import { NextResponse } from "next/server"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const client = await pool.connect()
    const userResult = await client.query("SELECT id FROM users WHERE clerk_id = $1", [userId])
    if (!userResult.rows.length) {
      client.release()
      return NextResponse.json([])
    }

    const result = await client.query("SELECT * FROM tracked_rfps WHERE user_id = $1", [userResult.rows[0].id])
    client.release()
    return NextResponse.json(result.rows)
  } catch (error: any) {
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { rfpId, notes } = await req.json()
    const client = await pool.connect()
    const userResult = await client.query("SELECT id FROM users WHERE clerk_id = $1", [userId])
    if (!userResult.rows.length) {
      client.release()
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const result = await client.query(
      "INSERT INTO tracked_rfps (user_id, rfp_id, notes) VALUES ($1, $2, $3) RETURNING *",
      [userResult.rows[0].id, rfpId, notes || ""]
    )
    client.release()
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}