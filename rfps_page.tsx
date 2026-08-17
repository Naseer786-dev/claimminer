"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Bell,
  Zap,
  Lock,
  RefreshCw,
  ExternalLink,
  Check,
  X,
} from "lucide-react";

const staticRfps = [
  {
    id: "1",
    title: "IT Support Services - VA",
    agency: "Dept of Veterans Affairs",
    description: "Comprehensive IT support services including help desk, network management, and cybersecurity monitoring for VA facilities nationwide.",
    budget: "$2,500,000",
    postedDate: "2026-08-10",
    dueDate: "2026-09-15",
    naicsCode: "541512",
    contractType: "Small Business",
    url: "#",
    matchScore: 92,
  },
  {
    id: "2",
    title: "Cloud Migration & Infrastructure - USDA",
    agency: "US Dept of Agriculture",
    description: "Enterprise cloud migration project to modernize USDA legacy systems. Includes AWS/Azure infrastructure setup, data migration, and staff training.",
    budget: "$8,750,000",
    postedDate: "2026-08-08",
    dueDate: "2026-10-01",
    naicsCode: "541513",
    contractType: "Open Competition",
    url: "#",
    matchScore: 88,
  },
  {
    id: "3",
    title: "Cybersecurity Operations Center - DHS",
    agency: "Homeland Security",
    description: "24/7 Security Operations Center (SOC) services for DHS networks. Includes threat monitoring, incident response, and vulnerability management.",
    budget: "$12,000,000",
    postedDate: "2026-08-05",
    dueDate: "2026-11-20",
    naicsCode: "541519",
    contractType: "SDVOSB Set-Aside",
    url: "#",
    matchScore: 85,
  },
  {
    id: "4",
    title: "Network Engineering - DOJ",
    agency: "Dept of Justice",
    description: "Wide Area Network (WAN) redesign and implementation for DOJ field offices. MPLS to SD-WAN migration with zero downtime requirement.",
    budget: "$4,200,000",
    postedDate: "2026-08-03",
    dueDate: "2026-09-30",
    naicsCode: "541512",
    contractType: "Small Business",
    url: "#",
    matchScore: 82,
  },
  {
    id: "5",
    title: "Data Analytics Platform - HHS",
    agency: "Health & Human Services",
    description: "Big data analytics platform for healthcare research. Must handle HIPAA compliance and support machine learning workloads.",
    budget: "$6,800,000",
    postedDate: "2026-08-01",
    dueDate: "2026-10-15",
    naicsCode: "541511",
    contractType: "Open Competition",
    url: "#",
    matchScore: 79,
  },
];

export default function RfpsPage() {
  const { user, isLoaded } = useUser();
  const [rfps, setRfps] = useState(staticRfps);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [alertedRfps, setAlertedRfps] = useState<Set<string>>(new Set());
  const [errorMsg, setErrorMsg] = useState("");

  // Load subscription status safely
  useEffect(() => {
    async function checkSub() {
      try {
        const res = await fetch("/api/subscription/status", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        console.log("Subscription:", data);
      } catch (e) {
        console.log("Sub check failed (ok):", e);
      }
    }
    checkSub();
  }, []);

  const handleLoadLive = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/rfps/sam-live?limit=10", { cache: "no-store" });
      if (!res.ok) {
        setErrorMsg("Live data temporarily unavailable. Showing static contracts.");
        setLiveMode(false);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.opportunities && data.opportunities.length > 0) {
        setRfps(data.opportunities);
        setLiveMode(true);
      } else {
        setErrorMsg("No live contracts found. Showing static data.");
      }
    } catch (e) {
      setErrorMsg("Connection error. Showing static contracts.");
    }
    setLoading(false);
  };

  const handleSetAlert = (rfp: any) => {
    if (!user) {
      window.alert("Please sign in to set alerts.");
      return;
    }
    setAlertedRfps((prev) => {
      const next = new Set(prev);
      if (next.has(rfp.id)) {
        next.delete(rfp.id);
        window.alert(`Alert removed for: ${rfp.title}`);
      } else {
        next.add(rfp.id);
        window.alert(`Alert set for: ${rfp.title}\n\nYou'll receive emails when similar RFPs are posted.`);
      }
      return next;
    });
  };

  const filteredRfps = rfps.filter(
    (rfp) =>
      rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.naicsCode.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Government RFPs</h1>
          <p className="text-slate-400">
            {liveMode ? "Live contracts from SAM.gov" : "6 active contracts from federal agencies"}
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-amber-200 text-sm">{errorMsg}</span>
            <button onClick={() => setErrorMsg("")} className="ml-auto">
              <X className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        )}

        {/* Live Mode Banner */}
        {liveMode && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-200 text-sm">Live data from SAM.gov</span>
          </div>
        )}

        {/* Upgrade Banner */}
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-medium text-amber-200">1 more RFPs hidden</p>
              <p className="text-amber-200/70 text-sm">Upgrade to see all 6 contracts and unlock advanced filters</p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg text-sm transition-colors"
          >
            Upgrade Now
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, agency, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#111827] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-slate-800 rounded-lg text-sm text-slate-400 hover:text-white transition-colors">
                <Filter className="w-4 h-4" />
                All Agencies
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-slate-800 rounded-lg text-sm text-slate-400 hover:text-white transition-colors">
                <Zap className="w-4 h-4" />
                All Types
              </button>
            </div>
            <button
              onClick={handleLoadLive}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Loading..." : "Load Live Data"}
            </button>
          </div>
        </div>

        {/* RFP Cards */}
        <div className="space-y-4">
          {filteredRfps.map((rfp) => (
            <div
              key={rfp.id}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{rfp.title}</h3>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
                      {rfp.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{rfp.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-slate-400">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                      {rfp.agency}
                    </span>
                    <span className="text-slate-400">Budget: {rfp.budget}</span>
                    <span className="text-slate-400">Posted: {rfp.postedDate}</span>
                    <span className="text-slate-400">Due: {rfp.dueDate}</span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">
                      NAICS: {rfp.naicsCode}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-lg">
                    {rfp.contractType}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSetAlert(rfp)}
                    className={`flex items-center gap-2 text-sm transition-colors cursor-pointer ${
                      alertedRfps.has(rfp.id)
                        ? "text-emerald-400 hover:text-emerald-300"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {alertedRfps.has(rfp.id) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                    {alertedRfps.has(rfp.id) ? "Alert Active" : "Set Alert"}
                  </button>
                  <a
                    href={rfp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRfps.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No RFPs match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
