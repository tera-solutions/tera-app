interface IProps {
  className?: string;
  /** Màu cánh hoa — mặc định xanh thương hiệu */
  color?: string;
  /** Màu nhụy ở giữa */
  coreColor?: string;
}

/** Bông hoa 6 cánh của logo Hana, tách riêng để dùng lại làm hình trang trí */
const HanaFlower = ({
  className = "h-8 w-8",
  color = "#1877f2",
  coreColor = "#ffffff",
}: IProps) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    {[0, 60, 120, 180, 240, 300].map((deg) => (
      <ellipse
        key={deg}
        cx="16"
        cy="9"
        rx="4.6"
        ry="6.8"
        fill={color}
        opacity={0.85}
        transform={`rotate(${deg} 16 16)`}
      />
    ))}
    <circle cx="16" cy="16" r="3.4" fill={coreColor} />
  </svg>
);

export default HanaFlower;
