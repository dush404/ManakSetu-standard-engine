"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NodeDetailsPanel } from "./node-details";
import type { GraphData, GraphNode } from "@/lib/types";

/**
 * Inline node drawer (Sheet). Shares its content with the expanded graph
 * view via NodeDetailsPanel. When `onNavigateNode` is provided, linked
 * standards in the panel swap the inspected node without closing.
 */
export function NodeDrawer({
  node,
  graph,
  open,
  onOpenChange,
  onNavigateNode,
}: {
  node: GraphNode | null;
  graph: GraphData | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onNavigateNode?: (node: GraphNode) => void;
}) {
  if (!node) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 p-0 shadow-none sm:max-w-[400px]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{node.isNumber}</SheetTitle>
          <SheetDescription>{node.title}</SheetDescription>
        </SheetHeader>
        <NodeDetailsPanel
          node={node}
          graph={graph}
          onNavigateNode={onNavigateNode}
          className="min-h-0 flex-1"
        />
      </SheetContent>
    </Sheet>
  );
}
