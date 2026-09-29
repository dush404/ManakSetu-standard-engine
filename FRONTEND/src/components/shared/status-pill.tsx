import { cn } from "@/lib/utils";

type PillTone = "pass" | "warn" | "fail" | "neutral" | "info";

const TONES: Record<PillTone, string> = {
  pass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warn: "bg-amber-50 text-amber-700 border-amber-200",
  fail: "bg-red-50 text-red-700 border-red-200",
  neutral: "bg-gray-100 text-gray-600 border-gray-200",
  info: "bg-[#EFF6FF] text-[#1D4ED8] border-blue-200",
};

const DOT: Record<PillTone, string> = {
  pass: "bg-emerald-500",
  warn: "bg-amber-500",
  fail: "bg-red-500",
  neutral: "bg-gray-400",
  info: "bg-blue-600",
};

export function StatusPill({
  tone,
  label,
  dot = true,
  className,
}: {
  tone: PillTone;
  label: string;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4 whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", DOT[tone])} aria-hidden />}
      {label}
    </span>
  );
}

export function riskTone(risk: string): PillTone {
  if (risk === "Low") return "pass";
  if (risk === "Medium") return "warn";
  return "fail";
}

export function scoreTone(score: number): PillTone {
  if (score >= 85) return "pass";
  if (score >= 70) return "warn";
  return "fail";
}
