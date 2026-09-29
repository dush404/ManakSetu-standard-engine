import { STANDARDS, SECTORS } from "@/lib/mock-data";
import type { SortColumn, SortDir, Standard } from "@/lib/types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const isSortColumn = (v: string | null): v is SortColumn =>
  ["isNumber", "title", "version", "lastAmended", "mandatory"].includes(v ?? "");

export async function GET(req: Request) {
  await sleep(480);

  const url = new URL(req.url);
  const sector = url.searchParams.get("sector") ?? "all";
  const status = url.searchParams.get("status") ?? "all";
  const cert = url.searchParams.get("cert") ?? "all";
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const yearFrom = Number(url.searchParams.get("yearFrom") ?? 1985);
  const yearTo = Number(url.searchParams.get("yearTo") ?? 2025);
  const mandatory = url.searchParams.get("mandatory") ?? "all";
  const sortColumn: SortColumn = isSortColumn(url.searchParams.get("sort"))
    ? (url.searchParams.get("sort") as SortColumn)
    : "isNumber";
  const sortDir: SortDir = url.searchParams.get("dir") === "desc" ? "desc" : "asc";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const pageSize = 50;

  let rows: Standard[] = STANDARDS.filter((s) => {
    if (sector !== "all" && s.sector !== sector) return false;
    if (status !== "all" && s.status !== status) return false;
    if (cert !== "all" && s.certType !== cert) return false;
    if (mandatory !== "all") {
      const want = mandatory === "yes";
      if (s.mandatory !== want) return false;
    }
    const year = s.amendedYear || 1985;
    if (year < yearFrom || year > yearTo) return false;
    if (q && !(`${s.isNumber} ${s.title}`.toLowerCase().includes(q))) return false;
    return true;
  });

  rows = [...rows].sort((a, b) => {
    let cmp = 0;
    switch (sortColumn) {
      case "isNumber":
        cmp = a.code.localeCompare(b.code, undefined, { numeric: true });
        break;
      case "title":
        cmp = a.title.localeCompare(b.title);
        break;
      case "version":
        cmp = a.version.localeCompare(b.version);
        break;
      case "lastAmended":
        cmp = a.amendedYear - b.amendedYear;
        break;
      case "mandatory":
        cmp = Number(a.mandatory) - Number(b.mandatory);
        break;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return Response.json({
    rows: rows.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    sortColumn,
    sortDir,
    sectors: SECTORS,
  });
}
