import { useTranslation } from "react-i18next";
import { ChartPieOutlined } from "tera-dls";

import { IWeeklyProgress } from "_common/services/student/_interface";

interface IProps {
  progress?: IWeeklyProgress;
  className?: string;
}

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** 390 phút -> "6h30m" */
const formatStudyTime = (minutes = 0) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h${String(m).padStart(2, "0")}m` : `${h}h`;
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-2 border-b border-hana-sky py-2.5 last:border-0">
    <span className="truncate text-sm text-hana-muted">{label}</span>
    <span className="shrink-0 text-sm font-bold text-hana-navy">{value}</span>
  </div>
);

/** Card "Tiến trình học tập" — mục 5.5 của task [086] */
const LearningProgressCard = ({ progress, className = "" }: IProps) => {
  const { t } = useTranslation();
  const percent = progress?.percent ?? 0;

  return (
    <section className={`hana-card p-5 ${className}`}>
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-hana-navy">
        <ChartPieOutlined className="h-5 w-5 text-hana-blue" />
        {t("home.progress_title")}
      </h2>

      <div className="flex items-center gap-5">
        <div className="relative h-[110px] w-[110px] shrink-0">
          <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
            <circle
              cx="55"
              cy="55"
              r={RADIUS}
              fill="none"
              stroke="#e9f2fd"
              strokeWidth="11"
            />
            <circle
              cx="55"
              cy="55"
              r={RADIUS}
              fill="none"
              stroke="#1877f2"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-hana-navy">
              {percent}
              <span className="text-sm">%</span>
            </span>
            <span className="block w-[74px] text-center text-[9px] leading-[11px] text-hana-muted">
              {t("home.progress_caption")}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <Row
            label={t("home.progress_lessons")}
            value={`${progress?.lessons_completed ?? 0}/${progress?.lessons_total ?? 0}`}
          />
          <Row
            label={t("home.progress_exercises")}
            value={`${progress?.exercises_done ?? 0}/${progress?.exercises_total ?? 0}`}
          />
          <Row
            label={t("home.progress_time")}
            value={formatStudyTime(progress?.study_time_minutes)}
          />
        </div>
      </div>
    </section>
  );
};

export default LearningProgressCard;
