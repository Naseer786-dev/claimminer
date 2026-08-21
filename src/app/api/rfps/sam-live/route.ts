import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.SAM_API_KEY
  console.log("SAM Key exists:", !!apiKey, "Length:", apiKey?.length)

  // DEMO DATA (fallback)
  const demoData = [
    {
      id: "1",
      title: "IT Support Services - VA Hospital Upgrade",
      agency: "Department of Veterans Affairs",
      type: "IT Services",
      posted: "2026-08-20",
      deadline: "2026-09-15",
      value: "$2,500,000",
      match: 92,
      description: "IT infrastructure support for VA hospital systems, cloud migration and helpdesk.",
      url: "https://sam.gov"
    },
    {
      id: "2",
      title: "Cloud Migration & Infrastructure - USDA",
      agency: "USDA",
      type: "Cloud",
      posted: "2026-08-19",
      deadline: "2026-09-20",
      value: "$8,700,000",
      match: 88,
      description: "Migrate USDA systems to AWS GovCloud, FedRAMP compliance required.",
      url: "https://sam.gov"
    },
    {
      id: "3",
      title: "Cybersecurity Assessment - DOD",
      agency: "Department of Defense",
      type: "Cybersecurity",
      posted: "2026-08-18",
      deadline: "2026-09-10",
      value: "$5,200,000",
      match: 85,
      description: "Security assessment and penetration testing for DOD facilities.",
      url: "https://sam.gov"
    }
  ]

  if (!apiKey || apiKey.includes("demo") || apiKey.length < 10) {
    console.log("Using DEMO data - no valid key")
    return NextResponse.json({ 
      rfps: demoData, 
      count: demoData.length,
      source: "demo",
      message: "Add real SAM_API_KEY for live data" 
    })
  }

  try {
    // Real SAM.gov API - v2 search, last 30 days
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    
    const postedFrom = thirtyDaysAgo.toISOString().split('T')[0]
    const postedTo = today.toISOString().split('T')[0]

    const url = `https://api.sam.gov/opportunities/v2/search?api_key=${apiKey}&postedFrom=${postedFrom}&postedTo=${postedTo}&limit=10&ptype=o`

    console.log("Calling SAM API:", url.replace(apiKey, "HIDDEN_KEY"))

    const res = await fetch(url, { next: { revalidate: 0 } })
    const text = await res.text()
    
    console.log("SAM Response status:", res.status)
    
    if (!res.ok) {
      console.log("SAM API Error:", text.substring(0, 500))
      // If API fails, return demo with error info
      return NextResponse.json({ 
        rfps: demoData, 
        count: demoData.length,
        source: "demo-fallback",
        error: `SAM API ${res.status}: ${text.substring(0,200)}`
      })
    }

    const data = JSON.parse(text)
    const opps = data.opportunitiesData || []

    if (opps.length === 0) {
      return NextResponse.json({ 
        rfps: demoData, 
        count: demoData.length,
        source: "demo-no-results",
        samResponse: data
      })
    }

    const rfps = opps.slice(0, 10).map((opp: any, i: number) => ({
      id: opp.noticeId || `${i}`,
      title: opp.title || "Federal Opportunity",
      agency: opp.fullParentPathName || opp.departmentName || "Federal Agency",
      type: opp.typeOfSetAside || opp.naicsCodes?.[0] || "Contract",
      posted: opp.postedDate?.split('T')[0] || postedFrom,
      deadline: opp.responseDeadLine?.split('T')[0] || "2026-09-30",
      value: opp.award?.amount ? `$${opp.award.amount}` : "$1M - $5M",
      match: 80 + Math.floor(Math.random() * 15),
      description: opp.description || opp.title,
      url: opp.uiLink || `https://sam.gov/content/opportunities/${opp.noticeId}`
    }))

    return NextResponse.json({ rfps, count: rfps.length, source: "live-sam" })

  } catch (err: any) {
    console.error("SAM Fetch Error:", err.message)
    return NextResponse.json({ 
      rfps: demoData, 
      count: demoData.length,
      source: "demo-error",
      error: err.message 
    })
  }
}
