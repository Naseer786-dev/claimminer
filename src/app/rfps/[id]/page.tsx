"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Bookmark, Download, Calendar, DollarSign, Building2, Tag } from "lucide-react"
import Link from "next/link"

export default function RfpDetailPage() {
  const { id } = useParams()
  const [rfp, setRfp] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/rfps/${id}`)
        const data = await res.json()
        setRfp(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!rfp) return <div className="max-w-4xl mx-auto px-4 py-8 text-center">RFP not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link href="/rfps" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to RFPs
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{rfp.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {rfp.agency} · {rfp.agencyLevel}
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-sm font-bold">
            {Math.round(rfp.matchScore || 0)}% match
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Contract Value</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{rfp.value}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Due Date</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {rfp.dueDate ? new Date(rfp.dueDate).toLocaleDateString() : "TBD"}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <Tag className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">NAICS Code</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{rfp.naics}</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Description</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{rfp.description}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-600/20">
            <Bookmark className="h-4 w-4" /> Track This RFP
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="h-4 w-4" /> Download Documents
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
