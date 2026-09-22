"use client";

import { Search, ShieldCheck, Command } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1 bg-[radial-gradient(circle_at_100%_0%,rgba(217,237,246,0.72),transparent_24rem)]">
        <MobileNav />

        {/* Desktop Header Utility Bar */}
        <header className="hidden lg:flex items-center justify-between border-b border-paper-line bg-paper-raised/80 backdrop-blur-xs px-8 py-3.5">
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-soft" />
              <input
                type="text"
                placeholder="Search plan sets, jurisdiction rules, permits..."
                className="w-full rounded-xl border border-paper-line bg-paper pl-9 pr-10 py-1.5 text-[12.5px] font-medium text-ink placeholder:text-slate-soft focus:border-primary focus:bg-white focus:outline-none transition-colors"
              />
              <span className="absolute right-2.5 top-2 flex items-center gap-0.5 rounded border border-paper-line bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-soft">
                <Command size={10} /> K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[12px]">
            <span className="flex items-center gap-1.5 rounded-full bg-forest-soft/60 px-3 py-1 font-semibold text-forest">
              <ShieldCheck size={14} /> System Operational
            </span>
            <span className="font-medium text-slate">
              Workspace: <strong className="text-ink">Texas Region</strong>
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-[1320px] px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
