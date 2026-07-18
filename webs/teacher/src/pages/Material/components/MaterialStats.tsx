import {
  BookOpenOutlined,
  ClipboardDocumentListOutlined,
  FolderOpenOutlined,
  PencilSquareOutlined,
  RectangleGroupOutlined,
} from "tera-dls";

import StatisticCard from "_common/components/StatisticCard";

import type { MaterialSummary } from "../_interface";

interface MaterialStatsProps {
  summary: MaterialSummary;
  loading?: boolean;
}

const MaterialStats = ({ summary, loading }: MaterialStatsProps) => (
  <div className="grid grid-cols-2 gap-4 xmd:grid-cols-5">
    <StatisticCard
      icon={<FolderOpenOutlined />}
      value={summary.total}
      label="Tổng tài liệu"
      iconClassName="bg-sky-50 text-brand"
      loading={loading}
    />
    <StatisticCard
      icon={<BookOpenOutlined />}
      value={summary.byType.document ?? 0}
      label="Giáo án"
      iconClassName="bg-emerald-50 text-emerald-500"
      loading={loading}
    />
    <StatisticCard
      icon={<RectangleGroupOutlined />}
      value={summary.byType.presentation ?? 0}
      label="Bài giảng"
      iconClassName="bg-orange-50 text-orange-500"
      loading={loading}
    />
    <StatisticCard
      icon={<PencilSquareOutlined />}
      value={summary.byType.exam ?? 0}
      label="Đề kiểm tra"
      iconClassName="bg-violet-50 text-violet-500"
      loading={loading}
    />
    <StatisticCard
      icon={<ClipboardDocumentListOutlined />}
      value={summary.byType.worksheet ?? 0}
      label="Phiếu bài tập"
      iconClassName="bg-rose-50 text-rose-500"
      loading={loading}
    />
  </div>
);

export default MaterialStats;
