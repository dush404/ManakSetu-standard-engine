"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Network, Circle } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Primary navigation"
      className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-border bg-white md:flex"
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded bg-primary">
          <Network className="h-4 w-4 text-primary-foreground" strokeWidth={1.5} aria-hidden />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-foreground">BIS-Graph</p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Standards Intelligence
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3 thin-scroll" aria-label="Workspace">
        <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Workspace
        </p>
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "transition-fast flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon
                className={cn("h-4 w-4 shrink-0", active && "text-primary")}
                strokeWidth={1.5}
                aria-hidden
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sync status */}
      <div className="border-t border-border p-3">
        <div className="rounded border border-border bg-background p-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
              <Circle className="h-1.5 w-1.5 fill-emerald-500 text-emerald-500" aria-hidden />
              QCO Sync: Live
            </span>
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums">v2.4.1</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground tabular-nums">
            Last sync 04:30 IST · 24,318 records
          </p>
        </div>
      </div>
    </aside>
  );
}
