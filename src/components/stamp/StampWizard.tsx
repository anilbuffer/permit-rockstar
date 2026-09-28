"use client";

import { useState, useEffect } from "react";
import { StampStepRail } from "./StampStepRail";
import { UploadStampStep } from "./UploadStampStep";
import { StampProcessingStep } from "./StampProcessingStep";
import { PreviewDocumentStep } from "./PreviewDocumentStep";
import { StampExportStep } from "./StampExportStep";
import {
  createDefaultPageStampSettings,
  createMockPlanFile,
  DEFAULT_STAMP_CONFIG,
  DEFAULT_STAMP_FILES,
  getStoredPlanPackage,
  mockExportStampDocument,
  mockRunStampProcessing,
  mockUploadFiles,
  setStoredPlanPackage,
} from "@/lib/mock-data";
import type {
  PageStampSettings,
  PlanFile,
  StampConfig,
  StampExportResult,
  StampStepKey,
} from "@/lib/types";

const STEP_COPY: Record<
  StampStepKey,
  { eyebrow: string; title: string; description: string }
> = {
  upload: {
    eyebrow: "Upload Stamp",
    title: "Upload & configure your stamp",
    description:
      "Create or customize your stamp using the interactive editor, and confirm the plan set carried over from review.",
  },
  processing: {
    eyebrow: "Credential Verification",
    title: "Preparing stamping workspace",
    description:
      "We are authenticating your digital seal credentials and calculating sheet coordinates.",
  },
  preview: {
    eyebrow: "Document Placement",
    title: "Position your stamp on sheets",
    description:
      "The custom stamp you designed is placed on the document. Drag to position, scale, and adjust per-sheet visibility.",
  },
  export: {
    eyebrow: "Stamping Complete",
    title: "Your stamped plans are ready",
    description:
      "The certified plan set has been packaged with cryptographic signing metadata.",
  },
};

export function StampWizard() {
  const [step, setStep] = useState<StampStepKey>("upload");
  const [files, setFiles] = useState<PlanFile[]>(DEFAULT_STAMP_FILES);
  const [stampConfig, setStampConfig] = useState<StampConfig>(DEFAULT_STAMP_CONFIG);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [pageSettings, setPageSettings] = useState<Record<number, PageStampSettings>>(() =>
    createDefaultPageStampSettings(5)
  );
  const [exportResult, setExportResult] = useState<StampExportResult | null>(null);
  const [carriedOverFromReview, setCarriedOverFromReview] = useState(true);

  // Automatically load the plan package exported from Review Plans
  useEffect(() => {
    const pkg = getStoredPlanPackage();
    if (pkg && pkg.fileName) {
      setFiles([
        {
          id: pkg.id || "pkg_reviewed_active",
          name: pkg.fileName,
          sizeBytes: pkg.sizeBytes || 14_892_100,
          pageCount: pkg.pageCount || 5,
          status: "uploaded",
          uploadProgress: 100,
        },
      ]);
      setPageSettings(createDefaultPageStampSettings(pkg.pageCount || 5));
      setCarriedOverFromReview(pkg.source === "review-plans");
    }
  }, []);

  async function handleFilesAdded(newFiles: File[]) {
    const mocked = newFiles.map(createMockPlanFile);
    setFiles((prev) => [...prev, ...mocked]);
    setFiles((prev) =>
      prev.map((f) =>
        mocked.find((m) => m.id === f.id) ? { ...f, status: "uploading" } : f
      )
    );
    await mockUploadFiles(mocked, (id, progress) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                uploadProgress: progress,
                status: progress >= 100 ? "uploaded" : "uploading",
              }
            : f
        )
      );
    });

    const totalPages = mocked[0]?.pageCount || 5;
    setPageSettings(createDefaultPageStampSettings(totalPages));
  }

  function handleRemoveFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleProceedFromUpload() {
    setStep("processing");
    setProcessingIndex(0);
    await mockRunStampProcessing((i) => setProcessingIndex(i));
    setStep("preview");
  }

  async function handleExport() {
    const activeFileName = files[0]?.name || "Michigan.pdf";
    const totalSheets = files[0]?.pageCount || 5;
    const stampedCount = Object.values(pageSettings).filter((p) => p.visible).length;

    const result = await mockExportStampDocument({
      fileName: activeFileName,
      stampedSheetsCount: stampedCount,
      totalSheetsCount: totalSheets,
      engineerName: stampConfig.engineerName,
      licenseNumber: stampConfig.licenseNumber,
    });

    setStoredPlanPackage({
      id: `pkg_stamped_${Date.now()}`,
      fileName: result.fileName,
      sizeBytes: 14_892_100,
      pageCount: totalSheets,
      source: "stamp",
      exportedAt: result.generatedAt,
    });

    setExportResult(result);
    setStep("export");
  }

  function handleStartOver() {
    setFiles(DEFAULT_STAMP_FILES);
    setStampConfig(DEFAULT_STAMP_CONFIG);
    setPageSettings(createDefaultPageStampSettings(5));
    setExportResult(null);
    setStep("upload");
  }

  const copy = STEP_COPY[step];
  const stepNumber =
    step === "upload"
      ? 1
      : step === "processing"
        ? 2
        : step === "preview"
          ? 3
          : 4;

  const activeFileName = files[0]?.name || "Michigan.pdf";
  const activePageCount = files[0]?.pageCount || 5;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header section matching /review-plans */}
      <header className="flex flex-col gap-4 border-b border-paper-line pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-full">
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">
            Digital Stamping <span className="mx-1.5 text-slate-soft">/</span> {copy.eyebrow}
          </p>
          <h1 className="mt-1 text-[18px] font-bold tracking-[-0.035em] text-ink sm:text-[24px]">
            {copy.title}
          </h1>
          <p className="mt-1 max-w-full text-[12px] leading-relaxed text-slate">
            {copy.description}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-[12px] shadow-xs lg:self-auto">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-[12px] font-bold text-primary">
            {stepNumber}
          </span>
          <div>
            <p className="font-semibold text-ink">Step {stepNumber} of 4</p>
            <p className="text-slate">Digital stamping workflow</p>
          </div>
        </div>
      </header>

      {/* Step Rail Progress indicator */}
      <StampStepRail current={step} />

      {/* Step Views */}
      {step === "upload" && (
        <UploadStampStep
          stampConfig={stampConfig}
          onChangeStampConfig={setStampConfig}
          files={files}
          onFilesAdded={handleFilesAdded}
          onRemoveFile={handleRemoveFile}
          onProceed={handleProceedFromUpload}
          isCarriedOverFromReview={carriedOverFromReview}
        />
      )}

      {step === "processing" && <StampProcessingStep activeIndex={processingIndex} />}

      {step === "preview" && (
        <PreviewDocumentStep
          fileName={activeFileName}
          totalPages={activePageCount}
          stampConfig={stampConfig}
          pageSettings={pageSettings}
          onChangePageSettings={setPageSettings}
          onBack={() => setStep("upload")}
          onExport={handleExport}
        />
      )}

      {step === "export" && exportResult && (
        <StampExportStep result={exportResult} onStartOver={handleStartOver} />
      )}
    </div>
  );
}
