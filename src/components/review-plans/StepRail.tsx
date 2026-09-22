"use client";

import { Check } from "lucide-react";
import clsx from "clsx";
import { REVIEW_STEPS } from "@/lib/mock-data";
import type { ReviewStepKey } from "@/lib/types";

export function StepRail({ current }: { current: ReviewStepKey }) {
  const currentIndex = REVIEW_STEPS.findIndex((s) => s.key === current);

  return (
    <ol className="flex w-full items-stretch rounded-2xl border border-paper-line bg-paper-raised px-3 py-3 shadow-[0_6px_18px_rgba(23,19,15,0.035)] sm:px-5">
      {REVIEW_STEPS.map((step, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming";

        return (
          <li key={step.key} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div
                className={clsx(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold transition-colors",
                  state === "done" && "bg-forest text-white",
                  state === "active" && "bg-primary text-white shadow-[0_0_0_4px_rgba(217,237,246,0.8)]",
                  state === "upcoming" && "border border-paper-line bg-transparent text-slate-soft"
                )}
              >
                {state === "done" ? <Check size={16} strokeWidth={3} /> : step.index}
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className={clsx("truncate text-[13.5px] font-semibold leading-tight", state === "upcoming" ? "text-slate-soft" : "text-ink")}>
                  {step.label}
                </p>
                <p className="mt-0.5 max-w-[180px] truncate text-[12px] leading-tight text-slate">
                  {step.description}
                </p>
              </div>
            </div>
            {i < REVIEW_STEPS.length - 1 && (
              <div className={clsx("mx-2 h-px flex-1 transition-colors sm:mx-4", i < currentIndex ? "bg-forest" : "bg-paper-line")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}