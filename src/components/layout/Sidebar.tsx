"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  CalendarCheck2,
  ClipboardCheck,
  FileStack,
  FolderCheck,
  Stamp,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { NAV_ITEMS } from "@/lib/mock-data";
import type { NavKey } from "@/lib/types";

const ICONS: Record<
  NavKey,
  React.ComponentType<{ size?: number; strokeWidth?: number }>
> = {
  "review-plans": FileStack,
  stamp: Stamp,
  pca: ClipboardCheck,
  "saved-pca": FolderCheck,
  inspections: CalendarCheck2,
  "cities-emails": Building2,
  users: Users,
  notifications: Bell,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-[245px] shrink-0 overflow-hidden bg-primary-dark text-white shadow-[14px_0_38px_rgba(0,62,93,0.12)] lg:flex lg:flex-col">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(255,255,255,0.14),transparent_26%),radial-gradient(circle_at_100%_100%,rgba(245,184,46,0.17),transparent_32%)]" />

      <div className="relative border-b border-white/[0.12] px-5 py-3 flex items-center justify-center">
        <Link
          href="/review-plans"
          className="group block text-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"
        >
          <Image
            src="/logo.png"
            alt="Permit Rockstar"
            width={300}
            height={200}
            priority
            className="h-auto max-w-[170px] mx-auto drop-shadow-[0_8px_14px_rgba(0,0,0,0.24)] transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </Link>
      </div>

      <nav className="relative flex-1 overflow-y-auto px-3 py-5" aria-label="Primary">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.key];
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[13.5px] font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-secondary",
                  isActive
                    ? "border-white/[0.12] bg-white/[0.13] text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                    : "border-transparent text-white/62 hover:border-white/[0.08] hover:bg-white/[0.07] hover:text-white"
                )}
              >
                <span
                  className={clsx(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-secondary text-primary shadow-sm"
                      : "bg-white/[0.08] text-white/70 group-hover:bg-white/[0.12] group-hover:text-white"
                  )}
                >
                  <Icon size={16} strokeWidth={2.1} />
                </span>
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_10px_rgba(245,184,46,0.95)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
