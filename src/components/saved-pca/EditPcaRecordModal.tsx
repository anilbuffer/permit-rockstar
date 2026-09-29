"use client";

import { useState, useEffect } from "react";
import { X, Save, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SavedPcaRecord } from "@/lib/types";

interface EditPcaRecordModalProps {
  record: SavedPcaRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRecord: SavedPcaRecord) => void;
}

export function EditPcaRecordModal({
  record,
  isOpen,
  onClose,
  onSave,
}: EditPcaRecordModalProps) {
  const [permitNumber, setPermitNumber] = useState("");
  const [projectAddress, setProjectAddress] = useState("");
  const [city, setCity] = useState("");
  const [privateProvider, setPrivateProvider] = useState("");
  const [contractor, setContractor] = useState("");
  const [dateSaved, setDateSaved] = useState("");

  useEffect(() => {
    if (record) {
      setPermitNumber(record.permitNumber || "");
      setProjectAddress(record.projectAddress || "");
      setCity(record.city || "");
      setPrivateProvider(record.privateProvider || "");
      setContractor(record.contractor || "");
      setDateSaved(record.dateSaved || "");
    }
  }, [record]);

  if (!isOpen || !record) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!record) return;

    const updated: SavedPcaRecord = {
      ...record,
      permitNumber: permitNumber.trim(),
      projectAddress: projectAddress.trim(),
      city: city.trim() || "Jacksonville",
      privateProvider: privateProvider.trim(),
      contractor: contractor.trim(),
      dateSaved: dateSaved.trim() || record.dateSaved,
    };

    onSave(updated);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs animate-fade-up">
      <div className="relative flex w-full max-w-xl flex-col rounded-2xl border border-paper-line bg-paper-raised shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-paper-line bg-paper px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Pencil size={18} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-ink">
                Edit PCA Record
              </h3>
              <p className="text-[11.5px] text-slate">
                Update permit, contractor, and provider metadata
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

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Permit Number */}
            <div className="space-y-1">
              <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate">
                Permit #
              </label>
              <input
                type="text"
                value={permitNumber}
                onChange={(e) => setPermitNumber(e.target.value)}
                placeholder="e.g. cbc-12, B-26-422413.000"
                className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-semibold text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {/* Project Address */}
            <div className="space-y-1">
              <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate">
                Project Address
              </label>
              <input
                type="text"
                value={projectAddress}
                onChange={(e) => setProjectAddress(e.target.value)}
                placeholder="e.g. 2124 Lake Weir Ave"
                className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-semibold text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate">
                City / Jurisdiction
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Jacksonville, Atlantic Beach"
                className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-semibold text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {/* Private Provider */}
            <div className="space-y-1">
              <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate">
                Private Provider
              </label>
              <input
                type="text"
                value={privateProvider}
                onChange={(e) => setPrivateProvider(e.target.value)}
                placeholder="e.g. Ali Marar, Abhishek Dhiman"
                className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-semibold text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {/* Contractor */}
            <div className="space-y-1">
              <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate">
                Contractor Name / Details
              </label>
              <input
                type="text"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                placeholder="e.g. Ketty Meillo, Owner/Builder"
                className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-semibold text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {/* Date Saved */}
            <div className="space-y-1">
              <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate">
                Date Saved
              </label>
              <input
                type="text"
                value={dateSaved}
                onChange={(e) => setDateSaved(e.target.value)}
                placeholder="e.g. Sep 22, 2026"
                className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-semibold text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-paper-line bg-paper px-6 py-3.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="gap-1.5"
            >
              <Save size={14} /> Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
