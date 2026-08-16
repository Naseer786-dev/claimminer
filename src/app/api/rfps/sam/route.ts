import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// SAM.gov API base URL
const SAM_API_BASE = "https://sam.gov/api/prod/opportunities/v1/search";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "20");

    // For demo purposes, we'll create realistic mock data based on real SAM.gov format
    // In production, you would call the actual SAM.gov API with your API key
    // const apiKey = process.env.SAM_GOV_API_KEY;
    // const samResponse = await fetch(`${SAM_API_BASE}?api_key=${apiKey}&page=${page}&limit=${limit}`);

    // Mock real government RFPs (based on actual SAM.gov data structure)
    const mockRfps = [
      {
        id: 1001,
        title: "IT Support Services - Department of Veterans Affairs",
        agency: "Department of Veterans Affairs",
        state: "VA",
        budget: "$2,500,000",
        match_score: 92,
        agency_level: "Federal",
        due_date: "2026-09-30",
        description: "The VA requires comprehensive IT support services including help desk, network administration, and cybersecurity monitoring for 500+ users across 3 facilities.",
        naics_code: "541511",
        status: "active",
        posted_date: "2026-08-01",
        solicitation_number: "36C10B26Q0001",
        contract_type: "Fixed Price",
        set_aside: "Small Business",
      },
      {
        id: 1002,
        title: "Cloud Migration and Modernization - USDA",
        agency: "US Department of Agriculture",
        state: "DC",
        budget: "$8,750,000",
        match_score: 88,
        agency_level: "Federal",
        due_date: "2026-10-15",
        description: "USDA seeks a contractor to migrate 200+ legacy applications to cloud infrastructure (AWS/Azure), including data migration, security compliance, and staff training.",
        naics_code: "541512",
        status: "active",
        posted_date: "2026-08-05",
        solicitation_number: "AG-3F-26-0002",
        contract_type: "Time & Materials",
        set_aside: "None",
      },
      {
        id: 1003,
        title: "Cybersecurity Assessment - State of Texas",
        agency: "Texas Department of Information Resources",
        state: "TX",
        budget: "$1,200,000",
        match_score: 85,
        agency_level: "State",
        due_date: "2026-09-20",
        description: "Comprehensive cybersecurity risk assessment for state agencies including penetration testing, vulnerability scanning, and remediation planning.",
        naics_code: "541519",
        status: "active",
        posted_date: "2026-08-10",
        solicitation_number: "DIR-2026-CS-003",
        contract_type: "Fixed Price",
        set_aside: "Small Business",
      },
      {
        id: 1004,
        title: "Software Development - City of San Francisco",
        agency: "SF Department of Technology",
        state: "CA",
        budget: "$3,400,000",
        match_score: 90,
        agency_level: "Local",
        due_date: "2026-10-01",
        description: "Custom software development for city services portal including mobile app, API integration with legacy systems, and citizen engagement platform.",
        naics_code: "541511",
        status: "active",
        posted_date: "2026-08-12",
        solicitation_number: "SF-DT-26-004",
        contract_type: "Fixed Price",
        set_aside: "Local Business",
      },
      {
        id: 1005,
        title: "Data Analytics Platform - Department of Education",
        agency: "US Department of Education",
        state: "DC",
        budget: "$5,600,000",
        match_score: 87,
        agency_level: "Federal",
        due_date: "2026-11-01",
        description: "Enterprise data analytics platform for student performance tracking, predictive modeling, and reporting dashboards for 50+ state education agencies.",
        naics_code: "541512",
        status: "active",
        posted_date: "2026-08-15",
        solicitation_number: "ED-OS-OPE-26-005",
        contract_type: "Time & Materials",
        set_aside: "None",
      },
      {
        id: 1006,
        title: "Network Infrastructure Upgrade - DHS",
        agency: "Department of Homeland Security",
        state: "DC",
        budget: "$12,000,000",
        match_score: 94,
        agency_level: "Federal",
        due_date: "2026-10-30",
        description: "Complete network infrastructure upgrade including SD-WAN deployment, zero-trust architecture implementation, and 24/7 NOC services.",
        naics_code: "541513",
        status: "active",
        posted_date: "2026-08-18",
        solicitation_number: "HSHQDC-26-Q-00006",
        contract_type: "Fixed Price",
        set_aside: "Small Business",
      },
      {
        id: 1007,
        title: "IT Help Desk Services - State of Florida",
        agency: "Florida Agency for State Technology",
        state: "FL",
        budget: "$4,200,000",
        match_score: 81,
        agency_level: "State",
        due_date: "2026-09-25",
        description: "24/7 IT help desk services for 15,000+ state employees including phone, email, chat support, and on-site dispatch.",
        naics_code: "541519",
        status: "active",
        posted_date: "2026-08-20",
        solicitation_number: "AST-2026-IT-007",
        contract_type: "Time & Materials",
        set_aside: "Small Business",
      },
      {
        id: 1008,
        title: "AI-Powered Document Processing - GSA",
        agency: "General Services Administration",
        state: "DC",
        budget: "$6,800,000",
        match_score: 89,
        agency_level: "Federal",
        due_date: "2026-11-15",
        description: "AI/ML solution for automated document classification, data extraction, and workflow routing for federal procurement documents.",
        naics_code: "541511",
        status: "active",
        posted_date: "2026-08-22",
        solicitation_number: "GSA-FAS-26-008",
        contract_type: "Fixed Price",
        set_aside: "None",
      },
    ];

    // Calculate pagination
    const total = mockRfps.length;
    const start = page * limit;
    const end = start + limit;
    const paginatedRfps = mockRfps.slice(start, end);

    return NextResponse.json({
      rfps: paginatedRfps,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      source: "sam.gov",
    });
  } catch (error: any) {
    console.error("SAM.gov API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
