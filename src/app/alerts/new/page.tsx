"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function NewAlertPage() {
  const [name, setName] = useState("")
  const [keywords, setKeywords] = useState("")
  const [level, setLevel] = useState("All")
  const [minValue, setMinValue] = useState("")
  const [naics, setNaics] = useState("")
  const [addedKeywords, setAddedKeywords] = useState<string[]>([])

  const addKeyword = () => {
    if (keywords.trim() && !addedKeywords.includes(keywords.trim())) {
      setAddedKeywords([...addedKeywords, keywords.trim()])
      setKeywords("")
    }
  }

  const removeKeyword = (kw: string) => {
    setAddedKeywords(addedKeywords.filter((k) => k !== kw))
  }

  const handleSubmit = () => {
    alert("Alert created! (This would save to your database)")
    window.location.href = "/alerts"
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/alerts" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Alerts
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New Alert</h1>

      <Card>
        <CardHeader>
          <CardTitle>Alert Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Alert Name</label>
            <Input
              placeholder="e.g., IT Services - Federal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Keywords</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., cybersecurity"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword()}
              />
              <Button type="button" onClick={addKeyword} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {addedKeywords.map((kw) => (
                <Badge key={kw} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword(kw)}>
                  {kw} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contract Level</label>
            <select
              className="w-full px-3 py-2 border rounded-md text-sm"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option>All</option>
              <option>Federal</option>
              <option>State</option>
              <option>Local</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Value</label>
            <Input
              placeholder="e.g., $50,000"
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">NAICS Codes (comma separated)</label>
            <Input
              placeholder="e.g., 541511, 541512"
              value={naics}
              onChange={(e) => setNaics(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit}>Create Alert</Button>
            <Link href="/alerts">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}