"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, ShieldCheck, FileSpreadsheet } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface PcaProcessingStepProps {
  onComplete: () => void;
}

export function PcaProcessingStep({ onComplete }: PcaProcessingStepProps) {
  const [progress, setProgress] = useState(12);
  const [statusMessage, setStatusMessage] = useState("Uploading files to the server...");
  const [subStatus, setSubStatus] = useState("12% of file bytes uploaded");

  useEffect(() => {
    const stages = [
      {
        progress: 25,
        msg: "Uploading files to the server...",
        sub: "25% of file bytes uploaded",
        time: 500,
      },
      {
        progress: 48,
        msg: "Parsing drawing sheets & layout metadata...",
        sub: "48% of file bytes uploaded",
        time: 1100,
      },
      {
        progress: 72,
        msg: "Extracting title block sheet numbers...",
        sub: "72% of file bytes uploaded",
        time: 1700,
      },
      {
        progress: 90,
        msg: "Indexing plan set & validating jurisdiction requirements...",
        sub: "90% of file bytes uploaded",
        time: 2300,
      },
      {
        progress: 100,
        msg: "Sheets extracted successfully!",
        sub: "100% of file bytes uploaded",
        time: 2800,
      },
    ];

    const timeouts = stages.map((stage) =>
      setTimeout(() => {
        setProgress(stage.progress);
        setStatusMessage(stage.msg);
        setSubStatus(stage.sub);
      }, stage.time)
    );

    const finishTimeout = setTimeout(() => {
      onComplete();
    }, 3300);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(finishTimeout);
    };
  }, [onComplete]);

  return (
    <div className="space-y-6 animate-fade-up">
      <Card padded={false} className="overflow-hidden shadow-[0_12px_36px_rgba(23,19,15,0.05)]">
        <div className="p-8 sm:p-14 text-center max-w-2xl mx-auto space-y-7">
          {/* Header */}
          <div className="space-y-2">
            <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
              Step 02 - Processing
            </span>
            <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-ink">
              {statusMessage}
            </h2>
            <p className="text-[13.5px] font-medium text-primary">
              {subStatus}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-paper-line h-2.5 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Spinner & Uploading indicator */}
          <div className="pt-2 flex flex-col items-center justify-center gap-2">
            <div className="relative flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-2 border-primary-soft border-t-primary animate-spin" />
            </div>
            <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-primary uppercase mt-1">
              {progress < 100 ? "Uploading..." : "Ready!"}
            </span>
          </div>
        </div>

        {/* Bottom subtle details */}
        <div className="border-t border-paper-line bg-paper/60 px-6 py-3.5 flex items-center justify-between text-[12px] text-slate">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck size={14} className="text-forest" /> Secure SSL transmission
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <FileSpreadsheet size={14} className="text-primary" /> Automated sheet extraction
          </span>
        </div>
      </Card>
    </div>
  );
}
