interface IProps {
  percent: number;
  /** Đường kính (px) */
  size?: number;
  strokeWidth?: number;
  className?: string;
  /** Màu vòng chạy — mặc định xanh thương hiệu, 100% thì dùng xanh lá */
  color?: string;
}

/** Vòng tròn tiến độ nhỏ có % ở giữa (cột "Tiến độ" của danh sách lớp học) */
const MiniDonut = ({
  percent,
  size = 58,
  strokeWidth = 5,
  className = "",
  color,
}: IProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const stroke = color ?? (percent >= 100 ? "#22c55e" : "#1877f2");

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e9f2fd"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - Math.min(100, percent) / 100)}
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-hana-navy">
        {percent}%
      </span>
    </div>
  );
};

export default MiniDonut;
