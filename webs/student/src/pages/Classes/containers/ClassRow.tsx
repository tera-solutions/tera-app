import { useTranslation } from "react-i18next";
import {
  CalendarDaysOutlined,
  ChevronRightOutlined,
  ClockOutlined,
} from "tera-dls";

import ProgressStars from "_common/components/ProgressStars";
import PersonAvatar from "_common/components/PersonAvatar";
import { IStudentClass } from "_common/services/student/_interface";

import ClassStatusBadge from "./ClassStatusBadge";
import LessonThumb from "../../Home/containers/LessonThumb";

/** Các cột dùng chung cho hàng tiêu đề và từng dòng để luôn thẳng hàng */
export const CLASS_GRID =
  "grid grid-cols-[minmax(0,1fr)_84px_116px_120px_116px_116px_32px] items-center gap-3";

interface IProps {
  item: IStudentClass;
  onOpen: (item: IStudentClass) => void;
}

const formatDate = (date: string, weekdays: string[]) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${weekdays[d.getDay()]}, ${day}/${month}`;
};

/** Một dòng lớp học ở desktop — mockup screen/desktop/lop hoc.png */
const ClassRow = ({ item, onOpen }: IProps) => {
  const { t } = useTranslation();
  const weekdays = t("date.weekdays", { returnObjects: true }) as string[];
  const done = item.completion_percent >= 100;

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={`hana-card w-full cursor-pointer px-4 py-3 text-left transition hover:-translate-y-0.5 ${CLASS_GRID}`}
    >
      {/* Ảnh + tên lớp + tiến độ bài */}
      <div className="flex min-w-0 items-center gap-3">
        <LessonThumb
          thumbnail={item.thumbnail}
          emoji={item.emoji}
          gradient={item.gradient}
          showPlay={false}
          className="h-[68px] w-[104px] shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-lg font-bold leading-snug text-hana-navy">
            {item.name}
          </p>
          <p className="mt-0.5 text-sm text-hana-muted">
            {t("classes.lesson_progress", {
              done: item.lesson_done,
              total: item.lesson_total,
            })}
          </p>
          <span className="mt-1.5 block h-2 w-full max-w-[170px] overflow-hidden rounded-full bg-hana-sky">
            <span
              className={`block h-full rounded-full ${done ? "bg-hana-mint" : "bg-hana-blue"}`}
              style={{ width: `${item.completion_percent}%` }}
            />
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <PersonAvatar
          name={item.teacher.name}
          src={item.teacher.avatar}
          className="h-10 w-10"
        />
        <span className="max-w-full truncate text-sm text-hana-muted">
          {item.teacher.name}
        </span>
      </div>

      <span className="flex items-center justify-center gap-1.5 text-base text-hana-navy">
        <CalendarDaysOutlined className="h-4 w-4 shrink-0 text-hana-muted" />
        {formatDate(item.date, weekdays)}
      </span>

      <span className="flex items-center justify-center gap-1.5 text-base text-hana-navy">
        <ClockOutlined className="h-4 w-4 shrink-0 text-hana-muted" />
        {item.time}
      </span>

      <ProgressStars
        percent={item.completion_percent}
        className="mx-auto"
        starClassName="h-4 w-4"
      />

      <ClassStatusBadge status={item.status} className="mx-auto" />

      <ChevronRightOutlined className="mx-auto h-5 w-5 text-hana-muted" />
    </button>
  );
};

export default ClassRow;
