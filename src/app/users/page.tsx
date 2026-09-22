import { Users } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Users"
      title="Team & permissions"
      description="Manage teammates, roles, and permissions across your org"
      icon={Users}
    />
  );
}
