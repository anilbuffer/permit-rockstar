"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Download,
  ArrowRight,
  Stamp,
  RotateCcw,
  FileCheck2,
  ShieldCheck,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ExportResult } from "@/lib/types";

export function ExportStep({
  result,
  onStartOver,
}: {
  result: ExportResult;
  onStartOver: () => void;
}) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [routedToPca, setRoutedToPca] = useState(false);
  const [routedToStamp, setRoutedToStamp] = useState(false);

  function triggerToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  function handleDownload() {
    setDownloaded(true);
    triggerToast("Downloading reviewed PDF plan package...");
    // Simulate blob download
    const element = document.createElement("a");
    const file = new Blob(["Permit Rockstar Reviewed Plan Set"], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = result.fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function handleMoveToPca() {
    setRoutedToPca(true);
    triggerToast("Successfully transferred review package to PCA workflow!");
  }

  function handleMoveToStamp() {
    setRoutedToStamp(true);
    triggerToast("Successfully sent reviewed plans to Digital Stamping queue!");
  }

  return (
    <div className="mx-auto max-w-[960px] animate-fade-up space-y-4">
      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-forest/30 bg-primary-dark px-5 py-3.5 text-white shadow-2xl animate-scale-in">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-forest text-white">
            <Check size={16} strokeWidth={3} />
          </div>
          <p className="text-[13px] font-medium text-white">{toastMessage}</p>
        </div>
      )}

      <Card padded={false} className="overflow-hidden shadow-[0_20px_45px_rgba(23,19,15,0.07)]">
        <div className="grid lg:grid-cols-[.92fr_1.08fr]">
          {/* Left Dark Column */}
          <div className="flex flex-col justify-between bg-primary-dark px-4 py-6 text-white">
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest/20 text-forest shadow-inner">
                <CheckCircle2 size={34} strokeWidth={2} className="text-forest" />
              </div>
              <p className="mt-7 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-secondary">
                REVIEW COMPLETE
              </p>
              <h2 className="mt-2 text-[24px] font-bold tracking-[-0.02em] sm:text-[28px]">
                Reviewed plans ready to share.
              </h2>
              <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-white/70">
                Your source set and all review annotations have been packaged into a single, traceable PDF with automated compliance metadata.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-2 border-t border-white/12 pt-5 text-[12.5px] text-white/75">
              <ShieldCheck size={16} className="text-secondary" /> Review package generated successfully
            </div>
          </div>

          {/* Right Light Column */}
          <div className="px-6 py-7 sm:px-9 sm:py-9 flex flex-col justify-between">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-soft">
                EXPORT PACKAGE
              </p>

              {/* Package Details Box */}
              <div className="mt-3 flex items-center gap-3.5 rounded-2xl border border-paper-line bg-paper px-4.5 py-4 transition-all hover:border-primary/20">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary shadow-xs">
                  <FileCheck2 size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-ink">{result.fileName}</p>
                  <p className="mt-0.5 text-[12px] text-slate-soft">
                    {result.fileSizeLabel} <span aria-hidden="true">&middot;</span> Generated{" "}
                    {new Date(result.generatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Statistics Row */}
              <div className="my-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-paper-line bg-white px-4 py-3.5 shadow-xs">
                  <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-slate-soft">
                    DOCUMENTS
                  </p>
                  <p className="mt-1 text-[22px] font-bold text-ink">{result.documentCount}</p>
                </div>
                <div className="rounded-xl border border-paper-line bg-white px-4 py-3.5 shadow-xs">
                  <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-slate-soft">
                    STATUS
                  </p>
                  <p className="mt-1 text-[13.5px] font-bold text-forest flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-forest animate-pulse" /> Ready to route
                  </p>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={handleDownload}
                  className="shadow-sm transition-transform active:scale-[0.98]"
                >
                  {downloaded ? <Check size={16} /> : <Download size={16} />}
                  {downloaded ? "Downloaded PDF" : "Download PDF"}
                </Button>
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleMoveToPca}
                  className="shadow-sm transition-transform active:scale-[0.98]"
                >
                  {routedToPca ? "Moved to PCA" : "Move to PCA"} <ArrowRight size={16} />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleMoveToStamp}
                  className="shadow-sm transition-transform active:scale-[0.98]"
                >
                  <Stamp size={16} />
                  {routedToStamp ? "Stamped Queue" : "Move to stamp"}
                </Button>
              </div>
            </div>

            {/* Start Over Action */}
            <div className="mt-8 border-t border-paper-line/80 pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={onStartOver}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate transition-colors hover:text-primary"
              >
                <RotateCcw size={15} /> Review another plan
              </button>
              <span className="font-mono text-[11px] text-slate-soft flex items-center gap-1">
                Ref: PR-2026-X9 <ExternalLink size={12} />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}