import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    count: 3,
    opportunities: [
      {
        id: "demo-1",
        title: "IT Support Services - VA",
        agency: "Dept of Veterans Affairs",
        description: "Comprehensive IT support services for VA facilities nationwide.",
        budget: "$2,400,000",
        postedDate: new Date().toISOString(),
        dueDate: "2026-09-30",
        naicsCode: "541512",
        contractType: "Small Business Set-Aside",
        url: "https://sam.gov",
        source: "SAM.gov",
        matchScore: 94,
      },
      {
        id: "demo-2",
        title: "Cloud Infrastructure - USDA",
        agency: "US Dept of Agriculture",
        description: "Cloud migration and infrastructure management for USDA systems.",
        budget: "$1,800,000",
        postedDate: new Date().toISOString(),
        dueDate: "2026-10-15",
        naicsCode: "541513",
        contractType: "Open Competition",
        url: "https://sam.gov",
        source: "SAM.gov",
        matchScore: 91,
      },
      {
        id: "demo-3",
        title: "Cybersecurity Audit - DHS",
        agency: "Homeland Security",
        description: "Annual cybersecurity audit and compliance assessment.",
        budget: "$3,200,000",
        postedDate: new Date().toISOString(),
        dueDate: "2026-11-01",
        naicsCode: "541519",
        contractType: "HUBZone Set-Aside",
        url: "https://sam.gov",
        source: "SAM.gov",
        matchScore: 88,
      },
    ],
    source: "SAM.gov (Demo Mode - Add SAM_API_KEY for live data)",
    fetchedAt: new Date().toISOString(),
  });
}