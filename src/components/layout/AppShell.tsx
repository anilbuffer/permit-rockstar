import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1 bg-[radial-gradient(circle_at_100%_0%,rgba(217,237,246,0.72),transparent_24rem)]">
        <MobileNav />
        <main className="mx-auto max-w-[1320px] px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
