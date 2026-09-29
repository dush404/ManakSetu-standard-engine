"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FilterBar, DEFAULT_FILTERS, type FilterState } from "@/components/standards/filter-bar";
import { StandardsTable } from "@/components/standards/standards-table";
import { FadeUp } from "@/components/shared/fade-up";
import { SECTORS } from "@/lib/mock-data";
import type { SortColumn, SortDir } from "@/lib/types";

function StandardsExplorer() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS, q: initialQ });
  const [draftRange, setDraftRange] = useState<[number, number]>([
    DEFAULT_FILTERS.yearFrom,
    DEFAULT_FILTERS.yearTo,
  ]);
  const [sort, setSort] = useState<{ column: SortColumn; dir: SortDir }>({
    column: "isNumber",
    dir: "asc",
  });
  const [page, setPage] = useState(1);

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.sector !== "all") n++;
    if (filters.status !== "all") n++;
    if (filters.cert !== "all") n++;
    if (filters.mandatory !== "all") n++;
    if (filters.yearFrom !== DEFAULT_FILTERS.yearFrom || filters.yearTo !== DEFAULT_FILTERS.yearTo)
      n++;
    if (filters.q) n++;
    return n;
  }, [filters]);

  const applyFilters = (f: FilterState) => {
    setFilters(f);
    setPage(1);
    setDraftRange([f.yearFrom, f.yearTo]);
  };

  const handleSort = (column: SortColumn) => {
    setSort((s) =>
      s.column === column
        ? { column, dir: s.dir === "asc" ? "desc" : "asc" }
        : { column, dir: "asc" },
    );
    setPage(1);
  };

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.sector !== "all") p.set("sector", filters.sector);
    if (filters.status !== "all") p.set("status", filters.status);
    if (filters.cert !== "all") p.set("cert", filters.cert);
    if (filters.mandatory !== "all") p.set("mandatory", filters.mandatory);
    if (filters.yearFrom !== DEFAULT_FILTERS.yearFrom) p.set("yearFrom", String(filters.yearFrom));
    if (filters.yearTo !== DEFAULT_FILTERS.yearTo) p.set("yearTo", String(filters.yearTo));
    if (filters.q) p.set("q", filters.q);
    return p;
  }, [filters]);

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4">
      <FadeUp index={0}>
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Standard Explorer
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            24,000+ indexed Indian Standards with amendment lineage and QCO coverage. Click a row
            to expand normative references.
          </p>
        </div>
      </FadeUp>

      <FadeUp index={1}>
        <FilterBar
          filters={filters}
          sectors={[...SECTORS]}
          onChange={applyFilters}
          activeCount={activeCount}
          draftRange={draftRange}
          onDraftRange={setDraftRange}
        />
      </FadeUp>

      <FadeUp index={2}>
        <StandardsTable
          filters={params}
          sort={sort}
          onSort={handleSort}
          page={page}
          onPage={setPage}
        />
      </FadeUp>
    </div>
  );
}

export default function StandardsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1400px] space-y-4" aria-busy="true">
          <div className="shimmer h-8 w-64 rounded" />
          <div className="shimmer h-20 rounded" />
          <div className="shimmer h-96 rounded" />
        </div>
      }
    >
      <StandardsExplorer />
    </Suspense>
  );
}
