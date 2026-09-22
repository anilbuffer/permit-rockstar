import { ClipboardCheck } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="PCA"
      title="Plan correction analysis"
      description="Run automated plan correction analysis across a submitted set"
      icon={ClipboardCheck}
    />
  );
}
