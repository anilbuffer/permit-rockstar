"use client";

import { Check, Loader2, Sparkles, Clock3, FileSearch } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { PROCESSING_TASKS } from "@/lib/mock-data";

export function ProcessingStep({ activeIndex }: { activeIndex: number }) {
  const completed = Math.min(activeIndex, PROCESSING_TASKS.length - 1);
  const progress = Math.round(((completed + 1) / PROCESSING_TASKS.length) * 100);

  return (
    <div className="grid animate-fade-up gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <Card className="overflow-hidden p-0 shadow-[0_12px_30px_rgba(23,19,15,0.045)]">
        <div className="border-b border-paper-line bg-paper px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-secondary"><Loader2 size={20} className="animate-spin" /></div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">Automated plan review</p>
                <h2 className="mt-1 text-[19px] font-semibold tracking-[-0.02em] text-ink">Processing your plan set</h2>
                <p className="mt-1 text-[13px] text-slate">Keep this tab open while we prepare your review workspace.</p>
              </div>
            </div>
            <span className="hidden rounded-full bg-primary-soft px-2.5 py-1 text-[12px] font-semibold text-primary sm:block">{progress}% complete</span>
          </div>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-paper-line"><div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} /></div>
        </div>

        <ol className="divide-y divide-paper-line px-6 sm:px-8">
          {PROCESSING_TASKS.map((task, i) => {
            const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "upcoming";
            return (
              <li key={task.stage} className="flex items-start gap-4 py-4 first:pt-5 last:pb-5">
                <div className="relative flex flex-col items-center">
                  <div className={clsx("flex h-7 w-7 items-center justify-center rounded-full", state === "done" && "bg-forest text-white", state === "active" && "bg-primary text-white shadow-[0_0_0_4px_rgba(217,237,246,0.8)]", state === "upcoming" && "border border-paper-line bg-paper text-slate-soft")}>
                    {state === "done" && <Check size={14} strokeWidth={3} />}
                    {state === "active" && <Loader2 size={14} className="animate-spin" />}
                    {state === "upcoming" && <span className="text-[11px] font-bold">{i + 1}</span>}
                  </div>
                  {i < PROCESSING_TASKS.length - 1 && <span className={clsx("mt-1 h-6 w-px", i < activeIndex ? "bg-forest" : "bg-paper-line")} />}
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className={clsx("text-[14px] font-semibold", state === "upcoming" ? "text-slate-soft" : "text-ink")}>{task.label}</p>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate">{task.detail}</p>
                </div>
                {state === "active" && <span className="ml-auto mt-1 hidden text-[11px] font-semibold text-primary sm:block">In progress</span>}
              </li>
            );
          })}
        </ol>
      </Card>

      <aside className="rounded-2xl bg-ink p-6 text-white shadow-[0_12px_30px_rgba(23,19,15,0.1)]">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-secondary"><Sparkles size={18} /></div>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">What happens next</p>
        <h3 className="mt-2 text-[18px] font-semibold">Your annotation workspace opens automatically.</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-white/65">The plan set is indexed first so notes stay anchored to the right review context.</p>
        <div className="mt-8 space-y-3 border-t border-white/10 pt-5 text-[12.5px] text-white/75">
          <p className="flex items-center gap-2"><Clock3 size={15} className="text-secondary" /> Usually under one minute</p>
          <p className="flex items-center gap-2"><FileSearch size={15} className="text-secondary" /> Sheet and note cross-checking</p>
        </div>
      </aside>
    </div>
  );
}