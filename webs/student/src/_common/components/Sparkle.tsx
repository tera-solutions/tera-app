/** Ngôi sao 4 cánh lấp lánh — hình trang trí dùng chung, màu lấy từ `currentColor` */
const Sparkle = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden
  >
    <path d="M12 0c.6 5.9 5.5 10.8 11.4 11.4C17.5 12 12.6 16.9 12 22.8 11.4 16.9 6.5 12 .6 11.4 6.5 10.8 11.4 5.9 12 0z" />
  </svg>
);

export default Sparkle;
