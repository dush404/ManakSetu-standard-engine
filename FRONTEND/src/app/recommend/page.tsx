"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ListChecks, MessageSquare } from "lucide-react";
import {
  ChatPanel,
  summarize,
  welcomeMessage,
  type ChatMsg,
  type ChatSection,
} from "@/components/recommend/chat-panel";
import { OutputPanel, OutputPlaceholder } from "@/components/recommend/output-panel";
import { NodeDrawer } from "@/components/recommend/node-drawer";
import { FadeUp } from "@/components/shared/fade-up";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { GraphNode, RecommendResponse } from "@/lib/types";

interface AnalyzePayload {
  description: string;
  context?: string;
  language: "en" | "hi";
  fileName?: string;
  msgId: string;
}

async function analyze(payload: AnalyzePayload): Promise<RecommendResponse> {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: payload.description,
      context: payload.context,
      language: payload.language,
      fileName: payload.fileName,
    }),
  });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}

let msgSeq = 0;
const nextMsgId = () => `msg-${Date.now().toString(36)}-${msgSeq++}`;

export default function RecommendPage() {
  const language = useUIStore((s) => s.language);

  const [messages, setMessages] = useState<ChatMsg[]>(() => [welcomeMessage()]);
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"chat" | "analysis">("chat");
  const [freshAnalysis, setFreshAnalysis] = useState(false);

  const mutation = useMutation({
    mutationFn: analyze,
    onSuccess: (data, vars) => {
      setResult(data);
      setSelectedNode(null);
      setDrawerOpen(false);
      setFreshAnalysis(true);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === vars.msgId
            ? {
                ...m,
                status: undefined,
                result: data,
                text: summarize(data, vars.language),
              }
            : m,
        ),
      );
    },
    onError: (_err, vars) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === vars.msgId ? { ...m, status: "error" } : m)),
      );
    },
  });

  const handleSend = (text: string, fileName?: string) => {
    const pendingId = nextMsgId();
    // Carry recent user turns as context so short follow-up questions keep
    // routing to the same product template on the server.
    const context = messages
      .filter((m) => m.role === "user" && m.text)
      .slice(-3)
      .map((m) => m.text)
      .join("\n");

    setMessages((prev) => [
      ...prev,
      { id: nextMsgId(), role: "user", text, attachment: fileName },
      {
        id: pendingId,
        role: "assistant",
        status: "pending",
        origin: { description: text, context, fileName, language },
      },
    ]);
    mutation.mutate({ description: text, context, language, fileName, msgId: pendingId });
  };

  const handleRetry = (msgId: string) => {
    const msg = messages.find((m) => m.id === msgId);
    if (!msg?.origin) return;
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: "pending" } : m)),
    );
    mutation.mutate({ ...msg.origin, msgId });
  };

  const handleNewChat = () => {
    setMessages([welcomeMessage()]);
    setResult(null);
    setSelectedNode(null);
    setDrawerOpen(false);
    setFreshAnalysis(false);
  };

  const jumpToSection = (s: ChatSection) => {
    setMobileTab("analysis");
    setFreshAnalysis(false);
    // Allow the analysis tab to mount before scrolling to the anchor
    setTimeout(() => {
      document
        .getElementById(`analysis-${s}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const selectMobileTab = (tab: "chat" | "analysis") => {
    setMobileTab(tab);
    if (tab === "analysis") setFreshAnalysis(false);
  };

  // Node click on the inline graph opens the details drawer.
  function handleSelectNode(node: GraphNode) {
    setSelectedNode(node);
    setDrawerOpen(true);
  }

  // Linked-standard navigation inside the drawer: swap the inspected node
  // without closing it.
  function handleDrawerNavigate(node: GraphNode) {
    setSelectedNode(node);
  }

  // Expanded view close: keep the last inspected node highlighted on the
  // inline graph, but never auto-open the drawer.
  function handleSyncSelection(node: GraphNode | null) {
    setSelectedNode(node);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4">
      <FadeUp index={0}>
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Recommendation Engine
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Chat with the graph-traverse engine — every reply updates the live
            analysis, allied standards graph and gap list on the right.
          </p>
        </div>
      </FadeUp>

      {/* Mobile view switcher */}
      <div
        role="tablist"
        aria-label="Chat or analysis view"
        className="flex items-center gap-1 rounded border border-border bg-white p-1 lg:hidden"
      >
        {(
          [
            { key: "chat", label: "Chat", icon: MessageSquare },
            { key: "analysis", label: "Analysis", icon: ListChecks },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={mobileTab === t.key}
            onClick={() => selectMobileTab(t.key)}
            className={cn(
              "transition-fast relative flex flex-1 items-center justify-center gap-1.5 rounded px-3 py-2 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
              mobileTab === t.key
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <t.icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            {t.label}
            {t.key === "analysis" && freshAnalysis && mobileTab !== "analysis" && (
              <span
                className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-primary"
                aria-hidden
              />
            )}
          </button>
        ))}
      </div>

      {/* Split view: chat left / live analysis right */}
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div
          className={cn(
            "lg:sticky lg:top-[80px] lg:h-[calc(100dvh-160px)]",
            mobileTab !== "chat" && "hidden lg:block",
          )}
        >
          <FadeUp index={1} className="h-full">
            <ChatPanel
              messages={messages}
              isPending={mutation.isPending}
              onSend={handleSend}
              onRetry={handleRetry}
              onNewChat={handleNewChat}
              onJumpToSection={jumpToSection}
            />
          </FadeUp>
        </div>

        <div className={cn("min-h-[420px]", mobileTab !== "analysis" && "hidden lg:block")}>
          {result ? (
            <OutputPanel
              result={result}
              selectedId={selectedNode?.id ?? null}
              onSelectNode={handleSelectNode}
              onSyncSelection={handleSyncSelection}
            />
          ) : (
            <FadeUp index={2}>
              <OutputPlaceholder />
            </FadeUp>
          )}
        </div>
      </div>

      <NodeDrawer
        node={selectedNode}
        graph={result?.graph ?? null}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onNavigateNode={handleDrawerNavigate}
      />
    </div>
  );
}
