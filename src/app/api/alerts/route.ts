export const dynamic = "force-dynamic"

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { alerts, users } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user.length) return NextResponse.json([])

    const result = await db.select().from(alerts).where(eq(alerts.userId, user[0].id))
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const user = await db.select().from(users).where(eq(users.clerkId, userId))

    let userDbId = user[0]?.id
    if (!userDbId) {
      const newUser = await db.insert(users).values({
        clerkId: userId,
        email: "user@example.com",
        name: "User",
      }).returning()
      userDbId = newUser[0].id
    }

    const alert = await db.insert(alerts).values({
      userId: userDbId,
      name: body.name,
      keywords: body.keywords || [],
      naicsCodes: body.naicsCodes || [],
      agencyLevel: body.agencyLevel,
      states: body.states || [],
      minValue: body.minValue,
      maxValue: body.maxValue,
    }).returning()

    return NextResponse.json(alert[0])
  } catch (error) {
    console.error("Alert creation error:", error)
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}
