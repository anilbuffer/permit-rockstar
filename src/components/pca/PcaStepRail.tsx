"use client";

import { Check } from "lucide-react";
import clsx from "clsx";
import { PCA_STEPS } from "@/lib/mock-data";
import type { PcaStepKey } from "@/lib/types";

export function PcaStepRail({ current }: { current: PcaStepKey }) {
  const currentIndex = PCA_STEPS.findIndex((s) => s.key === current);

  return (
    <ol className="flex w-full items-stretch rounded-2xl border border-paper-line bg-paper-raised px-3 py-3 shadow-[0_6px_18px_rgba(23,19,15,0.035)] sm:px-5">
      {PCA_STEPS.map((step, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming";

        return (
          <li key={step.key} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div
                className={clsx(
                  "flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl text-[12px] sm:text-[13px] font-bold transition-colors",
                  state === "done" && "bg-forest text-white",
                  state === "active" && "bg-primary text-white shadow-[0_0_0_4px_rgba(217,237,246,0.8)]",
                  state === "upcoming" && "border border-paper-line bg-transparent text-slate-soft"
                )}
              >
                {state === "done" ? <Check size={16} strokeWidth={3} /> : step.index}
              </div>
              <div className="min-w-0 hidden md:block">
                <p
                  className={clsx(
                    "truncate text-[12.5px] lg:text-[13px] font-semibold leading-tight",
                    state === "active" && "text-primary font-bold",
                    state === "done" && "text-ink font-semibold",
                    state === "upcoming" && "text-slate-soft"
                  )}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 max-w-[150px] truncate text-[11px] lg:text-[11.5px] leading-tight text-slate">
                  {step.description}
                </p>
              </div>
            </div>
            {i < PCA_STEPS.length - 1 && (
              <div
                className={clsx(
                  "mx-1.5 sm:mx-3 h-px flex-1 transition-colors",
                  i < currentIndex ? "bg-forest" : "bg-paper-line"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
