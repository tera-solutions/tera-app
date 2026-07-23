interface IProps {
  name?: string;
  src?: string | null;
  className?: string;
}

/** Lấy chữ cái đầu của TÊN (từ cuối) để làm avatar chữ: "Cô Hana" -> "H" */
const getInitial = (name?: string) => {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  return parts.length ? parts[parts.length - 1][0]?.toUpperCase() : "?";
};

/** Avatar giáo viên / người dùng: dùng ảnh nếu có, không thì hiện chữ cái đầu */
const PersonAvatar = ({ name, src, className = "h-10 w-10" }: IProps) => (
  <span
    title={name}
    className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-hana-blue-soft text-sm font-bold text-hana-blue ${className}`}
  >
    {src ? (
      <img
        src={src}
        alt={name ?? ""}
        className="h-full w-full object-cover object-top"
      />
    ) : (
      getInitial(name)
    )}
  </span>
);

export default PersonAvatar;
