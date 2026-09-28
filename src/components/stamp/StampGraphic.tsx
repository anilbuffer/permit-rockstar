"use client";

import clsx from "clsx";
import type { StampConfig, StampLayer } from "@/lib/types";

interface StampGraphicProps {
  config: StampConfig;
  scale?: number; // percentage (e.g. 100, 86)
  rotation?: number; // degrees (0, 90, etc.)
  className?: string;
  isPlacementMode?: boolean;
  selectedLayerId?: string | null;
  onSelectLayer?: (layerId: string) => void;
  interactive?: boolean;
}

export function StampGraphic({
  config,
  scale = 100,
  rotation = 0,
  className,
  isPlacementMode = false,
  selectedLayerId,
  onSelectLayer,
  interactive = false,
}: StampGraphicProps) {
  const inkColor = config.inkColor || "#ae2a1f";
  const scaleMultiplier = scale / 100;
  const width = config.artboardWidth || 262;
  const height = config.artboardHeight || 165;

  if (config.customStampImage) {
    return (
      <div
        style={{
          transform: `scale(${scaleMultiplier}) rotate(${rotation}deg)`,
          transformOrigin: "center center",
        }}
        className={clsx(
          "inline-block transition-transform select-none",
          isPlacementMode && "cursor-grab active:cursor-grabbing",
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.customStampImage}
          alt="Custom digital stamp"
          className="max-h-40 max-w-72 object-contain drop-shadow-xs"
        />
      </div>
    );
  }

  // If layers exist, render layer-by-layer composite stamp
  if (config.layers && config.layers.length > 0) {
    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scaleMultiplier}) rotate(${rotation}deg)`,
          transformOrigin: "center center",
        }}
        className={clsx(
          "relative bg-white/95 select-none transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
          isPlacementMode && "cursor-grab active:cursor-grabbing ring-1 ring-primary/40",
          className
        )}
      >
        {config.layers.map((layer) => {
          const isSelected = layer.id === selectedLayerId;
          const color = layer.strokeColor || inkColor;

          return (
            <div
              key={layer.id}
              onClick={(e) => {
                if (interactive && onSelectLayer) {
                  e.stopPropagation();
                  onSelectLayer(layer.id);
                }
              }}
              style={{
                position: "absolute",
                left: `${layer.x}px`,
                top: `${layer.y}px`,
                width: layer.width ? `${layer.width}px` : undefined,
                height: layer.height ? `${layer.height}px` : undefined,
                transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
                transformOrigin: "center center",
              }}
              className={clsx(
                "transition-all",
                interactive && "cursor-pointer hover:ring-1 hover:ring-primary/40",
                isSelected && "ring-2 ring-primary ring-offset-1 z-30"
              )}
            >
              {/* Rectangle Layer */}
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
                  className="w-full h-full pointer-events-auto"
                />
              )}

              {/* Circle Layer */}
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
                  className="w-full h-full pointer-events-auto"
                />
              )}

              {/* Line Layer */}
              {layer.type === "line" && (
                <div
                  style={{
                    width: `${layer.width || 100}px`,
                    height: `${layer.strokeWidth || 2}px`,
                    backgroundColor: color,
                  }}
                  className="pointer-events-auto"
                />
              )}

              {/* Text Layer */}
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
                  className="pointer-events-auto select-none"
                >
                  {layer.text}
                </div>
              )}

              {/* Arc Text Layer (Curved Text) */}
              {layer.type === "arctext" && (
                <svg
                  width={layer.width || 200}
                  height={layer.height || 70}
                  viewBox={`0 0 ${layer.width || 200} ${layer.height || 70}`}
                  className="overflow-visible pointer-events-auto"
                >
                  <path
                    id={`arc_${layer.id}`}
                    d={
                      layer.arcFlip
                        ? `M 10,${(layer.height || 70) - 10} Q ${(layer.width || 200) / 2},10 ${(layer.width || 200) - 10},${(layer.height || 70) - 10}`
                        : `M 10,10 Q ${(layer.width || 200) / 2},${(layer.height || 70) - 10} ${(layer.width || 200) - 10},10`
                    }
                    fill="none"
                  />
                  <text
                    fill={color}
                    fontSize={layer.fontSize || 12}
                    fontFamily={layer.fontFamily || "sans-serif"}
                    fontWeight={layer.fontWeight || "bold"}
                    letterSpacing="2"
                  >
                    <textPath href={`#arc_${layer.id}`} startOffset="50%" textAnchor="middle">
                      {layer.text || "PERMIT ROCKSTAR"}
                    </textPath>
                  </text>
                </svg>
              )}

              {/* PR Logo Layer */}
              {layer.type === "logo" && (
                <div
                  style={{
                    width: `${layer.width || 34}px`,
                    height: `${layer.height || 34}px`,
                    borderColor: color,
                  }}
                  className="flex items-center justify-center rounded-sm border-2 bg-secondary/15 font-black tracking-tighter"
                >
                  <span className="text-secondary font-black text-[15px] -mr-0.5 drop-shadow-xs">P</span>
                  <span style={{ color }} className="font-black text-[14px]">R</span>
                </div>
              )}

              {/* Florida Map Layer */}
              {layer.type === "flmap" && (
                <div
                  style={{
                    width: `${layer.width || 34}px`,
                    height: `${layer.height || 34}px`,
                    color,
                  }}
                  className="flex items-center justify-center font-bold text-[10px] border border-dashed rounded p-1"
                >
                  <span>FL MAP</span>
                </div>
              )}

              {/* Image Layer */}
              {layer.type === "image" && layer.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={layer.imageUrl}
                  alt={layer.name}
                  style={{
                    width: `${layer.width || 40}px`,
                    height: `${layer.height || 40}px`,
                  }}
                  className="object-contain"
                />
              )}

              {/* Selected Layer Bounding Handles */}
              {isSelected && interactive && (
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
    );
  }

  // Fallback default stamp rendering
  return (
    <div
      style={{
        transform: `scale(${scaleMultiplier}) rotate(${rotation}deg)`,
        transformOrigin: "center center",
        borderColor: inkColor,
        color: inkColor,
      }}
      className={clsx(
        "relative select-none rounded-xs border-2 bg-white/95 px-3 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform",
        "w-[275px] text-center",
        isPlacementMode && "cursor-grab active:cursor-grabbing ring-1 ring-offset-2 ring-primary/40",
        className
      )}
    >
      <div
        style={{ borderColor: inkColor }}
        className="pointer-events-none absolute inset-[3px] border border-opacity-60"
      />

      <p className="font-sans text-[11px] font-black uppercase tracking-tight leading-tight">
        {config.companyName || "PERMIT ROCKSTAR PRIVATE PROVIDER LLC"}
      </p>

      <p className="mt-1 font-serif text-[12px] font-bold italic tracking-wide">
        {config.complianceText || "Reviewed For Code Compliance"}
      </p>

      <div className="my-1.5 flex items-center justify-center gap-3">
        {config.includeLogo && (
          <div className="flex shrink-0 items-center justify-center">
            <div
              style={{ borderColor: inkColor }}
              className="flex h-9 w-9 items-center justify-center rounded-sm border-2 bg-secondary/15 font-black text-[13px] tracking-tighter"
            >
              <span className="text-secondary font-black text-[15px] -mr-0.5 drop-shadow-xs">P</span>
              <span style={{ color: inkColor }} className="font-black text-[14px]">R</span>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center">
          <p className="font-mono text-[11px] font-bold tracking-wider">
            {config.dateText || new Date().toLocaleDateString("en-US")}
          </p>
          <span className="text-[9px] font-semibold uppercase tracking-wider opacity-85">
            {config.role === "reviewer"
              ? "Plan Reviewer"
              : config.role === "building-official"
                ? "Building Official"
                : "Private Provider"}
          </span>
        </div>
      </div>

      <div className="mt-1 border-t pt-1" style={{ borderColor: `${inkColor}40` }}>
        <p className="font-sans text-[11.5px] font-bold tracking-tight">
          {config.engineerName} {config.licenseNumber}
        </p>
        <p className="mt-0.5 font-mono text-[9px] font-medium opacity-80">
          {config.email} &bull; {config.phone}
        </p>
      </div>
    </div>
  );
}
