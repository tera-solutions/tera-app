import { observer } from "mobx-react-lite";

import DonutStatsCard from "_common/components/DonutStatsCard";
import { useMeta } from "_common/hooks/useMeta";

import type { Lesson } from "../_interface";
import { LESSON_STATUS_META } from "../constants";

interface TeachingProgressCardProps {
  lessons: Lesson[];
  total: number;
}

const TeachingProgressCard = observer(
  ({ lessons, total }: TeachingProgressCardProps) => {
    const { getOptions, getLabel } = useMeta();

    const completed = lessons.filter((l) => l.status === "completed").length;
    const rate = total ? Math.round((completed / total) * 100) : 0;

    const legend = getOptions(LESSON_STATUS_META).map((option) => ({
      key: option.value,
      label: option.label,
      color: option.backgroundColor || option.color || "#cbd5e1",
      value: lessons.filter((l) => l.status === option.value).length,
    }));

    return (
      <DonutStatsCard
        title="Tiến độ giảng dạy"
        legend={legend}
        centerValue={`${rate}%`}
        centerCaption={getLabel(LESSON_STATUS_META, "completed")}
      />
    );
  },
);

export default TeachingProgressCard;
