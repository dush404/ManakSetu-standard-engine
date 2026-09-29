"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  FileText,
  MessageSquare,
  Paperclip,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { RecommendResponse } from "@/lib/types";

// ── Types ────────────────────────────────────────────────────
export type ChatSection = "primary" | "graph" | "gaps";

export interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  text?: string;
  attachment?: string;
  /** Assistant only — the analysis snapshot produced for this turn. */
  result?: RecommendResponse;
  status?: "pending" | "error";
  /** Assistant only — original request, kept for Retry. */
  origin?: {
    description: string;
    context?: string;
    fileName?: string;
    language: "en" | "hi";
  };
}

const composerSchema = z.object({
  message: z
    .string()
    .trim()
    .min(3, "Type at least 3 characters.")
    .max(2000, "Message is too long (max 2000)."),
});
type ComposerValues = z.infer<typeof composerSchema>;

/**
 * Grow the composer to exactly fit its content — never an internal scrollbar.
 * scrollHeight excludes the element's borders while the border-box height
 * includes them, so the border sum is added to keep every line fully visible.
 */
function growComposer(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  const borders = el.offsetHeight - el.clientHeight;
  el.style.height = `${el.scrollHeight + borders}px`;
}

function refocusComposer() {
  const el = document.getElementById("chat-message") as HTMLTextAreaElement | null;
  if (!el) return;
  el.focus();
  growComposer(el);
}

const STARTERS = [
  "Supply 500MT Fe500D TMT bars for coastal metro viaduct, NABL lot testing",
  "Cement OPC 43 grade, 5000 bags for RCC columns and slabs, PPC alternative",
  "LT armoured cables 1.1kV aluminium for underground distribution network",
];

export function welcomeMessage(): ChatMsg {
  const lang = useUIStore.getState().language;
  return {
    id: "welcome",
    role: "assistant",
    text:
      lang === "hi"
        ? "नमस्ते! अपनी खरीद आवश्यकता बताइए — मैं BIS मानक ग्राफ़ को ट्रैवर्स करके प्राथमिक मानक, संबद्ध संदर्भ और क्लॉज़ अंतराल बताऊँगा। PDF/DWG संलग्न करें या नीचे दिए सुझाव चुनें।"
        : "Describe your procurement requirement — I'll traverse the BIS standards graph and map the primary standard, allied references and clause-level gaps. Attach a PDF/DWG drawing or pick a starter below. Follow-up questions keep the full analysis in sync on the right.",
  };
}

export function summarize(r: RecommendResponse, lang: "en" | "hi"): string {
  const critical = r.gaps.filter((g) => g.severity === "critical").length;
  const recommended = r.gaps.length - critical;
  if (lang === "hi") {
    return `प्राथमिक मिलान: ${r.primary.isNumber} — ${r.primary.title}। ${r.primary.qcoRef} के अंतर्गत ${r.primary.certStatus}। विश्वास ${r.primary.confidence}%। ${r.traversed} मानक ट्रैवर्स किए — ${critical} गंभीर व ${recommended} अनुशंसित अंतराल मिले।`;
  }
  return `Primary match: ${r.primary.isNumber} — ${r.primary.title}. ${r.primary.certStatus} under ${r.primary.qcoRef}. Confidence ${r.primary.confidence}%. Traversed ${r.traversed} standards — ${critical} critical and ${recommended} recommended gaps identified.`;
}

// ── Panel ────────────────────────────────────────────────────
export function ChatPanel({
  messages,
  isPending,
  onSend,
  onRetry,
  onNewChat,
  onJumpToSection,
}: {
  messages: ChatMsg[];
  isPending: boolean;
  onSend: (text: string, fileName?: string) => void;
  onRetry: (msgId: string) => void;
  onNewChat: () => void;
  onJumpToSection: (s: ChatSection) => void;
}) {
  const language = useUIStore((s) => s.language);
  const setLanguage = useUIStore((s) => s.setLanguage);

  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ComposerValues>({
    resolver: zodResolver(composerSchema),
    defaultValues: { message: "" },
    mode: "onSubmit",
  });
  const message = useWatch({ control, name: "message" }) ?? "";
  const { ref: msgRef, ...msgRest } = register("message");

  // Auto-scroll the thread to the latest message
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isPending]);

  // Re-grow the composer on programmatic value changes (starter prefill,
  // post-send reset) — onChange alone misses those paths.
  useEffect(() => {
    const el = document.getElementById("chat-message") as HTMLTextAreaElement | null;
    if (el) growComposer(el);
  }, [message]);

  const acceptFile = (file: File | undefined) => {
    if (!file) return;
    if (!/\.(pdf|dwg)$/i.test(file.name)) {
      setFileError("Only PDF or DWG files are accepted.");
      return;
    }
    setFileError(null);
    setAttachment(file.name);
  };

  const submit = handleSubmit(({ message: text }) => {
    onSend(text.trim(), attachment ?? undefined);
    reset({ message: "" });
    setAttachment(null);
    requestAnimationFrame(refocusComposer);
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isPending && message.trim().length >= 3) submit(e);
    }
  };

  const starters = useMemo(() => STARTERS, []);

  const sectionLabels: Record<ChatSection, string> =
    language === "hi"
      ? { primary: "प्राथमिक मिलान", graph: "ग्राफ़ देखें", gaps: "अंतराल" }
      : { primary: "Primary match", graph: "Allied graph", gaps: "Gap analysis" };

  return (
    <section
      aria-label="Recommendation chat"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded border border-border bg-white"
    >
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-accent">
            <MessageSquare className="h-4 w-4 text-primary" strokeWidth={1.5} aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">
              {language === "hi" ? "सिफारिश चैट" : "Recommendation Chat"}
            </h2>
            <p className="truncate text-[11px] text-muted-foreground">
              {isPending
                ? language === "hi"
                  ? "ग्राफ़ ट्रैवर्स हो रहा है…"
                  : "Traversing the standards graph…"
                : language === "hi"
                  ? "BIS मानक इंजन के साथ बातचीत करें"
                  : "Chat with the BIS standards engine"}
            </p>
          </div>
        </div>
        {messages.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 rounded px-2 text-xs text-muted-foreground"
            onClick={onNewChat}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            {language === "hi" ? "नई चैट" : "New chat"}
          </Button>
        )}
      </header>

      {/* Thread */}
      <div
        ref={listRef}
        className="thin-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-4 max-lg:h-[46dvh] max-lg:flex-none"
        aria-live="polite"
        aria-label="Conversation thread"
      >
        {messages.map((m) =>
          m.role === "user" ? (
            // ── User bubble ──
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[85%] rounded rounded-br-sm bg-primary px-3 py-2 text-primary-foreground">
                {m.attachment && (
                  <p className="mb-1 flex items-center gap-1.5 text-[11px] text-primary-foreground/85">
                    <FileText className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden />
                    <span className="truncate">{m.attachment}</span>
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words text-[13px] leading-5">
                  {m.text}
                </p>
              </div>
            </div>
          ) : (
            // ── Assistant bubble ──
            <div key={m.id} className="flex justify-start">
              <div
                className={cn(
                  "max-w-[92%] rounded rounded-bl-sm border bg-white px-3 py-2.5",
                  m.status === "error" ? "border-red-200" : "border-border",
                )}
              >
                {m.status === "pending" ? (
                  <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <span className="flex items-end gap-0.5" aria-hidden>
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="typing-dot h-1.5 w-1.5 rounded-full bg-primary"
                          style={{ animationDelay: `${i * 140}ms` }}
                        />
                      ))}
                    </span>
                    {language === "hi" ? "ग्राफ़ ट्रैवर्स हो रहा है…" : "Traversing Graph…"}
                  </p>
                ) : m.status === "error" ? (
                  <>
                    <p className="flex items-start gap-1.5 text-[13px] leading-5 text-red-700">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
                      {language === "hi"
                        ? "विश्लेषण विफल — कृपया पुनः प्रयास करें।"
                        : "Analysis failed — please try again."}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 h-7 rounded px-2.5 text-xs"
                      onClick={() => onRetry(m.id)}
                    >
                      <RotateCcw className="mr-1.5 h-3 w-3" strokeWidth={1.5} aria-hidden />
                      {language === "hi" ? "पुनः प्रयास" : "Retry"}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap break-words text-[13px] leading-5 text-foreground">
                      {m.text}
                    </p>
                    {m.result && (
                      <>
                        <p className="mt-1.5 text-[11px] text-muted-foreground tabular-nums">
                          {m.result.traversed} standards ·{" "}
                          {m.result.elapsedMs.toLocaleString("en-IN")} ms · {m.result.generatedAt}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {(
                            [
                              ["primary", sectionLabels.primary],
                              ["graph", sectionLabels.graph],
                              ["gaps", `${sectionLabels.gaps} (${m.result!.gaps.length})`],
                            ] as [ChatSection, string][]
                          ).map(([key, label]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => onJumpToSection(key)}
                              className="transition-fast rounded border border-border bg-secondary/60 px-2 py-1 text-[11px] font-medium text-foreground hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ),
        )}

        {/* Starter prompts — only while the thread is just the welcome turn */}
        {messages.length === 1 && !isPending && (
          <div className="flex flex-col gap-1.5 pt-1">
            {starters.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setValue("message", s, { shouldValidate: true });
                  requestAnimationFrame(refocusComposer);
                }}
                className="transition-fast rounded border border-dashed border-border px-3 py-2 text-left text-xs leading-5 text-muted-foreground hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-border bg-white p-3">
        {attachment && (
          <div className="mb-2 flex items-center gap-2 rounded border border-border bg-secondary/60 px-2.5 py-1.5">
            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
              {attachment}
            </span>
            <button
              type="button"
              aria-label={`Remove file ${attachment}`}
              onClick={() => setAttachment(null)}
              className="transition-fast rounded p-0.5 text-muted-foreground hover:bg-background hover:text-red-600"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        )}

        <form onSubmit={submit} className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.dwg"
            className="hidden"
            aria-hidden
            onChange={(e) => {
              acceptFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 rounded text-muted-foreground"
            aria-label="Attach PDF or DWG file"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </Button>

          <div className="min-w-0 flex-1">
            <Textarea
              id="chat-message"
              rows={1}
              placeholder={
                language === "hi"
                  ? "अपनी आवश्यकता लिखें…"
                  : "Describe the requirement…"
              }
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "chat-msg-error" : undefined}
              className="min-h-[38px] resize-none overflow-hidden py-2 text-[13px] leading-5"
              {...msgRest}
              ref={msgRef}
              onChange={(e) => {
                msgRest.onChange(e);
                growComposer(e.currentTarget);
              }}
              onKeyDown={onKeyDown}
            />
            {errors.message ? (
              <p id="chat-msg-error" role="alert" className="mt-1 text-[11px] text-red-600">
                {errors.message.message}
              </p>
            ) : fileError ? (
              <p role="alert" className="mt-1 text-[11px] text-red-600">
                {fileError}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 shrink-0 rounded"
            disabled={isPending || message.trim().length < 3}
            aria-label={language === "hi" ? "संदेश भेजें" : "Send message"}
          >
            <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </Button>
        </form>

        {/* Language toggle */}
        <div className="mt-2 flex items-center justify-between">
          <div
            role="radiogroup"
            aria-label="Output language"
            className="inline-flex rounded border border-border p-0.5"
          >
            {(
              [
                { key: "en", label: "EN" },
                { key: "hi", label: "हिन्दी" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                role="radio"
                aria-checked={language === opt.key}
                onClick={() => setLanguage(opt.key)}
                className={cn(
                  "transition-fast rounded px-3 py-1 text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  language === opt.key
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {language === "hi" ? "PDF · DWG · भेजने के लिए Enter" : "PDF · DWG · Enter to send"}
          </p>
        </div>
      </div>
    </section>
  );
}
