import {
  BookOpenOutlined,
  ClockOutlined,
  ListBulletOutlined,
  CheckBadgeOutlined,
} from "tera-dls";

import StatisticCard from "_common/components/StatisticCard";

import type { LessonDetail } from "../_interface";

interface LessonStatRowProps {
  detail: LessonDetail;
}

const LessonStatRow = ({ detail }: LessonStatRowProps) => (
  <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
    <StatisticCard
      icon={<BookOpenOutlined />}
      value={detail.objectives.length}
      label="Mục tiêu"
      sublabel="Mục tiêu bài học"
      iconClassName="bg-sky-50 text-brand"
    />
    <StatisticCard
      icon={<ListBulletOutlined />}
      value={detail.activities.length}
      label="Hoạt động"
      sublabel="Hoạt động trong bài"
      iconClassName="bg-emerald-50 text-emerald-500"
    />
    <StatisticCard
      icon={<ClockOutlined />}
      value={detail.duration}
      label="Thời gian"
      sublabel="Số phút"
      iconClassName="bg-amber-50 text-amber-500"
    />
    <StatisticCard
      icon={<CheckBadgeOutlined />}
      value={`${detail.completion_rate}%`}
      label="Mức độ đạt"
      sublabel="Trung bình lớp"
      iconClassName="bg-violet-50 text-violet-500"
    />
  </div>
);

export default LessonStatRow;
