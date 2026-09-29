"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// SVG circular progress with stroke-dashoffset animation on load
export function ComplianceRing({ score }: { score: number }) {
  const r = 56;
  const C = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1100;
    let raf = 0;

    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setProgress(eased);
      setDisplay(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const tone = score >= 85 ? "#10B981" : score >= 70 ? "#F59E0B" : "#EF4444";
  const label = score >= 85 ? "Strong alignment" : score >= 70 ? "Needs amendment" : "High risk";

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-32 w-32" role="img" aria-label={`Compliance score ${score} of 100`}>
        <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="10"
          />
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke={tone}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress * (score / 100))}
            style={{ transition: "stroke 400ms cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn("text-2xl font-semibold tracking-tight tabular-nums")}
            style={{ color: tone }}
          >
            {display}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            / 100
          </span>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Overall Compliance
        </p>
        <p
          className="mt-0.5 text-sm font-semibold"
          style={{ color: tone }}
        >
          {label}
        </p>
        <p className="mt-1 max-w-[180px] text-[11px] leading-4 text-muted-foreground">
          Weighted across certification coverage, gap density and amendment recency.
        </p>
      </div>
    </div>
  );
}
