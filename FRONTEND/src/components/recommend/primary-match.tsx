"use client";

import { Check, Copy, FileCheck2 } from "lucide-react";
import { useState } from "react";
import { StatusPill } from "@/components/shared/status-pill";
import { Button } from "@/components/ui/button";
import type { PrimaryMatch } from "@/lib/types";

export function PrimaryMatchCard({ primary }: { primary: PrimaryMatch }) {
  const [copied, setCopied] = useState(false);

  const copyClauses = async () => {
    try {
      await navigator.clipboard.writeText(clauseText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const clauseText = `Primary standard: ${primary.isNumber} (${primary.version}, ${primary.amendment}). Certification: ${primary.certStatus} under ${primary.qcoRef}.`;

  return (
    <section
      aria-label="Primary match"
      className="rounded border border-border bg-white"
    >
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-primary" strokeWidth={1.5} aria-hidden />
          <h2 className="text-sm font-semibold text-foreground">Primary Match</h2>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
          Confidence {primary.confidence}%
        </span>
      </header>

      <div className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-2xl font-semibold tracking-tight text-foreground tabular-nums">
              {primary.isNumber}
            </p>
            <p className="mt-1 max-w-xl text-[13px] leading-5 text-muted-foreground">
              {primary.title}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {primary.version}
              </span>
              <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 tabular-nums">
                {primary.amendment}
              </span>
              <StatusPill
                tone={primary.certStatus === "Mandatory" ? "pass" : "neutral"}
                label={primary.certStatus}
              />
            </div>
          </div>

          {/* Confidence meter */}
          <div className="w-full shrink-0 md:w-40">
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={primary.confidence}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Match confidence"
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${primary.confidence}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
              {primary.matchReason}
            </p>
          </div>
        </div>

        {/* Spec table */}
        <dl className="mt-4 grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded border border-border md:grid-cols-4">
          {primary.spec.map((s) => (
            <div key={s.label} className="bg-white px-3 py-2">
              <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {s.label}
              </dt>
              <dd className="mt-0.5 text-[13px] font-semibold text-foreground tabular-nums">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] leading-4 text-muted-foreground">
            Certification required: <span className="font-medium text-foreground">{primary.qcoRef}</span>
          </p>
          <Button
            variant="ghost"
            onClick={copyClauses}
            className="h-7 shrink-0 self-start rounded px-2 text-[11px] text-muted-foreground md:self-auto"
          >
            {copied ? (
              <>
                <Check className="mr-1 h-3 w-3 text-emerald-600" strokeWidth={1.5} aria-hidden />
                Copied summary
              </>
            ) : (
              <>
                <Copy className="mr-1 h-3 w-3" strokeWidth={1.5} aria-hidden />
                Copy match summary
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
