import { STANDARDS, AUDITS } from "@/lib/mock-data";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface SearchResult {
  type: "standard" | "tender";
  title: string;
  subtitle: string;
  href: string;
}

export async function GET(req: Request) {
  await sleep(240);
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();

  if (!q) {
    return Response.json({
      results: AUDITS.slice(0, 4).map<SearchResult>((a) => ({
        type: "tender",
        title: a.id,
        subtitle: a.product,
        href: `/report/${a.id}`,
      })),
    });
  }

  const stds: SearchResult[] = STANDARDS.filter((s) =>
    `${s.isNumber} ${s.title}`.toLowerCase().includes(q),
  )
    .slice(0, 6)
    .map((s) => ({
      type: "standard",
      title: s.isNumber,
      subtitle: s.title,
      href: `/standards?q=${encodeURIComponent(s.isNumber)}`,
    }));

  const tenders: SearchResult[] = AUDITS.filter((a) =>
    `${a.id} ${a.product} ${a.agency}`.toLowerCase().includes(q),
  )
    .slice(0, 4)
    .map((a) => ({
      type: "tender",
      title: a.id,
      subtitle: a.product,
      href: `/report/${a.id}`,
    }));

  return Response.json({ results: [...stds, ...tenders] });
}
