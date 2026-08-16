"use client"

import { motion } from "framer-motion"

export function RfpCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
    >
      <div className="animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-3"></div>
        <div className="flex gap-4 mt-4">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
        </div>
      </div>
    </motion.div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  )
}
