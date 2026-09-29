"use client";

import { useCallback, useRef, useState } from "react";
import {
  FileText,
  UploadCloud,
  X,
  Plus,
  Layers,
  CheckCircle2,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatBytes } from "@/lib/mock-data";
import type { PcaSheetFile } from "@/lib/types";

interface PcaUploadStepProps {
  files: PcaSheetFile[];
  onFilesAdded: (newFiles: File[]) => void;
  onRemoveFile: (id: string) => void;
  onProceed: () => void;
}

export function PcaUploadStep({
  files,
  onFilesAdded,
  onRemoveFile,
  onProceed,
}: PcaUploadStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const dropped = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
      );
      if (dropped.length) onFilesAdded(dropped);
    },
    [onFilesAdded]
  );

  const hasFiles = files.length > 0;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Upload Card */}
      <Card padded={false} className="overflow-hidden shadow-[0_10px_30px_rgba(23,19,15,0.04)]">
        {/* Section Header */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-3">
          <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-slate uppercase">
            Drop Files Here
          </span>
          <div className="h-px flex-1 bg-paper-line" />
        </div>

        {/* Dashed Dropzone */}
        <div className="p-4 sm:p-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={clsx(
              "rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200",
              dragActive
                ? "border-primary bg-primary-soft/40 shadow-inner"
                : "border-paper-line bg-paper/50 hover:bg-paper/80"
            )}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-4 shadow-sm">
              <UploadCloud size={28} strokeWidth={1.8} />
            </div>

            <h3 className="text-[17px] font-semibold text-ink sm:text-[19px]">
              Drag and drop PDF files
            </h3>
            <p className="mt-1 text-[13px] text-slate">
              Upload plan drawings, cover sheets, or permit packages
            </p>

            <div className="mt-5 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => inputRef.current?.click()}
                className="bg-white hover:bg-paper border-paper-line text-ink font-medium shadow-xs"
              >
                Browse Files
              </Button>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  onFilesAdded(Array.from(e.target.files));
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>

        {/* Selected Files List */}
        {hasFiles && (
          <div className="border-t border-paper-line bg-paper/30 px-6 py-4">
            <div className="flex items-center justify-between pb-3">
              <p className="text-[12px] font-bold uppercase tracking-wider text-slate">
                Selected Plan Sets ({files.length})
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
              >
                <Plus size={14} /> Add more files
              </button>
            </div>

            <div className="space-y-2.5">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-xl border border-paper-line bg-paper-raised p-3 text-[13px] shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{file.name}</p>
                      <div className="flex items-center gap-2 text-[11.5px] text-slate">
                        <span>{formatBytes(file.sizeBytes)}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 font-medium text-forest">
                          <Layers size={12} /> {file.sheets.length} sheets detected
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveFile(file.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-soft transition-colors hover:bg-alert-soft/60 hover:text-alert"
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Primary Action Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={!hasFiles}
          onClick={onProceed}
          className="w-full max-w-xl py-3.5 text-[15px] font-semibold shadow-md transition-all duration-200"
        >
          Extract Sheet Numbers and Generate PCA
        </Button>
      </div>
    </div>
  );
}
