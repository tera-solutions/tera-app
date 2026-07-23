/**
 * Đám mây trang trí. Màu lấy từ `currentColor` nên chỉnh bằng `text-*`,
 * độ mờ/đổ nhoè bằng `opacity-*` / `blur-*` trên className.
 */
const Cloud = ({ className = "h-16 w-32" }: { className?: string }) => (
  <svg
    viewBox="0 0 200 104"
    className={className}
    fill="currentColor"
    aria-hidden
  >
    <ellipse cx="62" cy="60" rx="42" ry="30" />
    <ellipse cx="104" cy="46" rx="40" ry="36" />
    <ellipse cx="146" cy="62" rx="36" ry="28" />
    <rect x="24" y="60" width="152" height="30" rx="15" />
  </svg>
);

export default Cloud;
