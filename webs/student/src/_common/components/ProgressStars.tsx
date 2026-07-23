import { StarOutlined, StarSolid } from "tera-dls";

interface IProps {
  /** 0–100 */
  percent: number;
  /** Số sao của thang, mặc định 5 */
  total?: number;
  className?: string;
  starClassName?: string;
}

/**
 * Tiến độ dạng DÃY SAO thay cho con số phần trăm — trẻ chưa học phần trăm vẫn
 * hiểu ngay "được mấy sao".
 *
 * Sao **đầy dần**: các sao đã qua tô đầy, sao đang tới chỉ tô đúng phần tỉ lệ
 * (65% -> 3 sao đầy + 1 sao đầy 1/4). Làm tròn XUỐNG nên **chỉ 100% mới đủ 5
 * sao** — tránh chuyện 90% đã nhìn như học xong.
 */
const ProgressStars = ({
  percent,
  total = 5,
  className = "",
  starClassName = "h-5 w-5",
}: IProps) => {
  const safe = Math.min(100, Math.max(0, percent));
  const value = (safe / 100) * total;

  return (
    <span
      className={`flex items-center gap-0.5 ${className}`}
      title={`${percent}%`}
    >
      {Array.from({ length: total }, (_, i) => {
        // phần của ngôi sao thứ i được tô: 1 = đầy, 0 = rỗng
        const fill = Math.min(1, Math.max(0, value - i));

        if (fill >= 1) {
          return (
            <StarSolid key={i} className={`${starClassName} text-hana-sun`} />
          );
        }

        if (fill <= 0) {
          return (
            <StarOutlined
              key={i}
              className={`${starClassName} text-hana-muted/40`}
            />
          );
        }

        return (
          <span
            key={i}
            className={`relative inline-block shrink-0 ${starClassName}`}
          >
            <StarOutlined className="absolute inset-0 h-full w-full text-hana-muted/40" />
            {/* Lớp phủ bị cắt theo tỉ lệ; ngôi sao bên trong giữ nguyên bề rộng
                gốc (100 / fill %) để không bị bóp méo. */}
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <StarSolid
                className="h-full max-w-none text-hana-sun"
                style={{ width: `${100 / fill}%` }}
              />
            </span>
          </span>
        );
      })}
    </span>
  );
};

export default ProgressStars;
