"use client";

import { useEffect } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";
import { MobileNav } from "./mobile-nav";
import { CommandPalette } from "./command-palette";
import { useUIStore } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const setPaletteOpen = useUIStore((s) => s.setPaletteOpen);

  // Global ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPaletteOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:pl-56">
        <TopBar />
        <main className="flex-1 px-4 pb-4 pt-4 md:px-6 md:pb-6">
          {children}
        </main>
        <footer className="no-print mb-[calc(3.5rem+env(safe-area-inset-bottom))] mt-auto flex min-h-10 items-center justify-between border-t border-border bg-white px-4 text-[11px] text-muted-foreground md:mb-0 md:px-6">
          <span className="min-w-0 truncate">
            <span className="sm:hidden">© 2025 MANAKSETU</span>
            <span className="hidden sm:inline">
              © 2025 MANAKSETU · Bureau of Indian Standards alignment engine
            </span>
          </span>
          <span className="hidden shrink-0 sm:inline tabular-nums">
            Data as on 08 Dec 2025 · Build v2.4.1
          </span>
        </footer>
      </div>
      <MobileNav />
      <CommandPalette />
    </div>
  );
}
