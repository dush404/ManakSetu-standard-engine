"use client";

import { CheckCircle2 } from "lucide-react";
import { PrimaryMatchCard } from "./primary-match";
import { AlliedGraph, AlliedList } from "./allied-graph";
import { GapAnalysis } from "./gap-analysis";
import { FadeUp } from "@/components/shared/fade-up";
import { useMediaQuery } from "@/lib/hooks";
import type { RecommendResponse } from "@/lib/types";

export function OutputPanel({
  result,
  selectedId,
  onSelectNode,
  onSyncSelection,
}: {
  result: RecommendResponse;
  selectedId: string | null;
  onSelectNode: (node: import("@/lib/types").GraphNode) => void;
  onSyncSelection: (node: import("@/lib/types").GraphNode | null) => void;
}) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className="space-y-4" aria-live="polite">
      {/* Completion status line */}
      <FadeUp index={0}>
        <div className="flex flex-wrap items-center gap-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={1.5} aria-hidden />
          <p className="text-xs font-medium text-emerald-800">
            Analysis complete
          </p>
          <p className="text-[11px] text-emerald-700 tabular-nums">
            · {result.traversed} standards traversed · {result.elapsedMs.toLocaleString("en-IN")} ms ·{" "}
            {result.generatedAt}
          </p>
        </div>
      </FadeUp>

      <FadeUp index={1}>
        <div id="analysis-primary" className="scroll-mt-24">
          <PrimaryMatchCard primary={result.primary} />
        </div>
      </FadeUp>

      <FadeUp index={2}>
        <section
          id="analysis-graph"
          aria-label="Allied standards graph"
          className="scroll-mt-24 rounded border border-border bg-white"
        >
          <header className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Allied Standards Graph</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Force-directed traverse of normative refs, test methods and amendments.
            </p>
          </header>
          {isMobile ? (
            <AlliedList data={result.graph} selectedId={selectedId} onSelect={onSelectNode} />
          ) : (
            <AlliedGraph
              data={result.graph}
              selectedId={selectedId}
              onSelect={onSelectNode}
              onSyncSelection={onSyncSelection}
            />
          )}
        </section>
      </FadeUp>

      <FadeUp index={3}>
        <div id="analysis-gaps" className="scroll-mt-24">
          <GapAnalysis gaps={result.gaps} />
        </div>
      </FadeUp>
    </div>
  );
}

export function OutputPlaceholder() {
  return (
    <div
      className="flex h-full min-h-[420px] flex-col items-center justify-center rounded border border-dashed border-border bg-white/60 p-8 text-center"
      aria-hidden
    >
      <div className="w-full max-w-sm space-y-3">
        <div className="mx-auto h-3 w-2/3 rounded bg-secondary" />
        <div className="mx-auto h-3 w-1/2 rounded bg-secondary" />
        <div className="mx-auto mt-8 h-28 w-full rounded border border-border bg-secondary/40" />
        <div className="mx-auto h-3 w-3/4 rounded bg-secondary" />
        <div className="mx-auto h-3 w-2/3 rounded bg-secondary" />
      </div>
      <p className="mt-8 max-w-xs text-xs leading-5 text-muted-foreground">
        Submit a specification to see the primary match, allied standards graph and
        clause-level gap analysis here.
      </p>
    </div>
  );
}
