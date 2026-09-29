"use client";

import { useState } from "react";
import {
  Eye,
  RotateCcw,
  GripVertical,
  Pencil,
  Trash2,
  Plus,
  Landmark,
  FileText,
  PenTool,
  Edit3,
  CheckCircle2,
  X,
  Check,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PdfPreviewModal } from "./PdfPreviewModal";
import type {
  PcaSheetFile,
  PcaTemplateType,
  PcaSignatureType,
  SheetViewMode,
} from "@/lib/types";

interface PcaReviewStepProps {
  files: PcaSheetFile[];
  template: PcaTemplateType;
  onChangeTemplate: (template: PcaTemplateType) => void;
  signatureOption: PcaSignatureType;
  onChangeSignatureOption: (option: PcaSignatureType) => void;
  viewMode: SheetViewMode;
  onChangeViewMode: (mode: SheetViewMode) => void;
  onUpdateFiles: (files: PcaSheetFile[]) => void;
  onBack: () => void;
  onProceed: () => void;
  onRestart: () => void;
}

export function PcaReviewStep({
  files,
  template,
  onChangeTemplate,
  signatureOption,
  onChangeSignatureOption,
  viewMode,
  onChangeViewMode,
  onUpdateFiles,
  onBack,
  onProceed,
  onRestart,
}: PcaReviewStepProps) {
  const [editingFileNameId, setEditingFileNameId] = useState<string | null>(null);
  const [tempFileName, setTempFileName] = useState("");
  const [editingSheet, setEditingSheet] = useState<{
    fileId: string;
    sheetIndex: number;
    value: string;
  } | null>(null);
  const [previewPdfOpen, setPreviewPdfOpen] = useState(false);

  const totalSheets = files.reduce((acc, f) => acc + f.sheets.length, 0);

  // Filename rename
  function startRenameFile(file: PcaSheetFile) {
    setEditingFileNameId(file.id);
    setTempFileName(file.name);
  }

  function saveRenameFile(fileId: string) {
    if (!tempFileName.trim()) {
      setEditingFileNameId(null);
      return;
    }
    const updated = files.map((f) =>
      f.id === fileId ? { ...f, name: tempFileName.trim() } : f
    );
    onUpdateFiles(updated);
    setEditingFileNameId(null);
  }

  // Delete entire file
  function handleRemoveFile(fileId: string) {
    const updated = files.filter((f) => f.id !== fileId);
    onUpdateFiles(updated);
  }

  // Add sheet to file
  function handleAddSheet(fileId: string) {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    let nextNumber = "1";
    if (file.sheets.length > 0) {
      const lastSheet = file.sheets[file.sheets.length - 1];
      const parsed = parseInt(lastSheet, 10);
      nextNumber = isNaN(parsed) ? `${file.sheets.length + 1}` : `${parsed + 1}`;
    }

    const updated = files.map((f) =>
      f.id === fileId ? { ...f, sheets: [...f.sheets, nextNumber] } : f
    );
    onUpdateFiles(updated);
  }

  // Delete sheet from file
  function handleDeleteSheet(fileId: string, sheetIndex: number) {
    const updated = files.map((f) => {
      if (f.id !== fileId) return f;
      const newSheets = f.sheets.filter((_, idx) => idx !== sheetIndex);
      return { ...f, sheets: newSheets };
    });
    onUpdateFiles(updated);
  }

  // Save edited sheet value
  function handleSaveSheetValue() {
    if (!editingSheet) return;
    const { fileId, sheetIndex, value } = editingSheet;
    const trimmed = value.trim() || `${sheetIndex + 1}`;

    const updated = files.map((f) => {
      if (f.id !== fileId) return f;
      const newSheets = [...f.sheets];
      newSheets[sheetIndex] = trimmed;
      return { ...f, sheets: newSheets };
    });
    onUpdateFiles(updated);
    setEditingSheet(null);
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
            Step 03 - Review
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-[20px] sm:text-[24px] font-bold tracking-tight text-ink">
              Review Sheet Numbers
            </h2>
            <span className="text-[14px] font-medium text-slate">
              Total Sheets: <strong className="text-ink">{totalSheets}</strong>
            </span>
          </div>
          <p className="text-[13px] text-slate mt-0.5">
            Use the edit icon for filenames, or click any sheet number to edit it directly.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewPdfOpen(true)}
            className="bg-white gap-1.5 shadow-xs text-ink"
          >
            <Eye size={15} className="text-primary" /> Preview PDFs
          </Button>
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
      </div>

      {/* Sheet Management Card */}
      <Card padded={false} className="overflow-hidden shadow-[0_8px_24px_rgba(23,19,15,0.04)]">
        <div className="divide-y divide-paper-line">
          {files.map((file) => (
            <div key={file.id} className="p-4 sm:p-5 space-y-4">
              {/* File header row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <GripVertical size={16} className="text-slate-soft shrink-0 cursor-grab" />

                  {editingFileNameId === file.id ? (
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                      <input
                        type="text"
                        value={tempFileName}
                        onChange={(e) => setTempFileName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRenameFile(file.id);
                          if (e.key === "Escape") setEditingFileNameId(null);
                        }}
                        autoFocus
                        className="rounded-lg border border-primary bg-white px-2.5 py-1 text-[13px] font-semibold text-ink focus:outline-none w-full"
                      />
                      <button
                        type="button"
                        onClick={() => saveRenameFile(file.id)}
                        className="rounded bg-primary px-2 py-1 text-[12px] font-bold text-white hover:bg-primary-dark"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingFileNameId(null)}
                        className="rounded bg-paper px-2 py-1 text-[12px] font-bold text-slate hover:bg-paper-line"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[13.5px] font-bold text-ink truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => startRenameFile(file)}
                        className="text-slate-soft hover:text-ink p-1 rounded transition-colors"
                        title="Edit filename"
                      >
                        <Pencil size={13} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="rounded-md bg-paper border border-paper-line px-2.5 py-0.5 text-[12px] font-medium text-slate">
                    {file.sheets.length} sheets
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.id)}
                    className="text-slate-soft hover:text-alert p-1 rounded transition-colors"
                    title="Delete file"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Sheet pills row & View mode toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  {file.sheets.map((sheet, idx) => {
                    const isEditing =
                      editingSheet?.fileId === file.id &&
                      editingSheet?.sheetIndex === idx;

                    return isEditing ? (
                      <div
                        key={idx}
                        className="flex items-center rounded-lg border-2 border-primary bg-white px-1.5 py-0.5 shadow-sm"
                      >
                        <input
                          type="text"
                          value={editingSheet.value}
                          onChange={(e) =>
                            setEditingSheet({ ...editingSheet, value: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveSheetValue();
                            if (e.key === "Escape") setEditingSheet(null);
                          }}
                          onBlur={handleSaveSheetValue}
                          autoFocus
                          className="w-12 text-center text-[12.5px] font-bold text-ink focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div
                        key={idx}
                        className="group relative flex items-center rounded-lg border border-primary/30 bg-primary-soft/50 px-3.5 py-1 text-[13px] font-bold text-primary hover:border-primary hover:bg-primary-soft transition-all cursor-pointer shadow-xs"
                        onClick={() =>
                          setEditingSheet({
                            fileId: file.id,
                            sheetIndex: idx,
                            value: sheet,
                          })
                        }
                        title="Click to edit sheet number"
                      >
                        <span>{sheet}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSheet(file.id, idx);
                          }}
                          className="ml-1.5 opacity-0 group-hover:opacity-100 text-primary/70 hover:text-alert transition-opacity"
                          title="Remove sheet"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => handleAddSheet(file.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-dashed border-primary/60 bg-transparent px-3 py-1 text-[12.5px] font-semibold text-primary hover:bg-primary-soft/40 transition-colors"
                  >
                    <Plus size={13} /> Add Sheet
                  </button>
                </div>

                {/* View toggle (Individual vs Condense) */}
                <div className="flex items-center rounded-lg border border-paper-line bg-paper p-0.5 self-start sm:self-auto shadow-2xs">
                  <button
                    type="button"
                    onClick={() => onChangeViewMode("individual")}
                    className={clsx(
                      "px-3 py-1 text-[11.5px] font-bold rounded-md transition-all duration-150",
                      viewMode === "individual"
                        ? "bg-primary text-white shadow-xs"
                        : "text-slate hover:text-ink"
                    )}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeViewMode("condense")}
                    className={clsx(
                      "px-3 py-1 text-[11.5px] font-bold rounded-md transition-all duration-150",
                      viewMode === "condense"
                        ? "bg-primary text-white shadow-xs"
                        : "text-slate hover:text-ink"
                    )}
                  >
                    Condense
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* PCA TEMPLATE Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
            PCA Template
          </span>
          <div className="h-px flex-1 bg-paper-line" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Jacksonville */}
          <div
            onClick={() => onChangeTemplate("jacksonville")}
            className={clsx(
              "relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 shadow-xs",
              template === "jacksonville"
                ? "border-primary bg-paper-raised ring-2 ring-primary/20 shadow-md"
                : "border-paper-line bg-paper-raised/70 hover:border-slate-soft/50 hover:bg-paper-raised"
            )}
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] font-bold tracking-widest text-primary uppercase">
                DEFAULT
              </span>
              {template === "jacksonville" && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft/60 text-primary">
                <Landmark size={20} />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-ink">City of Jacksonville</h4>
                <p className="text-[12.5px] text-slate mt-0.5">
                  2-page • COJ Cover + PCA Affidavit
                </p>
              </div>
            </div>
          </div>

          {/* Standard PCA */}
          <div
            onClick={() => onChangeTemplate("standard")}
            className={clsx(
              "relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 shadow-xs",
              template === "standard"
                ? "border-primary bg-paper-raised ring-2 ring-primary/20 shadow-md"
                : "border-paper-line bg-paper-raised/70 hover:border-slate-soft/50 hover:bg-paper-raised"
            )}
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] font-bold tracking-widest text-slate uppercase">
                OTHER CITIES
              </span>
              {template === "standard" && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper-line/50 text-slate">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-ink">Standard PCA</h4>
                <p className="text-[12.5px] text-slate mt-0.5">
                  1-page • PCA Affidavit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIGNATURE OPTIONS Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
            Signature Options
          </span>
          <div className="h-px flex-1 bg-paper-line" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Embedded Signatures */}
          <div
            onClick={() => onChangeSignatureOption("embedded")}
            className={clsx(
              "relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 shadow-xs",
              signatureOption === "embedded"
                ? "border-primary bg-paper-raised ring-2 ring-primary/20 shadow-md"
                : "border-paper-line bg-paper-raised/70 hover:border-slate-soft/50 hover:bg-paper-raised"
            )}
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] font-bold tracking-widest text-primary uppercase">
                WITH SIGNATURES
              </span>
              {signatureOption === "embedded" && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft/60 text-primary">
                <PenTool size={20} />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-ink">Embedded Signatures</h4>
                <p className="text-[12.5px] text-slate mt-0.5">
                  Template with signatures already embedded
                </p>
              </div>
            </div>
          </div>

          {/* Manual Signature */}
          <div
            onClick={() => onChangeSignatureOption("manual")}
            className={clsx(
              "relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 shadow-xs",
              signatureOption === "manual"
                ? "border-primary bg-paper-raised ring-2 ring-primary/20 shadow-md"
                : "border-paper-line bg-paper-raised/70 hover:border-slate-soft/50 hover:bg-paper-raised"
            )}
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] font-bold tracking-widest text-slate uppercase">
                WITHOUT SIGNATURES
              </span>
              {signatureOption === "manual" && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper-line/50 text-slate">
                <Edit3 size={20} />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-ink">Manual Signature</h4>
                <p className="text-[12.5px] text-slate mt-0.5">
                  Template without signatures for manual signing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          className="w-full sm:w-auto bg-white"
        >
          Back to Upload
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onProceed}
          className="w-full sm:w-auto px-8 font-semibold shadow-md"
        >
          Preview PCA Document
        </Button>
      </div>

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={previewPdfOpen}
        onClose={() => setPreviewPdfOpen(false)}
        files={files}
      />
    </div>
  );
}
