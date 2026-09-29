// Custom SVG sparkline — no chart libraries
export function Sparkline({
  data,
  good = true,
  width = 84,
  height = 30,
  id,
  className = "",
}: {
  data: number[];
  good?: boolean;
  width?: number;
  height?: number;
  id: string;
  className?: string;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return [x, y] as const;
  });

  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${pad},${height - 1} ${line} ${width - pad},${height - 1}`;
  const stroke = good ? "#10B981" : "#EF4444";
  const last = pts[pts.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Trend sparkline"
      className={`shrink-0 ${className}`}
    >
      <polygon points={area} fill={stroke} fillOpacity={0.07} stroke="none" />
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r={2} fill={stroke} />
    </svg>
  );
}
