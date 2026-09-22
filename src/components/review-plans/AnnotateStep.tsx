"use client";

import { useState } from "react";
import {
  MousePointer2,
  Type,
  MoveUpRight,
  Square,
  MessageSquare,
  Highlighter,
  Minus,
  Pen,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  X,
  FileText,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  CheckCircle2,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StampBadge } from "@/components/ui/StampBadge";
import type { Annotation, AnnotationSeverity, AnnotationTool, PlanDocument } from "@/lib/types";

const TOOLS: { key: AnnotationTool; icon: typeof MousePointer2; label: string }[] = [
  { key: "select", icon: MousePointer2, label: "Select" },
  { key: "text", icon: Type, label: "Text" },
  { key: "arrow", icon: MoveUpRight, label: "Arrow" },
  { key: "rectangle", icon: Square, label: "Rectangle" },
  { key: "comment", icon: MessageSquare, label: "Comment" },
  { key: "highlight", icon: Highlighter, label: "Highlight" },
  { key: "line", icon: Minus, label: "Line" },
  { key: "pen", icon: Pen, label: "Pen" },
];

const COLOR_PALETTE = [
  "#00557f", // Brand Primary
  "#f5b82e", // Brand Secondary
  "#286e4e", // Forest Green
  "#ae2a1f", // Alert Red
  "#17130f", // Ink Black
  "#5b5850", // Slate
  "#ffffff", // White
  "#d9edf6", // Soft Blue
];

const SEVERITY_TONE = {
  info: "secondary",
  correction: "primary",
  rejection: "alert",
} as const;

const SEVERITY_LABEL = {
  info: "Note",
  correction: "Correction",
  rejection: "Rejection",
} as const;

interface AnnotateStepProps {
  document: PlanDocument;
  onAddAnnotation: (a: Annotation) => void;
  onReset: () => void;
  onExport: () => void;
}

export function AnnotateStep({
  document,
  onAddAnnotation,
  onReset,
  onExport,
}: AnnotateStepProps) {
  const [activeTool, setActiveTool] = useState<AnnotationTool>("select");
  const [selectedColor, setSelectedColor] = useState("#00557f");
  const [selectedSeverity, setSelectedSeverity] = useState<AnnotationSeverity>("correction");
  const [strokeThickness, setStrokeThickness] = useState(3);
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [draftAt, setDraftAt] = useState<{ x: number; y: number } | null>(null);
  const [draftNote, setDraftNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const placeable: AnnotationTool[] = ["comment", "text", "rectangle", "highlight", "pen", "arrow"];

  function handleCanvasClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!placeable.includes(activeTool)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDraftAt({ x, y });
    setDraftNote("");
  }

  function commitDraft() {
    if (!draftAt || !draftNote.trim()) {
      setDraftAt(null);
      return;
    }
    onAddAnnotation({
      id: `anno_${Date.now()}`,
      tool: activeTool,
      page: currentPage,
      x: draftAt.x,
      y: draftAt.y,
      color: selectedColor,
      severity: selectedSeverity,
      note: draftNote.trim(),
      author: "J. Alvarez, Plan Reviewer",
      createdAt: new Date().toISOString(),
    });
    setDraftAt(null);
    setDraftNote("");
  }

  const filteredAnnotations = document.annotations.filter((a) => {
    const matchesSeverity = filterSeverity === "all" || a.severity === filterSeverity;
    const matchesSearch =
      searchQuery === "" || a.note.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Top Document Metadata Bar */}
      <Card className="flex flex-col gap-4 border-primary/15 bg-paper-raised p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 shadow-xs">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary shadow-xs">
            <FileText size={20} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14.5px] font-bold text-ink">{document.fileName}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-slate">
              <MapPin size={13} className="text-primary" /> {document.jurisdiction}{" "}
              <span aria-hidden="true">&middot;</span> {document.permitType}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-forest-soft px-3 py-1 text-[11.5px] font-bold text-forest">
            <CheckCircle2 size={13} /> Review Ready
          </span>
          <span className="rounded-full bg-paper px-3 py-1 text-[11.5px] font-semibold text-slate border border-paper-line">
            {document.pageCount} page{document.pageCount === 1 ? "" : "s"}
          </span>
        </div>
      </Card>

      {/* Main Annotation Toolbar */}
      <Card padded={false} className="sticky top-3 z-20 flex flex-wrap items-center gap-2 px-3 py-2 shadow-[0_10px_25px_rgba(23,19,15,0.06)]">
        {/* Tool Selector Buttons */}
        <div className="flex items-center gap-1 bg-paper/70 p-1 rounded-xl border border-paper-line">
          {TOOLS.map((tool) => (
            <button
              key={tool.key}
              type="button"
              title={tool.label}
              onClick={() => setActiveTool(tool.key)}
              className={clsx(
                "h-9 w-9 rounded-lg flex items-center justify-center transition-all",
                activeTool === tool.key
                  ? "bg-primary text-white shadow-xs scale-[1.04]"
                  : "text-ink-muted hover:bg-black/[0.05]"
              )}
            >
              <tool.icon size={16} strokeWidth={2} />
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-paper-line mx-1 hidden sm:block" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 bg-paper/70 p-1 rounded-xl border border-paper-line">
          <button type="button" title="Undo" className="h-9 w-9 rounded-lg flex items-center justify-center text-ink-muted hover:bg-black/[0.05]">
            <Undo2 size={16} />
          </button>
          <button type="button" title="Redo" className="h-9 w-9 rounded-lg flex items-center justify-center text-ink-muted hover:bg-black/[0.05]">
            <Redo2 size={16} />
          </button>
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

          <Button variant="outline" size="sm" className="ml-2" onClick={onReset}>
            Reset
          </Button>

          <Button size="sm" variant="primary" onClick={onExport} className="ml-1 shadow-xs">
            Save all &amp; export
          </Button>
        </div>
      </Card>

      {/* File Document Tab Bar */}
      <div className="flex items-center justify-between border-b border-paper-line bg-paper/40 px-2 pt-1">
        <div className="flex items-center gap-2">
          <div className="border-b-2 border-primary bg-paper-raised px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-wider text-primary shadow-2xs">
            {document.fileName}
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
              {currentPage} / {document.pageCount}
            </span>
            <button
              type="button"
              disabled={currentPage >= document.pageCount}
              onClick={() => setCurrentPage((p) => Math.min(document.pageCount, p + 1))}
              className="disabled:opacity-30 hover:text-primary transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas & Sidebar Main Grid */}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Drawing Canvas */}
        <Card padded={false} className="min-h-[690px] overflow-auto p-2 shadow-[0_10px_24px_rgba(23,19,15,0.035)] sm:p-4">
          <div
            onClick={handleCanvasClick}
            style={{ width: `${zoom}%`, maxWidth: "810px" }}
            className={clsx(
              "relative mx-auto min-h-[620px] rounded-md border border-paper-line bg-white px-7 py-9 shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-[width] sm:px-10",
              placeable.includes(activeTool) ? "cursor-crosshair" : "cursor-default"
            )}
          >
            <span className="absolute top-4 left-4 font-mono text-[10.5px] font-semibold tracking-[0.08em] uppercase bg-primary-dark text-white px-2 py-1 rounded">
              Page {currentPage}
            </span>

            {/* Document Content Mockup */}
            <div className="mt-10 space-y-5">
              <h2 className="text-[20px] font-bold text-primary">
                MVP Scope Definition (clarifying section)
              </h2>
              <div>
                <h3 className="text-[15px] font-semibold text-ink">
                  MVP Principle
                </h3>
                <p className="text-[13.5px] leading-relaxed text-ink-muted mt-1.5">
                  To eliminate any ambiguity, Autohub has included the
                  following section to assist in your response.
                </p>
              </div>
              <p className="text-[13.5px] leading-relaxed text-ink-muted">
                The MVP must deliver a complete operational workflow from
                customer registration through to delivered order using a
                combination of customer self-service and Autohub-administered
                processes. Where advanced automation, third-party
                integrations, or AI capabilities are not required for launch,
                a manual or semi-manual process is acceptable provided it is
                clearly documented and does not block the core order
                lifecycle.
              </p>
              <p className="text-[13.5px] leading-relaxed text-ink-muted">
                Reviewers should treat this section as authoritative when a
                requirement elsewhere in the plan set appears to conflict
                with the scope described here.
              </p>
            </div>

            {/* Existing annotation pins on canvas */}
            {document.annotations.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveAnnotation(activeAnnotation === a.id ? null : a.id);
                }}
                className={clsx(
                  "absolute -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-md ring-2 ring-white z-10 transition-transform hover:scale-110",
                  activeAnnotation === a.id && "scale-125 ring-primary ring-offset-2"
                )}
                style={{ backgroundColor: a.color, left: `${a.x}%`, top: `${a.y}%` }}
              >
                <MessageSquare size={12} fill="white" />
              </button>
            ))}

            {/* Active Annotation Popover */}
            {document.annotations
              .filter((a) => a.id === activeAnnotation)
              .map((a) => (
                <div
                  key={a.id}
                  style={{ left: `${Math.min(a.x, 62)}%`, top: `${a.y}%` }}
                  className="absolute z-20 w-64 -translate-y-1/2 translate-x-4 bg-primary-dark text-white rounded-xl p-3.5 shadow-xl animate-scale-in"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <StampBadge tone={SEVERITY_TONE[a.severity]}>
                      {SEVERITY_LABEL[a.severity]}
                    </StampBadge>
                    <button
                      type="button"
                      onClick={() => setActiveAnnotation(null)}
                      className="text-white/50 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-white/90">
                    {a.note}
                  </p>
                  <p className="text-[11px] text-white/40 mt-2">{a.author}</p>
                </div>
              ))}

            {/* Draft Annotation Composer Box */}
            {draftAt && (
              <div
                style={{ left: `${Math.min(draftAt.x, 60)}%`, top: `${draftAt.y}%` }}
                onClick={(e) => e.stopPropagation()}
                className="absolute z-20 w-72 -translate-y-1/2 translate-x-4 bg-white border border-paper-line rounded-xl p-3.5 shadow-2xl animate-scale-in"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-soft">
                    New Note Category
                  </span>
                  <div className="flex gap-1">
                    {(["info", "correction", "rejection"] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSelectedSeverity(sev)}
                        className={clsx(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors",
                          selectedSeverity === sev
                            ? "bg-primary text-white"
                            : "bg-paper text-slate hover:bg-paper-line"
                        )}
                      >
                        {sev[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  autoFocus
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  placeholder="Add a review note..."
                  rows={3}
                  className="w-full text-[12.5px] rounded-lg border border-paper-line p-2.5 focus:outline-none focus:border-primary resize-none"
                />

                <div className="flex justify-end gap-2 mt-2.5">
                  <Button variant="ghost" size="sm" onClick={() => setDraftAt(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" variant="primary" onClick={commitDraft}>
                    Add Note
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Right Sidebar — Properties & Filterable Review Log */}
        <div className="space-y-4 lg:sticky lg:top-[88px]">
          {/* Properties Card */}
          <Card className="space-y-4">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-soft">
                PROPERTIES
              </p>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-[11.5px] font-medium text-slate mb-2">Color Palette</p>
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_PALETTE.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color }}
                        className={clsx(
                          "h-7 w-full rounded-md border border-black/10 transition-transform hover:scale-105",
                          selectedColor === color && "ring-2 ring-primary ring-offset-2"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11.5px] font-medium text-slate mb-1">
                    <span>Stroke Thickness</span>
                    <span className="font-mono font-bold">{strokeThickness}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={strokeThickness}
                    onChange={(e) => setStrokeThickness(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <hr className="border-paper-line" />
            <Button variant="outline" size="sm" className="w-full font-mono text-[11.5px] uppercase tracking-wider" onClick={onReset}>
              Clear Annotations
            </Button>
          </Card>

          {/* Filterable Review Log Card */}
          <Card className="space-y-3.5">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-soft">
                REVIEW LOG
              </p>
              <p className="text-[12.5px] text-slate mt-0.5">
                {filteredAnnotations.length} item{filteredAnnotations.length === 1 ? "" : "s"} found
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="space-y-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-slate-soft" />
                <input
                  type="text"
                  placeholder="Filter notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-paper-line bg-paper pl-8 pr-3 py-1.5 text-[12px] focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1 text-[11px]">
                <Filter size={12} className="text-slate-soft" />
                {(["all", "correction", "rejection", "info"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilterSeverity(s)}
                    className={clsx(
                      "px-2 py-0.5 rounded capitalize transition-colors",
                      filterSeverity === s
                        ? "bg-primary text-white font-semibold"
                        : "text-slate hover:bg-paper-line"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <ul className="max-h-[300px] space-y-2.5 overflow-auto pr-1">
              {filteredAnnotations.map((a) => (
                <li
                  key={a.id}
                  onClick={() => setActiveAnnotation(a.id)}
                  className={clsx(
                    "rounded-xl border px-3 py-2.5 cursor-pointer transition-all hover:shadow-xs",
                    activeAnnotation === a.id
                      ? "border-primary bg-primary-soft/60"
                      : "border-paper-line hover:border-primary/40"
                  )}
                >
                  <StampBadge tone={SEVERITY_TONE[a.severity]} className="mb-1.5">
                    {SEVERITY_LABEL[a.severity]}
                  </StampBadge>
                  <p className="text-[12.5px] text-ink leading-snug">{a.note}</p>
                </li>
              ))}
              {filteredAnnotations.length === 0 && (
                <li className="text-[12px] text-slate-soft text-center py-5">
                  No matching review notes found.
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
