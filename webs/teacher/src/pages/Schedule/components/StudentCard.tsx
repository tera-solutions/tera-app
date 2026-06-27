import { AcademicCapOutlined } from "tera-dls";

import { CARD } from "_common/constants/dashboard";
import WidgetState from "_common/components/WidgetState";

interface StudentCardProps {
  count: number;
  /** Growth vs. last month, in percent. Mirrors the mobile StudentOverviewCard. */
  growthPercent?: number;
  loading?: boolean;
}

const StudentCard = ({
  count,
  growthPercent = 8,
  loading,
}: StudentCardProps) => {
  return (
    <div className={`${CARD} flex flex-col gap-3 p-4`}>
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-emerald-500">
        <AcademicCapOutlined />
        Học viên
      </p>
      <WidgetState isLoading={loading}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="leading-tight">
              <p className="text-3xl font-bold text-emerald-600">{count}</p>
              <p className="text-xs text-slate-400">học viên</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 [&_svg]:h-7 [&_svg]:w-7">
              <AcademicCapOutlined />
            </div>
          </div>
          {growthPercent != null && (
            <p className="text-xs">
              <span className="font-semibold text-emerald-600">
                ↑ {growthPercent}%
              </span>{" "}
              <span className="text-slate-400">so với tháng trước</span>
            </p>
          )}
        </div>
      </WidgetState>
    </div>
  );
};

export default StudentCard;
