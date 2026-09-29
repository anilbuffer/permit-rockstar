"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddInspectionCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCode: (codeItem: { code: string; name: string }) => void;
  cityName?: string;
}

export function AddInspectionCodeModal({
  isOpen,
  onClose,
  onAddCode,
  cityName,
}: AddInspectionCodeModalProps) {
  const [code, setCode] = useState("");
  const [inspectionName, setInspectionName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      setError("Inspection code is required");
      return;
    }

    onAddCode({
      code: code.trim(),
      name: inspectionName.trim() || code.trim(),
    });

    setCode("");
    setInspectionName("");
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-up">
      <div className="relative my-auto w-full max-w-[460px] rounded-3xl bg-[#fbf9f4] border border-paper-line shadow-2xl overflow-hidden flex flex-col">
        {/* Top brand line accent */}
        <div className="h-1.5 w-full bg-primary" />

        {/* Modal Header */}
        <div className="relative bg-white border-b border-paper-line px-7 pt-6 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 flex h-7 w-7 items-center justify-center rounded-lg text-slate-soft hover:bg-paper hover:text-ink transition-colors"
          >
            <X size={20} strokeWidth={2} />
          </button>
          <h2 className="text-[20px] font-bold text-ink leading-tight">
            Add Inspection Code
          </h2>
          <p className="mt-1 text-[13px] text-slate">
            Add a new inspection code and name {cityName ? `for ${cityName}` : "for this city"}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {error && (
            <div className="rounded-xl bg-alert-soft/60 border border-alert/30 px-4 py-2 text-[12.5px] font-semibold text-alert">
              {error}
            </div>
          )}

          {/* CODE * */}
          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1.5">
              Code <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. 101"
              className="w-full rounded-xl border border-paper-line bg-white px-4 py-2.5 text-[14px] text-ink placeholder:text-slate-soft/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors shadow-2xs font-mono font-bold"
            />
          </div>

          {/* INSPECTION NAME */}
          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1.5">
              Inspection Description
            </label>
            <input
              type="text"
              value={inspectionName}
              onChange={(e) => setInspectionName(e.target.value)}
              placeholder="e.g. Footer/Foundation"
              className="w-full rounded-xl border border-paper-line bg-white px-4 py-2.5 text-[14px] text-ink placeholder:text-slate-soft/70 focus:border-primary focus:outline-none transition-colors shadow-2xs"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-paper-line">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-paper-line bg-white hover:bg-paper px-5 py-2.5 text-[13px] font-semibold text-ink transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary hover:bg-primary-dark px-6 py-2.5 text-[13px] font-semibold text-white transition-colors cursor-pointer shadow-sm"
            >
              Add Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
