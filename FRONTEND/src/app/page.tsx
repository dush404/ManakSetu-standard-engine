"use client";

import { KpiRow } from "@/components/dashboard/kpi-row";
import { AuditsTable } from "@/components/dashboard/audits-table";
import { UpdatesFeed } from "@/components/dashboard/updates-feed";
import { FadeUp } from "@/components/shared/fade-up";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4">
      <KpiRow />

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <AuditsTable />
        <UpdatesFeed />
      </div>

      <FadeUp index={5} className="hidden xl:block">
        <p className="px-1 text-[11px] text-muted-foreground">
          Risk levels are derived from gap density, certification coverage and amendment recency
          across the audited specification graph.
        </p>
      </FadeUp>
    </div>
  );
}
