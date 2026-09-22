import type {
  Annotation,
  NavItem,
  PlanDocument,
  PlanFile,
  ProcessingTask,
  ReviewStep,
} from "./types";

// ---------------------------------------------------------------------------
// Static navigation + wizard configuration
// ---------------------------------------------------------------------------

export const NAV_ITEMS: NavItem[] = [
  { key: "review-plans", label: "Review Plans", href: "/review-plans" },
  { key: "stamp", label: "Stamp", href: "/stamp" },
  { key: "pca", label: "PCA", href: "/pca" },
  { key: "saved-pca", label: "Saved PCA", href: "/saved-pca" },
  { key: "inspections", label: "Inspections", href: "/inspections" },
  { key: "cities-emails", label: "Cities & Emails", href: "/cities-emails" },
  { key: "users", label: "Users", href: "/users" },
  { key: "notifications", label: "Notifications", href: "/notifications" },
];

export const REVIEW_STEPS: ReviewStep[] = [
  {
    key: "upload",
    index: 1,
    label: "Upload",
    description: "Add the plan set you need reviewed",
  },
  {
    key: "processing",
    index: 2,
    label: "Processing",
    description: "We extract, index, and cross-check every page",
  },
  {
    key: "annotate",
    index: 3,
    label: "Annotate",
    description: "Mark up corrections directly on the plans",
  },
  {
    key: "export",
    index: 4,
    label: "Export",
    description: "Package annotations into a reviewed PDF",
  },
];

// ---------------------------------------------------------------------------
// Mock async "services" — deliberately shaped like real API calls
// (Promise-returning, artificial latency) so the network layer can be
// swapped for real fetch()/tRPC/REST calls later without touching any
// component code.
// ---------------------------------------------------------------------------

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}_${Date.now()}_${idCounter++}`;

export function createMockPlanFile(file: File): PlanFile {
  return {
    id: nextId("file"),
    name: file.name,
    sizeBytes: file.size,
    pageCount: Math.max(1, Math.round(file.size / 45_000)),
    status: "queued",
    uploadProgress: 0,
  };
}

export const PROCESSING_TASKS: ProcessingTask[] = [
  {
    stage: "extracting-text",
    label: "Extracting plan text",
    detail: "Reading sheet indexes, notes, and specification callouts",
  },
  {
    stage: "detecting-code-sections",
    label: "Detecting code sections",
    detail: "Matching drawings to applicable building code sections",
  },
  {
    stage: "cross-referencing-jurisdiction",
    label: "Cross-referencing jurisdiction rules",
    detail: "Comparing scope against local amendments on file",
  },
  {
    stage: "flagging-issues",
    label: "Flagging potential issues",
    detail: "Surfacing items that typically trigger corrections",
  },
  {
    stage: "complete",
    label: "Review-ready",
    detail: "Plan set indexed and ready for annotation",
  },
];

const MOCK_ANNOTATIONS: Annotation[] = [
  {
    id: nextId("anno"),
    tool: "comment",
    page: 1,
    x: 62,
    y: 28,
    color: "#00557f",
    severity: "correction",
    note: "MVP scope references self-service registration — confirm ADA-compliant kiosk fallback is documented.",
    author: "J. Alvarez, Plan Reviewer",
    createdAt: "2026-09-18T14:02:00Z",
  },
  {
    id: nextId("anno"),
    tool: "highlight",
    page: 1,
    x: 30,
    y: 52,
    color: "#f5b82e",
    severity: "info",
    note: "Third-party integration boundary — verify data retention policy is attached as an exhibit.",
    author: "J. Alvarez, Plan Reviewer",
    createdAt: "2026-09-18T14:05:00Z",
  },
  {
    id: nextId("anno"),
    tool: "rectangle",
    page: 1,
    x: 48,
    y: 71,
    color: "#ae2a1f",
    severity: "rejection",
    note: "Automation workflow does not show a manual override path — required before approval.",
    author: "J. Alvarez, Plan Reviewer",
    createdAt: "2026-09-18T14:09:00Z",
  },
];

export function buildMockDocument(fileName: string): PlanDocument {
  return {
    id: nextId("doc"),
    fileName,
    jurisdiction: "City of Cedar Park, TX",
    permitType: "Commercial — Tenant Finish-Out",
    pageCount: 1,
    currentPage: 1,
    annotations: MOCK_ANNOTATIONS,
  };
}

export async function mockUploadFiles(
  files: PlanFile[],
  onProgress: (id: string, progress: number) => void
): Promise<void> {
  await Promise.all(
    files.map(async (file) => {
      for (let progress = 20; progress <= 100; progress += 20) {
        await wait(140);
        onProgress(file.id, progress);
      }
    })
  );
}

export async function mockRunProcessing(
  onStage: (index: number) => void
): Promise<void> {
  for (let i = 0; i < PROCESSING_TASKS.length; i++) {
    onStage(i);
    await wait(650);
  }
}

export async function mockExportDocument(fileCount: number) {
  await wait(900);
  return {
    documentCount: fileCount,
    fileName: "Clarifying MVP and Future Phases — Reviewed.pdf",
    fileSizeLabel: "4.2 MB",
    generatedAt: new Date().toISOString(),
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
