"use client";

import { useState, useRef, useCallback } from "react";
import {
  MousePointer2,
  Square,
  Circle,
  Minus,
  Type,
  RotateCw,
  ImageIcon,
  MapPin,
  Shield,
  FileText,
  CheckCircle2,
  UploadCloud,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  X,
  RotateCcw,
  Check,
  FileCheck2,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StampGraphic } from "./StampGraphic";
import {
  createDefaultStampLayers,
  formatBytes,
  USER_STAMP_PROFILES,
} from "@/lib/mock-data";
import type {
  PlanFile,
  RoleStampType,
  StampConfig,
  StampLayer,
  StampLayerType,
} from "@/lib/types";

interface UploadStampStepProps {
  stampConfig: StampConfig;
  onChangeStampConfig: (config: StampConfig) => void;
  files: PlanFile[];
  onFilesAdded: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  onProceed: () => void;
  isCarriedOverFromReview?: boolean;
}

const FONT_FAMILIES = ["Arial", "Georgia", "Times New Roman", "Courier", "sans-serif"];

export function UploadStampStep({
  stampConfig,
  onChangeStampConfig,
  files,
  onFilesAdded,
  onRemoveFile,
  onProceed,
  isCarriedOverFromReview = true,
}: UploadStampStepProps) {
  const [activeTool, setActiveTool] = useState<"select" | StampLayerType>("select");
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    stampConfig.layers?.[0]?.id || "layer_rect_1"
  );

  // Active toolbar parameters
  const [strokeColor, setStrokeColor] = useState(stampConfig.inkColor || "#ae2a1f");
  const [strokeThickness, setStrokeThickness] = useState(2);
  const [fillColor, setFillColor] = useState("#ae2a1f");
  const [noFill, setNoFill] = useState(true);
  const [textInput, setTextInput] = useState("PERMIT ROCKSTAR");
  const [fontSizeInput, setFontSizeInput] = useState(12);
  const [fontFamilyInput, setFontFamilyInput] = useState("Arial");
  const [arcRadius, setArcRadius] = useState(80);
  const [arcStartAngle, setArcStartAngle] = useState(180);
  const [arcFlip, setArcFlip] = useState(false);
  const [artboardWidth, setArtboardWidth] = useState(stampConfig.artboardWidth || 262);
  const [artboardHeight, setArtboardHeight] = useState(stampConfig.artboardHeight || 165);

  const [dragLayerId, setDragLayerId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const artboardRef = useRef<HTMLDivElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const selectedLayer = stampConfig.layers?.find((l) => l.id === selectedLayerId);

  // Sync toolbar fields when selected layer changes
  const selectLayer = useCallback((layerId: string) => {
    setSelectedLayerId(layerId);
    const found = stampConfig.layers?.find((l) => l.id === layerId);
    if (found) {
      if (found.strokeColor) setStrokeColor(found.strokeColor);
      if (found.strokeWidth) setStrokeThickness(found.strokeWidth);
      if (found.text) setTextInput(found.text);
      if (found.fontSize) setFontSizeInput(found.fontSize);
      if (found.fontFamily) setFontFamilyInput(found.fontFamily);
      if (found.hasFill !== undefined) setNoFill(!found.hasFill);
      if (found.arcRadius) setArcRadius(found.arcRadius);
      if (found.arcStartAngle) setArcStartAngle(found.arcStartAngle);
      if (found.arcFlip !== undefined) setArcFlip(found.arcFlip);
    }
  }, [stampConfig.layers]);

  // Update properties of the currently selected layer
  function handleApplyProperties() {
    if (!selectedLayerId) return;
    const updatedLayers = (stampConfig.layers || []).map((layer) => {
      if (layer.id === selectedLayerId) {
        return {
          ...layer,
          strokeColor,
          strokeWidth: strokeThickness,
          fillColor: noFill ? undefined : fillColor,
          hasFill: !noFill,
          text: textInput,
          fontSize: fontSizeInput,
          fontFamily: fontFamilyInput,
          arcRadius,
          arcStartAngle,
          arcFlip,
          width: layer.type === "rect" || layer.type === "line" || layer.type === "circle" || layer.type === "arctext" ? layer.width : layer.width,
        };
      }
      return layer;
    });

    onChangeStampConfig({
      ...stampConfig,
      inkColor: strokeColor,
      artboardWidth,
      artboardHeight,
      layers: updatedLayers,
    });
  }

  // Adding a new layer based on selected tool
  function handleAddLayer(type: StampLayerType) {
    const id = `layer_${type}_${Date.now()}`;
    let newLayer: StampLayer;

    switch (type) {
      case "rect":
        newLayer = {
          id,
          type: "rect",
          name: `rect ${stampConfig.layers.length + 1}`,
          x: 20,
          y: 20,
          width: 140,
          height: 60,
          strokeColor,
          strokeWidth: strokeThickness,
          hasFill: !noFill,
          fillColor: noFill ? undefined : fillColor,
        };
        break;
      case "circle":
        newLayer = {
          id,
          type: "circle",
          name: `circle ${stampConfig.layers.length + 1}`,
          x: 50,
          y: 30,
          width: 60,
          height: 60,
          strokeColor,
          strokeWidth: strokeThickness,
          hasFill: !noFill,
        };
        break;
      case "line":
        newLayer = {
          id,
          type: "line",
          name: `line ${stampConfig.layers.length + 1}`,
          x: 20,
          y: 80,
          width: 160,
          height: 2,
          strokeColor,
          strokeWidth: strokeThickness,
        };
        break;
      case "text":
        newLayer = {
          id,
          type: "text",
          name: `text ${stampConfig.layers.length + 1}`,
          x: 130,
          y: 60,
          text: textInput || "NEW TEXT LINE",
          fontSize: fontSizeInput || 12,
          fontFamily: fontFamilyInput || "Arial",
          fontWeight: "bold",
          strokeColor,
        };
        break;
      case "arctext":
        newLayer = {
          id,
          type: "arctext",
          name: `arctext ${stampConfig.layers.length + 1}`,
          x: 30,
          y: 10,
          width: 200,
          height: 60,
          text: textInput || "PERMIT ROCKSTAR SEAL",
          fontSize: fontSizeInput || 11,
          fontFamily: fontFamilyInput || "Arial",
          fontWeight: "bold",
          arcRadius,
          arcStartAngle,
          arcFlip,
          strokeColor,
        };
        break;
      case "logo":
        newLayer = {
          id,
          type: "logo",
          name: `logo ${stampConfig.layers.length + 1}`,
          x: 20,
          y: 50,
          width: 34,
          height: 34,
          strokeColor,
        };
        break;
      case "flmap":
        newLayer = {
          id,
          type: "flmap",
          name: `flmap ${stampConfig.layers.length + 1}`,
          x: 20,
          y: 50,
          width: 36,
          height: 36,
          strokeColor,
        };
        break;
      case "image":
        imageInputRef.current?.click();
        return;
      default:
        return;
    }

    const nextLayers = [...(stampConfig.layers || []), newLayer];
    onChangeStampConfig({ ...stampConfig, layers: nextLayers });
    setSelectedLayerId(id);
    setActiveTool("select");
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const id = `layer_image_${Date.now()}`;
      const imgLayer: StampLayer = {
        id,
        type: "image",
        name: `image ${stampConfig.layers.length + 1}`,
        x: 40,
        y: 40,
        width: 48,
        height: 48,
        imageUrl: reader.result as string,
      };
      onChangeStampConfig({
        ...stampConfig,
        layers: [...(stampConfig.layers || []), imgLayer],
      });
      setSelectedLayerId(id);
      setActiveTool("select");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  // Layer Reordering & Deletion
  function handleMoveLayerUp(id: string) {
    const layers = [...stampConfig.layers];
    const index = layers.findIndex((l) => l.id === id);
    if (index > 0) {
      const temp = layers[index];
      layers[index] = layers[index - 1];
      layers[index - 1] = temp;
      onChangeStampConfig({ ...stampConfig, layers });
    }
  }

  function handleMoveLayerDown(id: string) {
    const layers = [...stampConfig.layers];
    const index = layers.findIndex((l) => l.id === id);
    if (index >= 0 && index < layers.length - 1) {
      const temp = layers[index];
      layers[index] = layers[index + 1];
      layers[index + 1] = temp;
      onChangeStampConfig({ ...stampConfig, layers });
    }
  }

  function handleDeleteLayer(id: string) {
    const layers = stampConfig.layers.filter((l) => l.id !== id);
    onChangeStampConfig({ ...stampConfig, layers });
    if (selectedLayerId === id) {
      setSelectedLayerId(layers[0]?.id || null);
    }
  }

  function handleClearArtboard() {
    onChangeStampConfig({
      ...stampConfig,
      layers: createDefaultStampLayers(
        stampConfig.engineerName,
        stampConfig.licenseNumber,
        stampConfig.role,
        strokeColor
      ),
    });
    setSelectedLayerId("layer_rect_1");
  }

  // Profile selection updates engineer name & layers
  function handleSelectUserProfile(profileId: string) {
    const profile = USER_STAMP_PROFILES.find((p) => p.id === profileId);
    if (!profile) return;

    const updatedLayers = (stampConfig.layers || []).map((layer) => {
      if (layer.id === "layer_text_engineer" || layer.name === "text 5") {
        return { ...layer, text: `${profile.name} ${profile.licenseNumber}` };
      }
      if (layer.id === "layer_text_contact" || layer.name === "text 6") {
        return { ...layer, text: `${profile.email} • ${profile.phone}` };
      }
      return layer;
    });

    onChangeStampConfig({
      ...stampConfig,
      engineerName: profile.name,
      licenseNumber: profile.licenseNumber,
      state: profile.state,
      email: profile.email,
      phone: profile.phone,
      layers: updatedLayers,
    });
  }

  function handleRoleChange(role: RoleStampType) {
    const complianceText =
      role === "reviewer"
        ? "Reviewed For Code Compliance"
        : "Private Provider Code Review";
    const roleText = role === "reviewer" ? "Plan Reviewer" : "Private Provider";

    const updatedLayers = (stampConfig.layers || []).map((layer) => {
      if (layer.id === "layer_text_compliance" || layer.name === "text 2") {
        return { ...layer, text: complianceText };
      }
      if (layer.id === "layer_text_role" || layer.name === "text 4") {
        return { ...layer, text: roleText };
      }
      return layer;
    });

    onChangeStampConfig({
      ...stampConfig,
      role,
      complianceText,
      layers: updatedLayers,
    });
  }

  // Dragging layer inside the artboard
  const handlePointerDownLayer = (e: React.PointerEvent, layer: StampLayer) => {
    e.stopPropagation();
    setSelectedLayerId(layer.id);
    setDragLayerId(layer.id);
    if (artboardRef.current) {
      const rect = artboardRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - layer.x,
        y: e.clientY - rect.top - layer.y,
      });
    }
  };

  const handlePointerMoveArtboard = (e: React.PointerEvent) => {
    if (!dragLayerId || !artboardRef.current) return;
    const rect = artboardRef.current.getBoundingClientRect();
    const newX = Math.round(e.clientX - rect.left - dragOffset.x);
    const newY = Math.round(e.clientY - rect.top - dragOffset.y);

    const clampedX = Math.max(0, Math.min(artboardWidth - 20, newX));
    const clampedY = Math.max(0, Math.min(artboardHeight - 10, newY));

    const updatedLayers = stampConfig.layers.map((l) =>
      l.id === dragLayerId ? { ...l, x: clampedX, y: clampedY } : l
    );
    onChangeStampConfig({ ...stampConfig, layers: updatedLayers });
  };

  const handlePointerUpArtboard = () => {
    setDragLayerId(null);
  };

  const activePdf = files[0];

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Hidden file pickers */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <input
        ref={pdfInputRef}
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

      {/* TOP TOOLBAR: Tools & Style Inputs (Matching Permit Rockstar design system) */}
      <Card padded={false} className="p-3 shadow-xs space-y-2.5 bg-paper-raised border-paper-line">
        {/* Row 1: Tool Selection Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-paper-line pb-2.5">
          {/* Select Tool */}
          <button
            type="button"
            onClick={() => setActiveTool("select")}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all",
              activeTool === "select"
                ? "bg-primary text-white shadow-xs scale-[1.02]"
                : "text-ink-muted hover:bg-black/[0.04] hover:text-ink"
            )}
          >
            <MousePointer2 size={14} strokeWidth={2.2} fill={activeTool === "select" ? "white" : "none"} />
            <span>Select</span>
          </button>

          <div className="h-4 w-px bg-paper-line mx-1" />

          {/* Shape & Element Tools */}
          {(
            [
              { key: "rect", icon: Square, label: "Rect" },
              { key: "circle", icon: Circle, label: "Circle" },
              { key: "line", icon: Minus, label: "Line" },
              { key: "text", icon: Type, label: "Text" },
              { key: "arctext", icon: RotateCw, label: "Arc" },
              { key: "image", icon: ImageIcon, label: "Add Image" },
              { key: "flmap", icon: MapPin, label: "FL Map" },
              { key: "logo", icon: Shield, label: "PR Logo" },
            ] as const
          ).map((tool) => {
            const isActive = activeTool === tool.key;
            return (
              <button
                key={tool.key}
                type="button"
                onClick={() => handleAddLayer(tool.key)}
                className={clsx(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all",
                  isActive
                    ? "bg-primary text-white shadow-xs scale-[1.02]"
                    : "text-slate hover:bg-black/[0.04] hover:text-ink"
                )}
              >
                <tool.icon size={13} strokeWidth={2} />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Property Modifiers (Stroke, Fill, Text, Arc, Dimensions, Apply) */}
        <div className="flex flex-wrap items-center gap-3 text-[12px] font-medium text-ink">
          {/* Stroke Control */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-soft">
              Stroke
            </span>
            <div className="flex items-center gap-1">
              {[
                { hex: "#ae2a1f", label: "Red" },
                { hex: "#00557f", label: "Navy" },
                { hex: "#c84b24", label: "Rust" },
                { hex: "#17130f", label: "Black" },
              ].map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  title={swatch.label}
                  onClick={() => setStrokeColor(swatch.hex)}
                  style={{ backgroundColor: swatch.hex }}
                  className={clsx(
                    "h-5 w-5 rounded-full transition-transform hover:scale-110",
                    strokeColor === swatch.hex && "ring-2 ring-primary ring-offset-1 scale-105"
                  )}
                />
              ))}
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="h-5 w-5 cursor-pointer rounded-full border-0 bg-transparent p-0 ml-1"
                title="Custom color"
              />
            </div>
            <input
              type="number"
              min="1"
              max="10"
              value={strokeThickness}
              onChange={(e) => setStrokeThickness(Number(e.target.value))}
              className="w-10 rounded-lg border border-paper-line bg-paper px-1.5 py-0.5 text-center font-mono text-[11px] text-ink focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>

          <div className="h-4 w-px bg-paper-line" />

          {/* Fill Control */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-soft">
              Fill
            </span>
            <input
              type="color"
              value={fillColor}
              disabled={noFill}
              onChange={(e) => setFillColor(e.target.value)}
              className="h-5 w-5 cursor-pointer rounded-full border-0 bg-transparent p-0 disabled:opacity-30"
            />
            <label className="flex items-center gap-1 text-[11.5px] text-slate cursor-pointer">
              <input
                type="checkbox"
                checked={noFill}
                onChange={(e) => setNoFill(e.target.checked)}
                className="accent-primary rounded"
              />
              <span>No fill</span>
            </label>
          </div>

          <div className="h-4 w-px bg-paper-line" />

          {/* Text Input & Font */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-soft">
              Text
            </span>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-40 rounded-lg border border-paper-line bg-paper px-2.5 py-1 text-[12px] text-ink focus:outline-none focus:border-primary focus:bg-white"
              placeholder="YOUR TEXT"
            />
            <input
              type="number"
              min="8"
              max="40"
              value={fontSizeInput}
              onChange={(e) => setFontSizeInput(Number(e.target.value))}
              className="w-11 rounded-lg border border-paper-line bg-paper px-1 py-1 text-center font-mono text-[11px] text-ink focus:border-primary focus:bg-white focus:outline-none"
              title="Font size"
            />
            <select
              value={fontFamilyInput}
              onChange={(e) => setFontFamilyInput(e.target.value)}
              className="rounded-lg border border-paper-line bg-paper px-2 py-1 text-[11.5px] font-sans text-ink focus:border-primary focus:bg-white focus:outline-none"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-paper-line" />

          {/* Arc Parameters */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-soft">
              Arc R
            </span>
            <input
              type="number"
              value={arcRadius}
              onChange={(e) => setArcRadius(Number(e.target.value))}
              className="w-11 rounded-lg border border-paper-line bg-paper px-1 py-1 text-center font-mono text-[11px] text-ink focus:border-primary focus:bg-white focus:outline-none"
            />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-soft">
              Start&deg;
            </span>
            <input
              type="number"
              value={arcStartAngle}
              onChange={(e) => setArcStartAngle(Number(e.target.value))}
              className="w-11 rounded-lg border border-paper-line bg-paper px-1 py-1 text-center font-mono text-[11px] text-ink focus:border-primary focus:bg-white focus:outline-none"
            />
            <label className="flex items-center gap-1 text-[11.5px] text-slate cursor-pointer">
              <input
                type="checkbox"
                checked={arcFlip}
                onChange={(e) => setArcFlip(e.target.checked)}
                className="accent-primary rounded"
              />
              <span>Flip</span>
            </label>
          </div>

          <div className="h-4 w-px bg-paper-line" />

          {/* Dimensions */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-soft">
              W
            </span>
            <input
              type="number"
              value={artboardWidth}
              onChange={(e) => setArtboardWidth(Number(e.target.value))}
              className="w-12 rounded-lg border border-paper-line bg-paper px-1 py-1 text-center font-mono text-[11px] text-ink focus:border-primary focus:bg-white focus:outline-none"
            />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-soft">
              H
            </span>
            <input
              type="number"
              value={artboardHeight}
              onChange={(e) => setArtboardHeight(Number(e.target.value))}
              className="w-12 rounded-lg border border-paper-line bg-paper px-1 py-1 text-center font-mono text-[11px] text-ink focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>

          {/* Apply Button */}
          <Button
            size="sm"
            variant="primary"
            onClick={handleApplyProperties}
            className="ml-auto shadow-xs"
          >
            Apply
          </Button>
        </div>
      </Card>


      {/* MAIN TWO-COLUMN WORKSPACE: Center Artboard & Right Sidebar */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
        {/* CENTER ARTBOARD CANVAS */}
        <Card padded={false} className="blueprint-grid flex min-h-[560px] flex-col items-center justify-center p-6 bg-paper/40 relative overflow-hidden">
          <p className="absolute top-3 left-4 font-mono text-[11px] text-slate-soft">
            STAMP CANVAS (DRAG LAYERS TO REPOSITION &bull; CLICK TO SELECT)
          </p>

          {/* Centered White Artboard */}
          <div
            ref={artboardRef}
            onPointerMove={handlePointerMoveArtboard}
            onPointerUp={handlePointerUpArtboard}
            style={{ width: `${artboardWidth}px`, height: `${artboardHeight}px` }}
            className="relative bg-white shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-paper-line rounded-xs select-none transition-shadow"
          >
            {/* Render all custom layers */}
            {stampConfig.layers?.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              const color = layer.strokeColor || strokeColor;

              return (
                <div
                  key={layer.id}
                  onPointerDown={(e) => handlePointerDownLayer(e, layer)}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectLayer(layer.id);
                  }}
                  style={{
                    position: "absolute",
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: layer.width ? `${layer.width}px` : undefined,
                    height: layer.height ? `${layer.height}px` : undefined,
                  }}
                  className={clsx(
                    "cursor-move select-none transition-all",
                    isSelected
                      ? "ring-2 ring-primary ring-offset-2 z-30"
                      : "hover:ring-1 hover:ring-primary/40"
                  )}
                >
                  {/* Layer Types */}
                  {layer.type === "rect" && (
                    <div
                      style={{
                        width: `${layer.width || 100}px`,
                        height: `${layer.height || 50}px`,
                        borderColor: color,
                        borderWidth: `${layer.strokeWidth || 2}px`,
                        borderStyle: "solid",
                        backgroundColor: layer.hasFill ? layer.fillColor || "transparent" : "transparent",
                      }}
                      className="w-full h-full"
                    />
                  )}

                  {layer.type === "circle" && (
                    <div
                      style={{
                        width: `${layer.width || 60}px`,
                        height: `${layer.height || layer.width || 60}px`,
                        borderColor: color,
                        borderWidth: `${layer.strokeWidth || 2}px`,
                        borderStyle: "solid",
                        borderRadius: "9999px",
                        backgroundColor: layer.hasFill ? layer.fillColor || "transparent" : "transparent",
                      }}
                      className="w-full h-full"
                    />
                  )}

                  {layer.type === "line" && (
                    <div
                      style={{
                        width: `${layer.width || 100}px`,
                        height: `${layer.strokeWidth || 2}px`,
                        backgroundColor: color,
                      }}
                    />
                  )}

                  {layer.type === "text" && (
                    <div
                      style={{
                        color,
                        fontSize: `${layer.fontSize || 12}px`,
                        fontFamily: layer.fontFamily || "sans-serif",
                        fontWeight: layer.fontWeight || "bold",
                        whiteSpace: "nowrap",
                        transform: "translateX(-50%)",
                      }}
                      className="select-none"
                    >
                      {layer.text}
                    </div>
                  )}

                  {layer.type === "arctext" && (
                    <svg
                      width={layer.width || 200}
                      height={layer.height || 60}
                      viewBox={`0 0 ${layer.width || 200} ${layer.height || 60}`}
                      className="overflow-visible"
                    >
                      <path
                        id={`arc_editor_${layer.id}`}
                        d={
                          layer.arcFlip
                            ? `M 10,${(layer.height || 60) - 10} Q ${(layer.width || 200) / 2},10 ${(layer.width || 200) - 10},${(layer.height || 60) - 10}`
                            : `M 10,10 Q ${(layer.width || 200) / 2},${(layer.height || 60) - 10} ${(layer.width || 200) - 10},10`
                        }
                        fill="none"
                      />
                      <text
                        fill={color}
                        fontSize={layer.fontSize || 12}
                        fontFamily={layer.fontFamily || "sans-serif"}
                        fontWeight={layer.fontWeight || "bold"}
                        letterSpacing="1.5"
                      >
                        <textPath href={`#arc_editor_${layer.id}`} startOffset="50%" textAnchor="middle">
                          {layer.text || "PERMIT ROCKSTAR"}
                        </textPath>
                      </text>
                    </svg>
                  )}

                  {layer.type === "logo" && (
                    <div
                      style={{
                        width: `${layer.width || 34}px`,
                        height: `${layer.height || 34}px`,
                        borderColor: color,
                      }}
                      className="flex items-center justify-center rounded-sm border-2 bg-secondary/15 font-black tracking-tighter"
                    >
                      <span className="text-secondary font-black text-[15px] -mr-0.5">P</span>
                      <span style={{ color }} className="font-black text-[14px]">R</span>
                    </div>
                  )}

                  {layer.type === "flmap" && (
                    <div
                      style={{
                        width: `${layer.width || 36}px`,
                        height: `${layer.height || 36}px`,
                        color,
                      }}
                      className="flex items-center justify-center font-bold text-[9px] border border-dashed rounded p-1"
                    >
                      FL MAP
                    </div>
                  )}

                  {layer.type === "image" && layer.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={layer.imageUrl}
                      alt={layer.name}
                      style={{
                        width: `${layer.width || 48}px`,
                        height: `${layer.height || 48}px`,
                      }}
                      className="object-contain"
                    />
                  )}

                  {/* Bounding box handles for selected layer */}
                  {isSelected && (
                    <div className="absolute inset-0 pointer-events-none border border-primary border-dashed">
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-xs" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-xs" />
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-xs" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-xs" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-4 text-[11px] font-mono text-slate-soft">
            <span>Artboard: {artboardWidth} &times; {artboardHeight} px</span>
            <span>&bull;</span>
            <span>Layers: {stampConfig.layers?.length || 0}</span>
            <span>&bull;</span>
            <span>Scale: Vector Scalable (100%)</span>
          </div>
        </Card>

        {/* RIGHT SIDEBAR: Controls, PDF Connection, Layers, Properties */}
        <div className="space-y-4">
          <Card className="space-y-4 shadow-sm bg-paper-raised border-paper-line">
            {/* 1. SELECT USER STAMP */}
            <div>
              <label
                htmlFor="user-stamp-select"
                className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-soft mb-1.5"
              >
                SELECT USER STAMP
              </label>
              <select
                id="user-stamp-select"
                value={
                  USER_STAMP_PROFILES.find((p) => p.name === stampConfig.engineerName)?.id ||
                  "ali-marar"
                }
                onChange={(e) => handleSelectUserProfile(e.target.value)}
                className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-semibold text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
              >
                {USER_STAMP_PROFILES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. CHOOSE ROLE STAMP */}
            <div>
              <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-soft mb-1.5">
                CHOOSE ROLE STAMP:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleChange("reviewer")}
                  className={clsx(
                    "rounded-xl border px-3 py-2 text-center text-[12px] font-bold transition-all",
                    stampConfig.role === "reviewer"
                      ? "border-primary bg-primary-soft/80 text-primary shadow-xs"
                      : "border-paper-line bg-paper text-slate hover:border-primary/40 hover:text-ink"
                  )}
                >
                  Reviewer Stamp
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("private-provider")}
                  className={clsx(
                    "rounded-xl border px-3 py-2 text-center text-[12px] font-bold transition-all",
                    stampConfig.role === "private-provider"
                      ? "border-primary bg-primary-soft/80 text-primary shadow-xs"
                      : "border-paper-line bg-paper text-slate hover:border-primary/40 hover:text-ink"
                  )}
                >
                  Private Provider Stamp
                </button>
              </div>
            </div>

            {/* 3. PDF FILES CARD (Carried over from Review Plans!) */}
            <div className="border-t border-paper-line pt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-soft">
                  PDF FILES
                </span>
                <span className="font-mono text-[10.5px] text-slate-soft">MAX: 200MB</span>
              </div>

              {/* Connected File Box */}
              {activePdf ? (
                <div className="rounded-xl border border-paper-line bg-paper/60 p-3 space-y-1.5 transition-colors hover:border-primary/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FileCheck2 size={16} className="text-primary shrink-0" />
                      <p className="truncate text-[12.5px] font-bold text-ink">{activePdf.name}</p>
                    </div>
                    <span className="shrink-0 text-[10.5px] font-mono text-slate-soft">
                      {formatBytes(activePdf.sizeBytes)} &bull; {activePdf.pageCount} pg
                    </span>
                  </div>

                  {isCarriedOverFromReview && (
                    <div className="flex items-center gap-1.5 text-[11px] text-forest font-semibold">
                      <CheckCircle2 size={12} />
                      <span>Carried over from Review Plans</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      className="text-[11.5px] font-semibold text-primary hover:underline"
                    >
                      Replace / Add PDF File(s)
                    </button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-white"
                  onClick={() => pdfInputRef.current?.click()}
                >
                  Add PDF File(s)
                </Button>
              )}
            </div>

            {/* 4. LAYERS (CLICK TO SELECT) */}
            <div className="border-t border-paper-line pt-3">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-soft mb-1.5">
                LAYERS (CLICK TO SELECT)
              </p>
              <ul className="max-h-[160px] overflow-y-auto space-y-1 pr-1">
                {stampConfig.layers?.map((layer) => {
                  const isSelected = layer.id === selectedLayerId;
                  return (
                    <li
                      key={layer.id}
                      onClick={() => selectLayer(layer.id)}
                      className={clsx(
                        "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] font-mono cursor-pointer transition-colors border",
                        isSelected
                          ? "border-primary/40 bg-primary-soft/80 text-primary font-bold shadow-2xs"
                          : "border-paper-line/50 bg-paper/40 text-slate hover:bg-paper hover:text-ink"
                      )}
                    >
                      <span className="truncate max-w-[170px]">{layer.name}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveLayerUp(layer.id);
                          }}
                          className="hover:text-primary p-0.5"
                        >
                          <ChevronUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveLayerDown(layer.id);
                          }}
                          className="hover:text-primary p-0.5"
                        >
                          <ChevronDown size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLayer(layer.id);
                          }}
                          className="hover:text-alert p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 5. PROPERTIES READOUT */}
            <div className="border-t border-paper-line pt-3">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-soft mb-1.5">
                PROPERTIES
              </p>
              {selectedLayer ? (
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex items-center justify-between rounded-lg border border-paper-line bg-paper px-2 py-1">
                    <span className="text-slate-soft">X:</span>
                    <span className="font-bold text-ink">{selectedLayer.x}px</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-paper-line bg-paper px-2 py-1">
                    <span className="text-slate-soft">Y:</span>
                    <span className="font-bold text-ink">{selectedLayer.y}px</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-paper-line bg-paper px-2 py-1">
                    <span className="text-slate-soft">W:</span>
                    <span className="font-bold text-ink">{selectedLayer.width || "-"}px</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-paper-line bg-paper px-2 py-1">
                    <span className="text-slate-soft">H:</span>
                    <span className="font-bold text-ink">{selectedLayer.height || "-"}px</span>
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-slate-soft italic">Nothing selected</p>
              )}
            </div>

            {/* 6. BOTTOM ACTION BUTTONS: Clear & Continue */}
            <div className="border-t border-paper-line pt-4 flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={handleClearArtboard}
                className="bg-white hover:bg-paper text-slate hover:text-ink border-paper-line"
              >
                Clear
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={onProceed}
                className="flex-1 shadow-sm font-semibold"
              >
                <span>Continue to Placement</span>
                <ArrowRight size={15} />
              </Button>
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
}
