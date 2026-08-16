export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { rfps } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await db.select().from(rfps).where(eq(rfps.id, parseInt(params.id)))
    if (!result.length) {
      return NextResponse.json({ error: "RFP not found" }, { status: 404 })
    }
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch RFP" }, { status: 500 })
  }
}
