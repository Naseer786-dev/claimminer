export const dynamic = "force-dynamic"

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { trackedRfps, users } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user.length) return NextResponse.json([])

    const result = await db.select().from(trackedRfps).where(eq(trackedRfps.userId, user[0].id))
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { rfpId, notes } = await req.json()
    const user = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user.length) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const tracked = await db.insert(trackedRfps).values({
      userId: user[0].id,
      rfpId: rfpId,
      notes: notes || "",
    }).returning()

    return NextResponse.json(tracked[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
