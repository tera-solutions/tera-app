import { FireSolid } from "tera-dls";

interface IProps {
  className?: string;
  /** Bật khi vừa có sự kiện (streak tăng) — lửa bùng lên rồi tự tắt */
  active?: boolean;
}

/**
 * Ngọn lửa của chip streak.
 *
 * Lúc bình thường **đứng yên** để không tranh chú ý với bài học. Khi `active`
 * bật lên thì 3 lớp cùng bùng: quầng sáng cam lan ra, ngọn ngoài vươn cao, lõi
 * vàng bên trong nhảy nhanh gấp đôi — mỗi lớp một nhịp riêng nên trông như lửa
 * thật chứ không phải icon bị rung. Chạy xong tự về trạng thái tĩnh.
 */
const FlameIcon = ({ className = "h-5 w-5", active = false }: IProps) => (
  <span className={`relative inline-flex shrink-0 ${className}`}>
    {active && (
      <span className="hana-flame-burst-glow absolute inset-0 rounded-full bg-orange-400/50 blur-[5px]" />
    )}
    <FireSolid
      className={`relative h-full w-full text-orange-500 ${
        active ? "hana-flame-burst-outer" : ""
      }`}
    />
    <FireSolid
      className={`absolute bottom-0 left-1/2 h-[62%] w-[62%] -translate-x-1/2 text-amber-300 ${
        active ? "hana-flame-burst-inner" : ""
      }`}
    />
  </span>
);

export default FlameIcon;
