import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BookOpenOutlined, SparklesOutlined } from "tera-dls";

import { STUDENT_PAGE_URL } from "_common/constants/url";
import { IContinueLesson } from "_common/services/student/_interface";

import LessonThumb from "./LessonThumb";

interface IProps {
  lesson?: IContinueLesson | null;
  className?: string;
}

/** Card "Tiếp tục học" — mục 5.3 của task [086] */
const ContinueLearningCard = ({ lesson, className = "" }: IProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className={`hana-card p-5 ${className}`}>
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-hana-navy">
        <BookOpenOutlined className="h-5 w-5 text-hana-blue" />
        {t("home.continue_title")}
      </h2>

      {/* Chưa có bài đang dở: ẩn tiến độ, mời bắt đầu bài đầu tiên (test case #6) */}
      {!lesson ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <SparklesOutlined className="h-10 w-10 text-hana-blue" />
          <p className="text-sm font-medium text-hana-muted">
            {t("home.empty_continue")}
          </p>
          <button
            type="button"
            onClick={() => navigate(STUDENT_PAGE_URL.lessons)}
            className="cursor-pointer rounded-full bg-hana-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-hana-blue-dark"
          >
            {t("home.start_learning")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row">
          <LessonThumb
            thumbnail={lesson.thumbnail}
            emoji={lesson.emoji}
            gradient={lesson.gradient}
            className="h-28 w-full shrink-0 sm:w-40"
          />

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            {!!lesson.lesson_no && (
              <span className="w-fit rounded-full bg-hana-sky px-2.5 py-0.5 text-xs font-semibold text-hana-muted">
                {t("home.lesson_no", { no: lesson.lesson_no })}
              </span>
            )}
            <p className="truncate text-lg font-bold text-hana-navy">
              {lesson.title}
            </p>

            <div className="flex items-center gap-2">
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-hana-sky">
                <span
                  className="block h-full rounded-full bg-hana-blue transition-all"
                  style={{ width: `${lesson.progress}%` }}
                />
              </span>
              <span className="text-xs font-semibold text-hana-muted">
                {lesson.progress}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate(STUDENT_PAGE_URL.lessonDetail(lesson.id))}
              className="mt-1 w-fit cursor-pointer rounded-full bg-hana-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-hana-blue-dark"
            >
              {t("home.continue_button")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContinueLearningCard;
