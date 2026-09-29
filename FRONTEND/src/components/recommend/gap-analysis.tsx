"use client";

import { useState } from "react";
import { AlertTriangle, CircleAlert } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Gap } from "@/lib/types";

export function GapAnalysis({ gaps }: { gaps: Gap[] }) {
  const critical = gaps.filter((g) => g.severity === "critical").length;
  const recommended = gaps.length - critical;

  return (
    <section
      aria-label="Gap analysis"
      className="rounded border border-border bg-white"
    >
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Gap Analysis</h2>
        <p className="flex items-center gap-3 text-[11px] font-medium">
          <span className="flex items-center gap-1.5 text-red-600">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden />
            {critical} critical
          </span>
          <span className="flex items-center gap-1.5 text-amber-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
            {recommended} recommended
          </span>
        </p>
      </header>

      <Accordion type="single" collapsible className="w-full">
        {gaps.map((g) => (
          <AccordionItem
            key={g.id}
            value={g.id}
            className="border-b border-border last:border-0"
          >
            <AccordionTrigger className="min-w-0 px-4 py-3 text-left hover:no-underline hover:bg-secondary/40">
              <span className="flex min-w-0 flex-1 items-center gap-2.5 pr-3">
                {g.severity === "critical" ? (
                  <CircleAlert className="h-4 w-4 shrink-0 text-red-500" strokeWidth={1.5} aria-hidden />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" strokeWidth={1.5} aria-hidden />
                )}
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground tabular-nums">
                    {g.clause}
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] font-medium text-foreground">
                    {g.title}
                  </span>
                </span>
                <span
                  className={`ml-auto shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                    g.severity === "critical"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  {g.severity === "critical" ? "Critical" : "Recommended"}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-[13px] leading-5 text-foreground">{g.detail}</p>
              <div className="mt-3 rounded border border-border bg-secondary/50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Suggested clause language
                </p>
                <p className="mt-1 font-mono text-xs leading-5 text-foreground">{g.suggestion}</p>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Reference:{" "}
                <span className="font-mono font-medium text-foreground tabular-nums">
                  {g.standardRef}
                </span>
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
