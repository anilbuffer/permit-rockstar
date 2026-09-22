"use client";

import { useState } from "react";
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
  Menu,
  Stamp,
  Users,
  X,
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

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 lg:hidden">
      <div className="relative z-10 flex h-[72px] items-center justify-between border-b border-white/[0.12] bg-primary-dark px-4 shadow-[0_5px_16px_rgba(0,62,93,0.16)]">
        <Link
          href="/review-plans"
          className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-secondary"
        >
          <Image
            src="/logo.png"
            alt="Permit Rockstar"
            width={300}
            height={200}
            priority
            className="h-auto w-[118px] drop-shadow-[0_5px_10px_rgba(0,0,0,0.22)]"
          />
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.08] text-white outline-none transition-colors hover:bg-white/[0.15] focus-visible:ring-2 focus-visible:ring-secondary"
        >
          {open ? <X size={20} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-0 bg-primary-dark/20 backdrop-blur-[1px]"
          />
          <nav
            id="mobile-navigation"
            aria-label="Primary"
            className="absolute z-10 inset-x-3 top-[80px] overflow-hidden rounded-2xl border border-white/[0.12] bg-primary-dark p-2 shadow-[0_20px_45px_rgba(0,42,63,0.32)] animate-fade-up"
          >
            <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
              Workspace
            </p>
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = ICONS[item.key];
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-secondary",
                      isActive
                        ? "bg-white/[0.14] text-white"
                        : "text-white/68 hover:bg-white/[0.08] hover:text-white"
                    )}
                  >
                    <span
                      className={clsx(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        isActive ? "bg-secondary text-primary" : "bg-white/[0.08] text-white/70"
                      )}
                    >
                      <Icon size={16} strokeWidth={2.1} />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
