"use client";

import { useState } from "react";
import { Check, Copy, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AuditReport } from "@/lib/types";

export function ExportActions({ report }: { report: AuditReport }) {
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  const copyClauses = async () => {
    try {
      await navigator.clipboard.writeText(report.tenderClauses);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const downloadDoc = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>MANAKSETU Audit ${report.id}</title></head><body style="font-family:Arial,sans-serif;max-width:800px;margin:24px auto;">
<h2>MANAKSETU Audit Report — ${report.id}</h2>
<p><strong>Product:</strong> ${report.product}<br/><strong>Agency:</strong> ${report.agency}<br/><strong>Date:</strong> ${report.date}<br/><strong>Compliance Score:</strong> ${report.score}/100</p>
<h3>Tender Clauses</h3>
<pre style="white-space:pre-wrap;font-family:Consolas,monospace;font-size:12px;">${report.tenderClauses}</pre>
</body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MANAKSETU_Audit_${report.id}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2400);
  };

  return (
    <div className="no-print flex flex-col gap-2 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <FileText className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        {report.id} · Generated {report.date} · Print-friendly
      </p>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="ghost"
          onClick={downloadDoc}
          className="rounded text-xs"
        >
          {exported ? (
            <>
              <Check
                className="mr-1.5 h-3.5 w-3.5 text-emerald-600"
                strokeWidth={1.5}
                aria-hidden
              />
              Exported to downloads
            </>
          ) : (
            <>
              <Download
                className="mr-1.5 h-3.5 w-3.5"
                strokeWidth={1.5}
                aria-hidden
              />
              Download DOCX
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={copyClauses}
          className="rounded text-xs"
        >
          {copied ? (
            <>
              <Check
                className="mr-1.5 h-3.5 w-3.5 text-emerald-600"
                strokeWidth={1.5}
                aria-hidden
              />
              Copied as tender clause
            </>
          ) : (
            <>
              <Copy
                className="mr-1.5 h-3.5 w-3.5"
                strokeWidth={1.5}
                aria-hidden
              />
              Copy as Tender Clause
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
