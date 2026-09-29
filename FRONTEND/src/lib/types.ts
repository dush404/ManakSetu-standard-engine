// ─────────────────────────────────────────────────────────────
// BIS-Graph — shared type definitions
// ─────────────────────────────────────────────────────────────

export type RiskLevel = "Low" | "Medium" | "High";

export type StandardStatus = "Active" | "Withdrawn" | "Under Revision";

export type CertType = "ISI Mark" | "CRS" | "Hallmark" | "Eco Mark";

export interface Standard {
  id: string;
  isNumber: string; // "IS 1786:2008"
  code: string; // "1786" — used for short display
  title: string;
  sector: string;
  version: string; // "Fifth Revision"
  lastAmended: string; // "02 Nov 2023" (pre-formatted, deterministic)
  amendedYear: number;
  status: StandardStatus;
  mandatory: boolean;
  certType: CertType;
  qcoRef: string | null;
  normativeRefs: string[]; // IS numbers
  ics: string;
  scope: string;
}

export interface StandardsPage {
  rows: Standard[];
  total: number;
  page: number;
  pageSize: number;
  sortColumn: SortColumn;
  sortDir: SortDir;
}

export type SortColumn =
  | "isNumber"
  | "title"
  | "version"
  | "lastAmended"
  | "mandatory";

export type SortDir = "asc" | "desc";

// ── Dashboard ────────────────────────────────────────────────

export interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaDirection: "up" | "down";
  deltaGood: boolean;
  series: number[];
}

export interface TenderAudit {
  id: string; // "TND-2025-0907"
  product: string;
  agency: string;
  risk: RiskLevel;
  score: number;
  date: string; // "08 Dec 2025"
  standardsCount: number;
}

export type UpdateSeverity = "mandatory" | "amendment" | "inclusion" | "draft";

export interface StandardUpdate {
  id: string;
  severity: UpdateSeverity;
  tag: string; // QCO | AMD | NEW | DRAFT
  ref: string; // "IS 1786:2008"
  title: string;
  date: string;
  summary: string;
}

// ── Recommendation engine ────────────────────────────────────

export type GraphNodeGroup =
  | "primary"
  | "normative"
  | "test"
  | "related"
  | "amendment";

export interface GraphNode {
  id: string;
  isNumber: string;
  shortLabel: string;
  title: string;
  group: GraphNodeGroup;
  version?: string;
  certStatus?: "Mandatory" | "Voluntary";
  scope: string;
  role: string;
  parameters?: { label: string; value: string }[];
}

export type EdgeType = "normative" | "test" | "related" | "amendment";

export interface GraphEdge {
  source: string;
  target: string;
  type: EdgeType;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Gap {
  id: string;
  severity: "critical" | "recommended";
  clause: string; // "Cl. 6.1 — IS 1786, Table 3"
  title: string;
  titleHi?: string;
  detail: string;
  detailHi?: string;
  suggestion: string;
  suggestionHi?: string;
  standardRef: string;
}

export interface PrimaryMatch {
  isNumber: string;
  title: string;
  version: string;
  amendment: string;
  certStatus: "Mandatory" | "Voluntary";
  qcoRef: string;
  confidence: number; // 0-100
  matchReason: string;
  matchReasonHi: string;
  spec: { label: string; value: string }[];
}

export interface RecommendResponse {
  primary: PrimaryMatch;
  graph: GraphData;
  gaps: Gap[];
  tenderClauses: string;
  traversed: number;
  elapsedMs: number;
  generatedAt: string;
}

// ── Audit report ─────────────────────────────────────────────

export interface ReportSpecRow {
  parameter: string;
  required: string;
  reference: string;
}

export interface ReportSection {
  id: string;
  heading: string;
  body?: { text: string }[];
  specRows?: ReportSpecRow[];
  chips?: { label: string; kind: "standard" | "test" | "code" }[];
  requirements?: { label: string; detail: string; mandatory: boolean }[];
  gaps?: Gap[];
}

export interface AuditReport {
  id: string;
  product: string;
  agency: string;
  category: string;
  date: string;
  evaluator: string;
  score: number;
  risk: RiskLevel;
  standardsAudited: number;
  clausesReviewed: number;
  summary: string;
  sections: ReportSection[];
  tenderClauses: string;
}
