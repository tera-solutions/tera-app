import { ReactNode } from "react";

import { CARD } from "_common/constants/dashboard";
import WidgetState from "_common/components/WidgetState";

interface StatisticCardProps {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  sublabel?: string;
  iconClassName?: string;
  loading?: boolean;
}

const StatisticCard = ({
  icon,
  value,
  label,
  sublabel,
  iconClassName = "bg-sky-50 text-brand",
  loading,
}: StatisticCardProps) => {
  return (
    <div className={`${CARD} p-4`}>
      <WidgetState isLoading={loading}>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl [&_svg]:h-6 [&_svg]:w-6 ${iconClassName}`}
          >
            {icon}
          </div>
          <div className="leading-tight">
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm font-medium text-slate-600">{label}</p>
            {sublabel && (
              <p className="text-xs text-slate-400">{sublabel}</p>
            )}
          </div>
        </div>
      </WidgetState>
    </div>
  );
};

export default StatisticCard;
