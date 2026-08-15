export interface RFP {
  id: string;
  title: string;
  agency: string;
  agencyLevel: string;
  state: string | null;
  naicsCodes: string[] | null;
  description: string | null;
  estimatedValue: number | null;
  postedDate: string | null;
  responseDeadline: string | null;
  status: "open" | "closing_soon" | "closed";
  sourceUrl: string | null;
  solicitationNumber: string | null;
  setAside: string | null;
  daysRemaining: number;
}

export interface Alert {
  id: string;
  name: string;
  keywords: string[] | null;
  naicsCodes: string[] | null;
  agencyLevel: string | null;
  states: string[] | null;
  minValue: number | null;
  maxValue: number | null;
  setAsideTypes: string[] | null;
  isActive: boolean;
  matchCount: number;
}

export interface Match {
  id: string;
  rfp: RFP;
  matchScore: number;
  isRead: boolean;
  isSaved: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalRfps: number;
  newMatches: number;
  savedRfps: number;
  closingSoon: number;
}
