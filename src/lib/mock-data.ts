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
  PcaStep,
  PcaProvider,
  PcaNotary,
  PcaSheetFile,
  SavedPcaReport,
  SavedPcaRecord,
  SheetViewMode,
  PermitInspectionStepKey,
  InspectionStepConfig,
  InspectionStatus,
  InspectionItem,
  PermitLookupRecord,
  InspectionCity,
  InspectionContractor,
  PermitInspectionFormData,
  InspectionEmailPayload,
} from "./types";

// ---------------------------------------------------------------------------
// Static navigation + wizard configuration
// ---------------------------------------------------------------------------

export const NAV_ITEMS: NavItem[] = [
  { key: "review-plans", label: "Review Plans", href: "/review-plans" },
  { key: "stamp", label: "Stamp", href: "/stamp" },
  { key: "pca", label: "PCA", href: "/pca" },
  { key: "saved-pca", label: "Saved PCA", href: "/saved-pca" },
  { key: "inspections", label: "Permit Inspection", href: "/permit-inspection" },
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

// ---------------------------------------------------------------------------
// PCA Workflow Constants & Mock Data
// ---------------------------------------------------------------------------

export const PCA_STEPS: PcaStep[] = [
  {
    key: "upload",
    index: 1,
    label: "Upload Files",
    description: "Upload source PDF plans",
    badge: "STEP 01 - UPLOAD",
  },
  {
    key: "processing",
    index: 2,
    label: "Processing",
    description: "Extract sheet numbers & text",
    badge: "STEP 02 - PROCESSING",
  },
  {
    key: "review",
    index: 3,
    label: "Review Sheets",
    description: "Review sheets & PCA options",
    badge: "STEP 03 - REVIEW",
  },
  {
    key: "preview",
    index: 4,
    label: "PCA Preview",
    description: "Inspect compliance affidavit",
    badge: "STEP 04 - PREVIEW",
  },
  {
    key: "export",
    index: 5,
    label: "Export PDF",
    description: "Download or save certified PCA",
    badge: "STEP 05 - EXPORT",
  },
];

export const DEFAULT_PCA_PROVIDERS: PcaProvider[] = [
  {
    id: "provider_ali_marar",
    name: "Ali Marar",
    title: "Qualifier & Professional Engineer",
    companyName: "Permit Rockstar Private Provider LLC",
    licenseNumber: "PE92978",
    phone: "904-879-6891",
    email: "ali@permitrockstar.com",
    address: "5218 Cypress Green Dr • Jacksonville, FL 32256",
  },
  {
    id: "provider_david_rodriguez",
    name: "David Rodriguez",
    title: "Qualifier & Plan Examiner",
    companyName: "Permit Rockstar Private Provider LLC",
    licenseNumber: "PE88124",
    phone: "904-879-6892",
    email: "david@permitrockstar.com",
    address: "5218 Cypress Green Dr • Jacksonville, FL 32256",
  },
  {
    id: "provider_marcus_vance",
    name: "Marcus Vance",
    title: "Senior Plans Reviewer",
    companyName: "Permit Rockstar Private Provider LLC",
    licenseNumber: "PE94511",
    phone: "904-879-6893",
    email: "marcus@permitrockstar.com",
    address: "5218 Cypress Green Dr • Jacksonville, FL 32256",
  },
];

export const DEFAULT_PCA_NOTARIES: PcaNotary[] = [
  {
    id: "notary_fabian_videla",
    name: "Fabian Videla",
    commissionNumber: "GG910248",
    commissionExpires: "10-02-2026",
  },
  {
    id: "notary_sarah_jenkins",
    name: "Sarah Jenkins",
    commissionNumber: "HH445210",
    commissionExpires: "04-15-2027",
  },
  {
    id: "notary_elena_rostova",
    name: "Elena Rostova",
    commissionNumber: "GG821903",
    commissionExpires: "08-22-2026",
  },
];

export const DEFAULT_PCA_FILES: PcaSheetFile[] = [
  {
    id: "pca_file_forms_default",
    name: "Forms and Required Fields .pdf",
    sizeBytes: 3_420_100,
    sheets: ["1", "2", "3", "4"],
    status: "uploaded",
    uploadProgress: 100,
  },
];

export function condenseSheetNumbers(sheets: string[]): string {
  if (sheets.length === 0) return "";
  const numericSheets = sheets.map((s) => ({
    raw: s,
    num: parseInt(s.trim(), 10),
  }));

  const allNumeric = numericSheets.every((s) => !isNaN(s.num));
  if (!allNumeric) {
    return sheets.join(", ");
  }

  const nums = numericSheets.map((s) => s.num);
  const ranges: string[] = [];
  let rangeStart = nums[0];
  let prev = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const curr = nums[i];
    if (curr === prev + 1) {
      prev = curr;
    } else {
      ranges.push(rangeStart === prev ? `${rangeStart}` : `${rangeStart}-${prev}`);
      rangeStart = curr;
      prev = curr;
    }
  }
  ranges.push(rangeStart === prev ? `${rangeStart}` : `${rangeStart}-${prev}`);
  return ranges.join(", ");
}

export function formatSheetsList(
  files: PcaSheetFile[],
  mode: SheetViewMode = "individual"
): string {
  if (!files || files.length === 0) return "None";

  return files
    .map((file) => {
      const sheetsDisplay =
        mode === "condense"
          ? condenseSheetNumbers(file.sheets)
          : file.sheets.join(", ");
      return `${file.name}: ${sheetsDisplay}`;
    })
    .join("; ");
}

export async function mockRunPcaUpload(
  onProgress: (progress: number, taskLabel: string) => void
): Promise<void> {
  const steps = [
    { pct: 15, msg: "Connecting to secure plan intake server..." },
    { pct: 32, msg: "Uploading files to the server..." },
    { pct: 54, msg: "Analyzing PDF structural layers..." },
    { pct: 78, msg: "Extracting sheet numbers & title blocks..." },
    { pct: 92, msg: "Validating Florida jurisdiction compliance requirements..." },
    { pct: 100, msg: "Upload complete! Preparing sheets for review..." },
  ];

  for (const step of steps) {
    onProgress(step.pct, step.msg);
    await wait(420);
  }
}

const STORAGE_SAVED_PCA_KEY = "pr_saved_pca_reports";

export function getStoredSavedPcas(): SavedPcaReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_PCA_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePcaReport(report: SavedPcaReport): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredSavedPcas();
    const updated = [report, ...existing.filter((r) => r.id !== report.id)];
    localStorage.setItem(STORAGE_SAVED_PCA_KEY, JSON.stringify(updated));

    // Also sync to SavedPcaRecord table records
    const tableRecord: SavedPcaRecord = {
      id: report.id,
      permitNumber: `PR-${Date.now().toString().slice(-6)}`,
      projectAddress: "5218 Cypress Green Dr",
      city: report.template === "jacksonville" ? "Jacksonville" : "Atlantic Beach",
      privateProvider: report.providerName,
      contractor: "Permit Rockstar / Owner-Builder",
      dateSaved: new Date(report.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      template: report.template,
      sheetsSummary: report.sheetsFormatted,
      totalSheets: report.totalSheets,
      fileName: report.fileName,
    };
    savePcaRecordItem(tableRecord);
  } catch (err) {
    console.error("Failed to save PCA report:", err);
  }
}

// ---------------------------------------------------------------------------
// Saved PCA Records Table Data
// ---------------------------------------------------------------------------

export const DEFAULT_SAVED_PCA_RECORDS: SavedPcaRecord[] = [
  {
    id: "rec_cbc_12",
    permitNumber: "cbc-12",
    projectAddress: "Cbc, Mohali",
    city: "ProductionTestCity",
    privateProvider: "Abhishek Dhiman",
    contractor: "Abhishek Dhiman / Creative buffer",
    dateSaved: "Sep 22, 2026",
    template: "standard",
    sheetsSummary: "Forms and Required Fields .pdf: 1, 2, 3, 4",
    totalSheets: 4,
    fileName: "Forms and Required Fields .pdf",
  },
  {
    id: "rec_4561",
    permitNumber: "4561",
    projectAddress: "",
    city: "Atlantic Beach",
    privateProvider: "Ali Marar",
    contractor: "Paul Kelly / Owner/Builder",
    dateSaved: "Sep 21, 2026",
    template: "jacksonville",
    sheetsSummary: "Commercial Plans.pdf: 1-3",
    totalSheets: 3,
    fileName: "Commercial Plans.pdf",
  },
  {
    id: "rec_783_wall",
    permitNumber: "",
    projectAddress: "783 Wall street, Chicago",
    city: "Genereic",
    privateProvider: "Archana Shah",
    contractor: "Agata Videla",
    dateSaved: "Sep 2, 2026",
    template: "standard",
    sheetsSummary: "Architecture Set.pdf: 1-6",
    totalSheets: 6,
    fileName: "Architecture Set.pdf",
  },
  {
    id: "rec_3443343434",
    permitNumber: "3443343434",
    projectAddress: "",
    city: "Alachua",
    privateProvider: "",
    contractor: "Agata Videla",
    dateSaved: "Aug 28, 2026",
    template: "standard",
    sheetsSummary: "Structural Engineering.pdf: 1-2",
    totalSheets: 2,
    fileName: "Structural Engineering.pdf",
  },
  {
    id: "rec_b_26_422413",
    permitNumber: "B-26-422413.000",
    projectAddress: "2124 Lake Weir Ave",
    city: "Jacksonville",
    privateProvider: "Ali Marar",
    contractor: "Ketty Meillo",
    dateSaved: "Aug 27, 2026",
    template: "jacksonville",
    sheetsSummary: "Lake Weir Master Plan.pdf: 1-5",
    totalSheets: 5,
    fileName: "Lake Weir Master Plan.pdf",
  },
];

const STORAGE_SAVED_PCA_RECORDS_KEY = "pr_saved_pca_table_records";

export function getStoredSavedPcaRecords(): SavedPcaRecord[] {
  if (typeof window === "undefined") return DEFAULT_SAVED_PCA_RECORDS;
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_PCA_RECORDS_KEY);
    if (!raw) {
      localStorage.setItem(
        STORAGE_SAVED_PCA_RECORDS_KEY,
        JSON.stringify(DEFAULT_SAVED_PCA_RECORDS)
      );
      return DEFAULT_SAVED_PCA_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SAVED_PCA_RECORDS;
  }
}

export function savePcaRecordItem(record: SavedPcaRecord): SavedPcaRecord[] {
  if (typeof window === "undefined") return DEFAULT_SAVED_PCA_RECORDS;
  try {
    const existing = getStoredSavedPcaRecords();
    const updated = [record, ...existing.filter((r) => r.id !== record.id)];
    localStorage.setItem(
      STORAGE_SAVED_PCA_RECORDS_KEY,
      JSON.stringify(updated)
    );
    return updated;
  } catch {
    return DEFAULT_SAVED_PCA_RECORDS;
  }
}

export function deletePcaRecordItem(id: string): SavedPcaRecord[] {
  if (typeof window === "undefined") return DEFAULT_SAVED_PCA_RECORDS;
  try {
    const existing = getStoredSavedPcaRecords();
    const updated = existing.filter((r) => r.id !== id);
    localStorage.setItem(
      STORAGE_SAVED_PCA_RECORDS_KEY,
      JSON.stringify(updated)
    );
    return updated;
  } catch {
    return DEFAULT_SAVED_PCA_RECORDS;
  }
}

export function updatePcaRecordItem(record: SavedPcaRecord): SavedPcaRecord[] {
  if (typeof window === "undefined") return DEFAULT_SAVED_PCA_RECORDS;
  try {
    const existing = getStoredSavedPcaRecords();
    const updated = existing.map((r) => (r.id === record.id ? record : r));
    localStorage.setItem(
      STORAGE_SAVED_PCA_RECORDS_KEY,
      JSON.stringify(updated)
    );
    return updated;
  } catch {
    return DEFAULT_SAVED_PCA_RECORDS;
  }
}

// ---------------------------------------------------------------------------
// Permit Inspection Workflow Constants & Mock Data
// ---------------------------------------------------------------------------

export const INSPECTION_STEPS: InspectionStepConfig[] = [
  {
    key: "lookup",
    index: 1,
    label: "Permit Lookup",
    description: "Select a city & enter permit number",
    badge: "STEP 01 - LOOKUP",
  },
  {
    key: "form",
    index: 2,
    label: "Complete Form",
    description: "Fill project, provider & inspection rows",
    badge: "STEP 02 - COMPLETE FORM",
  },
  {
    key: "preview",
    index: 3,
    label: "Preview Report",
    description: "Inspect official PPI report & email",
    badge: "STEP 03 - PREVIEW REPORT",
  },
];

export const DEFAULT_INSPECTION_CITIES: InspectionCity[] = [
  {
    id: "city_atlantic_beach",
    name: "Atlantic Beach",
    county: "Duval County / City of Atlantic Beach",
    email: "inspections@coab.us",
    phone: "904-247-5826",
  },
  {
    id: "city_boca_raton",
    name: "Boca Raton",
    county: "Palm Beach County / City of Boca Raton",
    email: "JTcheou@myboca.us",
    phone: "561-393-7930",
  },
  {
    id: "city_jacksonville",
    name: "Jacksonville",
    county: "Duval County / City of Jacksonville",
    email: "bldginspections@coj.net",
    phone: "904-630-1100",
  },
  {
    id: "city_jacksonville_beach",
    name: "Jacksonville Beach",
    county: "Duval County / City of Jacksonville Beach",
    email: "buildinginspections@jaxbchfl.net",
    phone: "904-247-6235",
  },
  {
    id: "city_neptune_beach",
    name: "Neptune Beach",
    county: "Duval County / City of Neptune Beach",
    email: "buildingdept@nbfl.us",
    phone: "904-270-2400",
  },
  {
    id: "city_st_augustine",
    name: "St. Augustine",
    county: "St. Johns County / City of St. Augustine",
    email: "building@citystaug.com",
    phone: "904-825-1065",
  },
  {
    id: "city_miami_dade",
    name: "Miami-Dade",
    county: "Miami-Dade County RER Department",
    email: "pprinspections@miamidade.gov",
    phone: "786-315-2000",
  },
  {
    id: "city_tampa",
    name: "Tampa",
    county: "Hillsborough County / City of Tampa",
    email: "tampapermits@tampagov.net",
    phone: "813-274-3100",
  },
  {
    id: "city_orlando",
    name: "Orlando",
    county: "Orange County / City of Orlando",
    email: "permits@orlando.gov",
    phone: "407-246-2271",
  },
];

export const DEFAULT_PERMITS_DATA: PermitLookupRecord[] = [
  {
    id: "perm_rfoun26_0007",
    permitNumber: "RFOUN26-0007",
    projectAddress: "311 10th Street, Atlantic Beach FL 32233",
    contractorName: "Matthew Shanley / Alpha Foundations",
    city: "Atlantic Beach",
    lastActivity: "COC",
    modificationDate: "Sep 24, 2026",
    privateProvider: "Ali Marar",
  },
  {
    id: "perm_256966",
    permitNumber: "256966",
    projectAddress: "742 Evergreen Terrace, Boca Raton FL 33431",
    contractorName: "Paul Kelly / Owner/Builder",
    city: "Boca Raton",
    lastActivity: "INSP",
    modificationDate: "Sep 28, 2026",
    privateProvider: "Ali Marar",
  },
  {
    id: "perm_4561",
    permitNumber: "4561",
    projectAddress: "1202 Ocean Blvd, Atlantic Beach FL 32233",
    contractorName: "Paul Kelly / Owner/Builder",
    city: "Atlantic Beach",
    lastActivity: "PASSED",
    modificationDate: "Sep 21, 2026",
    privateProvider: "Ali Marar",
  },
  {
    id: "perm_b_26_422413",
    permitNumber: "B-26-422413.000",
    projectAddress: "2124 Lake Weir Ave, Jacksonville FL 32207",
    contractorName: "Ketty Meillo / Southern Coastal Homes",
    city: "Jacksonville",
    lastActivity: "REVIEW",
    modificationDate: "Aug 27, 2026",
    privateProvider: "Ali Marar",
  },
  {
    id: "perm_cbc_12",
    permitNumber: "cbc-12",
    projectAddress: "105 Commercial Blvd, Atlantic Beach FL 32233",
    contractorName: "Abhishek Dhiman / Creative buffer",
    city: "Atlantic Beach",
    lastActivity: "PASSED",
    modificationDate: "Sep 22, 2026",
    privateProvider: "Abhishek Dhiman",
  },
];

export const DEFAULT_CONTRACTORS_DATA: InspectionContractor[] = [
  {
    id: "contr_matthew_shanley",
    name: "Matthew Shanley",
    companyName: "Alpha Foundations",
    licenseNumber: "CGC1529481",
    phone: "904-555-0144",
    email: "m.shanley@alphafoundations.com",
    address: "10555 Philips Hwy, Jacksonville, FL 32256",
  },
  {
    id: "contr_paul_kelly",
    name: "Paul Kelly",
    companyName: "Paul Kelly / Owner/Builder",
    licenseNumber: "OWNER-BUILDER-EXEMPT",
    phone: "904-555-0812",
    email: "paul.kelly@floridabuilders.net",
    address: "1202 Ocean Blvd, Atlantic Beach, FL 32233",
  },
  {
    id: "contr_abhishek_dhiman",
    name: "Abhishek Dhiman",
    companyName: "Creative buffer",
    licenseNumber: "CBC1258902",
    phone: "904-555-7788",
    email: "abhishek@creativebuffer.com",
    address: "Cbc, Mohali",
  },
  {
    id: "contr_agata_videla",
    name: "Agata Videla",
    companyName: "Premier Design & Build",
    licenseNumber: "CRC1330412",
    phone: "561-555-9014",
    email: "agata@premierbuilds.com",
    address: "783 Wall Street, Boca Raton, FL 33432",
  },
  {
    id: "contr_ketty_meillo",
    name: "Ketty Meillo",
    companyName: "Southern Coastal Homes LLC",
    licenseNumber: "CGC1518201",
    phone: "904-555-4421",
    email: "kmeillo@southerncoastal.com",
    address: "2124 Lake Weir Ave, Jacksonville, FL 32207",
  },
];

export const DEFAULT_INSPECTION_ROWS: InspectionItem[] = [
  {
    id: "insp_1",
    code: "101",
    inspection: "Building Framing",
    status: "Passed",
    date: "2026-09-30",
    inspector: "Ali Marar",
  },
  {
    id: "insp_2",
    code: "201",
    inspection: "Rough Electrical",
    status: "Passed",
    date: "2026-09-30",
    inspector: "Ali Marar",
  },
  {
    id: "insp_3",
    code: "301",
    inspection: "Rough Plumbing",
    status: "Passed",
    date: "2026-09-30",
    inspector: "Ali Marar",
  },
];

export const DEFAULT_INSPECTION_FORM_DATA: PermitInspectionFormData = {
  city: "Atlantic Beach",
  permitNumber: "256966",
  projectAddress: "Project Address",
  countyDepartment: "Boca Raton",
  providerId: "provider_ali_marar",
  firmName: "Permit Rockstar Private Provider LLC",
  qualifierName: "Ali Marar",
  phone: "904-679-6893",
  email: "ali@permitrockstar.com",
  contractorId: "contr_matthew_shanley",
  contractorName: "Matthew Shanley / Alpha Foundations",
  contractorLicense: "CGC1529481",
  contractorPhone: "904-555-0144",
  contractorEmail: "m.shanley@alphafoundations.com",
  inspections: DEFAULT_INSPECTION_ROWS,
};

const STORAGE_INSPECTION_CITIES_KEY = "pr_inspection_cities_list";
const STORAGE_INSPECTION_PERMITS_KEY = "pr_inspection_permits_list";

export function getStoredInspectionCities(): InspectionCity[] {
  if (typeof window === "undefined") return DEFAULT_INSPECTION_CITIES;
  try {
    const raw = localStorage.getItem(STORAGE_INSPECTION_CITIES_KEY);
    if (!raw) {
      localStorage.setItem(
        STORAGE_INSPECTION_CITIES_KEY,
        JSON.stringify(DEFAULT_INSPECTION_CITIES)
      );
      return DEFAULT_INSPECTION_CITIES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_INSPECTION_CITIES;
  }
}

export function saveStoredInspectionCity(city: InspectionCity): InspectionCity[] {
  if (typeof window === "undefined") return DEFAULT_INSPECTION_CITIES;
  try {
    const current = getStoredInspectionCities();
    const updated = [city, ...current.filter((c) => c.name.toLowerCase() !== city.name.toLowerCase())];
    localStorage.setItem(STORAGE_INSPECTION_CITIES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_INSPECTION_CITIES;
  }
}

export function getStoredInspectionPermits(): PermitLookupRecord[] {
  if (typeof window === "undefined") return DEFAULT_PERMITS_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_INSPECTION_PERMITS_KEY);
    if (!raw) {
      localStorage.setItem(
        STORAGE_INSPECTION_PERMITS_KEY,
        JSON.stringify(DEFAULT_PERMITS_DATA)
      );
      return DEFAULT_PERMITS_DATA;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PERMITS_DATA;
  }
}

