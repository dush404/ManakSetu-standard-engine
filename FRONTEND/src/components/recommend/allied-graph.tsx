"use client";

import { forwardRef, useRef, useState } from "react";
import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import type { GraphData, GraphNode, GraphNodeGroup } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { GraphCanvas, GraphLegend, type GraphCanvasHandle } from "./graph-canvas";
import { ExpandedGraph } from "./expanded-graph";
import { cn } from "@/lib/utils";

/**
 * Inline allied standards graph card body (desktop ≥768px).
 * The toolbar hosts zoom controls and the expand trigger — expanding opens
 * a full-screen connection view where node clicks render details in a
 * persistent right-hand panel instead of the inline drawer.
 */
export const AlliedGraph = forwardRef<
  HTMLDivElement,
  {
    data: GraphData;
    selectedId: string | null;
    onSelect: (node: GraphNode) => void;
    /** Syncs the last node inspected in the expanded view (no drawer opens). */
    onSyncSelection?: (node: GraphNode | null) => void;
  }
>(function AlliedGraph({ data, selectedId, onSelect, onSyncSelection }, ref) {
  const canvasRef = useRef<GraphCanvasHandle>(null);
  const [zoom, setZoom] = useState(1);
  const [expanded, setExpanded] = useState(false);

  return (
    <div ref={ref}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 pt-3">
        <p className="text-xs text-muted-foreground tabular-nums">
          {data.nodes.length} nodes · {data.edges.length} relationships · click a node for details
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded"
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded"
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.15).toFixed(2)))}
          >
            <Minus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded"
            aria-label="Reset layout"
            onClick={() => {
              setZoom(1);
              canvasRef.current?.restart();
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </Button>
          <div className="mx-1 h-5 w-px bg-border" aria-hidden />
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded px-2.5 text-xs"
            aria-label="Expand graph to full-screen connection view"
            aria-expanded={expanded}
            onClick={() => setExpanded(true)}
          >
            <Maximize2 className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Expand
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <GraphCanvas
        ref={canvasRef}
        data={data}
        selectedId={selectedId}
        onSelect={onSelect}
        zoom={zoom}
        className="h-[440px]"
      />

      {/* Legend */}
      <GraphLegend />

      {/* Expanded full-screen connection view */}
      {expanded && (
        <ExpandedGraph
          data={data}
          initialSelectedId={selectedId}
          onClose={() => setExpanded(false)}
          onSyncSelection={(node) => onSyncSelection?.(node)}
        />
      )}
    </div>
  );
});

// ── Mobile: vertical list (graph collapses on <768px) ────────
export function AlliedList({
  data,
  selectedId,
  onSelect,
}: {
  data: GraphData;
  selectedId: string | null;
  onSelect: (node: GraphNode) => void;
}) {
  const groups: { key: GraphNodeGroup; label: string }[] = [
    { key: "primary", label: "Primary match" },
    { key: "normative", label: "Normative references" },
    { key: "test", label: "Test methods" },
    { key: "related", label: "Related codes" },
    { key: "amendment", label: "Amendments" },
  ];

  return (
    <div className="divide-y divide-border">
      {groups.map((g) => {
        const items = data.nodes.filter((n) => n.group === g.key);
        if (items.length === 0) return null;
        return (
          <div key={g.key} className="py-1">
            <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {g.label}
            </p>
            {items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => onSelect(n)}
                aria-label={`${n.isNumber} — ${n.title}`}
                className={cn(
                  "transition-fast flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-secondary/60",
                  selectedId === n.id && "bg-accent",
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    n.group === "primary" && "bg-primary",
                    n.group === "normative" && "bg-primary/50",
                    n.group === "test" && "bg-emerald-500",
                    n.group === "related" && "bg-gray-400",
                    n.group === "amendment" && "bg-amber-500",
                  )}
                  aria-hidden
                />
                <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
                  {n.isNumber}
                </span>
                <span className="ml-auto truncate text-[11px] text-muted-foreground">
                  {n.shortLabel}
                </span>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
