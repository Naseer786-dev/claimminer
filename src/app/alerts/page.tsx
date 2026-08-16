"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Bell, Trash2 } from "lucide-react"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/alerts")
        const data = await res.json()
        setAlerts(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  async function createAlert(e: React.FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const alert = {
      name: formData.get("name"),
      keywords: (formData.get("keywords") as string).split(",").map((k) => k.trim()),
      agencyLevel: formData.get("agencyLevel"),
      states: (formData.get("states") as string).split(",").map((s) => s.trim()),
    }

    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alert),
    })

    if (res.ok) {
      const newAlert = await res.json()
      setAlerts([...alerts, newAlert])
      setShowForm(false)
      form.reset()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Alert Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Get notified when new RFPs match your criteria</p>
      </motion.div>

      <button onClick={() => setShowForm(!showForm)}
        className="mb-6 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-600/20">
        <Plus className="h-4 w-4" /> Create New Alert
      </button>

      {showForm && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          onSubmit={createAlert}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alert Name</label>
              <input name="name" required className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Agency Level</label>
              <select name="agencyLevel" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="all">All Levels</option>
                <option value="Federal">Federal</option>
                <option value="State">State</option>
                <option value="Local">Local</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keywords</label>
              <input name="keywords" placeholder="IT, cybersecurity, cloud" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">States</label>
              <input name="states" placeholder="TX, CA, NY" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">Save Alert</button>
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse">
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, i) => (
            <motion.div key={alert.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{alert.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {alert.keywords?.join(", ") || "No keywords"} · {alert.agencyLevel || "All levels"}
                    </p>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
