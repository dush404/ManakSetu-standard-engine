"use client";

import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Sparkline } from "@/components/shared/sparkline";
import { Shimmer } from "@/components/shared/shimmer";
import { FadeUp } from "@/components/shared/fade-up";
import type { Kpi } from "@/lib/types";
import { cn } from "@/lib/utils";

async function fetchKpis(): Promise<Kpi[]> {
  const res = await fetch("/api/kpis");
  return res.json();
}

function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  return (
    <FadeUp index={index}>
      <div className="flex items-center justify-between rounded border border-border bg-white p-4">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {kpi.label}
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-foreground tabular-nums">
            {kpi.value}
          </p>
          <p
            className={cn(
              "mt-1 flex items-center gap-1 text-[11px] font-medium tabular-nums",
              kpi.deltaGood ? "text-emerald-600" : "text-red-600",
            )}
          >
            {kpi.deltaDirection === "up" ? (
              <TrendingUp className="h-3 w-3" strokeWidth={1.5} aria-hidden />
            ) : (
              <TrendingDown className="h-3 w-3" strokeWidth={1.5} aria-hidden />
            )}
            {kpi.delta}
            <span className="font-normal text-muted-foreground">vs last month</span>
          </p>
        </div>
        {/* Fluid width below sm so 2-col cards keep room for the KPI text */}
        <Sparkline
          data={kpi.series}
          good={kpi.deltaGood}
          id={kpi.id}
          className="h-auto w-14 sm:w-[84px]"
        />
      </div>
    </FadeUp>
  );
}

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-busy="true" aria-label="Loading KPIs">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded border border-border bg-white p-4">
          <div className="space-y-2.5">
            <Shimmer className="h-2.5 w-24" />
            <Shimmer className="h-6 w-16" />
            <Shimmer className="h-2.5 w-28" />
          </div>
          <Shimmer className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

export function KpiRow() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["kpis"], queryFn: fetchKpis });

  if (isLoading) return <KpiSkeleton />;
  if (isError || !data)
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load KPIs.{" "}
        <button className="font-medium underline" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );

  return (
    <section aria-label="Key performance indicators">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {data.map((kpi, i) => (
          <KpiCard key={kpi.id} kpi={kpi} index={i} />
        ))}
      </div>
    </section>
  );
}
