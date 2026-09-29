"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FileX2 } from "lucide-react";
import { ReportView, ReportSkeleton } from "@/components/report/report-view";
import { Button } from "@/components/ui/button";
import type { AuditReport } from "@/lib/types";

async function fetchReport(id: string): Promise<AuditReport> {
  const res = await fetch(`/api/reports/${id}`);
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error("FETCH_FAILED");
  return res.json();
}

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["report", id],
    queryFn: () => fetchReport(id),
    enabled: !!id,
  });

  if (isLoading) return <div className="py-4"><ReportSkeleton /></div>;

  if (isError || !data) {
    const notFound = (error as Error)?.message === "NOT_FOUND";
    return (
      <div className="mx-auto flex max-w-[800px] flex-col items-center justify-center gap-3 py-20 text-center">
        <FileX2 className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} aria-hidden />
        <h1 className="text-base font-semibold text-foreground">
          {notFound ? "Report not found" : "Failed to load report"}
        </h1>
        <p className="max-w-sm text-xs leading-5 text-muted-foreground">
          {notFound
            ? `No audit report exists for identifier “${id}”. Verify the tender ID and try again.`
            : "The audit service could not be reached. Please retry."}
        </p>
        <Button asChild variant="outline" className="rounded mt-2 text-xs">
          <Link href="/">Return to dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-2">
      <ReportView report={data} />
    </div>
  );
}
