export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { auth } from "@clerk/nextjs/server"
import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const userResult = await sql`SELECT id FROM users WHERE clerk_id = ${userId}`
    if (!userResult.rows.length) return NextResponse.json([])

    const result = await sql`SELECT * FROM alerts WHERE user_id = ${userResult.rows[0].id}`
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

    const userResult = await sql`SELECT id FROM users WHERE clerk_id = ${userId}`
    let userDbId = userResult.rows[0]?.id

    if (!userDbId) {
      const newUser = await sql`INSERT INTO users (clerk_id, email, name) VALUES (${userId}, 'user@example.com', 'User') RETURNING id`
      userDbId = newUser.rows[0].id
    }

    const result = await sql`
      INSERT INTO alerts (user_id, name, keywords, naics_codes, agency_level, states, min_value, max_value)
      VALUES (${userDbId}, ${body.name}, ${JSON.stringify(body.keywords || [])}, ${JSON.stringify(body.naicsCodes || [])}, ${body.agencyLevel}, ${JSON.stringify(body.states || [])}, ${body.minValue || null}, ${body.maxValue || null})
      RETURNING *
    `
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("Alerts POST error:", error.message)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}