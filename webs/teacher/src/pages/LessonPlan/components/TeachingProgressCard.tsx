import { observer } from "mobx-react-lite";

import Card from "_common/components/Card";
import { useMeta } from "_common/hooks/useMeta";
import ProgressDonut from "pages/Classroom/components/ProgressDonut";

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
      color: option.backgroundColor || option.color,
      value: lessons.filter((l) => l.status === option.value).length,
    }));

    return (
      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">
          Tiến độ giảng dạy
        </p>

        <div className="flex flex-col items-center gap-2 py-2">
          <ProgressDonut value={rate} size={120} />
          <p className="text-xs text-slate-400">
            {getLabel(LESSON_STATUS_META, "completed")}
          </p>
        </div>

        <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
          {legend.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 text-slate-500">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color || "#cbd5e1" }}
                />
                {item.label}
              </span>
              <span className="font-semibold text-slate-700">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>
    );
  },
);

export default TeachingProgressCard;
