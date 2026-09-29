import { AppShell } from "@/components/layout/AppShell";
import { PcaWizard } from "@/components/pca/PcaWizard";

export const metadata = {
  title: "PCA Workflow | Permit Rockstar",
  description: "Generate and customize Florida Private Provider Plan Compliance Affidavits.",
};

export default function PcaPage() {
  return (
    <AppShell>
      <PcaWizard />
    </AppShell>
  );
}
