import { KPIS } from "@/lib/mock-data";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET() {
  await sleep(420);
  return Response.json(KPIS);
}
