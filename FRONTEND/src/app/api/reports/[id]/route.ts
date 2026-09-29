import { buildReport } from "@/lib/reports";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  await sleep(520);
  const report = buildReport(id);
  if (!report) {
    return Response.json({ error: "Report not found" }, { status: 404 });
  }
  return Response.json(report);
}
