"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FileText, Bell, TrendingUp, DollarSign, ArrowRight } from "lucide-react"
import Link from "next/link"
import { StatsCard } from "@/components/stats-card"
import { DashboardSkeleton } from "@/components/loading-skeleton"

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentRfps, setRecentRfps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, rfpsRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/rfps"),
        ])
        const statsData = await statsRes.json().catch(() => ({}))
        const rfpsData = await rfpsRes.json().catch(() => [])
        setStats(statsData)
        setRecentRfps(Array.isArray(rfpsData) ? rfpsData.slice(0, 5) : [])
      } catch (e) {
        console.error(e)
        setStats({})
        setRecentRfps([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <DashboardSkeleton />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track your government contract opportunities</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Active RFPs" value={String(stats?.totalRfps || "0")} change="+12% this week" icon={FileText} delay={0} />
        <StatsCard title="Your Alerts" value={String(stats?.totalAlerts || "0")} change="3 new matches" icon={Bell} delay={0.1} />
        <StatsCard title="Tracked Value" value={stats?.trackedValue || "$0"} change="+8.5% this month" icon={DollarSign} delay={0.2} />
        <StatsCard title="Match Score" value={stats?.avgMatch || "0%"} change="+5% improvement" icon={TrendingUp} delay={0.3} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent RFPs</h2>
          <Link href="/rfps" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {recentRfps.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              No RFPs available yet
            </div>
          ) : (
            recentRfps.map((rfp: any, i: number) => (
              <motion.div key={rfp.id || i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}>
                <Link href={`/rfps/${rfp.id}`} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">{rfp.title || "Untitled"}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{rfp.agency || ""} · {rfp.agency_level || ""}</p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{rfp.value || "N/A"}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-medium">
                      {Math.round(rfp.match_score || 0)}% match
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}