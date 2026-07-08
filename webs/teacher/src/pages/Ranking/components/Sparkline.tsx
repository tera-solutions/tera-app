interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}

/** Tiny inline trend line — cheap enough to render per table row without a chart.js instance each. */
const Sparkline = ({ values, width = 56, height = 20, color = "#38bdf8" }: SparklineProps) => {
  if (values.length < 2) {
    return <span className="text-xs text-slate-300">—</span>;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);

  const points = values
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
};

export default Sparkline;
