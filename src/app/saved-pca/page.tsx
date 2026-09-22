import { FolderCheck } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Saved PCA"
      title="Saved PCA reports"
      description="Revisit and export plan correction analyses you have saved"
      icon={FolderCheck}
    />
  );
}
