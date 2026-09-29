"use client";

import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { ShimmerTable } from "@/components/shared/shimmer";
import type { SortColumn, SortDir, StandardsPage } from "@/lib/types";
import { cn } from "@/lib/utils";

const COLUMNS: { key: SortColumn; label: string; sortable: boolean; className?: string }[] = [
  { key: "isNumber", label: "IS Number", sortable: true, className: "w-36" },
  { key: "title", label: "Title", sortable: true },
  { key: "version", label: "Latest Version", sortable: true, className: "w-36 hidden lg:table-cell" },
  { key: "lastAmended", label: "Last Amended", sortable: true, className: "w-32" },
  { key: "mandatory", label: "Mandatory", sortable: true, className: "w-24 text-center" },
];

async function fetchStandards(params: URLSearchParams): Promise<StandardsPage> {
  const res = await fetch(`/api/standards?${params.toString()}`);
  return res.json();
}

export function StandardsTable({
  filters,
  sort,
  onSort,
  page,
  onPage,
}: {
  filters: URLSearchParams;
  sort: { column: SortColumn; dir: SortDir };
  onSort: (column: SortColumn) => void;
  page: number;
  onPage: (p: number) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const params = new URLSearchParams(filters);
  params.set("sort", sort.column);
  params.set("dir", sort.dir);
  params.set("page", String(page));

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["standards", params.toString()],
    queryFn: () => fetchStandards(params),
    placeholderData: (prev) => prev,
  });

  if (isLoading) {
    return (
      <div className="rounded border border-border bg-white" aria-busy="true">
        <ShimmerTable rows={12} cols={5} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load standards.
      </div>
    );
  }

  const start = (data.page - 1) * data.pageSize + 1;
  const end = Math.min(data.page * data.pageSize, data.total);
  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <section
      aria-label="Standards table"
      className={cn(
        "rounded border border-border bg-white transition-opacity",
        isFetching && "opacity-70",
      )}
    >
      {/* relative: containing block for absolutely-positioned descendants (e.g.
          sr-only helpers) — without it they resolve to the transformed FadeUp
          ancestor and leak horizontal page overflow past the clipper. */}
      <div className="relative overflow-x-auto thin-scroll">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn("px-4 py-2.5 font-medium", c.className)}
                  aria-sort={
                    sort.column === c.key
                      ? sort.dir === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort(c.key)}
                      className={cn(
                        "transition-fast inline-flex items-center gap-1 uppercase tracking-wider hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                        sort.column === c.key && "text-foreground",
                      )}
                      aria-label={`Sort by ${c.label}`}
                    >
                      {c.label}
                      {sort.column === c.key ? (
                        sort.dir === "asc" ? (
                          <ArrowUp className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                        ) : (
                          <ArrowDown className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-40" strokeWidth={1.5} aria-hidden />
                      )}
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
              <th scope="col" className="w-12 px-4 py-2.5">
                <span className="sr-only">Expand row</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.rows.map((s) => {
              const expanded = expandedId === s.id;
              return (
                <Fragment key={s.id}>
                  <tr
                    className={cn(
                      "transition-fast cursor-pointer hover:bg-secondary/60",
                      expanded && "bg-accent/60",
                    )}
                    onClick={() => setExpandedId(expanded ? null : s.id)}
                    aria-expanded={expanded}
                  >
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground tabular-nums">
                      {s.isNumber}
                    </td>
                    <td className="max-w-[380px] px-4 py-2.5">
                      <p className="truncate text-foreground" title={s.title}>
                        {s.title}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">{s.sector}</p>
                    </td>
                    <td className="hidden px-4 py-2.5 text-muted-foreground lg:table-cell">
                      {s.version}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground tabular-nums">
                      {s.lastAmended}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {s.mandatory ? (
                        <span
                          className="inline-flex h-5 w-5 items-center justify-center rounded bg-emerald-50"
                          role="img"
                          aria-label="Mandatory certification"
                        >
                          <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={1.5} aria-hidden />
                        </span>
                      ) : (
                        <span
                          className="inline-flex h-5 w-5 items-center justify-center rounded bg-gray-100"
                          role="img"
                          aria-label="Voluntary certification"
                        >
                          <X className="h-3.5 w-3.5 text-gray-400" strokeWidth={1.5} aria-hidden />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className={cn(
                          "transition-fast inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground",
                          expanded && "bg-background text-primary",
                        )}
                      >
                        {expanded ? (
                          <ChevronDown className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                        ) : (
                          <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                        )}
                      </span>
                    </td>
                  </tr>

                  {/* Inline expansion — normative references as linked chips */}
                  {expanded && (
                    <tr className="bg-secondary/30">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Scope
                            </p>
                            <p className="mt-1 max-w-2xl text-xs leading-5 text-foreground">
                              {s.scope}
                            </p>
                            <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Normative references
                            </p>
                            <ul className="mt-1.5 flex flex-wrap gap-1.5">
                              {s.normativeRefs.map((r) => (
                                <li key={r}>
                                  <a
                                    href={`/standards?q=${encodeURIComponent(r)}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="transition-fast inline-block rounded-full border border-blue-200 bg-[#EFF6FF] px-2 py-0.5 font-mono text-[11px] font-medium text-[#1D4ED8] tabular-nums hover:bg-accent"
                                  >
                                    {r}
                                  </a>
                                </li>
                              ))}
                              {s.normativeRefs.length === 0 && (
                                <li className="text-xs text-muted-foreground">None listed</li>
                              )}
                            </ul>
                          </div>
                          <dl className="space-y-2 rounded border border-border bg-white p-3 text-xs">
                            <div className="flex justify-between gap-2">
                              <dt className="text-muted-foreground">Certification</dt>
                              <dd className="font-medium text-foreground">{s.certType}</dd>
                            </div>
                            <div className="flex justify-between gap-2">
                              <dt className="text-muted-foreground">Status</dt>
                              <dd
                                className={cn(
                                  "font-medium",
                                  s.status === "Active" && "text-emerald-600",
                                  s.status === "Withdrawn" && "text-red-600",
                                  s.status === "Under Revision" && "text-amber-600",
                                )}
                              >
                                {s.status}
                              </dd>
                            </div>
                            <div className="flex justify-between gap-2">
                              <dt className="text-muted-foreground">ICS</dt>
                              <dd className="font-medium text-foreground tabular-nums">{s.ics}</dd>
                            </div>
                            {s.qcoRef && (
                              <div>
                                <dt className="text-muted-foreground">QCO coverage</dt>
                                <dd className="mt-0.5 text-[11px] leading-4 font-medium text-foreground">
                                  {s.qcoRef}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Minimal pagination */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <p className="text-[11px] text-muted-foreground tabular-nums" aria-live="polite">
          Showing {start}–{end} of {data.total.toLocaleString("en-IN")}
          {isFetching && (
            <span className="shimmer ml-2 inline-block h-2 w-10 rounded align-middle" aria-hidden />
          )}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={data.page <= 1}
            onClick={() => onPage(data.page - 1)}
            aria-label="Previous page"
            className="transition-fast inline-flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4 rotate-180" strokeWidth={1.5} aria-hidden />
          </button>
          <span className="px-1 text-[11px] text-muted-foreground tabular-nums">
            {data.page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={data.page >= totalPages}
            onClick={() => onPage(data.page + 1)}
            aria-label="Next page"
            className="transition-fast inline-flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
