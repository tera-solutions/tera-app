import { useTranslation } from "react-i18next";
import { ChartPieOutlined, ClockOutlined } from "tera-dls";

import ProgressPath from "_common/components/ProgressPath";
import ProgressStars from "_common/components/ProgressStars";
import { IWeeklyProgress } from "_common/services/student/_interface";

interface IProps {
  progress?: IWeeklyProgress;
  className?: string;
}

const percentOf = (done = 0, total = 0) =>
  total ? Math.round((done / total) * 100) : 0;
const LearningProgressCard = ({ progress, className = "" }: IProps) => {
  const { t } = useTranslation();

  /** 390 phút -> "6 giờ 30 phút" / "6 hours 30 minutes" theo locale */
  const formatStudyTime = (minutes = 0) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (!h) return t("home.progress_time_minutes", { minutes: m });
    return m
      ? t("home.progress_time_hours_minutes", { hours: h, minutes: m })
      : t("home.progress_time_hours", { hours: h });
  };

  const lessonsDone = progress?.lessons_completed ?? 0;
  const lessonsTotal = progress?.lessons_total ?? 0;
  const remaining = Math.max(0, lessonsTotal - lessonsDone);

  const rows = [
    {
      label: t("home.progress_lessons_label"),
      done: lessonsDone,
      total: lessonsTotal,
    },
    {
      label: t("home.progress_exercises_label"),
      done: progress?.exercises_done ?? 0,
      total: progress?.exercises_total ?? 0,
    },
  ];

  return (
    <section className={`hana-card p-5 ${className}`}>
      <h2 className='mb-3 flex items-center gap-2 text-lg font-bold text-hana-navy'>
        <ChartPieOutlined className='h-5 w-5 text-hana-blue' />
        {t("home.progress_title")}
      </h2>

      {/* Câu nói thay cho con số phần trăm */}
      <p className='text-lg font-bold text-hana-blue'>
        {remaining > 0
          ? t("home.progress_remaining", { count: remaining })
          : t("home.progress_all_done")}
      </p>

      <ProgressPath
        done={lessonsDone}
        total={lessonsTotal}
        className='mb-4 mt-3'
      />

      <div className='flex flex-col'>
        {rows.map(({ label, done, total }) => (
          <div
            key={label}
            className='flex items-center justify-between gap-2 border-b border-hana-sky py-2.5'
          >
            <span className='text-base text-hana-muted'>{label}</span>
            <span className='flex items-center gap-2'>
              <ProgressStars
                percent={percentOf(done, total)}
                starClassName='h-4 w-4'
              />
              <span className='text-sm font-semibold text-hana-navy/85'>
                {done}/{total}
              </span>
            </span>
          </div>
        ))}

        <div className='flex items-center justify-between gap-2 py-2.5'>
          <span className='flex items-center gap-2 text-base text-hana-muted'>
            <ClockOutlined className='h-5 w-5 text-hana-muted' />
            {t("home.progress_time")}
          </span>
          <span className='text-base font-bold text-hana-navy'>
            {formatStudyTime(progress?.study_time_minutes)}
          </span>
        </div>
      </div>
    </section>
  );
};

export default LearningProgressCard;
