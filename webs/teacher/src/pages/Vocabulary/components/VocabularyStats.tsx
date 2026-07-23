import { ReactNode } from "react";
import { BookOpenOutlined, CheckBadgeOutlined, ExclamationCircleOutlined, Squares2x2Outlined } from "tera-dls";

import IconBox from "_common/components/IconBox";
import { CARD } from "_common/constants/dashboard";

import type { VocabularySummary } from "../_interface";

interface StatCardProps {
  icon: ReactNode;
  iconClassName: string;
  value: string;
  label: string;
  caption: string;
  captionClassName?: string;
  loading?: boolean;
}

const StatCard = ({ icon, iconClassName, value, label, caption, captionClassName = "text-slate-400", loading }: StatCardProps) => (
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
        <p className="text-2xl font-bold text-slate-800">{loading ? "—" : value}</p>
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
    </div>
    <p className={`mt-2 text-xs font-medium ${captionClassName}`}>{loading ? "Đang tải..." : caption}</p>
  </div>
);

interface VocabularyStatsProps {
  summary: VocabularySummary;
  loading?: boolean;
}

const VocabularyStats = ({ summary, loading }: VocabularyStatsProps) => (
  <div className="grid grid-cols-2 gap-4 xmd:grid-cols-4">
    <StatCard
      icon={<BookOpenOutlined />}
      iconClassName="bg-sky-50 text-brand"
      value={summary.total.toLocaleString("vi-VN")}
      label="Tổng từ vựng"
      caption="Trên trang hiện tại + toàn bộ dữ liệu"
      loading={loading}
    />
    <StatCard
      icon={<Squares2x2Outlined />}
      iconClassName="bg-violet-50 text-violet-500"
      value={String(summary.topicCount)}
      label="Chủ đề (trang này)"
      caption="Số chủ đề khác nhau đang hiển thị"
      loading={loading}
    />
    <StatCard
      icon={<CheckBadgeOutlined />}
      iconClassName="bg-emerald-50 text-emerald-500"
      value={String(summary.successCount)}
      label="Đã tạo xong"
      caption={`${summary.processingCount} đang xử lý`}
      captionClassName="text-amber-500"
      loading={loading}
    />
    <StatCard
      icon={<ExclamationCircleOutlined />}
      iconClassName="bg-rose-50 text-rose-500"
      value={String(summary.failedCount)}
      label="Lỗi tạo học liệu"
      caption="Trên trang hiện tại"
      captionClassName="text-rose-500"
      loading={loading}
    />
  </div>
);

export default VocabularyStats;
