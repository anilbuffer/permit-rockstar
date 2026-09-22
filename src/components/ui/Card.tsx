import clsx from "clsx";

export function Card({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={clsx(
        "bg-paper-raised border border-paper-line rounded-2xl",
        padded && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
