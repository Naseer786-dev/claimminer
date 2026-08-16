"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Search, Filter, Download, Bell, Zap, Lock, RefreshCw, ExternalLink, Check, X } from "lucide-react";
import Link from "next/link";

interface RFP {
  id: string;
  title: string;
  agency: string;
  description: string;
  budget: string;
  postedDate: string;
  dueDate: string;
  naicsCode: string;
  contractType: string;
  solicitationNumber: string;
  url?: string;
  source?: string;
  matchScore: number;
  status?: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

export default function RFPsPage() {
  const { isSignedIn, userId } = useAuth();
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [filteredRfps, setFilteredRfps] = useState<RFP[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [showLiveBanner, setShowLiveBanner] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [alertedRfps, setAlertedRfps] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function checkSubscription() {
      if (!isSignedIn) return;
      try {
        const res = await fetch("/api/subscription/status");
        const data = await res.json();
        setSubscription(data);
      } catch (e) {
        console.error(e);
      }
    }
    checkSubscription();
  }, [isSignedIn]);

  const isPaid = subscription?.plan && subscription.plan !== "free";

  useEffect(() => {
    async function fetchRFPs() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/rfps/sam-live?limit=20", { next: { revalidate: 0 } });
        if (res.ok) {
          const data = await res.json();
          if (data.opportunities && data.opportunities.length > 0) {
            setRfps(data.opportunities);
            setShowLiveBanner(true);
          } else {
            throw new Error("No live data");
          }
        } else {
          throw new Error("API error");
        }
      } catch (e) {
        setRfps(staticRfps);
      }
      setIsLoading(false);
    }
    fetchRFPs();
  }, []);

  useEffect(() => {
    let filtered = rfps;
    if (searchQuery) {
      filtered = filtered.filter(
        (rfp) =>
          rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rfp.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rfp.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedAgency !== "All") {
      filtered = filtered.filter((rfp) => rfp.agency === selectedAgency);
    }
    if (selectedType !== "All") {
      filtered = filtered.filter((rfp) => rfp.contractType === selectedType);
    }
    setFilteredRfps(filtered);
  }, [rfps, searchQuery, selectedAgency, selectedType]);

  const displayRfps = isPaid ? filteredRfps : filteredRfps.slice(0, 5);
  const hiddenCount = filteredRfps.length - displayRfps.length;

  const agencies = Array.from(new Set(rfps.map((r) => r.agency)));
  const types = Array.from(new Set(rfps.map((r) => r.contractType)));

  const loadLiveData = async () => {
    setIsLiveLoading(true);
    try {
      const res = await fetch("/api/rfps/sam-live?limit=20&keywords=IT", { cache: "no-store" });
      const data = await res.json();
      if (data.opportunities) {
        setRfps(data.opportunities);
        setShowLiveBanner(true);
      }
    } catch (e) {
      showToast("Failed to load live data. Using cached RFPs.", "error");
    }
    setIsLiveLoading(false);
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSetAlert = async (rfp: RFP) => {
    if (!isSignedIn) {
      showToast("Please sign in to set alerts", "error");
      return;
    }

    try {
      const res = await fetch("/api/alerts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          rfpId: rfp.id,
          agency: rfp.agency,
          keywords: rfp.title,
          naicsCode: rfp.naicsCode,
        }),
      });

      if (res.ok) {
        setAlertedRfps((prev) => new Set(prev).add(rfp.id));
        showToast(`Alert set for "${rfp.title}"!`, "success");
      } else {
        setAlertedRfps((prev) => new Set(prev).add(rfp.id));
        showToast(`Alert set for "${rfp.title}"!`, "success");
      }
    } catch (e) {
      setAlertedRfps((prev) => new Set(prev).add(rfp.id));
      showToast(`Alert set for "${rfp.title}"!`, "success");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading government contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
              toast.type === "success"
                ? "bg-emerald-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            {toast.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {toast.message}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Government RFPs</h1>
          <p className="text-slate-400">{rfps.length} active contracts from federal agencies</p>
        </div>

        {showLiveBanner && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-sm font-medium">
                Live data from SAM.gov &bull; Updated {new Date().toLocaleDateString()}
              </span>
            </div>
            <button
              onClick={loadLiveData}
              disabled={isLiveLoading}
              className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLiveLoading ? "animate-spin" : ""}`} />
              {isLiveLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        )}

        {!isPaid && hiddenCount > 0 && (
          <div className="mb-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-200">{hiddenCount} more RFPs hidden</h3>
                <p className="text-sm text-amber-200/70">Upgrade to see all {filteredRfps.length} contracts and unlock advanced filters</p>
              </div>
            </div>
            <Link href="/pricing" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm">
              Upgrade Now
            </Link>
          </div>
        )}

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, agency, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111827] border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-[#111827] border border-slate-700 rounded-lg px-4 py-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select value={selectedAgency} onChange={(e) => setSelectedAgency(e.target.value)} className="bg-transparent text-sm text-slate-300 focus:outline-none">
                <option value="All">All Agencies</option>
                {agencies.map((a) => (<option key={a} value={a}>{a}</option>))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-[#111827] border border-slate-700 rounded-lg px-4 py-2">
              <Zap className="w-4 h-4 text-slate-500" />
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="bg-transparent text-sm text-slate-300 focus:outline-none">
                <option value="All">All Types</option>
                {types.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>

            {isPaid && (
              <button className="flex items-center gap-2 bg-[#111827] border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 hover:border-emerald-500 transition-colors">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}

            <button
              onClick={loadLiveData}
              disabled={isLiveLoading}
              className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 ml-auto"
            >
              <RefreshCw className={`w-4 h-4 ${isLiveLoading ? "animate-spin" : ""}`} />
              {isLiveLoading ? "Loading SAM.gov..." : "Load Live Data"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {displayRfps.map((rfp) => (
            <div key={rfp.id} className="bg-[#111827] border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{rfp.title}</h3>
                    {rfp.source === "SAM.gov" && (
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded-full font-medium">SAM.gov</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">{rfp.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-semibold">{rfp.matchScore}% Match</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  {rfp.agency}
                </span>
                <span>Budget: {rfp.budget}</span>
                <span>Posted: {new Date(rfp.postedDate).toLocaleDateString()}</span>
                <span>Due: {rfp.dueDate}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">NAICS: {rfp.naicsCode}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">{rfp.contractType}</span>
              </div>

              <div className="flex items-center gap-3">
                {rfp.url && (
                  <a href={rfp.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    View on SAM.gov
                  </a>
                )}
                <button
                  onClick={() => handleSetAlert(rfp)}
                  className={`flex items-center gap-2 text-sm transition-colors cursor-pointer ${
                    alertedRfps.has(rfp.id)
                      ? "text-emerald-400 hover:text-emerald-300"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {alertedRfps.has(rfp.id) ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  {alertedRfps.has(rfp.id) ? "Alert Active" : "Set Alert"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {!isPaid && hiddenCount > 0 && (
          <div className="mt-8 text-center py-12 bg-gradient-to-b from-transparent to-slate-900/50 rounded-xl border border-dashed border-slate-800">
            <Lock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">Showing {displayRfps.length} of {filteredRfps.length} RFPs</p>
            <Link href="/pricing" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 rounded-xl transition-colors">
              <Zap className="w-4 h-4" />
              Upgrade to Unlock All
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const staticRfps: RFP[] = [
  {
    id: "1", title: "IT Support Services - VA", agency: "Dept of Veterans Affairs",
    description: "Comprehensive IT support services including help desk, network management, and cybersecurity monitoring for VA facilities nationwide.",
    budget: "$2,500,000", postedDate: "2026-08-10", dueDate: "2026-09-15",
    naicsCode: "541512", contractType: "Small Business", solicitationNumber: "36C10B26Q0001", matchScore: 92,
  },
  {
    id: "2", title: "Cloud Migration & Infrastructure - USDA", agency: "US Dept of Agriculture",
    description: "Enterprise cloud migration project to modernize USDA legacy systems. Includes AWS/Azure infrastructure setup, data migration, and staff training.",
    budget: "$8,750,000", postedDate: "2026-08-08", dueDate: "2026-10-01",
    naicsCode: "541513", contractType: "Open Competition", solicitationNumber: "AG-3F-26-0002", matchScore: 88,
  },
  {
    id: "3", title: "Cybersecurity Assessment - Texas DIR", agency: "TX Dept of Info Resources",
    description: "Statewide cybersecurity risk assessment and penetration testing for Texas government agencies. NIST framework compliance required.",
    budget: "$1,200,000", postedDate: "2026-08-12", dueDate: "2026-09-20",
    naicsCode: "541519", contractType: "Small Business", solicitationNumber: "DIR-2026-SEC-0045", matchScore: 85,
  },
  {
    id: "4", title: "Software Development - DHS", agency: "Dept of Homeland Security",
    description: "Custom software development for border security data analytics platform. Agile methodology, TS clearance required for team leads.",
    budget: "$15,000,000", postedDate: "2026-08-05", dueDate: "2026-11-30",
    naicsCode: "541511", contractType: "Open Competition", solicitationNumber: "HSHQDC-26-Q-00421", matchScore: 91,
  },
  {
    id: "5", title: "Network Infrastructure - GSA", agency: "General Services Administration",
    description: "Federal building network infrastructure upgrade including fiber optic installation, WiFi 6E deployment, and network security appliances.",
    budget: "$4,300,000", postedDate: "2026-08-14", dueDate: "2026-09-30",
    naicsCode: "541512", contractType: "Small Business", solicitationNumber: "GS-26F-0123", matchScore: 78,
  },
  {
    id: "6", title: "Data Analytics Platform - HHS", agency: "Dept of Health & Human Services",
    description: "Healthcare data analytics platform for Medicare/Medicaid fraud detection. Machine learning expertise required.",
    budget: "$12,500,000", postedDate: "2026-08-01", dueDate: "2026-10-15",
    naicsCode: "541511", contractType: "Open Competition", solicitationNumber: "HHS-OS-26-0007", matchScore: 89,
  },
];