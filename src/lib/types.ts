// ---------------------------------------------------------------------------
// Domain types — shared across the portal. Mock services and (future) real
// API clients both return these shapes, so swapping the data layer never
// requires touching UI components.
// ---------------------------------------------------------------------------

export type NavKey =
  | "review-plans"
  | "stamp"
  | "pca"
  | "saved-pca"
  | "inspections"
  | "cities-emails"
  | "users"
  | "notifications";

export interface NavItem {
  key: NavKey;
  label: string;
  href: string;
}

// ---- Review Plans -----------------------------------------------------

export type ReviewStepKey = "upload" | "processing" | "annotate" | "export";

export interface ReviewStep {
  key: ReviewStepKey;
  index: number;
  label: string;
  description: string;
}

export type PlanFileStatus = "queued" | "uploading" | "uploaded" | "error";

export interface PlanFile {
  id: string;
  name: string;
  sizeBytes: number;
  pageCount: number;
  status: PlanFileStatus;
  uploadProgress: number; // 0–100
}

export type ProcessingStage =
  | "extracting-text"
  | "detecting-code-sections"
  | "cross-referencing-jurisdiction"
  | "flagging-issues"
  | "complete";

export interface ProcessingTask {
  stage: ProcessingStage;
  label: string;
  detail: string;
}

export type AnnotationTool =
  | "select"
  | "text"
  | "arrow"
  | "rectangle"
  | "comment"
  | "highlight"
  | "line"
  | "pen";

export type AnnotationSeverity = "info" | "correction" | "rejection";

export interface Annotation {
  id: string;
  tool: AnnotationTool;
  page: number;
  x: number; // percentage 0–100, position on the page canvas
  y: number;
  color: string;
  severity: AnnotationSeverity;
  note: string;
  author: string;
  createdAt: string;
}

export interface PlanDocument {
  id: string;
  fileName: string;
  jurisdiction: string;
  permitType: string;
  pageCount: number;
  currentPage: number;
  annotations: Annotation[];
}

export interface ExportResult {
  documentCount: number;
  fileName: string;
  fileSizeLabel: string;
  generatedAt: string;
}

// ---- Review Plans session ---------------------------------------------

export interface ReviewPlansSession {
  files: PlanFile[];
  document: PlanDocument | null;
  exportResult: ExportResult | null;
}
