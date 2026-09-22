import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "success" | "outline" | "rust" | "forest";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark shadow-[0_1px_0_0_rgba(0,0,0,0.08)] disabled:bg-primary/40",
  rust:
    "bg-rust text-white hover:bg-rust-dark shadow-[0_2px_8px_rgba(200,75,36,0.25)] disabled:bg-rust/40",
  forest:
    "bg-forest text-white hover:bg-forest-dark shadow-[0_2px_8px_rgba(40,110,78,0.25)] disabled:bg-forest/40",
  secondary:
    "bg-secondary text-ink hover:brightness-95 disabled:bg-secondary/40",
  success:
    "bg-forest text-white hover:brightness-110 disabled:bg-forest/40",
  outline:
    "bg-transparent text-ink border border-paper-line hover:border-ink/30 hover:bg-white disabled:opacity-40",
  ghost:
    "bg-transparent text-ink-muted hover:bg-black/[0.04] disabled:opacity-40",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded-lg gap-1.5",
  md: "text-sm px-4 py-2.5 rounded-lg gap-2",
  lg: "text-[15px] px-5 py-3 rounded-xl gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-semibold tracking-[-0.01em] transition-colors duration-150 disabled:cursor-not-allowed",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
