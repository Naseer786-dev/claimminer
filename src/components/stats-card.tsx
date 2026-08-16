"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  delay?: number
}

export function StatsCard({ title, value, change, icon: Icon, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">{change}</p>
        </div>
        <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
          <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
    </motion.div>
  )
}
