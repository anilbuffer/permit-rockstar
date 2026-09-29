"use client";

import { X, FileText, Download, Printer, ShieldCheck, MapPin, Building, User, Calendar, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SavedPcaRecord } from "@/lib/types";

interface ViewPcaRecordModalProps {
  record: SavedPcaRecord | null;
  onClose: () => void;
  onEdit: (record: SavedPcaRecord) => void;
}

export function ViewPcaRecordModal({
  record,
  onClose,
  onEdit,
}: ViewPcaRecordModalProps) {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs animate-fade-up">
      <div className="relative flex w-full max-w-2xl flex-col rounded-2xl border border-paper-line bg-paper-raised shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-paper-line bg-paper px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-ink">
                  PCA Certificate Details
                </h3>
                {record.permitNumber ? (
                  <span className="rounded-md border border-primary/20 bg-primary-soft px-2 py-0.5 font-mono text-[11px] font-bold text-primary">
                    {record.permitNumber}
                  </span>
                ) : (
                  <span className="text-[11px] italic text-slate-soft">No Permit #</span>
                )}
              </div>
              <p className="text-[12px] text-slate">
                Private Provider Inspection Certificate Record
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate transition-colors hover:bg-paper-line/50 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Main Highlights Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-paper-line bg-paper/50 p-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                <MapPin size={13} className="text-primary" /> Project Address
              </p>
              <p className="mt-1 text-[14px] font-semibold text-ink">
                {record.projectAddress || <span className="italic text-slate-soft">No address specified</span>}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                <Building size={13} className="text-primary" /> Jurisdiction / City
              </p>
              <p className="mt-1 text-[14px] font-semibold text-ink">
                {record.city}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                <User size={13} className="text-forest" /> Private Provider
              </p>
              <p className="mt-1 text-[14px] font-semibold text-ink">
                {record.privateProvider || <span className="italic text-slate-soft">N/A</span>}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-primary" /> Contractor
              </p>
              <p className="mt-1 text-[14px] font-semibold text-ink">
                {record.contractor || <span className="italic text-slate-soft">N/A</span>}
              </p>
            </div>
          </div>

          {/* Details Table */}
          <div className="rounded-xl border border-paper-line bg-paper-raised p-4 text-[12.5px] space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-paper-line">
              <span className="text-slate flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-soft" /> Date Saved:
              </span>
              <strong className="text-ink font-semibold">{record.dateSaved}</strong>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-paper-line">
              <span className="text-slate flex items-center gap-1.5">
                <Layers size={14} className="text-primary" /> Sheets Included:
              </span>
              <strong className="text-ink font-semibold">
                {record.sheetsSummary || `${record.totalSheets || 4} verified drawing sheets`}
              </strong>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-paper-line">
              <span className="text-slate flex items-center gap-1.5">
                <FileText size={14} className="text-primary" /> Template Format:
              </span>
              <strong className="text-ink font-semibold">
                {record.template === "jacksonville"
                  ? "City of Jacksonville (2-Page COJ Cover + Affidavit)"
                  : "Standard PCA (1-Page Affidavit)"}
              </strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-forest" /> Florida Statute:
              </span>
              <span className="font-mono text-[11px] text-ink font-bold">
                § 553.791 F.S. Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-paper-line bg-paper px-6 py-3.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(record);
            }}
            className="bg-white"
          >
            Edit Record
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="bg-white gap-1.5"
            >
              <Printer size={14} /> Print / Export PDF
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
