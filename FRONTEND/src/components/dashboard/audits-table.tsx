"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { StatusPill, riskTone, scoreTone } from "@/components/shared/status-pill";
import { Shimmer, ShimmerTable } from "@/components/shared/shimmer";
import { FadeUp } from "@/components/shared/fade-up";
import type { TenderAudit } from "@/lib/types";
import { cn } from "@/lib/utils";

async function fetchAudits(): Promise<TenderAudit[]> {
  const res = await fetch("/api/audits");
  return res.json();
}

function AuditsSkeleton() {
  return (
    <div className="rounded border border-border bg-white" aria-busy="true">
      <div className="flex items-center justify-between border-b border-border p-4">
        <Shimmer className="h-4 w-44" />
        <Shimmer className="h-4 w-20" />
      </div>
      <ShimmerTable rows={6} cols={5} />
    </div>
  );
}

export function AuditsTable() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["audits"],
    queryFn: fetchAudits,
  });

  if (isLoading) return <AuditsSkeleton />;
  if (isError || !data)
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load tender audits.
      </div>
    );

  return (
    <FadeUp index={4}>
      <section
        aria-label="Recent tender audits"
        className="rounded border border-border bg-white"
      >
        <header className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Recent Tender Audits</h2>
            <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
              6 of 3,207 audits · last 30 days
            </p>
          </div>
          <Link
            href="/standards"
            className="transition-fast text-xs font-medium text-primary hover:underline"
          >
            View explorer
          </Link>
        </header>

        <div className="overflow-x-auto thin-scroll">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-4 py-2.5 font-medium">Tender ID</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Product</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Risk</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Score</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Date</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((a) => (
                <tr key={a.id} className="transition-fast hover:bg-secondary/60">
                  <td className="whitespace-nowrap px-4 py-3">
                    <Link
                      href={`/report/${a.id}`}
                      className="font-medium text-primary tabular-nums hover:underline"
                    >
                      {a.id}
                    </Link>
                  </td>
                  <td className="max-w-[280px] px-4 py-3">
                    <p className="truncate font-medium text-foreground">{a.product}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{a.agency}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill tone={riskTone(a.risk)} label={a.risk} />
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right font-semibold tabular-nums",
                      scoreTone(a.score) === "pass" && "text-emerald-600",
                      scoreTone(a.score) === "warn" && "text-amber-600",
                      scoreTone(a.score) === "fail" && "text-red-600",
                    )}
                  >
                    {a.score}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground tabular-nums">{a.date}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/report/${a.id}`}
                      aria-label={`Open audit report ${a.id}`}
                      className="transition-fast inline-flex h-7 w-7 items-center justify-center rounded border border-transparent text-muted-foreground hover:border-border hover:bg-background hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </FadeUp>
  );
}
