"use client";

import { useState } from "react";
import { Check, ChevronRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/shared/status-pill";
import type { EdgeType, GraphData, GraphNode, GraphNodeGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

const GROUP_LABEL: Record<GraphNodeGroup, string> = {
  primary: "Primary Standard",
  normative: "Normative Reference",
  test: "Test Method",
  related: "Related Code",
  amendment: "Amendment",
};

const EDGE_LABEL: Record<EdgeType, string> = {
  normative: "Normative ref",
  test: "Test method",
  related: "Related code",
  amendment: "Amendment",
};

const GROUP_DOT: Record<GraphNodeGroup, string> = {
  primary: "bg-primary",
  normative: "bg-primary/60",
  test: "bg-emerald-500",
  related: "bg-gray-400",
  amendment: "bg-amber-500",
};

/**
 * Full node detail content, shared by the inline drawer (Sheet) and the
 * expanded graph connection view. Rendered as a flex column so the body
 * scrolls independently of the header and the footer action.
 */
export function NodeDetailsPanel({
  node,
  graph,
  onNavigateNode,
  className,
}: {
  node: GraphNode;
  graph: GraphData | null;
  /** When provided, linked standards become buttons that jump to that node. */
  onNavigateNode?: (node: GraphNode) => void;
  className?: string;
}) {
  // Derived reset: keyed to node id, so switching nodes implicitly clears
  // the inline "added" state without an effect.
  const [addedKey, setAddedKey] = useState<string | null>(null);
  const added = addedKey === node.id;

  const connected = (
    graph?.edges
      .filter((e) => e.source === node.id || e.target === node.id)
      .map((e) => {
        const otherId = e.source === node.id ? e.target : e.source;
        return {
          type: e.type,
          node: graph.nodes.find((n) => n.id === otherId),
        };
      })
      .filter((c) => Boolean(c.node)) ?? []
  ) as { type: EdgeType; node: GraphNode }[];

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      {/* Header */}
      <div className="shrink-0 border-b border-border p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {GROUP_LABEL[node.group]}
        </p>
        <h2 className="mt-1 font-mono text-lg font-semibold tracking-tight text-foreground tabular-nums">
          {node.isNumber}
        </h2>
        <p className="mt-1 text-[13px] leading-5 text-foreground">{node.title}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {node.version && (
            <span className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {node.version}
            </span>
          )}
          {node.certStatus && (
            <StatusPill
              tone={node.certStatus === "Mandatory" ? "pass" : "neutral"}
              label={node.certStatus}
            />
          )}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="thin-scroll min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Role in graph
          </h3>
          <p className="mt-1.5 text-[13px] leading-5 text-foreground">{node.role}</p>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Scope
          </h3>
          <p className="mt-1.5 text-[13px] leading-5 text-foreground">{node.scope}</p>
        </section>

        {node.parameters && node.parameters.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Key parameters
            </h3>
            <dl className="mt-1.5 divide-y divide-border rounded border border-border">
              {node.parameters.map((p) => (
                <div key={p.label} className="flex items-center justify-between px-3 py-2">
                  <dt className="text-xs text-muted-foreground">{p.label}</dt>
                  <dd className="text-xs font-semibold text-foreground tabular-nums">
                    {p.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {connected.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Linked standards
              <span className="ml-1.5 font-normal normal-case tracking-normal tabular-nums">
                ({connected.length})
              </span>
            </h3>
            <ul className="mt-1.5 space-y-1.5">
              {connected.map((c) => {
                const clickable = Boolean(onNavigateNode);
                const inner = (
                  <>
                    <span
                      className={cn("h-1.5 w-1.5 shrink-0 rounded-full", GROUP_DOT[c.node.group])}
                      aria-hidden
                    />
                    <span className="font-mono text-xs font-medium text-foreground tabular-nums">
                      {c.node.isNumber}
                    </span>
                    <span className="ml-auto flex min-w-0 items-center gap-1">
                      <span className="truncate text-[10px] text-muted-foreground">
                        {EDGE_LABEL[c.type]}
                      </span>
                      {clickable && (
                        <ChevronRight
                          className="h-3 w-3 shrink-0 text-muted-foreground transition-fast group-hover:translate-x-0.5 group-hover:text-primary"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      )}
                    </span>
                  </>
                );
                return (
                  <li key={`${c.type}-${c.node.id}`}>
                    {clickable ? (
                      <button
                        type="button"
                        onClick={() => onNavigateNode?.(c.node)}
                        aria-label={`Inspect ${c.node.isNumber} — ${c.node.title}`}
                        className="group transition-fast flex w-full items-center gap-2 rounded border border-border px-2.5 py-1.5 text-left hover:border-primary/40 hover:bg-accent"
                      >
                        {inner}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 rounded border border-border px-2.5 py-1.5">
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      {/* Footer action — inline success state, no toast */}
      <div className="shrink-0 border-t border-border p-4">
        <Button
          variant={added ? "ghost" : "outline"}
          onClick={() => setAddedKey(node.id)}
          disabled={added}
          className={cn("w-full rounded text-xs", added && "text-emerald-600")}
        >
          {added ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" strokeWidth={1.5} aria-hidden />
              Added to clause bundle
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Add to clause bundle
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export { GROUP_LABEL, EDGE_LABEL };
