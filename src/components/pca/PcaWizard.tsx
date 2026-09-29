"use client";

import { useState } from "react";
import { PcaStepRail } from "./PcaStepRail";
import { PcaUploadStep } from "./PcaUploadStep";
import { PcaProcessingStep } from "./PcaProcessingStep";
import { PcaReviewStep } from "./PcaReviewStep";
import { PcaPreviewStep } from "./PcaPreviewStep";
import { PcaExportStep } from "./PcaExportStep";
import { DEFAULT_PCA_FILES, PCA_STEPS } from "@/lib/mock-data";
import type {
  PcaStepKey,
  PcaSheetFile,
  PcaTemplateType,
  PcaSignatureType,
  SheetViewMode,
} from "@/lib/types";

const STEP_COPY: Record<
  PcaStepKey,
  { eyebrow: string; title: string; description: string }
> = {
  upload: {
    eyebrow: "Step 01 - Upload",
    title: "Upload Plan Files",
    description:
      "Upload your PDF drawing sets to automatically parse sheet numbers and prepare the Plan Compliance Affidavit.",
  },
  processing: {
    eyebrow: "Step 02 - Processing",
    title: "Uploading files to the server...",
    description:
      "Please keep this tab open while our engine indexes your sheets, verifies title blocks, and parses metadata.",
  },
  review: {
    eyebrow: "Step 03 - Review",
    title: "Review Sheet Numbers",
    description:
      "Use the edit icon for filenames, or click any sheet number to edit it directly.",
  },
  preview: {
    eyebrow: "Step 04 - Preview",
    title: "PCA Document Preview",
    description:
      "Both pages are formatted as official A4 compliance documents, with all underlined filler fields ready.",
  },
  export: {
    eyebrow: "Step 05 - Export",
    title: "Export Complete",
    description:
      "The Plan Compliance Affidavit has been assembled and is ready for download, signing, or saving.",
  },
};

export function PcaWizard() {
  const [step, setStep] = useState<PcaStepKey>("upload");
  const [files, setFiles] = useState<PcaSheetFile[]>(DEFAULT_PCA_FILES);
  const [template, setTemplate] = useState<PcaTemplateType>("jacksonville");
  const [signatureOption, setSignatureOption] =
    useState<PcaSignatureType>("embedded");
  const [viewMode, setViewMode] = useState<SheetViewMode>("individual");
  const [selectedProviderId, setSelectedProviderId] = useState("provider_ali_marar");
  const [selectedNotaryId, setSelectedNotaryId] = useState("notary_fabian_videla");
  const [signedDate, setSignedDate] = useState("29-09-2026");

  const currentStepConfig = PCA_STEPS.find((s) => s.key === step) || PCA_STEPS[0];
  const copy = STEP_COPY[step];
  const stepNumber = currentStepConfig.index;

  function handleFilesAdded(newFiles: File[]) {
    const converted: PcaSheetFile[] = newFiles.map((file, idx) => {
      // Mock sheet count based on size
      const sheetCount = Math.max(1, Math.min(25, Math.round(file.size / 600_000) || 4));
      const sheetLabels: string[] = [];
      for (let i = 1; i <= sheetCount; i++) {
        sheetLabels.push(`${i}`);
      }

      return {
        id: `file_${Date.now()}_${idx}`,
        name: file.name,
        sizeBytes: file.size,
        sheets: sheetLabels,
        status: "uploaded",
        uploadProgress: 100,
      };
    });

    setFiles((prev) => [...prev, ...converted]);
  }

  function handleRemoveFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function handleRestart() {
    setStep("upload");
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Header */}
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="max-w-full">
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">
            PCA Workflow <span className="mx-1.5 text-slate-soft">/</span> {copy.eyebrow}
          </p>
          <h1 className="mt-1 text-[20px] font-bold tracking-[-0.035em] text-ink sm:text-[26px]">
            {copy.title}
          </h1>
          <p className="mt-1 max-w-full text-[12.5px] leading-relaxed text-slate">
            {copy.description}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-[12px] shadow-xs lg:self-auto">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-[12px] font-bold text-primary">
            {stepNumber}
          </span>
          <div>
            <p className="font-semibold text-ink">Step {stepNumber} of 5</p>
            <p className="text-slate">Plan Compliance Affidavit</p>
          </div>
        </div>
      </header>

      {/* Step Rail Indicator */}
      <PcaStepRail current={step} />

      {/* Step Contents */}
      {step === "upload" && (
        <PcaUploadStep
          files={files}
          onFilesAdded={handleFilesAdded}
          onRemoveFile={handleRemoveFile}
          onProceed={() => setStep("processing")}
        />
      )}

      {step === "processing" && (
        <PcaProcessingStep onComplete={() => setStep("review")} />
      )}

      {step === "review" && (
        <PcaReviewStep
          files={files}
          template={template}
          onChangeTemplate={setTemplate}
          signatureOption={signatureOption}
          onChangeSignatureOption={setSignatureOption}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onUpdateFiles={setFiles}
          onBack={() => setStep("upload")}
          onProceed={() => setStep("preview")}
          onRestart={handleRestart}
        />
      )}

      {step === "preview" && (
        <PcaPreviewStep
          template={template}
          signatureOption={signatureOption}
          selectedProviderId={selectedProviderId}
          onChangeProviderId={setSelectedProviderId}
          selectedNotaryId={selectedNotaryId}
          onChangeNotaryId={setSelectedNotaryId}
          signedDate={signedDate}
          onChangeSignedDate={setSignedDate}
          files={files}
          viewMode={viewMode}
          onEditSheets={() => setStep("review")}
          onGeneratePdf={() => setStep("export")}
          onRestart={handleRestart}
        />
      )}

      {step === "export" && (
        <PcaExportStep
          template={template}
          signatureOption={signatureOption}
          selectedProviderId={selectedProviderId}
          selectedNotaryId={selectedNotaryId}
          signedDate={signedDate}
          files={files}
          viewMode={viewMode}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
