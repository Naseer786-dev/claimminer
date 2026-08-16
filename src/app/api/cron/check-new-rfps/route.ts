import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://claimminer-eight.vercel.app";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const samResponse = await fetch(
      `${APP_URL}/api/rfps/sam-live?limit=5`,
      { next: { revalidate: 0 } }
    );

    if (!samResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch from SAM.gov" }, { status: 502 });
    }

    const samData = await samResponse.json();
    const newRfps = samData.opportunities || [];

    if (newRfps.length === 0) {
      return NextResponse.json({ message: "No new RFPs found", sent: 0 });
    }

    let users: any[] = [];
    try {
      const usersResult = await pool.query(`
        SELECT DISTINCT u.email, u.id 
        FROM users u 
        JOIN user_alerts ua ON u.id = ua.user_id 
        WHERE ua.email_enabled = true
      `);
      users = usersResult.rows;
    } catch (dbError) {
      console.log("No user_alerts table yet or no subscribers.", dbError);
    }

    let sentCount = 0;
    for (const user of users) {
      const emailHtml = generateAlertEmail(newRfps, user.email);

      await fetch(`${APP_URL}/api/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          subject: `🚨 ${newRfps.length} New Government RFP${newRfps.length > 1 ? "s" : ""} Match Your Alerts`,
          html: emailHtml,
        }),
      });
      sentCount++;
    }

    return NextResponse.json({
      message: "Alerts processed successfully",
      newRfps: newRfps.length,
      subscribers: users.length,
      emailsSent: sentCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json(
      { error: "Cron job failed", details: String(error) },
      { status: 500 }
    );
  }
}

function generateAlertEmail(rfps: any[], email: string) {
  const rfpRows = rfps.map((rfp) => `
    <tr>
      <td style="padding:16px;border-bottom:1px solid #e5e7eb;">
        <div style="font-weight:700;color:#0f172a;font-size:16px;margin-bottom:4px;">${rfp.title}</div>
        <div style="color:#64748b;font-size:14px;line-height:1.5;">
          <strong>${rfp.agency}</strong> &bull; Budget: ${rfp.budget} &bull; Due: ${rfp.dueDate}
        </div>
        <div style="color:#475569;font-size:13px;margin-top:8px;line-height:1.5;">
          ${rfp.description?.substring(0, 200)}${rfp.description?.length > 200 ? "..." : ""}
        </div>
        <div style="margin-top:12px;">
          <a href="${rfp.url}" style="background:#10b981;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;display:inline-block;">View on SAM.gov &rarr;</a>
          <a href="${APP_URL}/rfps" style="background:#f1f5f9;color:#334155;padding:10px 20px;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;display:inline-block;margin-left:8px;">Open ClaimMiner</a>
        </div>
      </td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f1f5f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
        <tr><td style="background:#0f172a;padding:40px 32px;text-align:center;">
          <div style="color:#10b981;font-size:28px;font-weight:800;letter-spacing:-0.5px;">ClaimMiner</div>
          <div style="color:#94a3b8;font-size:14px;margin-top:6px;font-weight:500;">Government Contract Intelligence</div>
        </td></tr>
        <tr><td style="padding:40px 32px;">
          <h1 style="color:#0f172a;font-size:22px;margin:0 0 8px 0;font-weight:700;">🚨 New RFPs Available</h1>
          <p style="color:#64748b;font-size:15px;margin:0 0 28px 0;line-height:1.6;">
            We found <strong style="color:#0f172a;">${rfps.length} new government contract${rfps.length > 1 ? "s" : ""}</strong> that match your alert criteria.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rfpRows}</table>
          <div style="text-align:center;margin-top:36px;padding-top:24px;border-top:1px solid #e2e8f0;">
            <a href="${APP_URL}/rfps" style="background:#10b981;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;display:inline-block;box-shadow:0 4px 6px -1px rgba(16,185,129,0.2);">View All RFPs on ClaimMiner &rarr;</a>
          </div>
        </td></tr>
        <tr><td style="padding:24px 32px;background:#f8fafc;text-align:center;">
          <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">You\'re receiving this because you enabled RFP alerts on ClaimMiner.</p>
          <a href="${APP_URL}/settings/alerts" style="color:#64748b;font-size:13px;text-decoration:underline;">Manage Alert Preferences</a>
          <p style="margin:16px 0 0 0;color:#cbd5e1;font-size:12px;">ClaimMiner &bull; Government Contract Intelligence Platform</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
