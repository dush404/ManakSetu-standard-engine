"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { GraphData, GraphEdge, GraphNode, GraphNodeGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

// ── Simulation types ─────────────────────────────────────────
interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const EDGE_STYLE: Record<
  GraphEdge["type"],
  { stroke: string; dash?: string; label: string }
> = {
  normative: { stroke: "#2563EB", label: "Normative ref" },
  test: { stroke: "#10B981", label: "Test method" },
  related: { stroke: "#94A3B8", dash: "4 3", label: "Related code" },
  amendment: { stroke: "#F59E0B", dash: "4 3", label: "Amendment" },
};

const NODE_STYLE: Record<
  GraphNodeGroup,
  { fill: string; stroke: string; text: string; r: number }
> = {
  primary: { fill: "#2563EB", stroke: "#1D4ED8", text: "#FFFFFF", r: 30 },
  normative: { fill: "#EFF6FF", stroke: "#2563EB", text: "#1D4ED8", r: 20 },
  test: { fill: "#ECFDF5", stroke: "#10B981", text: "#047857", r: 20 },
  related: { fill: "#F9FAFB", stroke: "#9CA3AF", text: "#374151", r: 20 },
  amendment: { fill: "#FFFBEB", stroke: "#F59E0B", text: "#B45309", r: 20 },
};

function shortCode(n: { isNumber: string; group: GraphNodeGroup }): string {
  const isNumber = n.isNumber;
  if (n.group === "primary") return isNumber.replace(/^IS /, ""); // "1786:2008" — fits the large node
  if (isNumber.startsWith("Amd")) return isNumber.replace(/\s·\s?\d{4}$/, ""); // "Amd 4"
  if (isNumber.startsWith("QCO")) return isNumber.replace(/\s\d{4}$/, ""); // "QCO"
  if (isNumber.startsWith("IS")) {
    return isNumber
      .replace(/^IS /, "")
      .replace(/:\d{4}$/, ""); // "1786"
  }
  return isNumber;
}

// ── Force simulation (custom, deterministic circle seeding) ──
function initNodes(data: GraphData, w: number, h: number): SimNode[] {
  const cx = w / 2;
  const cy = h / 2;
  const satellites = data.nodes.filter((n) => n.group !== "primary");
  const radius = Math.min(w, h) / 2 - 60;

  let sIdx = 0;
  return data.nodes.map((n) => {
    if (n.group === "primary") {
      return { ...n, x: cx, y: cy, vx: 0, vy: 0 };
    }
    const angle = (2 * Math.PI * sIdx) / satellites.length + Math.PI / 7;
    sIdx++;
    return {
      ...n,
      x: cx + radius * 0.8 * Math.cos(angle),
      y: cy + radius * 0.8 * Math.sin(angle),
      vx: 0,
      vy: 0,
    };
  });
}

function tick(
  nodes: SimNode[],
  edges: GraphEdge[],
  w: number,
  h: number,
  alpha: number,
  spread: number,
) {
  const cx = w / 2;
  const cy = h / 2;
  // Scale interaction distances with canvas size so the graph fills
  // both the inline card (440px) and the expanded view (~viewport).
  const nearR = 100 * spread;
  const repulse = 2800 * spread * spread;
  const springLen = 118 * spread;

  // Repulsion between all node pairs
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let d2 = dx * dx + dy * dy;
      if (d2 < 1) {
        dx = (i % 2 ? 1 : -1) * 0.5;
        dy = (j % 2 ? -1 : 1) * 0.5;
        d2 = 1;
      }
      const d = Math.sqrt(d2);
      // Near-field: strong linear push apart; far-field: inverse-square
      const f =
        (d < nearR ? 0.35 + (nearR - d) / (55 * spread) : repulse / d2) *
        alpha;
      const fx = (dx / d) * f;
      const fy = (dy / d) * f;
      a.vx -= fx;
      a.vy -= fy;
      b.vx += fx;
      b.vy += fy;
    }
  }

  // Spring attraction along edges
  const byId = new Map(nodes.map((n) => [n.id, n]));
  for (const e of edges) {
    const a = byId.get(e.source);
    const b = byId.get(e.target);
    if (!a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
    const target = springLen;
    const f = (d - target) * 0.012 * alpha;
    const fx = (dx / d) * f * d * 0.05;
    const fy = (dy / d) * f * d * 0.05;
    a.vx += fx;
    a.vy += fy;
    b.vx -= fx;
    b.vy -= fy;
  }

  // Center gravity (primary pinned at center)
  for (const n of nodes) {
    const g = n.group === "primary" ? 0.16 : 0.018;
    n.vx += (cx - n.x) * g * alpha;
    n.vy += (cy - n.y) * g * alpha;
    // damping
    n.vx *= 0.82;
    n.vy *= 0.82;
    n.x += n.vx;
    n.y += n.vy;
    // boundary clamp
    const pad = 44;
    n.x = Math.max(pad, Math.min(w - pad, n.x));
    n.y = Math.max(pad, Math.min(h - pad - 16, n.y));
  }
}

// ── Canvas component ─────────────────────────────────────────
export interface GraphCanvasHandle {
  restart: () => void;
}

/**
 * Self-measuring force-directed SVG canvas. Height is controlled by the
 * parent via className (fixed height inline, flex-1 in the expanded view).
 * When `selectedId` is set, the node's direct connections are emphasized
 * and everything else fades back, so the full connection neighborhood
 * stays readable at a glance.
 */
export const GraphCanvas = forwardRef<
  GraphCanvasHandle,
  {
    data: GraphData;
    selectedId: string | null;
    onSelect: (node: GraphNode) => void;
    zoom: number;
    className?: string;
    ariaLabel?: string;
  }
>(function GraphCanvas(
  { data, selectedId, onSelect, zoom, className, ariaLabel },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const alphaRef = useRef(1);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);

  const [size, setSize] = useState({ w: 640, h: 440 });
  const [nodes, setNodes] = useState<SimNode[]>([]);

  // Observe container size (width AND height — expanded view is fluid)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      const w = Math.max(320, Math.floor(r.width));
      const h = Math.max(280, Math.floor(r.height));
      setSize(
        (s) =>
          Math.abs(s.w - w) > 4 || Math.abs(s.h - h) > 4
            ? { w, h }
            : s,
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Direct neighbors of the selected node (for connection emphasis)
  const neighborIds = useMemo(() => {
    if (!selectedId) return null;
    const set = new Set<string>([selectedId]);
    for (const e of data.edges) {
      if (e.source === selectedId) set.add(e.target);
      else if (e.target === selectedId) set.add(e.source);
    }
    return set;
  }, [data, selectedId]);

  // (Re)start simulation when data or size changes.
  // State updates only happen inside rAF frames (external-system sync).
  const restart = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    nodesRef.current = initNodes(data, size.w, size.h);
    alphaRef.current = 1;
    frameRef.current = 0;

    const loop = () => {
      alphaRef.current *= 0.984;
      tick(
        nodesRef.current,
        data.edges,
        size.w,
        size.h,
        alphaRef.current,
        // Spread factor: neutral at the inline card height, larger on big canvases
        Math.max(1, Math.min(2.4, Math.min(size.w, size.h) / 440)),
      );
      frameRef.current++;
      setNodes(nodesRef.current.map((n) => ({ ...n })));
      if (alphaRef.current > 0.012 && frameRef.current < 420) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [data, size.w, size.h]);

  useImperativeHandle(ref, () => ({ restart }), [restart]);

  useEffect(() => {
    restart();
    return () => cancelAnimationFrame(rafRef.current);
  }, [restart]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full select-none", className)}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size.w} ${size.h}`}
        role="application"
        aria-label={ariaLabel ?? "Allied standards relationship graph"}
      >
        <g
          transform={`translate(${size.w / 2} ${size.h / 2}) scale(${zoom}) translate(${-size.w / 2} ${-size.h / 2})`}
        >
          {/* Edges — draw in via stroke-dashoffset; selected connections emphasized */}
          {data.edges.map((e, i) => {
            const a = nodes.find((n) => n.id === e.source);
            const b = nodes.find((n) => n.id === e.target);
            if (!a || !b) return null;
            const len = Math.hypot(b.x - a.x, b.y - a.y);
            const style = EDGE_STYLE[e.type];
            const isConnected =
              selectedId != null &&
              (e.source === selectedId || e.target === selectedId);
            const dimmed = neighborIds != null && !isConnected;
            return (
              <line
                key={`${e.source}-${e.target}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={style.stroke}
                strokeWidth={isConnected ? 1.9 : 1.2}
                strokeOpacity={isConnected ? 0.95 : dimmed ? 0.12 : 0.55}
                strokeDasharray={style.dash ?? `${len + 4}`}
                strokeDashoffset={style.dash ? 0 : len + 4}
                className={cn(
                  "transition-fast",
                  style.dash ? undefined : "edge-draw",
                )}
                style={
                  style.dash
                    ? undefined
                    : { animationDelay: `${i * 35}ms` }
                }
              />
            );
          })}

          {/* Nodes — non-neighbors recede while a node is inspected */}
          {nodes.map((n) => {
            const style = NODE_STYLE[n.group];
            const selected = selectedId === n.id;
            const dimmed = neighborIds != null && !neighborIds.has(n.id);
            return (
              <g
                key={n.id}
                className="graph-node outline-none"
                transform={`translate(${n.x} ${n.y})`}
                role="button"
                tabIndex={0}
                aria-label={`${n.isNumber} — ${n.shortLabel}`}
                aria-pressed={selected}
                data-selected={selected}
                onClick={() => onSelect(n)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    onSelect(n);
                  }
                }}
                style={{ opacity: dimmed ? 0.3 : 1 }}
              >
                <circle
                  className="node-scale"
                  r={style.r}
                  fill={style.fill}
                  stroke={selected ? "#2563EB" : style.stroke}
                  strokeWidth={selected ? 2.5 : 1.5}
                />
                {n.group === "primary" && (
                  <circle
                    r={style.r + 5}
                    fill="none"
                    stroke="#2563EB"
                    strokeOpacity={0.25}
                    strokeWidth={1}
                  />
                )}
                <text
                  y={3.5}
                  textAnchor="middle"
                  fontSize={n.group === "primary" ? 11 : 9}
                  fontWeight={600}
                  fill={style.text}
                  style={{ pointerEvents: "none" }}
                >
                  {shortCode(n)}
                </text>
                <text
                  y={style.r + 13}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#6B7280"
                  style={{ pointerEvents: "none" }}
                >
                  {n.shortLabel.length > 22
                    ? `${n.shortLabel.slice(0, 21)}…`
                    : n.shortLabel}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
});

// ── Shared legend ────────────────────────────────────────────
export function GraphLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border bg-white px-4 py-2.5",
        className,
      )}
    >
      {(Object.keys(EDGE_STYLE) as GraphEdge["type"][]).map((t) => (
        <span
          key={t}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
        >
          <svg width="18" height="6" aria-hidden>
            <line
              x1="0"
              y1="3"
              x2="18"
              y2="3"
              stroke={EDGE_STYLE[t].stroke}
              strokeWidth={1.5}
              strokeDasharray={EDGE_STYLE[t].dash}
            />
          </svg>
          {EDGE_STYLE[t].label}
        </span>
      ))}
    </div>
  );
}
