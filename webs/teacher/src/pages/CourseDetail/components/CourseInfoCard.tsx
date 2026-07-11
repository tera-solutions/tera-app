import { ReactNode } from "react";
import {
  BookOpenOutlined,
  ClockOutlined,
  CurrencyDollarOutlined,
  IdentificationOutlined,
} from "tera-dls";

import Badge from "_common/components/Badge";
import { CARD } from "_common/constants/dashboard";
import { getCoverGradient } from "pages/Classroom/constants";

import type { CourseDetail } from "../_interface";

interface CourseInfoCardProps {
  detail: CourseDetail;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) => (
  <div className="flex items-center gap-2 py-1.5">
    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-400 [&_svg]:h-4 [&_svg]:w-4">
      {icon}
    </span>
    <span className="w-28 shrink-0 text-xs text-slate-400">{label}</span>
    <span className="min-w-0 text-sm font-medium text-slate-700">{value}</span>
  </div>
);

const CourseInfoCard = ({ detail }: CourseInfoCardProps) => {
  const statusLabel = detail.is_active ? "Đang mở" : "Ngừng hoạt động";

  return (
    <div className={`${CARD} overflow-hidden`}>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
        <div
          className={`relative flex min-h-55 flex-col justify-between bg-linear-to-br p-5 text-white ${getCoverGradient(
            detail.id,
          )}`}
        >
          <span className="self-start rounded-full bg-white/25 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
            {statusLabel}
          </span>
          <div className="flex flex-1 items-center justify-center py-4 [&_svg]:h-16 [&_svg]:w-16 [&_svg]:opacity-80">
            {detail.thumbnail ? (
              <img
                src={detail.thumbnail}
                alt={detail.name}
                className="max-h-32 rounded-xl object-cover"
              />
            ) : (
              <BookOpenOutlined />
            )}
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">{detail.name}</p>
            {detail.code && <p className="text-sm text-white/80">{detail.code}</p>}
          </div>
        </div>

        <div className="p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">{detail.name}</h2>
            <Badge
              className={`px-2.5 py-0.5 text-[11px] ${
                detail.is_active
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {statusLabel}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            <InfoRow
              icon={<IdentificationOutlined />}
              label="Mã khóa học"
              value={detail.code || "—"}
            />
            <InfoRow
              icon={<ClockOutlined />}
              label="Thời lượng"
              value={`${detail.duration_minutes} phút / buổi`}
            />
            <InfoRow
              icon={<CurrencyDollarOutlined />}
              label="Học phí"
              value={`${detail.price_per_lesson.toLocaleString("en-US")}đ / buổi`}
            />
          </div>

          {detail.description && (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-400">Mô tả khóa học</p>
              <p className="mt-1 text-sm text-slate-600">{detail.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseInfoCard;
