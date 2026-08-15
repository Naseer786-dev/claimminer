import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rfps } from "@/lib/schema";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const level = searchParams.get("level");
    const setAside = searchParams.get("setAside");

    let conditions = [];
    if (query) conditions.push(sql`(${rfps.title} ILIKE ${`%${query}%`} OR ${rfps.agency} ILIKE ${`%${query}%`})`);
    if (level && level !== "all") conditions.push(sql`${rfps.agencyLevel} = ${level}`);
    if (setAside) conditions.push(sql`${rfps.setAside} = ${setAside}`);

    const rfpList = await db.query.rfps.findMany({
      where: conditions.length > 0 ? sql.join(conditions, sql` AND `) : undefined,
      orderBy: (rfps, { desc }) => [desc(rfps.postedDate)],
      limit: 50,
    });

    return NextResponse.json(rfpList);
  } catch (error) {
    console.error("Error fetching RFPs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
