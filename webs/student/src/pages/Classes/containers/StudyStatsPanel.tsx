import { useTranslation } from "react-i18next";
import {
  ClipboardDocumentListOutlined,
  ClockOutlined,
  DocumentTextOutlined,
  StarSolid,
} from "tera-dls";

import { useStudyStats } from "_common/services/student/class.service";

/** 390 -> "6h 30m" */
const formatStudyTime = (minutes = 0) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
};

/** Thống kê học tập — mục 5.4 của task [087] */
const StudyStatsPanel = () => {
  const { t } = useTranslation();
  const { data } = useStudyStats();

  const rows = [
    {
      icon: DocumentTextOutlined,
      tone: "bg-blue-50 text-hana-blue",
      value: `${data?.lessons_completed ?? 0}/${data?.lessons_total ?? 0}`,
      label: t("classes.stats_lessons"),
    },
    {
      icon: ClipboardDocumentListOutlined,
      tone: "bg-sky-50 text-sky-500",
      value: String(data?.exercises_done ?? 0),
      label: t("classes.stats_exercises"),
    },
    {
      icon: ClockOutlined,
      tone: "bg-violet-50 text-violet-500",
      value: formatStudyTime(data?.study_time_minutes),
      label: t("classes.stats_time"),
    },
    {
      icon: StarSolid,
      tone: "bg-amber-50 text-amber-400",
      value: `${data?.xp ?? 0} XP`,
      label: t("classes.stats_xp"),
    },
  ];

  return (
    <section className="hana-card p-4">
      <h2 className="mb-3 text-lg font-bold text-hana-navy">
        {t("classes.stats_title")}
      </h2>

      <div className="flex flex-col">
        {rows.map(({ icon: Icon, tone, value, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 border-b border-hana-sky py-2.5 last:border-0"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-bold text-hana-navy">
                {value}
              </span>
              <span className="block truncate text-sm text-hana-muted">
                {label}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudyStatsPanel;
