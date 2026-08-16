"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import Link from "next/link"
import { RfpCardSkeleton } from "@/components/loading-skeleton"

export default function RfpsPage() {
  const [rfps, setRfps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/rfps")
        const data = await res.json()
        setRfps(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
        setRfps([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = (rfps || []).filter((rfp) => {
    if (!rfp) return false
    const matchesSearch = !search || (rfp.title && rfp.title.toLowerCase().includes(search.toLowerCase()))
    const matchesFilter = filter === "all" || rfp.agencyLevel === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Government RFPs</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Find and track government contract opportunities</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search RFPs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["all", "Federal", "State", "Local"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => <RfpCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">No RFPs found</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((rfp, i) => (
              <motion.div
                key={rfp.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/rfps/${rfp.id}`}>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-800 transition-all group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {rfp.title || "Untitled"}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{rfp.agency || ""} · {rfp.state || rfp.agencyLevel || ""}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{rfp.description || ""}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                            {rfp.agencyLevel || "Unknown"}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                            NAICS: {rfp.naics || "N/A"}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs font-medium">
                            Due: {rfp.dueDate ? new Date(rfp.dueDate).toLocaleDateString() : "TBD"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-6 text-right shrink-0">
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{rfp.value || "N/A"}</p>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold mt-2">
                          {Math.round(rfp.matchScore || 0)}% match
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}