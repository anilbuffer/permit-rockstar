"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  RotateCcw,
  Save,
  Check,
  FileText,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  savePcaReport,
  formatSheetsList,
  DEFAULT_PCA_PROVIDERS,
  DEFAULT_PCA_NOTARIES,
} from "@/lib/mock-data";
import type {
  PcaSheetFile,
  PcaTemplateType,
  PcaSignatureType,
  SheetViewMode,
  SavedPcaReport,
} from "@/lib/types";

interface PcaExportStepProps {
  template: PcaTemplateType;
  signatureOption: PcaSignatureType;
  selectedProviderId: string;
  selectedNotaryId: string;
  signedDate: string;
  files: PcaSheetFile[];
  viewMode: SheetViewMode;
  onRestart: () => void;
}

export function PcaExportStep({
  template,
  signatureOption,
  selectedProviderId,
  selectedNotaryId,
  signedDate,
  files,
  viewMode,
  onRestart,
}: PcaExportStepProps) {
  const [saved, setSaved] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const provider =
    DEFAULT_PCA_PROVIDERS.find((p) => p.id === selectedProviderId) ||
    DEFAULT_PCA_PROVIDERS[0];
  const notary =
    DEFAULT_PCA_NOTARIES.find((n) => n.id === selectedNotaryId) ||
    DEFAULT_PCA_NOTARIES[0];

  const totalSheets = files.reduce((acc, f) => acc + f.sheets.length, 0);
  const sheetsText = formatSheetsList(files, viewMode);
  const isJacksonville = template === "jacksonville";

  function handleSave() {
    const newReport: SavedPcaReport = {
      id: `pca_${Date.now()}`,
      title: `${isJacksonville ? "City of Jacksonville" : "Standard"} PCA - ${files[0]?.name || "Plan Set"}`,
      template,
      signatureOption,
      providerName: provider.name,
      notaryName: notary.name,
      signedDate: signedDate || "09-29-2026",
      totalSheets,
      sheetsFormatted: sheetsText,
      fileName: `PCA_Affidavit_${files[0]?.name.replace(/\.pdf$/i, "") || "Plan"}.pdf`,
      fileSizeLabel: "1.2 MB",
      createdAt: new Date().toISOString(),
    };

    savePcaReport(newReport);
    setSaved(true);
  }

  function handleDownloadPdf() {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 200);
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
            Step 05 - Export
          </span>
          <h2 className="text-[20px] sm:text-[24px] font-bold tracking-tight text-ink mt-0.5">
            Export Complete
          </h2>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRestart}
          className="bg-white gap-1.5 shadow-xs text-ink"
        >
          <RotateCcw size={14} /> Restart Process
        </Button>
      </div>

      {/* Main Success Card */}
      <Card padded={false} className="overflow-hidden shadow-[0_12px_36px_rgba(23,19,15,0.05)]">
        <div className="p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6">
          {/* Success Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-soft text-forest shadow-sm">
            <CheckCircle2 size={36} strokeWidth={2.2} />
          </div>

          <div className="space-y-2">
            <h3 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-ink">
              PCA Generated!
            </h3>
            <p className="text-[14px] text-slate leading-relaxed">
              {isJacksonville
                ? "The export reflects the two-page A4 preview with blank underlined fill-in fields."
                : "The export reflects the single-page Standard PCA affidavit with blank underlined fill-in fields."}
            </p>
          </div>

          {/* Metadata pill details */}
          <div className="rounded-xl border border-paper-line bg-paper/60 p-4 text-left text-[12.5px] space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-paper-line">
              <span className="text-slate flex items-center gap-1.5">
                <FileText size={14} className="text-primary" /> Template:
              </span>
              <strong className="text-ink font-semibold">
                {isJacksonville ? "City of Jacksonville (2-Page)" : "Standard PCA (1-Page)"}
              </strong>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-paper-line">
              <span className="text-slate flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-forest" /> Signatures:
              </span>
              <strong className="text-ink font-semibold">
                {signatureOption === "embedded" ? "Embedded Signatures" : "Manual Signature"}
              </strong>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-paper-line">
              <span className="text-slate flex items-center gap-1.5">
                <Layers size={14} className="text-primary" /> Plan Sheets:
              </span>
              <strong className="text-ink font-semibold">{totalSheets} Sheets Included</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate flex items-center gap-1.5">
                <Calendar size={14} className="text-slate" /> Date Signed:
              </span>
              <strong className="text-ink font-semibold">{signedDate || "09-29-2026"}</strong>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {/* Download PCA PDF */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleDownloadPdf}
              className="w-full sm:w-auto px-6 py-3 font-semibold shadow-md gap-2"
            >
              <Download size={17} /> Download PCA PDF
            </Button>

            {/* Start New PCA */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onRestart}
              className="w-full sm:w-auto px-6 py-3 bg-white font-medium shadow-xs"
            >
              Start New PCA
            </Button>

            {/* Save PCA */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={saved}
              className="w-full sm:w-auto px-6 py-3 font-semibold shadow-md gap-2"
            >
              {saved ? (
                <>
                  <Check size={17} /> Saved to Reports
                </>
              ) : (
                <>
                  <Save size={17} /> Save PCA
                </>
              )}
            </Button>
          </div>

          {saved && (
            <div className="pt-2 animate-fade-up">
              <Link
                href="/saved-pca"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
              >
                View all saved PCA documents in Saved PCA <ExternalLink size={13} />
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
