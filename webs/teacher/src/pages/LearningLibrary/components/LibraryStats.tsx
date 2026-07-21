import { ReactNode } from "react";
import { ArrowSmallUpOutlined, BookOpenOutlined, DocumentTextOutlined, StarOutlined, VideoCameraOutlined } from "tera-dls";

import IconBox from "_common/components/IconBox";
import { CARD } from "_common/constants/dashboard";

import { LIBRARY_SUMMARY } from "../mock";

interface StatCardProps {
  icon: ReactNode;
  iconClassName: string;
  value: string;
  label: string;
  delta: number;
}

const StatCard = ({ icon, iconClassName, value, label, delta }: StatCardProps) => (
  <div className={`${CARD} p-4`}>
    <div className="flex items-center gap-3">
      <IconBox
        icon={icon}
        sizeClassName="h-12 w-12"
        roundedClassName="rounded-2xl"
        colorClassName={iconClassName}
        iconSizeClassName="[&_svg]:h-6 [&_svg]:w-6"
      />
      <div className="leading-tight">
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
    </div>
    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-500">
      <ArrowSmallUpOutlined className="h-3.5 w-3.5" />
      {delta}% so với tháng trước
    </p>
  </div>
);

const LibraryStats = () => (
  <div className="grid grid-cols-2 gap-4 xmd:grid-cols-4">
    <StatCard
      icon={<BookOpenOutlined />}
      iconClassName="bg-sky-50 text-brand"
      value={String(LIBRARY_SUMMARY.total)}
      label="Tổng học liệu"
      delta={LIBRARY_SUMMARY.totalDelta}
    />
    <StatCard
      icon={<VideoCameraOutlined />}
      iconClassName="bg-rose-50 text-rose-500"
      value={String(LIBRARY_SUMMARY.videoCount)}
      label="Video bài học"
      delta={LIBRARY_SUMMARY.videoDelta}
    />
    <StatCard
      icon={<DocumentTextOutlined />}
      iconClassName="bg-violet-50 text-violet-500"
      value={String(LIBRARY_SUMMARY.worksheetCount)}
      label="Worksheet"
      delta={LIBRARY_SUMMARY.worksheetDelta}
    />
    <StatCard
      icon={<StarOutlined />}
      iconClassName="bg-amber-50 text-amber-500"
      value={`${LIBRARY_SUMMARY.favoriteRate}%`}
      label="Được giáo viên sử dụng"
      delta={LIBRARY_SUMMARY.favoriteDelta}
    />
  </div>
);

export default LibraryStats;
