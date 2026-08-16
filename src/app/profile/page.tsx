"use client"

import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { User, Mail, Building, Briefcase } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account settings</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        <div className="px-6 pb-6">
          <div className="relative -mt-12 mb-4">
            <div className="h-24 w-24 rounded-2xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-lg">
              <User className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.fullName || "User"}</h2>
          <p className="text-slate-500 dark:text-slate-400">{user?.primaryEmailAddress?.emailAddress}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <Building className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Company</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Not set</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <Briefcase className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Role</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Contractor</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
