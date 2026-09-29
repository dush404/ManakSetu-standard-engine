"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Network, Search, Bell, ChevronDown, Circle, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/lib/store";
import { pageTitle } from "@/lib/nav";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function TopBar() {
  const pathname = usePathname();
  const setPaletteOpen = useUIStore((s) => s.setPaletteOpen);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unread = notifs.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-white px-4 md:px-6">
      {/* Mobile logo */}
      <Link href="/" className="flex items-center gap-2 md:hidden" aria-label="BIS-Graph home">
        <span className="flex h-7 w-7 items-center justify-center rounded bg-primary">
          <Network className="h-4 w-4 text-primary-foreground" strokeWidth={1.5} aria-hidden />
        </span>
        <span className="text-sm font-semibold tracking-tight">BIS-Graph</span>
      </Link>

      <h1 className="hidden text-sm font-semibold tracking-tight text-foreground md:block">
        {pageTitle(pathname)}
      </h1>

      {/* Global search trigger — Cmd+K */}
      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        aria-label="Open command palette (Ctrl+K)"
        className="transition-fast ml-auto flex h-8 w-8 items-center justify-center rounded border border-border bg-background text-muted-foreground hover:bg-secondary md:ml-6 md:h-9 md:w-72 md:justify-start md:gap-2 md:px-3"
      >
        <Search className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
        <span className="hidden text-[13px] md:inline">Search standards, tenders…</span>
        <kbd className="ml-auto hidden rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline-block">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5 md:ml-0">
        {/* Notification bell */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Notifications (${unread} unread)`}
              className="relative h-9 w-9 rounded text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Bell className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              {unread > 0 && (
                <span
                  className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500"
                  aria-hidden
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 max-w-[calc(100vw-2rem)] rounded p-0">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <p className="text-xs font-semibold text-foreground">Notifications</p>
              <button
                type="button"
                onClick={() => setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })))}
                className="transition-fast text-[11px] font-medium text-primary hover:underline"
              >
                Mark all read
              </button>
            </div>
            <ul className="max-h-72 overflow-y-auto thin-scroll">
              {notifs.map((n) => (
                <li
                  key={n.id}
                  className="flex gap-2.5 border-b border-border px-3 py-2.5 last:border-0"
                >
                  <Circle
                    className={cn(
                      "mt-1 h-1.5 w-1.5 shrink-0",
                      n.unread ? "fill-primary text-primary" : "fill-gray-300 text-gray-300",
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">{n.title}</p>
                    <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{n.body}</p>
                  </div>
                  <span className="ml-auto shrink-0 text-[10px] text-muted-foreground tabular-nums">
                    {n.date}
                  </span>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              aria-label="User profile menu"
              className="h-9 gap-2 rounded px-2 text-foreground hover:bg-secondary"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded bg-accent text-[10px] font-semibold text-accent-foreground">
                RS
              </span>
              <span className="hidden text-xs font-medium lg:inline">R. Sharma</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded">
            <DropdownMenuLabel>
              <p className="text-xs font-semibold text-foreground">Ramesh Sharma</p>
              <p className="text-[11px] font-normal text-muted-foreground">
                r.sharma@ndmc.gov.in
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs">
              <User className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              <Settings className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs">
              <LogOut className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
