"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { PcaSheetFile } from "@/lib/types";

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: PcaSheetFile[];
}

export function PdfPreviewModal({ isOpen, onClose, files }: PdfPreviewModalProps) {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen || files.length === 0) return null;

  const currentFile = files[activeFileIndex] || files[0];
  const totalSheets = currentFile.sheets.length || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-up">
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-paper-line bg-paper-raised shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-paper-line bg-paper px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-ink">{currentFile.name}</h3>
              <p className="text-[11.5px] text-slate">
                Sheet {currentPage} of {totalSheets} (Sheet: {currentFile.sheets[currentPage - 1] || currentPage})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-paper-line bg-white px-2 py-1 text-[12px]">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                className="p-1 text-slate hover:text-ink"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span className="w-10 text-center font-mono text-[11px] font-semibold text-slate">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="p-1 text-slate hover:text-ink"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate transition-colors hover:bg-paper-line/50 hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Canvas Body */}
        <div className="flex-1 overflow-auto bg-[#4a4f54] p-6 flex items-center justify-center blueprint-grid">
          <div
            className="relative bg-white shadow-2xl rounded-sm transition-transform duration-200"
            style={{
              width: `${Math.round(595 * (zoomLevel / 100))}px`,
              minHeight: `${Math.round(842 * (zoomLevel / 100))}px`,
              padding: "40px",
            }}
          >
            {/* Mock Construction Sheet Rendering */}
            <div className="border-4 border-ink p-6 h-full flex flex-col justify-between min-h-[760px]">
              {/* Header Box */}
              <div className="border-b-2 border-ink pb-4 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate">
                    PERMIT COMPLIANCE DRAWING SET
                  </span>
                  <h2 className="text-[18px] font-bold text-ink">
                    COMMERCIAL TENANT IMPROVEMENTS
                  </h2>
                  <p className="text-[11px] text-slate">5218 Cypress Green Dr, Jacksonville, FL 32256</p>
                </div>
                <div className="text-right border-l-2 border-ink pl-4">
                  <p className="text-[9px] font-mono text-slate">SHEET NUMBER</p>
                  <p className="text-[22px] font-black text-primary">
                    {currentFile.sheets[currentPage - 1] || `S-${currentPage}`}
                  </p>
                </div>
              </div>

              {/* Architectural Grid / Mock Drawing content */}
              <div className="flex-1 py-8 flex flex-col items-center justify-center">
                <div className="w-full h-80 border border-dashed border-slate-soft/50 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50/50">
                  <div className="grid grid-cols-3 gap-6 w-full text-center text-[11px] text-slate-soft font-mono">
                    <div className="border border-slate-soft/30 p-4 rounded">
                      <p className="font-bold text-ink">ELEVATION A-1</p>
                      <p className="text-[10px] text-slate mt-1">SCALE: 1/4&quot; = 1&apos;-0&quot;</p>
                    </div>
                    <div className="border border-slate-soft/30 p-4 rounded">
                      <p className="font-bold text-ink">FLOOR PLAN DETAILS</p>
                      <p className="text-[10px] text-slate mt-1">SHEET REF: {currentFile.sheets[currentPage - 1] || currentPage}</p>
                    </div>
                    <div className="border border-slate-soft/30 p-4 rounded">
                      <p className="font-bold text-ink">WALL SECTIONS</p>
                      <p className="text-[10px] text-slate mt-1">CODE: FBC 2024 ED.</p>
                    </div>
                  </div>
                  <p className="mt-8 text-[12px] font-semibold text-slate font-mono">
                    [ Sheet Content Verified • Florida PE #92978 Review Ready ]
                  </p>
                </div>
              </div>

              {/* Title Block Footer */}
              <div className="border-t-2 border-ink pt-3 flex justify-between items-center text-[10px] font-mono">
                <div>
                  <p className="font-bold text-ink">PROJECT: PERMIT ROCKSTAR COMPLIANCE</p>
                  <p className="text-slate">DRAWING DATE: 09/29/2026 • REVISION 2</p>
                </div>
                <div className="text-right">
                  <p className="text-slate">FILE: {currentFile.name}</p>
                  <p className="font-bold text-ink">SHEET {currentPage} OF {totalSheets}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-paper-line bg-paper px-6 py-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="bg-white"
            >
              <ChevronLeft size={16} /> Previous Sheet
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalSheets}
              onClick={() => setCurrentPage((p) => Math.min(totalSheets, p + 1))}
              className="bg-white"
            >
              Next Sheet <ChevronRight size={16} />
            </Button>
          </div>

          <p className="text-[12px] font-medium text-slate">
            Viewing Sheet: <strong className="text-ink font-semibold">{currentFile.sheets[currentPage - 1] || currentPage}</strong>
          </p>

          <Button type="button" variant="primary" size="sm" onClick={onClose}>
            Done Reviewing
          </Button>
        </div>
      </div>
    </div>
  );
}
