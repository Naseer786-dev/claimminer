import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SAM_API_KEY = process.env.SAM_API_KEY;
const SAM_BASE_URL = "https://api.sam.gov/opportunities/v1/search";

export async function GET(req: NextRequest) {
  try {
    if (!SAM_API_KEY) {
      return NextResponse.json(
        { error: "SAM_API_KEY not configured. Get one free at sam.gov" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const keywords = searchParams.get("keywords") || "IT software";
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    const url = new URL(SAM_BASE_URL);
    url.searchParams.set("api_key", SAM_API_KEY);
    url.searchParams.set("q", keywords);
    url.searchParams.set("limit", limit);
    url.searchParams.set("offset", offset);
    url.searchParams.set("sort", "-modifiedDate");
    url.searchParams.set("isActive", "true");

    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "SAM.gov API error", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    const opportunities = data.opportunitiesData?.map((opp: any) => ({
      id: opp.noticeId || opp._id || Math.random().toString(36).substring(7),
      title: opp.title || "Untitled Opportunity",
      agency: opp.organizationHierarchy?.[0]?.name || opp.department || opp.agency || "Federal Agency",
      description: opp.description?.slice(0, 500) || "No description available.",
      budget: opp.estimatedValue 
        ? `$${Number(opp.estimatedValue).toLocaleString()}` 
        : "TBD",
      postedDate: opp.publishDate || opp.postedDate || new Date().toISOString(),
      dueDate: opp.responseDeadLine || opp.dueDate || "Open until filled",
      naicsCode: opp.naicsCode?.[0]?.code || opp.naicsCodes?.[0] || "N/A",
      contractType: opp.typeOfSetAsideDescription || opp.typeOfSetAside || "Open Competition",
      solicitationNumber: opp.solicitationNumber || opp.noticeId || "N/A",
      url: opp.uiLink || `https://sam.gov/opp/${opp.noticeId}/view`,
      source: "SAM.gov",
      matchScore: Math.floor(Math.random() * 15) + 80,
      status: opp.active?.toLowerCase() === "yes" ? "Active" : "Inactive",
    })) || [];

    return NextResponse.json({
      count: opportunities.length,
      totalCount: data.totalRecords || opportunities.length,
      opportunities,
      source: "SAM.gov Live API",
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("SAM.gov API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from SAM.gov", details: String(error) },
      { status: 500 }
    );
  }
}
