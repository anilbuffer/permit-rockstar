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
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StampBadge } from "@/components/ui/StampBadge";
import type { Annotation, AnnotationTool, PlanDocument } from "@/lib/types";

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
  const [zoom, setZoom] = useState(100);
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [draftAt, setDraftAt] = useState<{ x: number; y: number } | null>(null);
  const [draftNote, setDraftNote] = useState("");

  const placeable: AnnotationTool[] = ["comment", "text", "rectangle", "highlight"];

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
      page: document.currentPage,
      x: draftAt.x,
      y: draftAt.y,
      color: "#00557f",
      severity: "info",
      note: draftNote.trim(),
      author: "You",
      createdAt: new Date().toISOString(),
    });
    setDraftAt(null);
    setDraftNote("");
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <Card className="flex flex-col gap-4 border-primary/15 bg-paper-raised p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><FileText size={18} /></div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-ink">{document.fileName}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[12px] text-slate"><MapPin size={12} className="text-primary" /> {document.jurisdiction} <span aria-hidden="true">&middot;</span> {document.permitType}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-forest-soft px-2.5 py-1 text-[11.5px] font-semibold text-forest">Review ready</span>
          <span className="rounded-full bg-paper px-2.5 py-1 text-[11.5px] font-medium text-slate">{document.pageCount} page{document.pageCount === 1 ? "" : "s"}</span>
        </div>
      </Card>

      {/* Toolbar */}
      <Card padded={false} className="sticky top-3 z-20 flex flex-wrap items-center gap-2 px-3 py-2 shadow-[0_8px_20px_rgba(23,19,15,0.055)]">
        <div className="flex items-center gap-1">
          {TOOLS.map((tool) => (
            <button
              key={tool.key}
              title={tool.label}
              onClick={() => setActiveTool(tool.key)}
              className={clsx(
                "h-9 w-9 rounded-lg flex items-center justify-center transition-colors",
                activeTool === tool.key
                  ? "bg-primary text-white"
                  : "text-ink-muted hover:bg-black/[0.05]"
              )}
            >
              <tool.icon size={16} strokeWidth={2} />
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-paper-line mx-1 hidden sm:block" />

        <div className="flex items-center gap-1">
          <button className="h-9 w-9 rounded-lg flex items-center justify-center text-ink-muted hover:bg-black/[0.05]">
            <Undo2 size={16} />
          </button>
          <button className="h-9 w-9 rounded-lg flex items-center justify-center text-ink-muted hover:bg-black/[0.05]">
            <Redo2 size={16} />
          </button>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-ink-muted hover:bg-black/[0.05]"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-[12.5px] font-medium text-ink-muted w-11 text-center tabular-nums">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-ink-muted hover:bg-black/[0.05]"
          >
            <ZoomIn size={16} />
          </button>
          <Button variant="outline" size="sm" className="ml-2" onClick={onReset}>
            Reset
          </Button>
          <Button size="sm" onClick={onExport} className="ml-1">
            Save all &amp; export
          </Button>
        </div>
      </Card>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Canvas */}
        <Card padded={false} className="blueprint-grid min-h-[690px] overflow-auto p-4 shadow-[0_10px_24px_rgba(23,19,15,0.035)] sm:p-6 lg:p-10">
          <div
            onClick={handleCanvasClick}
            style={{ width: `${zoom}%`, maxWidth: "780px" }}
            className={clsx(
              "relative mx-auto min-h-[620px] rounded-md border border-paper-line bg-white px-7 py-9 shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-[width] sm:px-10",
              placeable.includes(activeTool) ? "cursor-crosshair" : "cursor-default"
            )}
          >
            <span className="absolute top-4 left-4 text-[10.5px] font-semibold tracking-[0.08em] uppercase bg-ink text-white px-2 py-1 rounded">
              Page {document.currentPage}
            </span>

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

            {/* Existing annotation pins */}
            {document.annotations.map((a) => (
              <button
                key={a.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveAnnotation(activeAnnotation === a.id ? null : a.id);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-md ring-2 ring-white z-10"
                style={{ backgroundColor: a.color, left: `${a.x}%`, top: `${a.y}%` }}
              >
                <MessageSquare size={12} fill="white" />
              </button>
            ))}

            {document.annotations
              .filter((a) => a.id === activeAnnotation)
              .map((a) => (
                <div
                  key={a.id}
                  style={{ left: `${Math.min(a.x, 62)}%`, top: `${a.y}%` }}
                  className="absolute z-20 w-64 -translate-y-1/2 translate-x-4 bg-ink text-white rounded-xl p-3.5 shadow-xl animate-scale-in"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <StampBadge tone={SEVERITY_TONE[a.severity]}>
                      {SEVERITY_LABEL[a.severity]}
                    </StampBadge>
                    <button
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

            {/* Draft annotation composer */}
            {draftAt && (
              <div
                style={{ left: `${Math.min(draftAt.x, 60)}%`, top: `${draftAt.y}%` }}
                onClick={(e) => e.stopPropagation()}
                className="absolute z-20 w-64 -translate-y-1/2 translate-x-4 bg-white border border-paper-line rounded-xl p-3 shadow-xl animate-scale-in"
              >
                <textarea
                  autoFocus
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  placeholder="Add a review comment…"
                  rows={3}
                  className="w-full text-[12.5px] rounded-lg border border-paper-line px-2.5 py-2 focus:outline-none focus:border-primary resize-none"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => setDraftAt(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={commitDraft}>
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Annotation log */}
        <Card className="space-y-4 lg:sticky lg:top-[88px]">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-slate-soft">
              Review log
            </p>
            <p className="text-[12.5px] text-slate mt-0.5">
              {document.annotations.length} item
              {document.annotations.length === 1 ? "" : "s"} on this page
            </p>
          </div>
          <div className="rounded-xl border border-paper-line bg-paper/55 p-3 text-[12px] leading-relaxed text-slate">Select a note to focus it on the plan. Use the comment tool to add a new review item.</div>
          <ul className="max-h-[440px] space-y-2.5 overflow-auto pr-1">
            {document.annotations.map((a) => (
              <li
                key={a.id}
                onClick={() => setActiveAnnotation(a.id)}
                className={clsx(
                  "rounded-xl border px-3 py-2.5 cursor-pointer transition-colors",
                  activeAnnotation === a.id
                    ? "border-primary bg-primary-soft/60"
                    : "border-paper-line hover:border-ink/20"
                )}
              >
                <StampBadge tone={SEVERITY_TONE[a.severity]} className="mb-1.5">
                  {SEVERITY_LABEL[a.severity]}
                </StampBadge>
                <p className="text-[12.5px] text-ink leading-snug">{a.note}</p>
              </li>
            ))}
            {document.annotations.length === 0 && (
              <li className="text-[12.5px] text-slate-soft text-center py-6">
                No annotations yet. Select the comment tool and click the
                plan to add one.
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
