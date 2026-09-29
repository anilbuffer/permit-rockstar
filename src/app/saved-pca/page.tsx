import { AppShell } from "@/components/layout/AppShell";
import { SavedPcaTable } from "@/components/saved-pca/SavedPcaTable";

export const metadata = {
  title: "Saved PCA Records | Permit Rockstar",
  description: "View, search, and manage all private provider inspection certificates saved in the database.",
};

export default function SavedPcaPage() {
  return (
    <AppShell>
      <SavedPcaTable />
    </AppShell>
  );
}
