"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  FileText,
  Bell,
  TrendingUp,
  DollarSign,
  Zap,
  ArrowRight,
  Crown,
  Calendar,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeRfps: 12,
    alerts: 0,
    trackedValue: 2450000,
    matchScore: 87,
  });

  useEffect(() => {
    async function fetchSubscription() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/subscription/status?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setSubscription(data);
        }
      } catch (e) {
        console.log("Subscription fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) fetchSubscription();
  }, [user, isLoaded]);

  const plan = subscription?.plan || "free";
  const planLabel = plan === "starter" ? "Starter" : plan === "professional" ? "Professional" : plan === "enterprise" ? "Enterprise" : "Free";
  const isPaid = plan !== "free";

  // FIX: Proper number formatting - no more NaNK
  const formatCurrency = (val: number) => {
    if (!val || isNaN(val)) return "$0";
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-slate-400">Track your government contract opportunities</p>
        </div>

        {/* Plan Card */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{planLabel}</h3>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-slate-400 text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Next billing: {subscription?.current_period_end
                    ? new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "Sep 15, 2026"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/billing"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Billing
              </Link>
              {!isPaid && (
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade to Professional
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade Banner (free users) */}
        {!isPaid && (
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Upgrade to Professional</h3>
                  <p className="text-slate-400 text-sm">
                    Get more power with Professional. More alerts, team seats, and API access.
                  </p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                View Pricing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active RFPs */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Active RFPs</span>
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.activeRfps}</div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+12% this week</span>
            </div>
          </div>

          {/* Your Alerts */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Your Alerts</span>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.alerts}</div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <span>3 new matches</span>
            </div>
          </div>

          {/* Tracked Value - FIXED */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Tracked Value</span>
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{formatCurrency(stats.trackedValue)}</div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+8.5% this month</span>
            </div>
          </div>

          {/* Match Score - FIXED (no double %%) */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Match Score</span>
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.matchScore}%</div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+5% improvement</span>
            </div>
          </div>
        </div>

        {/* Recent RFPs Section */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent RFPs</h3>
            <Link
              href="/rfps"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { title: "IT Support Services - VA", agency: "Dept of Veterans Affairs", value: "$2.4M", score: 94 },
              { title: "Cloud Infrastructure - USDA", agency: "US Dept of Agriculture", value: "$1.8M", score: 91 },
              { title: "Cybersecurity Audit - DHS", agency: "Homeland Security", value: "$3.2M", score: 88 },
            ].map((rfp, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
                <div>
                  <h4 className="font-medium mb-1">{rfp.title}</h4>
                  <p className="text-slate-400 text-sm">{rfp.agency}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 font-medium">{rfp.value}</span>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
                    {rfp.score}% match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
