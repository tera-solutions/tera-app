import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { QUICK_ACTION } from "_common/constants/dashboard";

interface QuickActionCardProps {
  icon: ReactNode;
  label: string;
  to?: string;
  badge?: number;
  iconClassName?: string;
}

const QuickActionCard = ({
  icon,
  label,
  to,
  badge,
  iconClassName = "bg-sky-50 text-brand",
}: QuickActionCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={QUICK_ACTION}
      onClick={() => to && navigate(to)}
    >
      <span
        className={`relative flex h-11 w-11 items-center justify-center rounded-xl [&_svg]:h-6 [&_svg]:w-6 ${iconClassName}`}
      >
        {icon}
        {badge != null && badge > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {badge}
          </span>
        )}
      </span>
      <span className="text-xs font-medium text-slate-700">{label}</span>
    </button>
  );
};

export default QuickActionCard;
