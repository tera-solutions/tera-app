import { ReactNode } from "react";
import {
  AcademicCapOutlined,
  CalendarDaysOutlined,
  CheckBadgeOutlined,
  ClipboardDocumentCheckOutlined,
  ClipboardDocumentListOutlined,
  DocumentTextOutlined,
  StarOutlined,
  UserMinusOutlined,
  UsersOutlined,
} from "tera-dls";

import { CARD } from "_common/constants/dashboard";

import type { ClassStatistics } from "../_interface";

interface OverviewStatsProps {
  statistics: ClassStatistics;
}

interface Tile {
  icon: ReactNode;
  value: string | number;
  label: string;
  tone: string;
  soon?: boolean;
}

const OverviewStats = ({ statistics }: OverviewStatsProps) => {
  const { students, operational } = statistics;

  const tiles: Tile[] = [
    {
      icon: <UsersOutlined />,
      value: students.total,
      label: "Tổng số học viên",
      tone: "bg-sky-50 text-brand",
    },
    {
      icon: <CheckBadgeOutlined />,
      value: students.active,
      label: "Học viên tham gia",
      tone: "bg-emerald-50 text-emerald-500",
    },
    {
      icon: <UserMinusOutlined />,
      value: students.dropped,
      label: "Học viên nghỉ",
      tone: "bg-rose-50 text-rose-500",
    },
    {
      icon: <StarOutlined />,
      value: "—",
      label: "Điểm trung bình",
      tone: "bg-amber-50 text-amber-500",
      soon: true,
    },
    {
      icon: <ClipboardDocumentCheckOutlined />,
      value: "—",
      label: "Hoàn thành bài tập",
      tone: "bg-violet-50 text-violet-500",
      soon: true,
    },
    {
      icon: <DocumentTextOutlined />,
      value: "—",
      label: "Bài tập đã giao",
      tone: "bg-indigo-50 text-indigo-500",
      soon: true,
    },
    {
      icon: <CalendarDaysOutlined />,
      value: operational.completed_sessions,
      label: "Buổi học đã diễn ra",
      tone: "bg-sky-50 text-brand",
    },
    {
      icon: <ClipboardDocumentListOutlined />,
      value: operational.total_sessions,
      label: "Buổi học tổng",
      tone: "bg-slate-100 text-slate-500",
    },
    {
      icon: <AcademicCapOutlined />,
      value: `${operational.avg_attendance_rate}%`,
      label: "Tỷ lệ điểm danh TB",
      tone: "bg-emerald-50 text-emerald-500",
    },
  ];

  return (
    <div className={`${CARD} p-4`}>
      <p className="mb-3 text-sm font-semibold text-slate-700">
        Tổng quan lớp học
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [&_svg]:h-5 [&_svg]:w-5 ${tile.tone}`}
            >
              {tile.icon}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-slate-800">{tile.value}</p>
              <p className="flex items-center gap-1 text-xs text-slate-400">
                {tile.label}
                {tile.soon && (
                  <span className="rounded bg-slate-100 px-1 text-[10px] text-slate-400">
                    Sắp có
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewStats;
