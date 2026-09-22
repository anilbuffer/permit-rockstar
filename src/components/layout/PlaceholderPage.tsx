import type { LucideIcon } from "lucide-react";
import { AppShell } from "./AppShell";
import { Card } from "@/components/ui/Card";

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-primary">
            {eyebrow}
          </p>
          <h1 className="text-[26px] font-bold text-ink tracking-[-0.01em] mt-1">
            {title}
          </h1>
        </div>

        <Card className="blueprint-grid flex flex-col items-center justify-center text-center py-20">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-5">
            <Icon size={24} className="text-secondary" strokeWidth={1.75} />
          </div>
          <h2 className="text-[16px] font-semibold text-ink max-w-[360px]">
            {description}
          </h2>
          <p className="text-[13px] text-slate mt-2 max-w-[320px]">
            This workspace is being built out next. Start with Review Plans
            to see the full experience.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
