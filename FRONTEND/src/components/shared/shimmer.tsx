import { cn } from "@/lib/utils";

// Skeleton shimmer — background-position shift, no opacity pulse
export function Shimmer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("shimmer rounded", className)}
      {...props}
    />
  );
}

export function ShimmerText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer key={i} className="h-3" style={{ width: `${100 - i * 14}%` }} />
      ))}
    </div>
  );
}

export function ShimmerTable({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="divide-y divide-border" aria-hidden>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-3">
          {Array.from({ length: cols }).map((_, c) => (
            <Shimmer
              key={c}
              className="h-3.5"
              style={{ width: c === 1 ? "32%" : "12%" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
