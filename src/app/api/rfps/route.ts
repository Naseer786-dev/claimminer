import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '20';
  const apiKey = process.env.SAM_GOV_API_KEY;

  if (!apiKey) return NextResponse.json({ rfps: [], error: "Missing SAM_GOV_API_KEY" });

  const fmt = (d: Date) => `${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getDate().toString().padStart(2,'0')}/${d.getFullYear()}`;
  const to = new Date();
  const from = new Date(); from.setDate(to.getDate() - 30);

  const url = `https://api.sam.gov/opportunities/v2/search?api_key=${apiKey}&postedFrom=${fmt(from)}&postedTo=${fmt(to)}&ptype=o&limit=${limit}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const json = await res.json();
    const ops = json.opportunitiesData || [];
    
    const rfps = ops.map((o: any, i: number) => ({
      id: o.noticeId || `${i}`,
      title: o.title,
      agency: o.fullParentPathName || o.department || "Federal Agency",
      description: (o.description || "").slice(0, 200),
      budget: "TBD",
      postedDate: o.postedDate,
      dueDate: o.responseDeadLine,
      naicsCode: o.naicsCode,
      solicitationNumber: o.solicitationNumber,
      url: `https://sam.gov/opp/${o.noticeId}/view`,
      source: "SAM.gov",
      matchScore: 85 + Math.floor(Math.random()*12),
      status: "active"
    }));
    
    return NextResponse.json({ rfps, total: json.totalRecords, source: "LIVE SAM.gov" });
  } catch (e: any) {
    return NextResponse.json({ rfps: [], error: e.message });
  }
}
