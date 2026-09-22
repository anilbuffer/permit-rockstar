"use client";

import { useState } from "react";
import { StepRail } from "./StepRail";
import { UploadStep } from "./UploadStep";
import { ProcessingStep } from "./ProcessingStep";
import { AnnotateStep } from "./AnnotateStep";
import { ExportStep } from "./ExportStep";
import {
  buildMockDocument,
  createMockPlanFile,
  mockExportDocument,
  mockRunProcessing,
  mockUploadFiles,
} from "@/lib/mock-data";
import type {
  Annotation,
  ExportResult,
  PlanDocument,
  PlanFile,
  ReviewStepKey,
} from "@/lib/types";

const STEP_COPY: Record<ReviewStepKey, { eyebrow: string; title: string; description: string }> = {
  upload: {
    eyebrow: "New review",
    title: "Prepare your plan set",
    description: "Upload the source PDFs you want to review. We will keep every sheet together as one review package.",
  },
  processing: {
    eyebrow: "Review package",
    title: "Preparing your workspace",
    description: "We are indexing the plan set and checking it against the selected jurisdiction rules.",
  },
  annotate: {
    eyebrow: "Review workspace",
    title: "Review and annotate plans",
    description: "Add clear, actionable notes directly on the plan before you create the reviewed PDF.",
  },
  export: {
    eyebrow: "Review complete",
    title: "Your reviewed plans are ready",
    description: "The review package has been prepared and is ready for its next step.",
  },
};

export function ReviewPlansWizard() {
  const [step, setStep] = useState<ReviewStepKey>("upload");
  const [files, setFiles] = useState<PlanFile[]>([]);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [document, setDocument] = useState<PlanDocument | null>(null);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);

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
  }

  function handleRemoveFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleProceedFromUpload() {
    setStep("processing");
    setProcessingIndex(0);
    await mockRunProcessing((i) => setProcessingIndex(i));
    setDocument(buildMockDocument(files[0]?.name ?? "Plan Set.pdf"));
    setStep("annotate");
  }

  function handleAddAnnotation(a: Annotation) {
    setDocument((doc) =>
      doc ? { ...doc, annotations: [...doc.annotations, a] } : doc
    );
  }

  function handleResetAnnotations() {
    setDocument((doc) => (doc ? { ...doc, annotations: [] } : doc));
  }

  async function handleExport() {
    const result = await mockExportDocument(files.length || 1);
    setExportResult(result);
    setStep("export");
  }

  function handleStartOver() {
    setFiles([]);
    setDocument(null);
    setExportResult(null);
    setStep("upload");
  }

  const copy = STEP_COPY[step];
  const stepNumber = step === "upload" ? 1 : step === "processing" ? 2 : step === "annotate" ? 3 : 4;

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-5 border-b border-paper-line pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-full">
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">
            Review plans <span className="mx-1.5 text-slate-soft">/</span> {copy.eyebrow}
          </p>
          <h1 className="mt-1 text-[18px] font-bold tracking-[-0.035em] text-ink sm:text-[24px]">
            {copy.title}
          </h1>
          <p className="mt-1 max-w-full text-[12px] leading-relaxed text-slate">
            {copy.description}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-[12px] lg:self-auto">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft font-bold text-primary">
            {stepNumber}
          </span>
          <div>
            <p className="font-semibold text-ink">Step {stepNumber} of 4</p>
            <p className="text-slate">Guided review workflow</p>
          </div>
        </div>
      </header>

      <StepRail current={step} />

      {step === "upload" && (
        <UploadStep
          files={files}
          onFilesAdded={handleFilesAdded}
          onRemove={handleRemoveFile}
          onProceed={handleProceedFromUpload}
        />
      )}

      {step === "processing" && <ProcessingStep activeIndex={processingIndex} />}

      {step === "annotate" && document && (
        <AnnotateStep
          document={document}
          onAddAnnotation={handleAddAnnotation}
          onReset={handleResetAnnotations}
          onExport={handleExport}
        />
      )}

      {step === "export" && exportResult && (
        <ExportStep result={exportResult} onStartOver={handleStartOver} />
      )}
    </div>
  );
}