"use client";

import { useState } from "react";
import {
  RotateCcw,
  Copy,
  Check,
  FileCheck2,
  ChevronDown,
  Calendar,
  UserCheck,
  Stamp as StampIcon,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PcaDocumentPreview } from "./PcaDocumentPreview";
import {
  DEFAULT_PCA_PROVIDERS,
  DEFAULT_PCA_NOTARIES,
  formatSheetsList,
} from "@/lib/mock-data";
import type {
  PcaProvider,
  PcaNotary,
  PcaSheetFile,
  PcaTemplateType,
  PcaSignatureType,
  SheetViewMode,
} from "@/lib/types";

interface PcaPreviewStepProps {
  template: PcaTemplateType;
  signatureOption: PcaSignatureType;
  selectedProviderId: string;
  onChangeProviderId: (id: string) => void;
  selectedNotaryId: string;
  onChangeNotaryId: (id: string) => void;
  signedDate: string;
  onChangeSignedDate: (date: string) => void;
  files: PcaSheetFile[];
  viewMode: SheetViewMode;
  onEditSheets: () => void;
  onGeneratePdf: () => void;
  onRestart: () => void;
}

export function PcaPreviewStep({
  template,
  signatureOption,
  selectedProviderId,
  onChangeProviderId,
  selectedNotaryId,
  onChangeNotaryId,
  signedDate,
  onChangeSignedDate,
  files,
  viewMode,
  onEditSheets,
  onGeneratePdf,
  onRestart,
}: PcaPreviewStepProps) {
  const [copied, setCopied] = useState(false);

  const currentProvider =
    DEFAULT_PCA_PROVIDERS.find((p) => p.id === selectedProviderId) ||
    DEFAULT_PCA_PROVIDERS[0];

  const currentNotary =
    DEFAULT_PCA_NOTARIES.find((n) => n.id === selectedNotaryId) ||
    DEFAULT_PCA_NOTARIES[0];

  function handleCopySheetList() {
    const text = formatSheetsList(files, viewMode);
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Header Row */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
            Step 04 - Preview
          </span>
          <h2 className="text-[20px] sm:text-[24px] font-bold tracking-tight text-ink mt-0.5">
            PCA Document Preview
          </h2>
          <p className="text-[13px] text-slate mt-0.5">
            Both pages are formatted as official A4 compliance documents, with all underlined filler fields ready.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRestart}
          className="bg-white gap-1.5 shadow-xs text-ink shrink-0"
        >
          <RotateCcw size={14} /> Restart Process
        </Button>
      </div>

      {/* Top Controls Row */}
      <Card padded={false} className="p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Provider Dropdown */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-primary">
              Select Private Provider:
            </label>
            <div className="relative">
              <select
                value={selectedProviderId}
                onChange={(e) => onChangeProviderId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-semibold text-ink shadow-2xs focus:border-primary focus:bg-white focus:outline-none transition-colors pr-8 cursor-pointer"
              >
                {DEFAULT_PCA_PROVIDERS.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} ({provider.companyName})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-2.5 top-2.5 text-slate-soft"
              />
            </div>
          </div>

          {/* Notary Dropdown */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-primary">
              Select Notary:
            </label>
            <div className="relative">
              <select
                value={selectedNotaryId}
                onChange={(e) => onChangeNotaryId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-semibold text-ink shadow-2xs focus:border-primary focus:bg-white focus:outline-none transition-colors pr-8 cursor-pointer"
              >
                {DEFAULT_PCA_NOTARIES.map((notary) => (
                  <option key={notary.id} value={notary.id}>
                    {notary.name} (Comm. #{notary.commissionNumber})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-2.5 top-2.5 text-slate-soft"
              />
            </div>
          </div>

          {/* Date Signed */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-primary">
              Date Signed:
            </label>
            <div className="relative">
              <input
                type="text"
                value={signedDate}
                onChange={(e) => onChangeSignedDate(e.target.value)}
                placeholder="DD-MM-YYYY"
                className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-semibold text-ink shadow-2xs focus:border-primary focus:bg-white focus:outline-none transition-colors pr-8"
              />
              <Calendar
                size={16}
                className="pointer-events-none absolute right-2.5 top-2.5 text-slate-soft"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Document Preview Display Container */}
      <div className="rounded-2xl border border-paper-line bg-paper/70 p-4 sm:p-8 shadow-inner overflow-x-auto">
        <PcaDocumentPreview
          template={template}
          signatureOption={signatureOption}
          provider={currentProvider}
          notary={currentNotary}
          signedDate={signedDate}
          files={files}
          viewMode={viewMode}
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onEditSheets}
            className="flex-1 sm:flex-none bg-white"
          >
            Edit Sheets
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleCopySheetList}
            className={clsx(
              "flex-1 sm:flex-none bg-white gap-1.5 transition-colors",
              copied && "text-forest border-forest bg-forest-soft/30"
            )}
          >
            {copied ? (
              <>
                <Check size={15} className="text-forest" /> Copied Sheet List!
              </>
            ) : (
              <>
                <Copy size={15} /> Copy Sheet List
              </>
            )}
          </Button>
        </div>

        <Button
          type="button"
          variant="forest"
          size="lg"
          onClick={onGeneratePdf}
          className="w-full sm:w-auto px-10 font-bold shadow-md gap-2"
        >
          <FileCheck2 size={18} /> Generate PCA PDF
        </Button>
      </div>
    </div>
  );
}
