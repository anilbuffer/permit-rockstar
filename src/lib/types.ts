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

// ---- Stamp Workflow ---------------------------------------------------

export type StampStepKey = "upload" | "processing" | "preview" | "export";

export interface StampStep {
  key: StampStepKey;
  index: number;
  label: string;
  description: string;
}

export type RoleStampType = "reviewer" | "private-provider" | "building-official";

export interface UserStampProfile {
  id: string;
  name: string;
  title: string;
  licenseNumber: string;
  state: string;
  email: string;
  phone: string;
}

export type StampLayerType =
  | "rect"
  | "circle"
  | "line"
  | "text"
  | "arctext"
  | "image"
  | "flmap"
  | "logo";

export interface StampLayer {
  id: string;
  type: StampLayerType;
  name: string;
  x: number; // px within artboard
  y: number; // px within artboard
  width?: number; // px
  height?: number; // px
  radius?: number; // px
  text?: string;
  fontSize?: number; // px
  fontFamily?: string;
  fontWeight?: string;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  hasFill?: boolean;
  arcRadius?: number;
  arcStartAngle?: number;
  arcFlip?: boolean;
  imageUrl?: string;
  rotation?: number;
}

export interface StampConfig {
  engineerName: string;
  role: RoleStampType;
  licenseNumber: string;
  state: string;
  companyName: string;
  complianceText: string;
  email: string;
  phone: string;
  dateText: string;
  inkColor: string; // hex code
  includeLogo: boolean;
  includeSeal: boolean;
  customStampImage: string | null;
  artboardWidth: number;
  artboardHeight: number;
  layers: StampLayer[];
}

export interface SharedPlanPackage {
  id: string;
  fileName: string;
  sizeBytes: number;
  pageCount: number;
  source: "review-plans" | "stamp" | "pca";
  exportedAt: string;
}

export interface PageStampSettings {
  pageNumber: number;
  visible: boolean;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale: number; // percentage 50-150
  rotation: number; // 0, 90, 180, 270
}

export interface StampProcessingTask {
  stage: string;
  label: string;
  detail: string;
}

export interface StampExportResult {
  documentCount: number;
  stampedSheetsCount: number;
  totalSheetsCount: number;
  fileName: string;
  fileSizeLabel: string;
  generatedAt: string;
  engineerName: string;
  licenseNumber: string;
  certificateHash: string;
}

// ---- PCA Workflow -----------------------------------------------------

export type PcaStepKey =
  | "upload"
  | "processing"
  | "review"
  | "preview"
  | "export";

export interface PcaStep {
  key: PcaStepKey;
  index: number;
  label: string;
  description: string;
  badge: string;
}

export type PcaTemplateType = "jacksonville" | "standard";
export type PcaSignatureType = "embedded" | "manual";
export type SheetViewMode = "individual" | "condense";

export interface PcaSheetFile {
  id: string;
  name: string;
  sizeBytes: number;
  sheets: string[];
  status?: "queued" | "uploading" | "uploaded";
  uploadProgress?: number;
}

export interface PcaProvider {
  id: string;
  name: string;
  title: string;
  companyName: string;
  licenseNumber: string;
  phone: string;
  email: string;
  address: string;
}

export interface PcaNotary {
  id: string;
  name: string;
  commissionNumber: string;
  commissionExpires: string;
}

export interface SavedPcaReport {
  id: string;
  title: string;
  template: PcaTemplateType;
  signatureOption: PcaSignatureType;
  providerName: string;
  notaryName: string;
  signedDate: string;
  totalSheets: number;
  sheetsFormatted: string;
  fileName: string;
  fileSizeLabel: string;
  createdAt: string;
}

export interface SavedPcaRecord {
  id: string;
  permitNumber?: string;
  projectAddress?: string;
  city: string;
  privateProvider: string;
  contractor: string;
  dateSaved: string;
  template?: PcaTemplateType;
  sheetsSummary?: string;
  totalSheets?: number;
  fileName?: string;
  notes?: string;
}

// ---- Permit Inspection Workflow ---------------------------------------

export type PermitInspectionStepKey = "lookup" | "form" | "preview";

export interface InspectionStepConfig {
  key: PermitInspectionStepKey;
  index: number;
  label: string;
  description: string;
  badge: string;
}

export type InspectionStatus = "Passed" | "Partial" | "Failed" | "Scheduled";

export interface InspectionItem {
  id: string;
  code: string;
  inspection: string;
  status: InspectionStatus;
  date: string;
  inspector: string;
  notes?: string;
}

export interface PermitLookupRecord {
  id: string;
  permitNumber: string;
  projectAddress: string;
  contractorName: string;
  city: string;
  lastActivity: string;
  modificationDate: string;
  privateProvider?: string;
}

export interface InspectionCodeItem {
  code: string;
  name: string;
}

export interface InspectionCity {
  id: string;
  name: string;
  county: string;
  email: string;
  phone: string;
  cityType?: string;
  workflowSteps?: "One Step" | "Two Step";
  emailRecipients?: string[];
  inspectionCodes?: InspectionCodeItem[];
  subjectTemplate?: string;
  bodyTemplate?: string;
  attachmentRequired?: boolean;
}

export interface InspectionContractor {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  companyName: string;
  identifierFormat?: "name" | "company" | "both";
  licenseNumber: string;
  licenses?: string[];
  phone?: string;
  email?: string;
  address?: string;
}

export interface PermitInspectionFormData {
  city: string;
  permitNumber: string;
  projectAddress: string;
  countyDepartment: string;
  providerId: string;
  firmName: string;
  qualifierName: string;
  phone: string;
  email: string;
  contractorId: string;
  contractorName: string;
  contractorLicense: string;
  contractorPhone: string;
  contractorEmail: string;
  inspections: InspectionItem[];
}

export interface InspectionEmailPayload {
  fromEmail: string;
  senderName: string;
  replyTo: string;
  toRecipients: string[];
  ccRecipients: string[];
  subject: string;
  messageBody: string;
}


