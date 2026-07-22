import { PlaySolid } from "tera-dls";

interface IProps {
  thumbnail?: string | null;
  emoji?: string;
  gradient?: string;
  className?: string;
  showPlay?: boolean;
}

/**
 * Ảnh minh họa bài học. Mock chưa có ảnh thật nên vẽ ô gradient + emoji;
 * khi API trả `thumbnail` thì hiển thị ảnh, không phải sửa chỗ gọi.
 */
const LessonThumb = ({
  thumbnail,
  emoji = "📘",
  gradient = "from-sky-200 to-cyan-100",
  className = "",
  showPlay = true,
}: IProps) => (
  <div
    className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} ${className}`}
  >
    {thumbnail ? (
      <img src={thumbnail} alt="" className="h-full w-full object-cover" />
    ) : (
      <span className="text-4xl select-none">{emoji}</span>
    )}
    {showPlay && (
      <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 shadow-hana-sm">
        <PlaySolid className="h-3.5 w-3.5 translate-x-[1px] text-hana-blue" />
      </span>
    )}
  </div>
);

export default LessonThumb;
