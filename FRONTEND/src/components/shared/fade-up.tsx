"use client";

// Staggered page-load fade-up: opacity 0→1, translateY 8px→0,
// 300ms ease-out with 50ms delay increments per element.
export function FadeUp({
  index = 0,
  className,
  as: Tag = "div",
  children,
  ...props
}: {
  index?: number;
  className?: string;
  as?: React.ElementType;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={`animate-fade-up ${className ?? ""}`}
      style={{ animationDelay: `${index * 50}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
}
