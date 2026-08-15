import Link from 'next/link'
import { FileText, Bookmark, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const rfps = [
  { id: "1", title: "IT Support Services", agency: "Dept of Veterans Affairs", level: "Federal", value: 2500000, deadline: "2026-08-25", status: "Open", setAside: "Small Business", naics: "541511" },
  { id: "2", title: "Cybersecurity Assessment", agency: "State of Texas", level: "State", value: 450000, deadline: "2026-09-03", status: "Open", setAside: null, naics: "541512" },
  { id: "3", title: "Cloud Migration Project", agency: "City of Austin", level: "Local", value: 180000, deadline: "2026-08-30", status: "Closing Soon", setAside: "Woman-Owned", naics: "541519" },
  { id: "4", title: "Network Infrastructure", agency: "Dept of Defense", level: "Federal", value: 8200000, deadline: "2026-09-15", status: "Open", setAside: "SDVOSB", naics: "541513" },
  { id: "5", title: "Software Development", agency: "State of California", level: "State", value: 1200000, deadline: "2026-08-28", status: "Closing Soon", setAside: "Small Business", naics: "541511" },
  { id: "6", title: "Data Analytics Platform", agency: "City of New York", level: "Local", value: 350000, deadline: "2026-09-10", status: "Open", setAside: null, naics: "541519" },
]

export default function RfpsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">RFPs</h1>
          <p className="text-slate-500 text-sm mt-1">{rfps.length} active opportunities found</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input placeholder="Search RFPs..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">RFP</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Agency</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Value</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Deadline</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {rfps.map((rfp) => (
                <tr key={rfp.id} className="border-b hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">{rfp.title}</p>
                        <p className="text-xs text-slate-500">NAICS {rfp.naics}{rfp.setAside ? ` · ${rfp.setAside}` : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">{rfp.agency}<br/><span className="text-xs text-slate-400">{rfp.level}</span></td>
                  <td className="py-4 px-4 text-sm font-medium text-slate-900">${(rfp.value / 1000000).toFixed(1)}M</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{new Date(rfp.deadline).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <Badge variant={rfp.status === 'Open' ? 'default' : 'secondary'}>{rfp.status}</Badge>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link href={`/rfps/${rfp.id}`} className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                      <Bookmark className="w-4 h-4" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}