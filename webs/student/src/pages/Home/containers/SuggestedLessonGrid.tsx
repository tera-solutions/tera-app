import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRightOutlined, SparklesOutlined } from "tera-dls";

import { STUDENT_PAGE_URL } from "_common/constants/url";
import { ISuggestedLesson } from "_common/services/student/_interface";

import LessonThumb from "./LessonThumb";

interface IProps {
  lessons?: ISuggestedLesson[];
  className?: string;
}

/** Lưới "Bài học đề xuất cho bạn" — mục 5.7 của task [086] */
const SuggestedLessonGrid = ({ lessons = [], className = "" }: IProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className={`hana-card p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-hana-navy">
          <SparklesOutlined className="h-5 w-5 text-hana-blue" />
          {t("home.suggested_title")}
        </h2>
        <Link
          to={STUDENT_PAGE_URL.lessons}
          className="-mr-2 flex h-12 items-center gap-0.5 px-2 text-base font-semibold text-hana-blue"
        >
          {t("common.see_all")}
          <ChevronRightOutlined className="h-4 w-4" />
        </Link>
      </div>

      {lessons.length === 0 ? (
        <p className="py-4 text-center text-base text-hana-muted">
          {t("home.suggested_empty")}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() => navigate(STUDENT_PAGE_URL.lessonDetail(lesson.id))}
              className="group cursor-pointer text-left"
            >
              <div className="relative">
                <LessonThumb
                  thumbnail={lesson.thumbnail}
                  emoji={lesson.emoji}
                  gradient={lesson.gradient}
                  className="h-24 w-full transition group-hover:-translate-y-0.5"
                />
                {lesson.is_new && (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
                    {t("home.badge_new")}
                  </span>
                )}
              </div>
              <p className="mt-2 truncate text-lg font-semibold text-hana-navy">
                {lesson.title}
              </p>
              <p className="flex items-center justify-between gap-2 text-sm text-hana-muted">
                {!!lesson.lesson_no && (
                  <span>{t("home.lesson_no", { no: lesson.lesson_no })}</span>
                )}
                <span>
                  {t("home.duration", { minutes: lesson.duration_minutes })}
                </span>
              </p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default SuggestedLessonGrid;
