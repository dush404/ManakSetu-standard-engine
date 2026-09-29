"use client";

import { Fragment } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ComplianceRing } from "./compliance-ring";
import { ExportActions } from "./export-actions";
import { GapAnalysis } from "@/components/recommend/gap-analysis";
import { StatusPill, riskTone } from "@/components/shared/status-pill";
import { Shimmer } from "@/components/shared/shimmer";
import { FadeUp } from "@/components/shared/fade-up";
import type { AuditReport, ReportSection } from "@/lib/types";

// Wrap IS-number key terms with subtle highlight (#EFF6FF)
function highlightTerms(text: string): React.ReactNode {
  const parts = text.split(/(IS\s?\d+(?:-\d+)?(?::\d{4})?|Amd\s?\d+(?:\s·\s?\d{4})?)/g);
  return parts.map((p, i) =>
    /^(IS\s?\d+(?:-\d+)?(?::\d{4})?|Amd\s?\d+(?:\s·\s?\d{4})?)$/.test(p) ? (
      <span key={i} className="term-hl font-mono text-[12px] tabular-nums">
        {p}
      </span>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    ),
  );
}

function Section({ section, index }: { section: ReportSection; index: number }) {
  return (
    <FadeUp index={index} as="section" className="print-break-avoid">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
        {section.heading}
      </h2>
      <div className="mt-2 space-y-3">
        {section.body?.map((b, i) => (
          <p key={i} className="text-[13px] leading-6 text-muted-foreground">
            {highlightTerms(b.text)}
          </p>
        ))}

        {section.specRows && (
          <div className="thin-scroll overflow-x-auto rounded border border-border">
            <table className="w-full min-w-[440px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="px-3 py-2 font-medium">Parameter</th>
                  <th scope="col" className="px-3 py-2 font-medium">Required</th>
                  <th scope="col" className="px-3 py-2 font-medium">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {section.specRows.map((r) => (
                  <tr key={r.parameter}>
                    <td className="px-3 py-2 text-foreground">{r.parameter}</td>
                    <td className="px-3 py-2 font-semibold text-foreground tabular-nums">
                      {r.required}
                    </td>
                    <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground tabular-nums">
                      {r.reference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {section.chips && (
          <ul className="flex flex-wrap gap-1.5">
            {section.chips.map((c) => (
              <li
                key={c.label}
                className="rounded-full border border-blue-200 bg-[#EFF6FF] px-2.5 py-1 font-mono text-[11px] font-medium text-[#1D4ED8] tabular-nums"
              >
                {c.label}
              </li>
            ))}
          </ul>
        )}

        {section.requirements && (
          <ul className="divide-y divide-border rounded border border-border">
            {section.requirements.map((req) => (
              <li key={req.label} className="flex items-start justify-between gap-3 px-3 py-2.5">
                <div>
                  <p className="text-[13px] font-medium text-foreground">{req.label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{req.detail}</p>
                </div>
                <StatusPill
                  tone={req.mandatory ? "pass" : "neutral"}
                  label={req.mandatory ? "Mandatory" : "Optional"}
                  dot={false}
                  className="mt-0.5 shrink-0"
                />
              </li>
            ))}
          </ul>
        )}

        {section.gaps && <GapAnalysis gaps={section.gaps} />}
      </div>
    </FadeUp>
  );
}

export function ReportView({ report }: { report: AuditReport }) {
  return (
    <article className="print-full mx-auto w-full max-w-[800px]">
      <FadeUp index={0} as="div" className="rounded border border-border bg-white">
        {/* Header */}
        <header className="border-b border-border p-6">
          <Link
            href="/"
            className="no-print transition-fast mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Back to dashboard
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary tabular-nums">
                Audit Report · {report.id}
              </p>
              <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">
                {report.product}
              </h1>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                <div className="flex justify-between gap-3 sm:block">
                  <dt className="text-muted-foreground">Purchasing agency</dt>
                  <dd className="font-medium text-foreground sm:mt-0.5">{report.agency}</dd>
                </div>
                <div className="flex justify-between gap-3 sm:block">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium text-foreground sm:mt-0.5">{report.category}</dd>
                </div>
                <div className="flex justify-between gap-3 sm:block">
                  <dt className="text-muted-foreground">Audit date</dt>
                  <dd className="font-medium text-foreground tabular-nums sm:mt-0.5">
                    {report.date}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 sm:block">
                  <dt className="text-muted-foreground">Risk level</dt>
                  <dd className="sm:mt-0.5">
                    <StatusPill tone={riskTone(report.risk)} label={report.risk} />
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Evaluator: {report.evaluator} · {report.standardsAudited} standards ·{" "}
                {report.clausesReviewed} clauses reviewed
              </p>
            </div>

            <div className="shrink-0 self-center lg:self-start">
              <ComplianceRing score={report.score} />
            </div>
          </div>

          {/* Summary */}
          <div className="mt-5 rounded border border-border bg-secondary/40 p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Executive summary
            </p>
            <p className="mt-1 text-[13px] leading-6 text-foreground">
              {highlightTerms(report.summary)}
            </p>
          </div>
        </header>

        {/* Body */}
        <div className="space-y-7 p-6">
          {report.sections.map((s, i) => (
            <Section key={s.id} section={s} index={i + 1} />
          ))}

          {/* Tender clauses preview */}
          <section className="print-break-avoid">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Draft Tender Clauses
            </h2>
            <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
              Ready-to-insert clause language generated from this audit. Use the copy action below
              to lift it into your tender document.
            </p>
            <pre className="mt-3 overflow-x-auto rounded border border-border bg-secondary/40 p-4 font-mono text-[11px] leading-5 text-foreground thin-scroll">
              {report.tenderClauses}
            </pre>
          </section>
        </div>

        <ExportActions report={report} />
      </FadeUp>
    </article>
  );
}

export function ReportSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[800px]" aria-busy="true">
      <div className="rounded border border-border bg-white p-6">
        <Shimmer className="h-3 w-40" />
        <Shimmer className="mt-3 h-6 w-3/4" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-4/5" />
          <Shimmer className="h-3 w-3/5" />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-5/6" />
          </div>
          <Shimmer className="ml-6 h-32 w-32 rounded-full" />
        </div>
        <div className="mt-8 space-y-2.5">
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}
