import { Bell } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Notifications"
      title="Activity & alerts"
      description="See status changes, comments, and deadlines in one feed"
      icon={Bell}
    />
  );
}
