import Link from "next/link"
import { FileText, TrendingUp, Bookmark, Clock, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const stats = {
  totalRfps: 1247,
  newMatches: 23,
  savedRfps: 8,
  closingSoon: 14,
}

const recentMatches = [
  { id: "1", title: "IT Support Services", agency: "Dept of Veterans Affairs", level: "Federal", value: 2500000, deadline: "2026-08-25", score: 96, setAside: "Small Business", naics: "541511" },
  { id: "2", title: "Cybersecurity Assessment", agency: "State of Texas", level: "State", value: 450000, deadline: "2026-09-03", score: 91, setAside: null, naics: "541512" },
  { id: "3", title: "Cloud Migration Project", agency: "City of Austin", level: "Local", value: 180000, deadline: "2026-08-30", score: 88, setAside: "Woman-Owned", naics: "541519" },
  { id: "4", title: "Network Infrastructure", agency: "Dept of Defense", level: "Federal", value: 8200000, deadline: "2026-09-15", score: 85, setAside: "SDVOSB", naics: "541513" },
]

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">{stats.newMatches} new matches today · {stats.closingSoon} closing soon</p>
        </div>
        <Link href="/alerts/new">
          <Button><Zap className="w-4 h-4 mr-2" /> Create Alert</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/rfps" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2"><FileText className="w-4 h-4" /> Total RFPs</CardDescription>
              <CardTitle className="text-3xl">{stats.totalRfps.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-xs text-slate-500">Tracked across all sources</p></CardContent>
          </Card>
        </Link>

        <Link href="/rfps" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> New Matches</CardDescription>
              <CardTitle className="text-3xl">{stats.newMatches}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-xs text-green-600">↑ 8 since yesterday</p></CardContent>
          </Card>
        </Link>

        <Link href="/rfps" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2"><Bookmark className="w-4 h-4" /> Saved RFPs</CardDescription>
              <CardTitle className="text-3xl">{stats.savedRfps}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-xs text-slate-500">Actively tracking</p></CardContent>
          </Card>
        </Link>

        <Link href="/rfps" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2"><Clock className="w-4 h-4" /> Closing Soon</CardDescription>
              <CardTitle className="text-3xl">{stats.closingSoon}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-xs text-amber-600">Within 7 days</p></CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Top Matches for You</CardTitle>
              <Link href="/rfps" className="text-sm text-blue-600 hover:text-blue-800">View all</Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-900">{match.title}</h3>
                      <Badge variant={match.score >= 90 ? "default" : "secondary"}>{match.score}% match</Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{match.agency} · {match.level} · NAICS {match.naics}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                      <span className="font-medium">${(match.value / 1000000).toFixed(1)}M</span>
                      <span>Due {new Date(match.deadline).toLocaleDateString()}</span>
                      {match.setAside && <Badge variant="outline">{match.setAside}</Badge>}
                    </div>
                  </div>
                  <Link href={`/rfps/${match.id}`} className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                    View →
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Link href="/alerts/new" className="block p-4 border rounded-lg hover:bg-slate-50">
                <h3 className="font-medium text-slate-900">Create Alert</h3>
                <p className="text-sm text-slate-500">Get notified when matching RFPs are posted</p>
              </Link>
              <Link href="/rfps" className="block p-4 border rounded-lg hover:bg-slate-50">
                <h3 className="font-medium text-slate-900">Browse All RFPs</h3>
                <p className="text-sm text-slate-500">Search and filter 1,200+ active opportunities</p>
              </Link>
              <Link href="/profile" className="block p-4 border rounded-lg hover:bg-slate-50">
                <h3 className="font-medium text-slate-900">Update Profile</h3>
                <p className="text-sm text-slate-500">Improve match accuracy with NAICS codes</p>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}