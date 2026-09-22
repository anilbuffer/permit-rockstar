"use client";

import { CheckCircle2, Download, ArrowRight, Stamp, RotateCcw, FileCheck2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ExportResult } from "@/lib/types";

export function ExportStep({ result, onStartOver }: { result: ExportResult; onStartOver: () => void }) {
  return (
    <div className="mx-auto max-w-[920px] animate-fade-up">
      <Card padded={false} className="overflow-hidden shadow-[0_16px_36px_rgba(23,19,15,0.055)]">
        <div className="grid lg:grid-cols-[.9fr_1.1fr]">
          <div className="flex flex-col justify-between bg-ink px-7 py-8 text-white sm:px-9 sm:py-10">
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-soft text-forest"><CheckCircle2 size={31} strokeWidth={2} /></div>
              <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.13em] text-secondary">Review complete</p>
              <h2 className="mt-2 text-[26px] font-bold tracking-[-0.03em]">Reviewed plans ready to share.</h2>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/65">Your source set and all review annotations have been packaged into a single, traceable PDF.</p>
            </div>
            <div className="mt-10 flex items-center gap-2 border-t border-white/10 pt-5 text-[12.5px] text-white/70"><ShieldCheck size={16} className="text-secondary" /> Review package generated successfully</div>
          </div>

          <div className="px-6 py-7 sm:px-9 sm:py-9">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-soft">Export package</p>
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-paper-line bg-paper px-4 py-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><FileCheck2 size={20} /></div>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold text-ink">{result.fileName}</p>
                <p className="mt-0.5 text-[12px] text-slate-soft">{result.fileSizeLabel} <span aria-hidden="true">&middot;</span> Generated {new Date(result.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>

            <div className="my-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-paper-line px-4 py-3"><p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-soft">Documents</p><p className="mt-1 text-[20px] font-bold text-ink">{result.documentCount}</p></div>
              <div className="rounded-xl border border-paper-line px-4 py-3"><p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-soft">Status</p><p className="mt-1 text-[14px] font-semibold text-forest">Ready to route</p></div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg"><Download size={16} /> Download PDF</Button>
              <Button variant="success" size="lg">Move to PCA <ArrowRight size={16} /></Button>
              <Button variant="secondary" size="lg"><Stamp size={16} /> Move to stamp</Button>
            </div>
            <button onClick={onStartOver} className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate transition-colors hover:text-ink"><RotateCcw size={14} /> Review another plan</button>
          </div>
        </div>
      </Card>
    </div>
  );
}