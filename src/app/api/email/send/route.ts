import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Resend API integration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "alerts@claimminer.com";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html, rfpData } = await req.json();

    if (!RESEND_API_KEY) {
      console.log("Resend API key not configured. Email would have been sent to:", to);
      return NextResponse.json({ 
        success: true, 
        message: "Email queued (Resend API key not configured - add RESEND_API_KEY to env vars)",
        preview: { to, subject }
      });
    }

    // Build email HTML if rfpData provided
    let emailHtml = html;
    if (rfpData && !html) {
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #10b981; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">ClaimMiner Alert</h1>
          </div>
          <div style="padding: 20px; background: #f8fafc;">
            <h2 style="color: #1e293b;">New RFP Match Found!</h2>
            <p style="color: #64748b;">We found a new government contract that matches your criteria.</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
              <h3 style="color: #1e293b; margin-top: 0;">${rfpData.title}</h3>
              <p><strong>Agency:</strong> ${rfpData.agency}</p>
              <p><strong>Budget:</strong> ${rfpData.budget}</p>
              <p><strong>Due Date:</strong> ${rfpData.due_date}</p>
              <p><strong>Match Score:</strong> ${rfpData.match_score}%</p>
              <p><strong>Location:</strong> ${rfpData.state}</p>
              <p style="color: #64748b;">${rfpData.description}</p>
            </div>

            <a href="https://claimminer-eight.vercel.app/rfps/${rfpData.id}" 
               style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View RFP Details
            </a>
          </div>
          <div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            <p>You're receiving this because you have alerts enabled on ClaimMiner.</p>
            <p><a href="https://claimminer-eight.vercel.app/settings" style="color: #10b981;">Manage Alert Preferences</a></p>
          </div>
        </div>
      `;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html: emailHtml,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      return NextResponse.json({ error: data.message || "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: data.id });
  } catch (error: any) {
    console.error("Email API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
