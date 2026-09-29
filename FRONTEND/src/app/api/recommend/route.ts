import { pickTemplate } from "@/lib/graph-templates";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    description?: string;
    // Prior conversation text — keeps keyword routing on the right product
    // template when the user sends short follow-up questions.
    context?: string;
    language?: "en" | "hi";
  };

  await sleep(1900);

  const description = (body.description ?? "").slice(0, 500);
  const context = (body.context ?? "").slice(0, 1000);
  const language = body.language === "hi" ? "hi" : "en";
  const template = pickTemplate(`${context}\n${description}`);
  const elapsedMs = 1640 + Math.floor(Math.random() * 220);

  const primary =
    language === "hi"
      ? {
          ...template.primary,
          matchReason: template.primary.matchReasonHi,
        }
      : template.primary;

  const gaps =
    language === "hi"
      ? template.gaps.map((g) => ({
          ...g,
          title: g.titleHi ?? g.title,
          detail: g.detailHi ?? g.detail,
          suggestion: g.suggestionHi ?? g.suggestion,
        }))
      : template.gaps;

  return Response.json({
    primary,
    graph: template.graph,
    gaps,
    tenderClauses: template.tenderClauses,
    traversed: template.graph.nodes.length + 6,
    elapsedMs,
    generatedAt: "08 Dec 2025 · 11:42 IST",
  });
}
