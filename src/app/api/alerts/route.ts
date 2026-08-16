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

    const result = await client.query("SELECT * FROM alerts WHERE user_id = $1", [userResult.rows[0].id])
    client.release()
    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error("Alerts GET error:", error.message)
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const client = await pool.connect()

    const userResult = await client.query("SELECT id FROM users WHERE clerk_id = $1", [userId])
    let userDbId = userResult.rows[0]?.id

    if (!userDbId) {
      const newUser = await client.query(
        "INSERT INTO users (clerk_id, email, name) VALUES ($1, $2, $3) RETURNING id",
        [userId, "user@example.com", "User"]
      )
      userDbId = newUser.rows[0].id
    }

    const result = await client.query(
      `INSERT INTO alerts (user_id, name, keywords, naics_codes, agency_level, states, min_value, max_value)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userDbId, body.name, JSON.stringify(body.keywords || []), JSON.stringify(body.naicsCodes || []), body.agencyLevel, JSON.stringify(body.states || []), body.minValue || null, body.maxValue || null]
    )
    client.release()
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("Alerts POST error:", error.message)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}