"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Trash2, Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Alert {
  id: string
  name: string
  status: "Active" | "Paused"
  matches: number
  keywords: string[]
  level: string
  naics: string[]
  minValue: string
  states?: string
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    name: "IT Services - Federal",
    status: "Active",
    matches: 12,
    keywords: ["IT support", "help desk", "managed services"],
    level: "Federal",
    naics: ["541511", "541512"],
    minValue: "$100K",
  },
  {
    id: "2",
    name: "Cybersecurity - All Levels",
    status: "Active",
    matches: 8,
    keywords: ["cybersecurity", "penetration test", "security audit"],
    level: "All",
    naics: ["541512", "541519"],
    minValue: "$50K",
  },
  {
    id: "3",
    name: "Texas State Contracts",
    status: "Paused",
    matches: 5,
    keywords: ["software", "development"],
    level: "State",
    naics: ["541511"],
    minValue: "$25K",
    states: "TX",
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id
          ? { ...alert, status: alert.status === "Active" ? "Paused" : "Active" }
          : alert
      )
    )
  }

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Alerts</h1>
          <p className="text-slate-500 text-sm mt-1">Get notified when matching RFPs are posted</p>
        </div>
        <Link href="/alerts/new">
          <Button><Plus className="w-4 h-4 mr-2" /> New Alert</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No alerts yet</h3>
              <p className="text-slate-500 mb-4">Create your first alert to get notified about matching RFPs</p>
              <Link href="/alerts/new">
                <Button><Plus className="w-4 h-4 mr-2" /> Create Alert</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {alerts.map((alert) => (
          <Card key={alert.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{alert.name}</h3>
                    <Badge variant={alert.status === "Active" ? "default" : "secondary"}>
                      {alert.status}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {alert.matches} matches
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {alert.keywords.map((kw) => (
                      <span key={kw} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                        {kw}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-slate-500">
                    {alert.level} · NAICS: {alert.naics.join(", ")} · Min: {alert.minValue}
                    {alert.states ? ` · States: ${alert.states}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      alert.status === "Active"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {alert.status === "Active" ? "On" : "Off"}
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}