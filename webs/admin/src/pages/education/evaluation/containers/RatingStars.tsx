interface IProps {
  score?: string | number; // 0–5
  max?: number;
  showValue?: boolean;
  size?: number; // px
}

const Star = ({ fill, size }: { fill: number; size: number }) => {
  // fill: 0 (rỗng) → 1 (đầy); hỗ trợ nửa sao qua clip
  const id = `star-${Math.random().toString(36).slice(2)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="#f59e0b" />
          <stop offset={`${fill * 100}%`} stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M12 2l2.9 6.26L21.8 9.3l-4.9 4.78L18.18 21 12 17.27 5.82 21 7.1 14.08 2.2 9.3l6.9-1.04L12 2z"
      />
    </svg>
  );
};

/** Hiển thị điểm số dưới dạng 5 sao (hỗ trợ nửa sao) + số điểm tuỳ chọn. */
const RatingStars = ({ score, max = 5, showValue = true, size = 16 }: IProps) => {
  const value = Number(score) || 0;

  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return <Star key={i} fill={fill} size={size} />;
        })}
      </span>
      {showValue && (
        <span className="text-[13px] font-semibold text-gray-700">
          {value ? value.toFixed(2).replace(/\.?0+$/, "") : "—"}
        </span>
      )}
    </span>
  );
};

export default RatingStars;
