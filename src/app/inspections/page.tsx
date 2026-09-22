import { CalendarCheck2 } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Inspections"
      title="Inspection scheduling"
      description="Track and schedule field inspections tied to active permits"
      icon={CalendarCheck2}
    />
  );
}
