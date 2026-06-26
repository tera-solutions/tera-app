import { ReactNode } from "react";
import { Spin } from "tera-dls";

import { STAT_CARD } from "_common/constants/dashboard";

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  iconClassName?: string;
  loading?: boolean;
}

const StatCard = ({
  icon,
  value,
  label,
  iconClassName = "bg-sky-50 text-brand",
  loading,
}: StatCardProps) => {
  return (
    <div className={STAT_CARD}>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl [&_svg]:h-6 [&_svg]:w-6 ${iconClassName}`}
      >
        {icon}
      </div>
      <div className="leading-tight">
        {loading ? (
          <Spin spinning size="small" />
        ) : (
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        )}
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
