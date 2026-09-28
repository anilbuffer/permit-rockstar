"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Move,
  Layers,
  Sliders,
  CheckCircle2,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  ArrowRight,
  FileCheck2,
  Copy,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StampGraphic } from "./StampGraphic";
import type { PageStampSettings, StampConfig } from "@/lib/types";

interface PreviewDocumentStepProps {
  fileName: string;
  totalPages: number;
  stampConfig: StampConfig;
  pageSettings: Record<number, PageStampSettings>;
  onChangePageSettings: (settings: Record<number, PageStampSettings>) => void;
  onBack: () => void;
  onExport: () => void;
}

export function PreviewDocumentStep({
  fileName,
  totalPages = 5,
  stampConfig,
  pageSettings,
  onChangePageSettings,
  onBack,
  onExport,
}: PreviewDocumentStepProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState<"placement" | "layers">("placement");
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  function triggerToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  }

  const currentSetting: PageStampSettings = pageSettings[currentPage] || {
    pageNumber: currentPage,
    visible: true,
    x: 18,
    y: 82,
    scale: 86,
    rotation: 0,
  };

  const updateCurrentPageSetting = useCallback(
    (updates: Partial<PageStampSettings>) => {
      onChangePageSettings({
        ...pageSettings,
        [currentPage]: {
          ...currentSetting,
          ...updates,
        },
      });
    },
    [currentSetting, currentPage, onChangePageSettings, pageSettings]
  );

  function handleTogglePageVisibility(pageNum: number) {
    const existing = pageSettings[pageNum] || {
      pageNumber: pageNum,
      visible: true,
      x: 18,
      y: 82,
      scale: 86,
      rotation: 0,
    };
    onChangePageSettings({
      ...pageSettings,
      [pageNum]: {
        ...existing,
        visible: !existing.visible,
      },
    });
  }

  function handleUpdatePageScale(pageNum: number, delta: number) {
    const existing = pageSettings[pageNum] || {
      pageNumber: pageNum,
      visible: true,
      x: 18,
      y: 82,
      scale: 86,
      rotation: 0,
    };
    const nextScale = Math.min(140, Math.max(50, existing.scale + delta));
    onChangePageSettings({
      ...pageSettings,
      [pageNum]: {
        ...existing,
        scale: nextScale,
      },
    });
  }

  function handleResetPage(pageNum: number) {
    onChangePageSettings({
      ...pageSettings,
      [pageNum]: {
        pageNumber: pageNum,
        visible: true,
        x: 18,
        y: 82,
        scale: 86,
        rotation: 0,
      },
    });
    triggerToast(`Reset Page ${pageNum} stamp position.`);
  }

  function handleApplyToAllPages() {
    const updated: Record<number, PageStampSettings> = {};
    for (let p = 1; p <= totalPages; p++) {
      updated[p] = {
        pageNumber: p,
        visible: true,
        x: currentSetting.x,
        y: currentSetting.y,
        scale: currentSetting.scale,
        rotation: currentSetting.rotation,
      };
    }
    onChangePageSettings(updated);
    triggerToast(`Applied stamp placement to all ${totalPages} pages.`);
  }

  function handleSnapPosition(position: "bottom-left" | "bottom-right" | "top-right" | "center") {
    switch (position) {
      case "bottom-left":
        updateCurrentPageSetting({ x: 18, y: 82 });
        break;
      case "bottom-right":
        updateCurrentPageSetting({ x: 78, y: 82 });
        break;
      case "top-right":
        updateCurrentPageSetting({ x: 78, y: 18 });
        break;
      case "center":
        updateCurrentPageSetting({ x: 50, y: 50 });
        break;
    }
  }

  // Handle Dragging Stamp on Canvas
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const xRaw = ((e.clientX - rect.left) / rect.width) * 100;
    const yRaw = ((e.clientY - rect.top) / rect.height) * 100;
    const xClamped = Math.round(Math.min(92, Math.max(8, xRaw)));
    const yClamped = Math.round(Math.min(92, Math.max(8, yRaw)));
    updateCurrentPageSetting({ x: xClamped, y: yClamped });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const xRaw = ((e.clientX - rect.left) / rect.width) * 100;
    const yRaw = ((e.clientY - rect.top) / rect.height) * 100;
    const xClamped = Math.round(Math.min(92, Math.max(8, xRaw)));
    const yClamped = Math.round(Math.min(92, Math.max(8, yRaw)));
    updateCurrentPageSetting({ x: xClamped, y: yClamped });
  };

  const visibleCount = Object.values(pageSettings).filter((p) => p.visible).length;

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-forest/30 bg-primary-dark px-4 py-3 text-white shadow-2xl animate-scale-in">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-forest text-white">
            <CheckCircle2 size={15} />
          </div>
          <p className="text-[12.5px] font-medium text-white">{toastMessage}</p>
        </div>
      )}

      {/* Top Document Metadata Bar */}
      <Card className="flex flex-col gap-4 border-primary/15 bg-paper-raised p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 shadow-xs">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary shadow-xs">
            <FileCheck2 size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-[14.5px] font-bold text-ink">{fileName}</p>
              <span className="font-mono text-[11px] text-slate-soft">
                &bull; Currently editing
              </span>
            </div>
            <p className="mt-0.5 text-[12px] text-slate">
              Florida Private Provider Review &bull; Sheet {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-soft px-3 py-1 text-[11.5px] font-bold text-forest">
            <CheckCircle2 size={13} /> {visibleCount} of {totalPages} sheets stamped
          </span>
          <span className="rounded-full bg-paper px-3 py-1 text-[11.5px] font-semibold text-slate border border-paper-line">
            {stampConfig.engineerName} ({stampConfig.licenseNumber})
          </span>
        </div>
      </Card>

      {/* Main Positioning Toolbar */}
      <Card
        padded={false}
        className="sticky top-3 z-20 flex flex-wrap items-center gap-2 px-3 py-2 shadow-[0_10px_25px_rgba(23,19,15,0.06)]"
      >
        {/* Placement Mode Tool Indicator */}
        <div className="flex items-center gap-1.5 bg-paper/80 px-2.5 py-1.5 rounded-xl border border-paper-line text-[12px] font-semibold text-ink">
          <Move size={15} className="text-primary" />
          <span>Position Stamp:</span>
          <span className="font-mono text-[11px] text-slate-soft">Drag or click sheet</span>
        </div>

        {/* Quick Position Snap Buttons */}
        <div className="hidden sm:flex items-center gap-1 bg-paper/60 p-1 rounded-xl border border-paper-line">
          <button
            type="button"
            title="Snap Bottom Left"
            onClick={() => handleSnapPosition("bottom-left")}
            className="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate hover:bg-white hover:text-ink transition-colors"
          >
            Bottom-Left
          </button>
          <button
            type="button"
            title="Snap Bottom Right"
            onClick={() => handleSnapPosition("bottom-right")}
            className="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate hover:bg-white hover:text-ink transition-colors"
          >
            Bottom-Right
          </button>
          <button
            type="button"
            title="Snap Center"
            onClick={() => handleSnapPosition("center")}
            className="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate hover:bg-white hover:text-ink transition-colors"
          >
            Center
          </button>
        </div>

        <div className="h-6 w-px bg-paper-line mx-1 hidden sm:block" />

        {/* Rotation Control */}
        <div className="flex items-center gap-1 bg-paper/60 p-1 rounded-xl border border-paper-line">
          <button
            type="button"
            title="Rotate 90° Clockwise"
            onClick={() =>
              updateCurrentPageSetting({
                rotation: (currentSetting.rotation + 90) % 360,
              })
            }
            className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-muted hover:bg-black/[0.05]"
          >
            <RotateCw size={15} />
          </button>
          <span className="font-mono text-[11px] font-bold text-slate px-1">
            {currentSetting.rotation}&deg;
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 ml-auto bg-paper/70 px-2 py-1 rounded-xl border border-paper-line">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-muted hover:bg-black/[0.05]"
          >
            <ZoomOut size={15} />
          </button>
          <span className="font-mono text-[12px] font-bold text-ink w-11 text-center tabular-nums">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-muted hover:bg-black/[0.05]"
          >
            <ZoomIn size={15} />
          </button>

          <Button variant="outline" size="sm" className="ml-2" onClick={onBack}>
            Back
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={onExport}
            className="ml-1 shadow-xs"
          >
            Save All &amp; Continue ({visibleCount})
          </Button>
        </div>
      </Card>

      {/* File Document Tab Bar & Page Switcher */}
      <div className="flex items-center justify-between border-b border-paper-line bg-paper/40 px-2 pt-1">
        <div className="flex items-center gap-2">
          <div className="border-b-2 border-primary bg-paper-raised px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-wider text-primary shadow-2xs">
            {fileName}
          </div>
        </div>

        {/* Page Switcher */}
        <div className="flex items-center gap-2 mb-1.5 pr-2">
          <div className="flex items-center gap-2.5 rounded-lg border border-paper-line bg-white px-3 py-1 font-mono text-[12px] font-semibold text-ink shadow-2xs">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="disabled:opacity-30 hover:text-primary transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="disabled:opacity-30 hover:text-primary transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas & Sidebar Main Grid */}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Drawing Document Canvas Area */}
        <Card
          padded={false}
          className="min-h-[720px] overflow-auto p-2 shadow-[0_10px_24px_rgba(23,19,15,0.035)] sm:p-4"
        >
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ width: `${zoom}%`, maxWidth: "840px" }}
            className="relative mx-auto min-h-[660px] rounded-md border border-paper-line bg-white px-8 py-10 shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-[width] sm:px-12 select-none"
          >
            {/* Sheet Badge */}
            <span className="absolute top-4 left-4 font-mono text-[10.5px] font-bold tracking-[0.08em] uppercase bg-primary-dark text-white px-2.5 py-1 rounded">
              Sheet {currentPage} of {totalPages}
            </span>

            <span className="absolute top-4 right-4 font-mono text-[10.5px] text-slate-soft">
              Coordinates: x:{currentSetting.x}%, y:{currentSetting.y}% &bull; Scale: {currentSetting.scale}%
            </span>

            {/* Document Content Mockup (Realistic construction / plan review sheet) */}
            <div className="mt-8 space-y-6 opacity-90 pointer-events-none">
              <div className="border-b border-paper-line pb-3">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-soft">
                  STATE OF MICHIGAN &bull; DEPARTMENT OF LICENSING &amp; REGULATORY AFFAIRS
                </p>
                <h1 className="text-[20px] font-bold text-ink mt-1">
                  Licensure Term &bull; Assisted Living Facility Review
                </h1>
              </div>

              <div className="space-y-4 text-[13px] leading-relaxed text-ink-muted">
                <div>
                  <h3 className="font-semibold text-ink text-[14px]">Definition:</h3>
                  <p className="mt-1">
                    HFA: A supervised personal care facility, other than a hotel, adult foster care facility,
                    hospital, nursing home, or county medical care facility, that provides room, board,
                    and supervised personal care to 21 or more unrelated, non-transient individuals who are
                    55 years of age or older. Home for the aged includes a supervised personal care facility
                    for 20 or fewer individuals 55 years of age or older if operated in conjunction with
                    a licensed nursing home.
                  </p>
                </div>

                <div>
                  <p>
                    AFC: Residential settings that provide personal care, supervision, and protection,
                    in addition to room and board for 3 to 20 unrelated persons who are aged, mentally
                    ill, developmentally disabled, or physically disabled for 24 hours a day, 5 or more
                    days a week, and for two or more consecutive weeks for compensation.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-ink text-[14px]">
                    Regulatory and Legislative Update:
                  </h3>
                  <p className="mt-1">
                    Rules changes are currently pending for HFA and AFC - New rules likely in effect
                    early 2026 under administrative provisions. Pending legislative statutory review.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-ink text-[14px]">
                    Move-in Requirements Including Required Disclosures / Notifications:
                  </h3>
                  <p className="mt-1">
                    A home must provide a resident and his or her authorized representative with a written
                    notice stating the reasons and specific terms of discharge 30 days before discharge.
                    A home may discharge a resident before the 30-day notice if determined and documented
                    by certified medical personnel.
                  </p>
                </div>
              </div>

              {/* Sheet Title Block Simulation at bottom */}
              <div className="pt-12 text-center text-[10.5px] font-mono text-slate-soft border-t border-paper-line">
                Copyright 2026 Permit Rockstar Private Provider Systems &bull; Architectural &amp; Code Review Division
              </div>
            </div>

            {/* Stamp on Canvas (Draggable) */}
            {currentSetting.visible ? (
              <div
                style={{
                  left: `${currentSetting.x}%`,
                  top: `${currentSetting.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onPointerDown={handlePointerDown}
                className={clsx(
                  "absolute z-30 transition-shadow",
                  isDragging && "opacity-90 ring-2 ring-primary ring-offset-4 cursor-grabbing"
                )}
              >
                <div className="relative group">
                  <StampGraphic
                    config={stampConfig}
                    scale={currentSetting.scale}
                    rotation={currentSetting.rotation}
                    isPlacementMode={true}
                  />

                  {/* Drag Handle Indicator */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-primary-dark px-2 py-0.5 text-[10px] font-mono font-bold text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    x:{currentSetting.x}% y:{currentSetting.y}% &bull; Drag to move
                  </div>
                </div>
              </div>
            ) : (
              /* Hidden Banner Overlay for Sheet */
              <div className="absolute inset-0 bg-paper/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-20">
                <div className="rounded-2xl border border-paper-line bg-white p-6 text-center shadow-lg max-w-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-paper text-slate-soft mb-3">
                    <EyeOff size={22} />
                  </div>
                  <h4 className="text-[16px] font-semibold text-ink">Stamp Hidden on Sheet {currentPage}</h4>
                  <p className="mt-1.5 text-[12.5px] text-slate">
                    This sheet will not receive a digital seal during export.
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    className="mt-4"
                    onClick={() => handleTogglePageVisibility(currentPage)}
                  >
                    <Eye size={14} /> Show Stamp on this Sheet
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Right Sidebar: Page Controls & Stamp Details */}
        <div className="space-y-4 lg:sticky lg:top-[88px]">
          <Card className="space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-paper-line pb-2">
              <button
                type="button"
                onClick={() => setActiveTab("placement")}
                className={clsx(
                  "flex-1 pb-2 text-[12px] font-bold uppercase tracking-wider text-center border-b-2 -mb-2.5 transition-colors",
                  activeTab === "placement"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-soft hover:text-ink"
                )}
              >
                Stamp Placement
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("layers")}
                className={clsx(
                  "flex-1 pb-2 text-[12px] font-bold uppercase tracking-wider text-center border-b-2 -mb-2.5 transition-colors",
                  activeTab === "layers"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-soft hover:text-ink"
                )}
              >
                Layers &amp; Details
              </button>
            </div>

            {activeTab === "placement" ? (
              <div className="space-y-4 pt-2">
                {/* ALL PAGES Section */}
                <div className="rounded-xl border border-paper-line bg-paper/60 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-soft">
                      ALL PAGES
                    </p>
                    <span className="text-[11px] font-semibold text-primary">
                      {totalPages} Sheets Total
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplyToAllPages}
                      className="w-full text-[12px] bg-white"
                    >
                      <Copy size={13} /> Apply Position to All
                    </Button>
                  </div>
                </div>

                {/* PAGE CONTROLS LIST (Page 1 .. Page 5) */}
                <div className="space-y-2">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-soft">
                    PAGE CONTROLS
                  </p>

                  <ul className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const setting = pageSettings[pageNum] || {
                        pageNumber: pageNum,
                        visible: true,
                        x: 18,
                        y: 82,
                        scale: 86,
                        rotation: 0,
                      };
                      const isSelected = currentPage === pageNum;

                      return (
                        <li
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={clsx(
                            "rounded-xl border p-3 cursor-pointer transition-all",
                            isSelected
                              ? "border-primary bg-primary-soft/50 shadow-xs"
                              : "border-paper-line bg-paper/40 hover:border-primary/40"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-[13px] text-ink">
                              Page {pageNum}
                            </span>

                            {/* Visible / Hidden Toggle */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePageVisibility(pageNum);
                              }}
                              className={clsx(
                                "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold transition-colors",
                                setting.visible
                                  ? "bg-forest-soft text-forest hover:bg-forest/20"
                                  : "bg-paper-line text-slate-soft hover:bg-paper-line/80"
                              )}
                            >
                              {setting.visible ? (
                                <>
                                  <Eye size={11} /> VISIBLE
                                </>
                              ) : (
                                <>
                                  <EyeOff size={11} /> HIDDEN
                                </>
                              )}
                            </button>
                          </div>

                          {/* Controls Row */}
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-paper-line/80 text-[11px]">
                            {/* Scale +/- */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdatePageScale(pageNum, -5);
                                }}
                                className="h-6 w-6 rounded border border-paper-line bg-white flex items-center justify-center font-bold text-slate hover:text-ink"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold text-ink w-9 text-center">
                                {setting.scale}%
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdatePageScale(pageNum, 5);
                                }}
                                className="h-6 w-6 rounded border border-paper-line bg-white flex items-center justify-center font-bold text-slate hover:text-ink"
                              >
                                +
                              </button>
                            </div>

                            {/* Rotation */}
                            <span className="font-mono text-slate-soft">
                              ROT {setting.rotation}&deg;
                            </span>

                            {/* Reset */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResetPage(pageNum);
                              }}
                              className="text-slate-soft hover:text-primary transition-colors text-[11px] font-semibold"
                            >
                              RESET
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Helper Tip Note matching Screenshot 2 */}
                <div className="rounded-xl border border-paper-line bg-paper/50 p-3 text-[11.5px] leading-relaxed text-slate italic">
                  &ldquo;Each page has its own stamp. If you don&apos;t want a stamp on a specific page, click &apos;Hidden&apos;.&rdquo;
                </div>
              </div>
            ) : (
              /* Layers & Details Tab */
              <div className="space-y-4 pt-2">
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-soft mb-2">
                    STAMP LAYERS
                  </p>
                  <div className="space-y-2 text-[12px] font-medium text-ink">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-paper">
                      <span>Outer Approval Border</span>
                      <span className="font-bold text-forest">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-paper">
                      <span>Reviewed For Compliance</span>
                      <span className="font-bold text-forest">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-paper">
                      <span>Florida PE Seal &amp; Logo</span>
                      <span className="font-bold text-forest">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-paper">
                      <span>Engineer Credentials &amp; Date</span>
                      <span className="font-bold text-forest">Active</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-paper-line pt-3">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-soft mb-2">
                    ACTIVE COORDINATES
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-lg border border-paper-line bg-paper p-2 font-mono text-[11.5px]">
                      <span className="text-slate-soft">X Offset: </span>
                      <span className="font-bold text-ink">{currentSetting.x}%</span>
                    </div>
                    <div className="rounded-lg border border-paper-line bg-paper p-2 font-mono text-[11.5px]">
                      <span className="text-slate-soft">Y Offset: </span>
                      <span className="font-bold text-ink">{currentSetting.y}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
