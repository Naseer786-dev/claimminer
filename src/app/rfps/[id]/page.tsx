import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, DollarSign, Building2, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const rfps = [
  { id: "1", title: "IT Support Services", agency: "Dept of Veterans Affairs", level: "Federal", state: null, value: 2500000, deadline: "2026-08-25", score: 96, setAside: "Small Business", naics: "541511", description: "Comprehensive IT support services including help desk, network administration, and system maintenance for VA facilities nationwide." },
  { id: "2", title: "Cybersecurity Assessment", agency: "State of Texas", level: "State", state: "TX", value: 450000, deadline: "2026-09-03", score: 91, setAside: null, naics: "541512", description: "State-wide cybersecurity risk assessment and vulnerability testing for critical infrastructure systems." },
  { id: "3", title: "Cloud Migration Project", agency: "City of Austin", level: "Local", state: "TX", value: 180000, deadline: "2026-08-30", score: 88, setAside: "Woman-Owned", naics: "541519", description: "Migrate city government systems to cloud infrastructure including data migration and staff training." },
  { id: "4", title: "Network Infrastructure", agency: "Dept of Defense", level: "Federal", state: null, value: 8200000, deadline: "2026-09-15", score: 85, setAside: "SDVOSB", naics: "541513", description: "Design and implementation of secure network infrastructure for DoD operations." },
  { id: "5", title: "Software Development", agency: "State of California", level: "State", state: "CA", value: 1200000, deadline: "2026-08-28", score: 82, setAside: "Small Business", naics: "541511", description: "Custom software development for state welfare management system." },
  { id: "6", title: "Data Analytics Platform", agency: "City of New York", level: "Local", state: "NY", value: 350000, deadline: "2026-09-10", score: 79, setAside: null, naics: "541519", description: "Build analytics dashboard for city transportation data." },
]

export default function RfpDetailPage({ params }: { params: { id: string } }) {
  const rfp = rfps.find(r => r.id === params.id)
  if (!rfp) return notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/rfps" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to RFPs
      </Link>
      
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{rfp.title}</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> {rfp.agency} · {rfp.level}{rfp.state ? `, ${rfp.state}` : ''}
          </p>
        </div>
        <Badge variant={rfp.score >= 90 ? 'default' : rfp.score >= 80 ? 'secondary' : 'outline'}>
          {rfp.score}% match
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-2 text-slate-500 mb-1"><DollarSign className="w-4 h-4" /> Value</div><p className="text-xl font-semibold">${(rfp.value / 1000000).toFixed(1)}M</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-2 text-slate-500 mb-1"><Calendar className="w-4 h-4" /> Due Date</div><p className="text-xl font-semibold">{new Date(rfp.deadline).toLocaleDateString()}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-2 text-slate-500 mb-1"><Tag className="w-4 h-4" /> NAICS</div><p className="text-xl font-semibold">{rfp.naics}</p></CardContent></Card>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Description</CardTitle></CardHeader>
        <CardContent><p className="text-slate-700 leading-relaxed">{rfp.description}</p></CardContent>
      </Card>

      <div className="flex gap-3">
        <Button>Track This RFP</Button>
        <Button variant="outline">Download Documents</Button>
      </div>
    </div>
  )
}