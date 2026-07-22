import boyImg from "@/assets/characters/boy.png";

interface IProps {
  name?: string;
  src?: string | null;
  className?: string;
}

/**
 * Avatar học viên: dùng ảnh thật nếu có, không thì rơi về nhân vật mặc định
 * (agents/claude/student/bot/be-trai.jpg đã tách nền).
 */
const StudentAvatar = ({ name, src, className = "h-10 w-10" }: IProps) => (
  <span
    className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-hana-blue-soft ring-2 ring-white ${className}`}
    title={name}
  >
    <img
      src={src || boyImg}
      alt={name ?? "Học viên"}
      className="h-full w-full object-cover object-top"
    />
  </span>
);

export default StudentAvatar;
