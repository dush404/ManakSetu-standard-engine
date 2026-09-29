"use client";

import { useQuery } from "@tanstack/react-query";
import { Shimmer } from "@/components/shared/shimmer";
import { Reveal } from "@/components/shared/reveal";
import type { StandardUpdate, UpdateSeverity } from "@/lib/types";
import { cn } from "@/lib/utils";

async function fetchUpdates(): Promise<StandardUpdate[]> {
  const res = await fetch("/api/updates");
  return res.json();
}

const SEVERITY_BORDER: Record<UpdateSeverity, string> = {
  mandatory: "border-l-red-500",
  amendment: "border-l-amber-500",
  inclusion: "border-l-emerald-500",
  draft: "border-l-gray-400",
};

const SEVERITY_LABEL: Record<UpdateSeverity, string> = {
  mandatory: "Mandatory",
  amendment: "Amendment",
  inclusion: "Inclusion",
  draft: "Draft",
};

const SEVERITY_TEXT: Record<UpdateSeverity, string> = {
  mandatory: "text-red-600",
  amendment: "text-amber-600",
  inclusion: "text-emerald-600",
  draft: "text-gray-500",
};

function FeedSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading updates">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2 border-l-2 border-l-border pl-3">
          <div className="flex items-center gap-2">
            <Shimmer className="h-3 w-12" />
            <Shimmer className="h-3 w-20" />
          </div>
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function UpdatesFeed() {
  const { data, isLoading } = useQuery({ queryKey: ["updates"], queryFn: fetchUpdates });

  return (
    <Reveal>
      <section
        aria-label="Standard updates feed"
        className="rounded border border-border bg-white"
      >
        <header className="border-b border-border p-4">
          <h2 className="text-sm font-semibold text-foreground">Standard Updates</h2>
          <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
            Latest BIS amendments · 7 new
          </p>
        </header>

        <div className="max-h-[560px] space-y-1 overflow-y-auto p-3 thin-scroll">
          {isLoading && <FeedSkeleton />}
          {data?.map((u) => (
            <article
              key={u.id}
              className={cn(
                "rounded border border-l-2 border-border p-3 transition-fast hover:bg-secondary/50",
                SEVERITY_BORDER[u.severity],
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-muted-foreground">
                    {u.tag}
                  </span>
                  <span className="text-xs font-semibold text-foreground tabular-nums">
                    {u.ref}
                  </span>
                </div>
                <span className={cn("text-[10px] font-medium", SEVERITY_TEXT[u.severity])}>
                  {SEVERITY_LABEL[u.severity]}
                </span>
              </div>
              <p className="mt-2 text-[13px] font-medium leading-5 text-foreground">{u.title}</p>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{u.summary}</p>
              <p className="mt-2 text-[10px] text-muted-foreground tabular-nums">{u.date}</p>
            </article>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
