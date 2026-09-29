"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MousePointerClick,
  Network,
  Plus,
  Minus,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GraphCanvas, GraphLegend, type GraphCanvasHandle } from "./graph-canvas";
import { NodeDetailsPanel } from "./node-details";
import { cn } from "@/lib/utils";
import type { GraphData, GraphNode, GraphNodeGroup } from "@/lib/types";

const INDEX_GROUPS: { key: GraphNodeGroup; label: string }[] = [
  { key: "primary", label: "Primary match" },
  { key: "normative", label: "Normative references" },
  { key: "test", label: "Test methods" },
  { key: "related", label: "Related codes" },
  { key: "amendment", label: "Amendments" },
];

/**
 * Full-screen expanded graph connection view.
 * Left: the complete force-directed graph with zoom + connection emphasis.
 * Right: persistent details panel — clicking any node inspects it here
 * (never opens the inline drawer). Selecting a linked standard inside the
 * panel walks the graph to that node.
 */
export function ExpandedGraph({
  data,
  initialSelectedId,
  onClose,
  onSyncSelection,
}: {
  data: GraphData;
  initialSelectedId: string | null;
  onClose: () => void;
  /** Called with the last inspected node so the inline graph keeps its highlight. */
  onSyncSelection: (node: GraphNode | null) => void;
}) {
  const canvasRef = useRef<GraphCanvasHandle>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [zoom, setZoom] = useState(1);
  const [active, setActive] = useState<GraphNode | null>(
    () => data.nodes.find((n) => n.id === initialSelectedId) ?? null,
  );

  const handleClose = () => {
    onSyncSelection(active);
    onClose();
  };
  // Keep a stable Esc handler that always closes over the latest active node
  const handleCloseRef = useRef(handleClose);
  useEffect(() => {
    handleCloseRef.current = handleClose;
  });

  // Esc closes · body scroll locked · initial focus on the close button
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Portal to <body>: ancestors carry a persistent animation transform
  // (FadeUp fill-mode), which would otherwise become the containing block
  // for `fixed inset-0` and confine the overlay to the graph card.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Expanded allied standards graph view"
      className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* Header */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-white px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <Network
            className="h-4 w-4 shrink-0 text-primary"
            strokeWidth={1.5}
            aria-hidden
          />
          <h2 className="truncate text-sm font-semibold text-foreground">
            Allied Standards Graph
          </h2>
          <p className="hidden shrink-0 text-xs text-muted-foreground tabular-nums sm:block">
            · {data.nodes.length} nodes · {data.edges.length} connections
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="mr-1 hidden text-[11px] text-muted-foreground tabular-nums md:block"
            aria-live="polite"
          >
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded"
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.15).toFixed(2)))}
          >
            <Minus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded"
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.15).toFixed(2)))}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded"
            aria-label="Reset layout and zoom"
            onClick={() => {
              setZoom(1);
              canvasRef.current?.restart();
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </Button>
          <div className="mx-1.5 h-5 w-px bg-border" aria-hidden />
          <Button
            ref={closeRef}
            variant="outline"
            size="sm"
            className="h-7 rounded px-2.5 text-xs"
            onClick={handleClose}
          >
            <X className="mr-1 h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Close
            <span className="ml-1.5 hidden rounded border border-border bg-secondary px-1 font-mono text-[10px] text-muted-foreground lg:inline">
              Esc
            </span>
          </Button>
        </div>
      </header>

      {/* Body: complete graph left · persistent details right */}
      <div className="flex min-h-0 flex-1">
        {/* Graph column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <GraphCanvas
            ref={canvasRef}
            data={data}
            selectedId={active?.id ?? null}
            onSelect={setActive}
            zoom={zoom}
            className="min-h-0 flex-1"
            ariaLabel="Expanded allied standards relationship graph — click a node to inspect it in the side panel"
          />
          <GraphLegend />
        </div>

        {/* Details panel */}
        <aside
          aria-label="Node details"
          className="flex w-[280px] shrink-0 flex-col border-l border-border bg-white lg:w-[340px]"
        >
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {active ? "Node details" : "All nodes"}
              <span className="ml-1.5 font-normal normal-case tracking-normal tabular-nums">
                {active
                  ? `· ${data.edges.filter((e) => e.source === active.id || e.target === active.id).length} connections`
                  : `· ${data.nodes.length}`}
              </span>
            </p>
            {active && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded"
                aria-label="Back to full node index"
                onClick={() => setActive(null)}
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              </Button>
            )}
          </div>

          {active ? (
            <NodeDetailsPanel
              key={active.id}
              node={active}
              graph={data}
              onNavigateNode={setActive}
              className="animate-fade-up min-h-0 flex-1"
            />
          ) : (
            <div className="thin-scroll min-h-0 flex-1 overflow-y-auto">
              {/* Empty state */}
              <div className="flex flex-col items-center gap-2 border-b border-border px-6 py-7 text-center">
                <MousePointerClick
                  className="h-5 w-5 text-muted-foreground"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <p className="text-[13px] font-medium text-foreground">
                  Select any node to inspect it
                </p>
                <p className="text-xs leading-5 text-muted-foreground">
                  Click a node in the graph — or pick one below — to see its
                  role, scope, parameters and every direct connection here.
                </p>
              </div>

              {/* Full node index */}
              <div className="divide-y divide-border pb-4">
                {INDEX_GROUPS.map((g) => {
                  const items = data.nodes.filter((n) => n.group === g.key);
                  if (items.length === 0) return null;
                  return (
                    <div key={g.key} className="pt-1">
                      <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {g.label}
                      </p>
                      {items.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => setActive(n)}
                          aria-label={`${n.isNumber} — ${n.title}`}
                          className={cn(
                            "transition-fast flex w-full items-center gap-2.5 px-4 py-2 text-left hover:bg-secondary/60",
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
                          <span className="shrink-0 font-mono text-xs font-semibold text-foreground tabular-nums">
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
            </div>
          )}
        </aside>
      </div>
    </div>,
    document.body,
  );
}
