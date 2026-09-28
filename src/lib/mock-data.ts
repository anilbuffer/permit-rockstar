import type {
  Annotation,
  NavItem,
  PageStampSettings,
  PlanDocument,
  PlanFile,
  ProcessingTask,
  ReviewStep,
  RoleStampType,
  SharedPlanPackage,
  StampConfig,
  StampExportResult,
  StampLayer,
  StampProcessingTask,
  StampStep,
  UserStampProfile,
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
    label: "Annotate PDF",
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

// ---------------------------------------------------------------------------
// Digital Stamp Workflow Configuration & Mock Services
// ---------------------------------------------------------------------------

export const STAMP_STEPS = [
  {
    key: "upload",
    index: 1,
    label: "Upload Stamp",
    description: "Configure seal & select target plan sets",
  },
  {
    key: "processing",
    index: 2,
    label: "Processing",
    description: "Verifying credentials & indexing sheets",
  },
  {
    key: "preview",
    index: 3,
    label: "Preview Document",
    description: "Position stamp & adjust per-sheet visibility",
  },
  {
    key: "export",
    index: 4,
    label: "Export PDF",
    description: "Package and download certified stamped plans",
  },
] as const;

export const USER_STAMP_PROFILES = [
  {
    id: "ali-marar",
    name: "Ali Marar",
    title: "Licensed Professional Engineer",
    licenseNumber: "FL PE 92978",
    state: "FL",
    email: "ali@permitrockstar.com",
    phone: "904-879-8893",
  },
  {
    id: "john-alvarez",
    name: "John Alvarez",
    title: "Senior Plan Reviewer & PE",
    licenseNumber: "TX PE 104822",
    state: "TX",
    email: "j.alvarez@permitrockstar.com",
    phone: "512-555-0199",
  },
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    title: "Certified Building Official / MCP",
    licenseNumber: "FL CBO #3391",
    state: "FL",
    email: "s.jenkins@permitrockstar.com",
    phone: "904-555-0142",
  },
];

export function createDefaultStampLayers(
  profileName = "Ali Marar",
  license = "FL PE 92978",
  role: RoleStampType = "private-provider",
  color = "#ae2a1f"
): StampLayer[] {
  return [
    {
      id: "layer_rect_1",
      type: "rect",
      name: "rect 1",
      x: 6,
      y: 6,
      width: 250,
      height: 153,
      strokeColor: color,
      strokeWidth: 2,
      hasFill: false,
    },
    {
      id: "layer_text_company",
      type: "text",
      name: "text 1",
      x: 131,
      y: 22,
      text: "PERMIT ROCKSTAR PRIVATE PROVIDER LLC",
      fontSize: 10,
      fontWeight: "bold",
      fontFamily: "Arial",
      strokeColor: color,
    },
    {
      id: "layer_text_compliance",
      type: "text",
      name: "text 2",
      x: 131,
      y: 38,
      text:
        role === "reviewer"
          ? "Reviewed For Code Compliance"
          : "Private Provider Code Review",
      fontSize: 11,
      fontWeight: "bold",
      fontFamily: "Georgia",
      strokeColor: color,
    },
    {
      id: "layer_logo_pr",
      type: "logo",
      name: "image 6",
      x: 18,
      y: 50,
      width: 32,
      height: 32,
      strokeColor: color,
    },
    {
      id: "layer_text_date",
      type: "text",
      name: "text 3",
      x: 165,
      y: 58,
      text: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      fontSize: 11,
      fontWeight: "bold",
      fontFamily: "monospace",
      strokeColor: color,
    },
    {
      id: "layer_text_role",
      type: "text",
      name: "text 4",
      x: 165,
      y: 74,
      text: role === "reviewer" ? "Plan Reviewer" : "Private Provider",
      fontSize: 9,
      fontWeight: "bold",
      fontFamily: "Arial",
      strokeColor: color,
    },
    {
      id: "layer_line_sep",
      type: "line",
      name: "line 1",
      x: 12,
      y: 96,
      width: 238,
      height: 1,
      strokeColor: color,
      strokeWidth: 1,
    },
    {
      id: "layer_text_engineer",
      type: "text",
      name: "text 5",
      x: 131,
      y: 112,
      text: `${profileName} ${license}`,
      fontSize: 11,
      fontWeight: "bold",
      fontFamily: "Arial",
      strokeColor: color,
    },
    {
      id: "layer_text_contact",
      type: "text",
      name: "text 6",
      x: 131,
      y: 132,
      text: "ali@permitrockstar.com · 904-879-8893",
      fontSize: 9,
      fontWeight: "normal",
      fontFamily: "Arial",
      strokeColor: color,
    },
  ];
}

export const DEFAULT_STAMP_CONFIG: StampConfig = {
  engineerName: "Ali Marar",
  role: "private-provider" as const,
  licenseNumber: "FL PE 92978",
  state: "FL",
  companyName: "PERMIT ROCKSTAR PRIVATE PROVIDER LLC",
  complianceText: "Reviewed For Code Compliance",
  email: "ali@permitrockstar.com",
  phone: "904-879-8893",
  dateText: new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }),
  inkColor: "#ae2a1f", // Classic engineering stamp red
  includeLogo: true,
  includeSeal: true,
  customStampImage: null,
  artboardWidth: 262,
  artboardHeight: 165,
  layers: createDefaultStampLayers(),
};

export function getStoredPlanPackage(): SharedPlanPackage {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("pr_shared_plan_package");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
  }
  return {
    id: "pkg_reviewed_default",
    fileName: "Michigan.pdf",
    sizeBytes: 14_892_100,
    pageCount: 5,
    source: "review-plans",
    exportedAt: new Date().toISOString(),
  };
}

export function setStoredPlanPackage(pkg: SharedPlanPackage) {
  if (typeof window !== "undefined") {
    localStorage.setItem("pr_shared_plan_package", JSON.stringify(pkg));
  }
}

export const DEFAULT_STAMP_FILES = [
  {
    id: "stamp_file_michigan",
    name: "Michigan.pdf",
    sizeBytes: 14_892_100,
    pageCount: 5,
    status: "uploaded" as const,
    uploadProgress: 100,
  },
];

export const STAMP_PROCESSING_TASKS = [
  {
    stage: "verifying-credentials",
    label: "Verifying digital signature & seal",
    detail: "Validating Florida PE #92978 and Private Provider credentials with state licensing database",
  },
  {
    stage: "indexing-plan-sheets",
    label: "Indexing plan set sheets",
    detail: "Analyzing 5 sheets, extracting title blocks, orientations, and margins",
  },
  {
    stage: "calculating-placement",
    label: "Calculating default stamp coordinates",
    detail: "Calibrating approval placement box on all sheets according to jurisdiction standards",
  },
  {
    stage: "generating-vector-layers",
    label: "Generating high-resolution vector layers",
    detail: "Building interactive placement canvas and coordinate tracking anchors",
  },
  {
    stage: "complete",
    label: "Stamping workspace ready",
    detail: "Coordinates calibrated and ready for interactive placement and review",
  },
];

export function createDefaultPageStampSettings(pageCount: number) {
  const settings: Record<number, {
    pageNumber: number;
    visible: boolean;
    x: number;
    y: number;
    scale: number;
    rotation: number;
  }> = {};

  for (let i = 1; i <= pageCount; i++) {
    settings[i] = {
      pageNumber: i,
      visible: true,
      x: 18, // percentage across
      y: 82, // percentage down
      scale: 86,
      rotation: 0,
    };
  }
  return settings;
}

export async function mockRunStampProcessing(
  onStage: (index: number) => void
): Promise<void> {
  for (let i = 0; i < STAMP_PROCESSING_TASKS.length; i++) {
    onStage(i);
    await wait(580);
  }
}

export async function mockExportStampDocument(params: {
  fileName: string;
  stampedSheetsCount: number;
  totalSheetsCount: number;
  engineerName: string;
  licenseNumber: string;
}) {
  await wait(850);
  return {
    documentCount: 1,
    stampedSheetsCount: params.stampedSheetsCount,
    totalSheetsCount: params.totalSheetsCount,
    fileName: `${params.fileName.replace(/\.pdf$/i, "")} — Stamped & Certified.pdf`,
    fileSizeLabel: "14.8 MB",
    generatedAt: new Date().toISOString(),
    engineerName: params.engineerName,
    licenseNumber: params.licenseNumber,
    certificateHash: "SHA256:8f9e12a4b0c782d829910e53a6dbff3a09",
  };
}

