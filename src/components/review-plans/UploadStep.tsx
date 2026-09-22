"use client";

import { useCallback, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  X,
  AlertTriangle,
  CheckCircle2,
  Files,
  ShieldCheck,
  Building2,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatBytes } from "@/lib/mock-data";
import type { PlanFile } from "@/lib/types";

interface UploadStepProps {
  files: PlanFile[];
  onFilesAdded: (files: File[]) => void;
  onRemove: (id: string) => void;
  onProceed: () => void;
}

const JURISDICTIONS = [
  "City of Cedar Park, TX",
  "City of Austin, TX",
  "City of Houston, TX",
  "City of Dallas, TX",
  "City of San Antonio, TX",
];

const PERMIT_TYPES = [
  "Commercial — Tenant Finish-Out",
  "Commercial — New Building",
  "Residential — Single Family",
  "Electrical & Solar Array",
  "Mechanical & Plumbing",
];

export function UploadStep({
  files,
  onFilesAdded,
  onRemove,
  onProceed,
}: UploadStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(JURISDICTIONS[0]);
  const [selectedPermitType, setSelectedPermitType] = useState(PERMIT_TYPES[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf");
      if (dropped.length) onFilesAdded(dropped);
    },
    [onFilesAdded]
  );

  function handleLoadSample() {
    const sampleBlob = new Blob(["Sample Plan Set PDF Content"], { type: "application/pdf" });
    const sampleFile = new File([sampleBlob], "Bill-Receipt-18-08-2026 12-19.pdf", {
      type: "application/pdf",
    });
    onFilesAdded([sampleFile]);
  }

  const hasFiles = files.length > 0;
  const anyUploading = files.some((f) => f.status === "uploading");
  const allUploaded = hasFiles && files.every((f) => f.status === "uploaded");

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Configuration Controls Bar */}
      <Card className="flex flex-col gap-4 bg-paper-raised p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap items-center gap-4 text-[13px]">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            <span className="font-semibold text-ink">Jurisdiction:</span>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="rounded-lg border border-paper-line bg-paper px-3 py-1.5 font-medium text-ink focus:border-primary focus:outline-none"
            >
              {JURISDICTIONS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>
          <div className="h-4 w-px bg-paper-line hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">Scope:</span>
            <select
              value={selectedPermitType}
              onChange={(e) => setSelectedPermitType(e.target.value)}
              className="rounded-lg border border-paper-line bg-paper px-3 py-1.5 font-medium text-ink focus:border-primary focus:outline-none"
            >
              {PERMIT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-primary/20 bg-primary-soft/50 px-3.5 py-1.5 font-mono text-[12px] font-semibold text-primary transition-colors hover:bg-primary-soft sm:self-auto"
        >
          <Sparkles size={14} /> Load Sample Plan Set
        </button>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Dropzone Card */}
        <Card padded={false} className="overflow-hidden shadow-[0_12px_30px_rgba(23,19,15,0.045)]">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={clsx(
              "m-4 rounded-2xl border-2 border-dashed transition-all duration-200",
              dragActive ? "border-primary bg-primary-soft/60 scale-[0.99]" : "border-paper-line bg-paper/60"
            )}
          >
            <div className="flex flex-col items-center justify-center px-4 py-6text-center sm:py-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-[0_8px_18px_rgba(0,85,127,0.2)] transition-transform hover:scale-105">
                <UploadCloud size={26} className="text-secondary" strokeWidth={1.75} />
              </div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                SOURCE FILES
              </p>
              <h3 className="mt-2 text-[20px] font-bold text-ink">Drop your plan set here</h3>
              <p className="mt-1.5 max-w-[400px] text-[13.5px] text-slate leading-relaxed">
                PDF files only. Upload complete sheet sets for automated AI rule matching and annotations.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button variant="primary" size="md" onClick={() => inputRef.current?.click()}>
                  Browse files
                </Button>
                <Button variant="outline" size="md" onClick={handleLoadSample}>
                  Use Sample PDF
                </Button>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    onFilesAdded(Array.from(e.target.files));
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        </Card>

        {/* Info Sidebar Box */}
        <div className="flex flex-col justify-between rounded-2xl bg-primary-dark p-6 text-white shadow-[0_12px_30px_rgba(0,62,93,0.15)]">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-secondary">
              <Files size={19} />
            </div>
            <p className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-secondary">
              A SMOOTHER REVIEW
            </p>
            <h3 className="mt-2 text-[18px] font-semibold leading-snug text-white">
              Include every related sheet in one upload.
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/80">
              We retain the sheet order, extract callout text, and prepare a unified review package.
            </p>
          </div>
          <div className="mt-7 flex items-center gap-2 border-t border-white/15 pt-4 text-[12px] font-medium text-white/90">
            <ShieldCheck size={16} className="text-secondary" /> PDF plan sets only &middot; Encrypted
          </div>
        </div>
      </div>

      {/* Uploaded File List */}
      {hasFiles && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-soft">
                REVIEW PACKAGE
              </p>
              <p className="mt-0.5 text-[13.5px] font-medium text-slate">
                {files.length} file{files.length === 1 ? "" : "s"} ready for automated review
              </p>
            </div>
            {allUploaded && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-soft px-3 py-1 text-[12px] font-bold text-forest">
                <CheckCircle2 size={15} /> Package Ready
              </span>
            )}
          </div>
          <ul className="space-y-2.5">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center gap-3.5 rounded-xl border border-paper-line bg-paper/60 px-4 py-3.5 transition-all hover:border-primary/40 shadow-xs"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                  {file.status === "error" ? (
                    <AlertTriangle size={18} className="text-alert" />
                  ) : (
                    <FileText size={18} className="text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-[13.5px] font-bold text-ink">{file.name}</p>
                    <span className="shrink-0 font-mono text-[12px] text-slate-soft">
                      {formatBytes(file.sizeBytes)} <span aria-hidden="true">&middot;</span> {file.pageCount} pg
                    </span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-paper-line">
                    <div
                      className={clsx(
                        "h-full rounded-full transition-all duration-300",
                        file.status === "uploaded" ? "bg-forest" : "bg-primary"
                      )}
                      style={{ width: `${file.uploadProgress}%` }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(file.id)}
                  aria-label={`Remove ${file.name}`}
                  className="shrink-0 p-1 text-slate-soft transition-colors hover:text-alert"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Action Footer Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-paper-line bg-paper-raised px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 shadow-xs">
        <p className="text-[13px] font-medium text-slate">
          {allUploaded
            ? "Your plan set is ready. Click proceed to begin automated processing."
            : anyUploading
              ? "Uploading files and preparing the review package..."
              : "Add at least one PDF plan set or click Load Sample PDF to continue."}
        </p>
        <Button
          size="lg"
          variant="primary"
          disabled={!allUploaded || anyUploading}
          onClick={onProceed}
          className="shadow-sm"
        >
          Proceed to review plans
        </Button>
      </div>
    </div>
  );
}