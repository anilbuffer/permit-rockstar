import { AppShell } from "@/components/layout/AppShell";
import { CitiesEmailsView } from "@/components/cities-emails/CitiesEmailsView";

export const metadata = {
  title: "Cities & Emails | Permit Rockstar",
  description: "Manage city profiles, jurisdiction contacts, and email notification templates.",
};

export default function CitiesEmailsPage() {
  return (
    <AppShell>
      <CitiesEmailsView />
    </AppShell>
  );
}
