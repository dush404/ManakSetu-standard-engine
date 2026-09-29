import {
  LayoutDashboard,
  Table2,
  Workflow,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";

export const NAV_ITEMS: {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
}[] = [
  {
    href: "/",
    label: "Dashboard",
    short: "Home",
    icon: LayoutDashboard,
    match: (p) => p === "/",
  },
  {
    href: "/recommend",
    label: "Recommendation Engine",
    short: "Recommend",
    icon: Workflow,
    match: (p) => p.startsWith("/recommend"),
  },
  {
    href: "/standards",
    label: "Standards Explorer",
    short: "Standards",
    icon: Table2,
    match: (p) => p.startsWith("/standards"),
  },
  {
    href: "/report/TND-2025-0907",
    label: "Audit Reports",
    short: "Reports",
    icon: ClipboardCheck,
    match: (p) => p.startsWith("/report"),
  },
];

export function pageTitle(path: string): string {
  if (path === "/") return "Intelligence Dashboard";
  if (path.startsWith("/recommend")) return "Recommendation Engine";
  if (path.startsWith("/standards")) return "Standard Explorer";
  if (path.startsWith("/report")) return "Audit Report";
  return "MANAKSETU";
}
