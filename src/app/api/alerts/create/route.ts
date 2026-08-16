import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const { userId, rfpId, agency, keywords, naicsCode } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Upsert user alert preferences
    await pool.query(
      `INSERT INTO user_alerts (user_id, keywords, agencies, email_enabled)
       VALUES ($1, $2, $3, true)
       ON CONFLICT (user_id)
       DO UPDATE SET
         keywords = CASE 
           WHEN user_alerts.keywords LIKE $4 THEN user_alerts.keywords 
           ELSE CONCAT(user_alerts.keywords, ', ', $4) 
         END,
         agencies = CASE 
           WHEN user_alerts.agencies LIKE $5 THEN user_alerts.agencies 
           ELSE CONCAT(user_alerts.agencies, ', ', $5) 
         END,
         updated_at = NOW()`,
      [userId, keywords, agency, `%${keywords}%`, `%${agency}%`]
    );

    return NextResponse.json({ success: true, message: "Alert saved" });
  } catch (error) {
    console.error("Alert creation error:", error);
    return NextResponse.json(
      { error: "Failed to save alert", details: String(error) },
      { status: 500 }
    );
  }
}
