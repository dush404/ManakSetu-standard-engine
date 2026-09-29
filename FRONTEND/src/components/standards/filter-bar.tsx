"use client";

import { useState } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export interface FilterState {
  sector: string;
  status: string;
  cert: string;
  mandatory: string;
  yearFrom: number;
  yearTo: number;
  q: string;
}

export const DEFAULT_FILTERS: FilterState = {
  sector: "all",
  status: "all",
  cert: "all",
  mandatory: "all",
  yearFrom: 1985,
  yearTo: 2025,
  q: "",
};

export function FilterBar({
  filters,
  sectors,
  onChange,
  activeCount,
  draftRange,
  onDraftRange,
}: {
  filters: FilterState;
  sectors: string[];
  onChange: (f: FilterState) => void;
  activeCount: number;
  draftRange: [number, number];
  onDraftRange: (r: [number, number]) => void;
}) {
  const set = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });

  return (
    <section
      aria-label="Filters"
      className="rounded border border-border bg-white"
    >
      <div className="flex flex-wrap items-end gap-3 p-4">
        <p className="mr-1 flex items-center gap-1.5 self-center text-xs font-semibold text-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground tabular-nums">
              {activeCount}
            </span>
          )}
        </p>

        {/* Sector */}
        <div className="w-full sm:w-44">
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Sector
          </label>
          <Select value={filters.sector} onValueChange={(v) => set({ sector: v, })}>
            <SelectTrigger size="sm" className="w-full rounded" aria-label="Filter by sector">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded max-h-64 thin-scroll">
              <SelectItem value="all">All sectors</SelectItem>
              {sectors.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="w-full sm:w-36">
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Status
          </label>
          <Select value={filters.status} onValueChange={(v) => set({ status: v })}>
            <SelectTrigger size="sm" className="w-full rounded" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded">
              <SelectItem value="all">Any status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Withdrawn">Withdrawn</SelectItem>
              <SelectItem value="Under Revision">Under Revision</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Certification type */}
        <div className="w-full sm:w-36">
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Certification
          </label>
          <Select value={filters.cert} onValueChange={(v) => set({ cert: v })}>
            <SelectTrigger size="sm" className="w-full rounded" aria-label="Filter by certification type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded">
              <SelectItem value="all">Any type</SelectItem>
              <SelectItem value="ISI Mark">ISI Mark</SelectItem>
              <SelectItem value="CRS">CRS</SelectItem>
              <SelectItem value="Hallmark">Hallmark</SelectItem>
              <SelectItem value="Eco Mark">Eco Mark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mandatory */}
        <div className="w-full sm:w-32">
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Mandatory
          </label>
          <Select value={filters.mandatory} onValueChange={(v) => set({ mandatory: v })}>
            <SelectTrigger size="sm" className="w-full rounded" aria-label="Filter by mandatory certification">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Year range slider */}
        <div className="w-full sm:min-w-48 sm:flex-1">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Year range
            </label>
            <span className="text-[11px] font-medium text-foreground tabular-nums">
              {draftRange[0]} – {draftRange[1]}
            </span>
          </div>
          <Slider
            min={1985}
            max={2025}
            step={1}
            value={draftRange}
            aria-label="Year range"
            onValueCommit={([a, b]) => set({ yearFrom: a, yearTo: b })}
            onValueChange={([a, b]) => onDraftRange([a, b])}
            className="[&_[role=slider]]:h-3.5 [&_[role=slider]]:w-3.5 [&_[role=slider]]:rounded-sm [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-white"
          />
        </div>

        {/* Clear */}
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded text-xs text-muted-foreground"
            onClick={() => onChange({ ...DEFAULT_FILTERS, q: filters.q })}
          >
            <RotateCcw className="mr-1.5 h-3 w-3" strokeWidth={1.5} aria-hidden />
            Clear
          </Button>
        )}
      </div>
    </section>
  );
}
