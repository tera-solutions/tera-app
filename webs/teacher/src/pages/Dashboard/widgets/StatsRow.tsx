import StatisticCard from "_common/components/StatisticCard";

import { STAT_META } from "../constants";
import { useDashboardSummary } from "../hooks";

const StatsRow = () => {
  const { data, isLoading, isError } = useDashboardSummary();
  const stats = data?.stats;

  const cards = [
    {
      key: "students",
      label: "Học viên",
      value: stats?.students_enrolled ?? "--",
    },
    {
      key: "classes",
      label: "Lớp đang dạy",
      value: stats?.active_classes ?? "--",
    },
    {
      key: "sessions",
      label: "Buổi dạy hôm nay",
      value: stats?.lessons_today ?? "--",
    },
    {
      key: "completion",
      label: "Tỷ lệ hoàn thành",
      value: stats ? `${stats.completion_rate}%` : "--",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xmd:grid-cols-4 xmd:gap-5">
      {cards.map((card) => (
        <StatisticCard
          key={card.key}
          value={isError ? "--" : String(card.value)}
          label={card.label}
          loading={isLoading}
          icon={STAT_META[card.key].icon}
          iconClassName={STAT_META[card.key].iconClassName}
        />
      ))}
    </div>
  );
};

export default StatsRow;
