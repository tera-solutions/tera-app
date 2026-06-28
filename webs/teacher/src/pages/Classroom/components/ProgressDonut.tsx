import { getDonutColor } from "../constants";

interface ProgressDonutProps {
  value: number;
  size?: number;
  label?: string;
}

const ProgressDonut = ({ value, size = 56, label }: ProgressDonutProps) => {
  const stroke = Math.max(4, Math.round(size * 0.1));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - clamped / 100);
  const color = getDonutColor(clamped);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
          {clamped}%
        </span>
      </div>
      {label && <span className="text-[11px] text-slate-400">{label}</span>}
    </div>
  );
};

export default ProgressDonut;
