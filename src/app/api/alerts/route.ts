import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { alerts, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const createAlertSchema = z.object({
  name: z.string().min(1),
  keywords: z.array(z.string()).optional(),
  naicsCodes: z.array(z.string()).optional(),
  agencyLevel: z.string().optional(),
  states: z.array(z.string()).optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const validated = createAlertSchema.parse(body);

    const user = await db.query.users.findFirst({ where: eq(users.clerkId, userId) });
    if (!user) {
      const [newUser] = await db.insert(users).values({ clerkId: userId, email: "user@example.com", name: "User" }).returning();
      return createAlertForUser(newUser.id, validated);
    }
    return createAlertForUser(user.id, validated);
  } catch (error) {
    console.error("Error creating alert:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function createAlertForUser(userId: string, data: z.infer<typeof createAlertSchema>) {
  const [alert] = await db.insert(alerts).values({
    userId,
    name: data.name,
    keywords: data.keywords,
    naicsCodes: data.naicsCodes,
    agencyLevel: data.agencyLevel,
    states: data.states,
    minValue: data.minValue?.toString(),
    maxValue: data.maxValue?.toString(),
  }).returning();
  return NextResponse.json(alert, { status: 201 });
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.query.users.findFirst({ where: eq(users.clerkId, userId) });
    if (!user) return NextResponse.json([]);

    const alertList = await db.query.alerts.findMany({ where: eq(alerts.userId, user.id) });
    return NextResponse.json(alertList);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
