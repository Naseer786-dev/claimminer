import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://claimminer-eight.vercel.app";

export async function POST(req: NextRequest) {
  try {
    const { to } = await req.json();

    if (!to) {
      return NextResponse.json({ error: "Email 'to' required" }, { status: 400 });
    }

    const rfps = [
      {
        title: "IT Support Services - VA",
        agency: "Dept of Veterans Affairs",
        budget: "$2,500,000",
        dueDate: "2026-09-15",
        description: "Comprehensive IT support services for VA facilities.",
        url: "https://sam.gov",
      },
      {
        title: "Cloud Migration - USDA",
        agency: "US Dept of Agriculture",
        budget: "$8,750,000",
        dueDate: "2026-10-01",
        description: "Enterprise cloud migration project.",
        url: "https://sam.gov",
      },
    ];

    const emailRes = await fetch(`${APP_URL}/api/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        subject: `🚨 ${rfps.length} New Government RFPs Match Your Alerts`,
        html: generateTestEmail(rfps),
      }),
    });

    const emailData = await emailRes.json();

    return NextResponse.json({
      success: emailRes.ok,
      emailId: emailData.id,
      message: emailRes.ok ? "Test email sent!" : "Failed to send email",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send test email", details: String(error) },
      { status: 500 }
    );
  }
}

function generateTestEmail(rfps: any[]) {
  const rows = rfps.map(rfp => `
    <div style="margin-bottom:20px;padding:16px;background:#f8fafc;border-radius:8px;">
      <div style="font-weight:700;color:#0f172a;font-size:16px;">${rfp.title}</div>
      <div style="color:#64748b;font-size:14px;margin-top:4px;">${rfp.agency} &bull; ${rfp.budget} &bull; Due: ${rfp.dueDate}</div>
      <a href="${rfp.url}" style="display:inline-block;margin-top:8px;background:#10b981;color:white;padding:8px 16px;text-decoration:none;border-radius:6px;font-size:14px;">View RFP</a>
    </div>
  `).join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
      <h1 style="color:#0f172a;">🚨 New RFP Alerts</h1>
      <p style="color:#64748b;">Latest government contracts matching your criteria:</p>
      ${rows}
      <p style="color:#94a3b8;font-size:12px;margin-top:32px;">This is a test email from ClaimMiner.</p>
    </div>
  `;
}
