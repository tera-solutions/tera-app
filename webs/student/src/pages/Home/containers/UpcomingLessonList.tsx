import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDaysOutlined, ChevronRightOutlined } from "tera-dls";

import { STUDENT_PAGE_URL } from "_common/constants/url";
import { IUpcomingLesson } from "_common/services/student/_interface";

interface IProps {
  lessons?: IUpcomingLesson[];
  className?: string;
}

/** Rơi về tự dựng nhãn thời gian nếu API không trả `time_label` */
const buildTimeLabel = (lesson: IUpcomingLesson, t: TFunction) => {
  if (lesson.time_label) return lesson.time_label;
  const date = new Date(lesson.date);
  if (Number.isNaN(date.getTime())) return lesson.date;

  const today = new Date();
  const isTomorrow =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    ).toDateString() === date.toDateString();

  const weekdays = t("date.weekdays", { returnObjects: true }) as string[];
  const day = isTomorrow ? t("date.tomorrow") : weekdays[date.getDay()];
  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day}, ${time}`;
};

/** Danh sách "Bài học sắp tới" — mục 5.6 của task [086] */
const UpcomingLessonList = ({ lessons = [], className = "" }: IProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className={`hana-card p-5 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-hana-navy">
          <CalendarDaysOutlined className="h-5 w-5 text-hana-blue" />
          {t("home.upcoming_title")}
        </h2>
        <Link
          to={STUDENT_PAGE_URL.schedule}
          className="flex items-center gap-0.5 text-sm font-semibold text-hana-blue"
        >
          {t("common.see_all")}
          <ChevronRightOutlined className="h-4 w-4" />
        </Link>
      </div>

      {lessons.length === 0 ? (
        <p className="py-4 text-center text-sm text-hana-muted">
          {t("home.upcoming_empty")}
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() => navigate(STUDENT_PAGE_URL.lessonDetail(lesson.id))}
              className="flex cursor-pointer items-center gap-3 rounded-2xl bg-hana-sky-soft p-3 text-left transition hover:bg-hana-blue-soft"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                <CalendarDaysOutlined className="h-5 w-5 text-hana-blue" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold text-hana-navy">
                  {lesson.title}
                </span>
                <span className="block truncate text-xs text-hana-muted">
                  {buildTimeLabel(lesson, t)}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default UpcomingLessonList;
