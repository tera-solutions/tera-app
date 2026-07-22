import { useTranslation } from "react-i18next";
import {
  CalendarDaysOutlined,
  ChevronRightOutlined,
  ClockOutlined,
} from "tera-dls";

import PersonAvatar from "_common/components/PersonAvatar";
import ProgressStars from "_common/components/ProgressStars";
import { IStudentClass } from "_common/services/student/_interface";

import ClassStatusBadge from "./ClassStatusBadge";
import LessonThumb from "../../Home/containers/LessonThumb";

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

/** Thẻ lớp học ở mobile — mockup screen/mobile/lop hoc.png */
const ClassCard = ({ item, onOpen }: IProps) => {
  const { t } = useTranslation();
  const weekdays = t("date.weekdays", { returnObjects: true }) as string[];
  const done = item.completion_percent >= 100;

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="hana-card flex w-full cursor-pointer items-center gap-2.5 p-3 text-left"
    >
      <LessonThumb
        thumbnail={item.thumbnail}
        emoji={item.emoji}
        gradient={item.gradient}
        showPlay={false}
        className="h-[76px] w-[76px] shrink-0"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 min-w-0 flex-1 text-lg font-bold leading-snug text-hana-navy">
            {item.name}
          </p>
          <ClassStatusBadge status={item.status} />
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <PersonAvatar
            name={item.teacher.name}
            src={item.teacher.avatar}
            className="h-6 w-6 text-[11px]"
          />
          <span className="truncate text-sm text-hana-muted">
            {item.teacher.name}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-hana-navy">
          <span className="flex items-center gap-1">
            <CalendarDaysOutlined className="h-3.5 w-3.5 text-hana-muted" />
            {formatDate(item.date, weekdays)}
          </span>
          <span className="flex items-center gap-1">
            <ClockOutlined className="h-3.5 w-3.5 text-hana-muted" />
            {item.time}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <ProgressStars
            percent={item.completion_percent}
            starClassName="h-5 w-5"
          />
          <span className="shrink-0 text-sm font-semibold text-hana-blue">
            {done
              ? t("classes.status_completed")
              : t("classes.remaining_lessons", {
                  count: item.lesson_total - item.lesson_done,
                })}
          </span>
        </div>
      </div>

      <ChevronRightOutlined className="h-5 w-5 shrink-0 text-hana-muted" />
    </button>
  );
};

export default ClassCard;
