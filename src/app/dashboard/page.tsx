"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Bell,
  DollarSign,
  TrendingUp,
  Calendar,
  MapPin,
  Building2,
  ArrowRight,
} from "lucide-react";

interface RFP {
  id: number;
  title: string;
  agency: string;
  state: string;
  budget: string;
  match_score: number;
  agency_level: string;
  due_date: string;
  description: string;
  naics_code: string;
  status: string;
  created_at: string;
}

interface Stats {
  totalRfps: number;
  totalValue: number;
  avgMatch: number;
  alerts: number;
}

const statCards = [
  {
    title: "Active RFPs",
    value: "0",
    subtext: "+12% this week",
    icon: FileText,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    href: "/rfps",
  },
  {
    title: "Your Alerts",
    value: "0",
    subtext: "3 new matches",
    icon: Bell,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    href: "/alerts",
  },
  {
    title: "Tracked Value",
    value: "$0",
    subtext: "+8.5% this month",
    icon: DollarSign,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    href: "/rfps",
  },
  {
    title: "Match Score",
    value: "0%",
    subtext: "+5% improvement",
    icon: TrendingUp,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    href: "/rfps",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRfps: 0,
    totalValue: 0,
    avgMatch: 0,
    alerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [rfpsRes, statsRes] = await Promise.all([
        fetch("/api/rfps"),
        fetch("/api/stats"),
      ]);

      const rfpsData = await rfpsRes.json();
      const statsData = await statsRes.json();

      if (Array.isArray(rfpsData)) {
        setRfps(rfpsData);
      }

      if (statsData && typeof statsData === "object") {
        setStats(statsData);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  const displayStats = [
    {
      ...statCards[0],
      value: stats.totalRfps?.toString() || "0",
    },
    {
      ...statCards[1],
      value: stats.alerts?.toString() || "0",
    },
    {
      ...statCards[2],
      value:
        stats.totalValue >= 1000000
          ? `$${(stats.totalValue / 1000000).toFixed(1)}M`
          : `$${(stats.totalValue / 1000).toFixed(0)}K`,
    },
    {
      ...statCards[3],
      value: `${stats.avgMatch || 0}%`,
    },
  ];

  const recentRfps = rfps.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">
            Track your government contract opportunities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(stat.href)}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 cursor-pointer hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">
                      {loading ? (
                        <span className="inline-block w-8 h-6 bg-slate-700 rounded animate-pulse" />
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-emerald-400">{stat.subtext}</p>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent RFPs */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent RFPs</h2>
            <button
              onClick={() => router.push("/rfps")}
              className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-slate-700 rounded w-1/4" />
                </div>
              ))
            ) : recentRfps.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No RFPs available yet</p>
                <button
                  onClick={() => router.push("/rfps")}
                  className="mt-3 text-emerald-400 hover:text-emerald-300 text-sm"
                >
                  Browse RFPs →
                </button>
              </div>
            ) : (
              recentRfps.map((rfp) => (
                <div
                  key={rfp.id}
                  onClick={() => router.push(`/rfps/${rfp.id}`)}
                  className="px-6 py-4 hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">
                        {rfp.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {rfp.agency}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {rfp.state}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {rfp.due_date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-sm font-semibold text-emerald-400">
                        {rfp.budget}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rfp.match_score >= 80
                            ? "bg-emerald-500/20 text-emerald-400"
                            : rfp.match_score >= 60
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-slate-500/20 text-slate-400"
                        }`}
                      >
                        {rfp.match_score}% match
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}