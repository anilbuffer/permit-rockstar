import { AppShell } from "@/components/layout/AppShell";
import { ReviewPlansWizard } from "@/components/review-plans/ReviewPlansWizard";

export default function RootPage() {
  return (
    <AppShell>
      <ReviewPlansWizard />
    </AppShell>
  );
}
