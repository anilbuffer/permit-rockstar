import { AppShell } from "@/components/layout/AppShell";
import { PermitInspectionWizard } from "@/components/permit-inspection/PermitInspectionWizard";

export const metadata = {
  title: "Permit Inspection Report | Permit Rockstar",
  description:
    "Generate, complete, and transmit official Florida Private Provider Inspection (PPI) reports under Florida Statute § 553.791.",
};

export default function PermitInspectionPage() {
  return (
    <AppShell>
      <PermitInspectionWizard />
    </AppShell>
  );
}
