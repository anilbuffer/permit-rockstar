import clsx from "clsx";

type Tone = "primary" | "secondary" | "forest" | "alert" | "slate";

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  forest: "text-forest",
  alert: "text-alert",
  slate: "text-slate",
};

export function StampBadge({
  children,
  tone = "slate",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "stamp text-[11px] uppercase",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
