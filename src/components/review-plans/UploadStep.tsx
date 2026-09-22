"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, X, AlertTriangle, CheckCircle2, Files, ShieldCheck } from "lucide-react";
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

export function UploadStep({ files, onFilesAdded, onRemove, onProceed }: UploadStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf");
    if (dropped.length) onFilesAdded(dropped);
  }, [onFilesAdded]);

  const hasFiles = files.length > 0;
  const anyUploading = files.some((f) => f.status === "uploading");
  const allUploaded = hasFiles && files.every((f) => f.status === "uploaded");

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card padded={false} className="overflow-hidden shadow-[0_12px_30px_rgba(23,19,15,0.045)]">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={clsx(
              "blueprint-grid m-4 rounded-2xl border-2 border-dashed transition-colors",
              dragActive ? "border-primary bg-primary-soft/60" : "border-paper-line bg-paper/60"
            )}
          >
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center sm:py-16">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-[0_8px_18px_rgba(0,85,127,0.2)]">
                <UploadCloud size={26} className="text-secondary" strokeWidth={1.75} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">Source files</p>
              <h3 className="mt-2 text-[18px] font-semibold text-ink">Drop your plan set here</h3>
              <p className="mt-1.5 max-w-[390px] text-[13.5px] text-slate">PDF files only. Upload a complete sheet set for the most accurate automated review.</p>
              <Button variant="outline" size="md" className="mt-5 bg-white/75" onClick={() => inputRef.current?.click()}>
                Browse files
              </Button>
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

        <Card className="flex flex-col justify-between bg-ink text-white shadow-[0_12px_30px_rgba(23,19,15,0.1)]">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-secondary"><Files size={19} /></div>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">A smoother review</p>
            <h3 className="mt-2 text-[17px] font-semibold leading-snug">Include every related sheet in one upload.</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/65">We retain the file order and prepare a single review package for annotation.</p>
          </div>
          <div className="mt-7 flex items-center gap-2 border-t border-white/10 pt-4 text-[12px] text-white/70"><ShieldCheck size={16} className="text-secondary" /> PDF plan sets only</div>
        </Card>
      </div>

      {hasFiles && (
        <Card className="space-y-3.5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-soft">Review package</p>
              <p className="mt-0.5 text-[13px] text-slate">{files.length} file{files.length === 1 ? "" : "s"} ready for review</p>
            </div>
            {allUploaded && <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-soft px-2.5 py-1 text-[11.5px] font-semibold text-forest"><CheckCircle2 size={14} /> Ready</span>}
          </div>
          <ul className="space-y-2">
            {files.map((file) => (
              <li key={file.id} className="flex items-center gap-3 rounded-xl border border-paper-line bg-paper/60 px-4 py-3 transition-colors hover:border-primary/30">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                  {file.status === "error" ? <AlertTriangle size={17} className="text-alert" /> : <FileText size={17} className="text-primary" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-[13.5px] font-medium text-ink">{file.name}</p>
                    <span className="shrink-0 text-[12px] text-slate-soft">{formatBytes(file.sizeBytes)} <span aria-hidden="true">&middot;</span> {file.pageCount} pg</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-line">
                    <div className={clsx("h-full rounded-full transition-all duration-200", file.status === "uploaded" ? "bg-forest" : "bg-primary")} style={{ width: `${file.uploadProgress}%` }} />
                  </div>
                </div>
                <button onClick={() => onRemove(file.id)} aria-label={`Remove ${file.name}`} className="shrink-0 p-1 text-slate-soft transition-colors hover:text-alert"><X size={16} /></button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-paper-line bg-paper-raised px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-[12.5px] text-slate">{allUploaded ? "Your files are ready. Continue when you are set." : anyUploading ? "Uploading files and preparing the review package..." : "Add at least one PDF plan set to continue."}</p>
        <Button size="lg" disabled={!allUploaded || anyUploading} onClick={onProceed}>Proceed to review plans</Button>
      </div>
    </div>
  );
}