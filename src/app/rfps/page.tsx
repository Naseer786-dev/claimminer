"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Calendar,
  ArrowRight,
  Star,
  Lock,
  Crown,
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
  posted_date?: string;
  solicitation_number?: string;
  contract_type?: string;
  set_aside?: string;
}

export default function RFPsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [filteredRfps, setFilteredRfps] = useState<RFP[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free");
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    fetchRFPs();
    if (isLoaded && user) {
      fetchUserPlan();
    }
  }, [isLoaded, user]);

  useEffect(() => {
    filterRfps();
  }, [searchQuery, selectedState, selectedLevel, rfps]);

  async function fetchRFPs() {
    try {
      // Try SAM.gov API first, fallback to local
      const [samRes, localRes] = await Promise.allSettled([
        fetch("/api/rfps/sam"),
        fetch("/api/rfps"),
      ]);

      let allRfps: RFP[] = [];

      if (samRes.status === "fulfilled" && samRes.value.ok) {
        const samData = await samRes.value.json();
        if (samData.rfps) {
          allRfps = [...samData.rfps];
        }
      }

      if (localRes.status === "fulfilled" && localRes.value.ok) {
        const localData = await localRes.value.json();
        if (Array.isArray(localData)) {
          allRfps = [...allRfps, ...localData];
        }
      }

      setRfps(allRfps);
      setFilteredRfps(allRfps);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserPlan() {
    try {
      const res = await fetch(`/api/subscription/status?userId=${user?.id}`);
      const data = await res.json();
      setPlan(data.plan || "free");

      // Set visible count based on plan
      const limits: Record<string, number> = {
        free: 5,
        starter: 50,
        pro: 999999,
        enterprise: 999999,
      };
      setVisibleCount(limits[data.plan || "free"] || 5);
    } catch (error) {
      console.error("Plan fetch error:", error);
    }
  }

  function filterRfps() {
    let filtered = [...rfps];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (rfp) =>
          rfp.title.toLowerCase().includes(query) ||
          rfp.agency.toLowerCase().includes(query) ||
          rfp.description.toLowerCase().includes(query)
      );
    }

    if (selectedState) {
      filtered = filtered.filter((rfp) => rfp.state === selectedState);
    }

    if (selectedLevel) {
      filtered = filtered.filter((rfp) => rfp.agency_level === selectedLevel);
    }

    setFilteredRfps(filtered);
  }

  const states = [...new Set(rfps.map((r) => r.state))].sort();
  const levels = [...new Set(rfps.map((r) => r.agency_level))].sort();

  const displayedRfps = filteredRfps.slice(0, visibleCount);
  const hasMore = filteredRfps.length > visibleCount;
  const isLimited = plan === "free" && filteredRfps.length > 5;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Government RFPs</h1>
          <p className="text-slate-400">
            {rfps.length}+ active contract opportunities from federal, state, and local agencies
          </p>
        </div>

        {/* Plan Banner for Free Users */}
        {plan === "free" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-amber-400 font-medium">
                  Showing {Math.min(5, filteredRfps.length)} of {filteredRfps.length} RFPs
                </p>
                <p className="text-xs text-slate-400">
                  Upgrade to Starter to see up to 50 RFPs, or Professional for unlimited access.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/pricing")}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Upgrade
            </button>
          </motion.div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search RFPs by title, agency, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="pl-9 pr-8 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="pl-9 pr-8 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">All Levels</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RFP Cards */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/3 mb-2" />
                <div className="h-3 bg-slate-700 rounded w-1/4" />
              </div>
            ))
          ) : displayedRfps.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No RFPs found matching your criteria</p>
            </div>
          ) : (
            displayedRfps.map((rfp, index) => (
              <motion.div
                key={rfp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/rfps/${rfp.id}`)}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                        {rfp.title}
                      </h3>
                      {rfp.solicitation_number && (
                        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded shrink-0">
                          {rfp.solicitation_number}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {rfp.agency}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {rfp.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due: {rfp.due_date}
                      </span>
                      {rfp.posted_date && (
                        <span className="text-xs text-slate-500">
                          Posted: {rfp.posted_date}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className="text-lg font-bold text-emerald-400">
                      {rfp.budget}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        rfp.match_score >= 90
                          ? "bg-emerald-500/20 text-emerald-400"
                          : rfp.match_score >= 75
                          ? "bg-blue-500/20 text-blue-400"
                          : rfp.match_score >= 60
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {rfp.match_score}% match
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{rfp.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded">
                    {rfp.agency_level}
                  </span>
                  <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded">
                    NAICS: {rfp.naics_code}
                  </span>
                  {rfp.contract_type && (
                    <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded">
                      {rfp.contract_type}
                    </span>
                  )}
                  {rfp.set_aside && rfp.set_aside !== "None" && (
                    <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded">
                      {rfp.set_aside}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Upgrade CTA for limited results */}
        {isLimited && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center py-8 border-t border-slate-800"
          >
            <p className="text-slate-400 mb-4">
              {filteredRfps.length - 5} more RFPs hidden. Upgrade to see all opportunities.
            </p>
            <button
              onClick={() => router.push("/pricing")}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <Star className="w-5 h-5" />
              Unlock All RFPs
            </button>
          </motion.div>
        )}

        {/* Load More for paid users */}
        {hasMore && plan !== "free" && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 20)}
              className="px-6 py-3 border border-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Load More RFPs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
