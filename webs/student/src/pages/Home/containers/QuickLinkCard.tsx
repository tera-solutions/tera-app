import { useNavigate } from "react-router-dom";

interface IProps {
  emoji: string;
  title: string;
  description: string;
  to: string;
  className?: string;
}

/** Ô lối tắt "Vào lớp học" / "Dành cho phụ huynh" — mục 5.4 của task [086] */
const QuickLinkCard = ({
  emoji,
  title,
  description,
  to,
  className = "",
}: IProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={`hana-card flex w-full cursor-pointer items-center gap-3 p-5 text-left transition hover:-translate-y-0.5 ${className}`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-hana-sky text-3xl">
        {emoji}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-lg font-bold text-hana-blue">
          {title}
        </span>
        <span className="block truncate text-base text-hana-muted">
          {description}
        </span>
      </span>
    </button>
  );
};

export default QuickLinkCard;
