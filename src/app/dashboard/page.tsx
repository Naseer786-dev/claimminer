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
  Crown,
  Zap,
  CreditCard,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

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

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string;
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

const planConfig: Record<string, { name: string; icon: any; color: string; price: string; badge: string; nextPlan: string }> = {
  free: { name: "Free Plan", icon: Zap, color: "text-slate-400", price: "$0", badge: "bg-slate-700 text-slate-300", nextPlan: "Starter" },
  starter: { name: "Starter", icon: Zap, color: "text-emerald-400", price: "$49/mo", badge: "bg-emerald-500/20 text-emerald-400", nextPlan: "Professional" },
  pro: { name: "Professional", icon: Crown, color: "text-blue-400", price: "$99/mo", badge: "bg-blue-500/20 text-blue-400", nextPlan: "Enterprise" },
  enterprise: { name: "Enterprise", icon: Building2, color: "text-purple-400", price: "$249/mo", badge: "bg-purple-500/20 text-purple-400", nextPlan: "" },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRfps: 0,
    totalValue: 0,
    avgMatch: 0,
    alerts: 0,
  });
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      fetchSubscription();
    }
  }, [isLoaded, user]);

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

  async function fetchSubscription() {
    try {
      const res = await fetch(`/api/subscription/status?userId=${user?.id}`);
      const data = await res.json();
      setSubscription(data);
    } catch (error) {
      console.error("Subscription fetch error:", error);
    }
  }

  const formatTrackedValue = (val: number | undefined | null): string => {
    if (typeof val !== "number" || !isFinite(val) || val < 0) return "$0";
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  const formatMatchScore = (val: number | string | undefined | null): string => {
    const cleaned = typeof val === "string" ? val.replace("%", "") : String(val ?? 0);
    const num = Number(cleaned);
    return `${isNaN(num) ? 0 : num}%`;
  };

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

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
      value: formatTrackedValue(stats.totalValue),
    },
    {
      ...statCards[3],
      value: formatMatchScore(stats.avgMatch),
    },
  ];

  const recentRfps = rfps.slice(0, 5);
  const currentPlan = planConfig[subscription?.plan || "free"];
  const PlanIcon = currentPlan?.icon || Zap;
  const isFree = subscription?.plan === "free" || !subscription;
  const canUpgrade = currentPlan?.nextPlan !== "";

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

        {/* Subscription Status Banner */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800">
              <PlanIcon className={`w-5 h-5 ${currentPlan?.color || "text-slate-400"}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{currentPlan?.name || "Free Plan"}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${currentPlan?.badge || "bg-slate-700 text-slate-300"}`}>
                  {subscription?.status === "active" && !isFree ? "Active" : isFree ? "Free" : subscription?.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isFree
                  ? "Unlock unlimited RFPs and alerts with a paid plan"
                  : `Next billing: ${subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/settings/billing")}
              className="px-3 py-1.5 text-sm text-slate-300 hover:text-white transition-colors"
            >
              Billing
            </button>
            {canUpgrade && (
              <button
                onClick={() => router.push("/pricing")}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Upgrade to {currentPlan?.nextPlan}
              </button>
            )}
          </div>
        </motion.div>

        {/* Upgrade CTA Banner */}
        {canUpgrade && (
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <CreditCard className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {isFree ? "Unlock Full Access" : `Upgrade to ${currentPlan?.nextPlan}`}
                </h3>
                <p className="text-sm text-slate-400">
                  {isFree
                    ? "You are on the Free plan. Upgrade to search unlimited RFPs, get more alerts, and access advanced features."
                    : `Get more power with ${currentPlan?.nextPlan}. More alerts, team seats, and API access.`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/pricing")}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl transition-colors flex items-center gap-2 shrink-0"
            >
              View Pricing
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
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
                  <div className={`p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
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
                          Due: {formatDate(rfp.due_date)}
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