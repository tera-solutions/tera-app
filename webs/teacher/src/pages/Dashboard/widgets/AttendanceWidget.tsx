import { useNavigate } from "react-router-dom";
import { ClipboardDocumentCheckOutlined } from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import DashboardCard from "../components/DashboardCard";
import WidgetState from "../components/WidgetState";
import { useDashboardSummary } from "../hooks";

const AttendanceWidget = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const attendance = data?.attendance ?? null;
  const rate =
    attendance && attendance.total > 0
      ? Math.round((attendance.present / attendance.total) * 100)
      : 0;

  return (
    <DashboardCard
      title="Điểm danh"
      icon={<ClipboardDocumentCheckOutlined />}
      actionLabel="Xem chi tiết"
      onAction={() => navigate(PATHS.attendance)}
    >
      <WidgetState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!attendance}
        emptyText="Chưa có dữ liệu điểm danh"
        onRetry={refetch}
      >
        {attendance && (
          <>
            <p className="text-3xl font-bold text-slate-800">
              {attendance.present}
              <span className="text-base font-normal text-slate-400">
                /{attendance.total}
              </span>
            </p>
            <p className="text-xs text-slate-400">Có mặt hôm nay</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${rate}%` }}
              />
            </div>
            <div className="mt-2 flex gap-3 text-xs">
              <span className="font-medium text-emerald-600">
                Có mặt {attendance.present}
              </span>
              <span className="font-medium text-amber-600">
                Muộn {attendance.late}
              </span>
              <span className="font-medium text-rose-600">
                Vắng {attendance.absent}
              </span>
            </div>
          </>
        )}
      </WidgetState>
    </DashboardCard>
  );
};

export default AttendanceWidget;
