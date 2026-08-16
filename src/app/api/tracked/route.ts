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

    const result = await sql`SELECT * FROM tracked_rfps WHERE user_id = ${userResult.rows[0].id}`
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
    const userResult = await sql`SELECT id FROM users WHERE clerk_id = ${userId}`
    if (!userResult.rows.length) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const result = await sql`INSERT INTO tracked_rfps (user_id, rfp_id, notes) VALUES (${userResult.rows[0].id}, ${rfpId}, ${notes || ""}) RETURNING *`
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}