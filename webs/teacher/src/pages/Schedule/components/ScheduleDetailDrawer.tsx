import { useNavigate } from "react-router-dom";
import {
  AcademicCapOutlined,
  BookOpenOutlined,
  Button,
  CalendarDaysOutlined,
  ClockOutlined,
  Drawer,
  MapPinOutlined,
  Spin,
  XMarkOutlined,
} from "tera-dls";
import moment from "moment";

import { PATHS } from "_common/components/Layout/Menu/menus";

import { SCHEDULE_STATUS } from "_common/constants/schedule";
import { useScheduleDetail } from "../hooks";

interface ScheduleDetailDrawerProps {
  scheduleId: number | null;
  onClose: () => void;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-2.5">
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-brand [&_svg]:h-4 [&_svg]:w-4">
      {icon}
    </span>
    <div className="min-w-0">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  </div>
);

const ScheduleDetailDrawer = ({
  scheduleId,
  onClose,
}: ScheduleDetailDrawerProps) => {
  const navigate = useNavigate();
  const { data: detail, isLoading } = useScheduleDetail(scheduleId);

  const status = detail
    ? (SCHEDULE_STATUS[detail.status] ?? SCHEDULE_STATUS.upcoming)
    : null;

  return (
    <Drawer
      open={scheduleId != null}
      onClose={onClose}
      placement="right"
      containerClassName="w-full max-w-[420px]"
    >
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-800">
            Chi tiết buổi học
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 [&_svg]:h-5 [&_svg]:w-5"
          >
            <XMarkOutlined />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <Spin spinning={isLoading}>
            {detail ? (
              <>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold text-slate-800">
                      {detail.class_name}
                    </p>
                    <p className="text-sm text-slate-400">{detail.level}</p>
                  </div>
                  {status && (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${status.badge}`}
                    >
                      {status.label}
                    </span>
                  )}
                </div>

                <div className="divide-y divide-slate-100">
                  <InfoRow
                    icon={<CalendarDaysOutlined />}
                    label="Ngày"
                    value={moment(detail.date).format("DD/MM/YYYY")}
                  />
                  <InfoRow
                    icon={<ClockOutlined />}
                    label="Thời gian"
                    value={`${detail.start_time} - ${detail.end_time}`}
                  />
                  <InfoRow
                    icon={<MapPinOutlined />}
                    label="Phòng học"
                    value={detail.room}
                  />
                  <InfoRow
                    icon={<AcademicCapOutlined />}
                    label="Số học viên"
                    value={`${detail.student_count} học viên`}
                  />
                  <InfoRow
                    icon={<BookOpenOutlined />}
                    label="Giáo án"
                    value={detail.lesson_plan?.title ?? "Chưa có giáo án"}
                  />
                </div>
              </>
            ) : (
              !isLoading && (
                <p className="py-10 text-center text-sm text-slate-400">
                  Không tải được chi tiết buổi học
                </p>
              )
            )}
          </Spin>
        </div>

        {detail && (
          <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4">
            <Button
              type="primary"
              className="w-full"
              onClick={() => navigate(`${PATHS.lesson}/${detail.id}`)}
            >
              Bắt đầu buổi học
            </Button>
            <Button
              type="alternative"
              outlined
              className="w-full"
              onClick={() =>
                navigate(`${PATHS.classroom}/${detail.class_id ?? ""}`)
              }
            >
              Xem chi tiết lớp
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default ScheduleDetailDrawer;
