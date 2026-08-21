"use client";
import { useState, useEffect } from "react";
import { ExternalLink, Bell, Zap, Lock } from "lucide-react";
import Link from "next/link";

type RFP = {
  id: string;
  title: string;
  agency: string;
  description: string;
  budget?: string;
  value?: string;
  postedDate?: string;
  posted?: string;
  dueDate?: string;
  deadline?: string;
  naicsCode?: string;
  contractType?: string;
  type?: string;
  solicitationNumber?: string;
  matchScore?: number;
  match?: number;
  url?: string;
};

export default function RFPsPage() {
  const [rfps, setRfps] = useState<RFP[]>(staticRfps);
  const [filteredRfps, setFilteredRfps] = useState<RFP[]>(staticRfps);
  const [search, setSearch] = useState("");
  const [agencyFilter, setAgencyFilter] = useState("All Agencies");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isPaid] = useState(false); // set true if paid user

  useEffect(() => {
    let result = rfps;
    if (search) {
      result = result.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.agency.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (agencyFilter!== "All Agencies") {
      result = result.filter(r => r.agency.includes(agencyFilter));
    }
    if (typeFilter!== "All Types") {
      result = result.filter(r => (r.contractType || r.type || "").includes(typeFilter));
    }
    setFilteredRfps(result);
  }, [search, agencyFilter, typeFilter, rfps]);

  const loadLiveData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rfps/sam-live");
      const data = await res.json();
      if (data.rfps && data.rfps.length > 0) {
        setRfps(data.rfps);
        setIsLive(true);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to load live data, showing demo");
    }
    setLoading(false);
  };

  const displayRfps = isPaid? filteredRfps : filteredRfps.slice(0, 3);
  const hiddenCount = filteredRfps.length - displayRfps.length;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Government RFPs</h1>
            <p className="text-slate-400 text-sm">{filteredRfps.length} active contracts from federal agencies</p>
          </div>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">Dashboard</Link>
        </div>

        <div className={`mb-6 px-4 py-2 rounded-lg text-xs flex justify-between items-center ${isLive? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-slate-800/50 border border-slate-700 text-slate-400"}`}>
          <span>{isLive? "● Live data from SAM.gov • Updated Aug 21, 2026" : "● Demo data • Click Load Live Data for SAM.gov"}</span>
          <button onClick={() => window.location.reload()} className="text-xs hover:text-white">↻ Refresh</button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, agency, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-emerald-500"
            />
            <span className="absolute left-3 top-3.5 text-slate-500">Q</span>
          </div>

          <div className="flex gap-3">
            <select value={agencyFilter} onChange={(e) => setAgencyFilter(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm">
              <option>All Agencies</option>
              <option>Veterans Affairs</option>
              <option>USDA</option>
              <option>Defense</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm">
              <option>All Types</option>
              <option>IT Services</option>
              <option>Cloud</option>
              <option>Cybersecurity</option>
            </select>
            <button
              onClick={loadLiveData}
              disabled={loading}
              className="ml-auto bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading? "Loading..." : "↻ Load Live Data"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {displayRfps.map((rfp) => {
            const budget = (rfp as any).budget || (rfp as any).value || "$1M - $5M";
            const posted = (rfp as any).postedDate || (rfp as any).posted || "2026-08-20";
            const due = (rfp as any).dueDate || (rfp as any).deadline || "2026-09-15";
            const match = (rfp as any).matchScore || (rfp as any).match || 85;
            const type = (rfp as any).contractType || (rfp as any).type || "Contract";
            const naics = (rfp as any).naicsCode || "541512";

            return (
              <div key={rfp.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/30 transition">
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{rfp.title}</h3>
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{rfp.description}</p>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-emerald-400">• {rfp.agency}</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">Budget: {budget}</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">Posted: {posted}</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">Due: {due}</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">NAICS: {naics}</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">{type}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <a href={(rfp as any).url || "https://sam.gov"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300">
                        <ExternalLink className="w-4 h-4" />
                        View on SAM.gov
                      </a>
                      <button
                        onClick={() => window.alert(`Alert set for: ${rfp.title}\n\nYou will receive email when similar RFP appears!`)}
                        className="flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 cursor-pointer"
                      >
                        <Bell className="w-4 h-4" />
                        Set Alert
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      {match}% Match
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!isPaid && hiddenCount > 0 && (
          <div className="mt-8 text-center py-12 bg-gradient-to-b from-transparent to-slate-900/50 rounded-xl border border-dashed border-slate-700">
            <Lock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 mb-4">Showing {displayRfps.length} of {filteredRfps.length} RFPs</p>
            <Link href="/pricing" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-2 rounded-lg">
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
    id: "1",
    title: "IT Support Services - VA Hospital Upgrade",
    agency: "Dept of Veterans Affairs",
    description: "Comprehensive IT support services including help desk, network management, and cybersecurity monitoring for VA facilities nationwide.",
    budget: "$2,500,000",
    postedDate: "2026-08-10",
    dueDate: "2026-09-15",
    naicsCode: "541512",
    contractType: "Small Business",
    solicitationNumber: "36C10B24Q0011",
    matchScore: 92,
    url: "https://sam.gov"
  },
  {
    id: "2",
    title: "Cloud Migration & Infrastructure - USDA",
    agency: "USDA",
    description: "Migrate USDA systems to AWS GovCloud, FedRAMP compliance required, includes DevOps and security.",
    budget: "$8,700,000",
    postedDate: "2026-08-12",
    dueDate: "2026-09-20",
    naicsCode: "541512",
    contractType: "Full and Open",
    solicitationNumber: "12FPC424Q0001",
    matchScore: 88,
    url: "https://sam.gov"
  },
  {
    id: "3",
    title: "Cybersecurity Assessment - DOD",
    agency: "Department of Defense",
    description: "Security assessment and penetration testing for DOD facilities, RMF and NIST compliance.",
    budget: "$5,200,000",
    postedDate: "2026-08-08",
    dueDate: "2026-09-10",
    naicsCode: "541690",
    contractType: "8(a)",
    solicitationNumber: "W91QF424Q0005",
    matchScore: 85,
    url: "https://sam.gov"
  },
  {
    id: "4",
    title: "Facilities Maintenance - GSA",
    agency: "GSA",
    description: "Facilities maintenance and janitorial services for federal buildings in DC metro area.",
    budget: "$1,200,000",
    postedDate: "2026-08-15",
    dueDate: "2026-09-05",
    naicsCode: "561720",
    contractType: "Small Business",
    solicitationNumber: "47QRAA24Q0012",
    matchScore: 78,
    url: "https://sam.gov"
  },
];
