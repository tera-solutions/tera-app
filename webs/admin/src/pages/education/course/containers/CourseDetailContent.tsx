/* Import: library */
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

/* Import: pages */
import { ICourse, ICourseStatistics } from "pages/education/course/_interface";

const money = (v?: number | string) =>
  `${Number(v ?? 0).toLocaleString("vi-VN")} ₫`;

export const getCourseDetailTabs = (t: (key: string) => string) => [
  { key: "basic", label: t("course.tab_basic") },
  { key: "operational", label: t("course.tab_operational") },
  { key: "financial", label: t("course.tab_financial") },
  { key: "rating", label: t("course.tab_rating") },
];

const InfoRow = ({ label, value }: { label: string; value?: ReactNode }) => (
  <div className="flex items-start gap-4 py-2.5">
    <span className="w-36 text-[13px] text-gray-500 shrink-0">{label}</span>
    <span className="text-[13px] text-gray-800 font-medium">
      {value === undefined || value === null || value === "" ? "—" : value}
    </span>
  </div>
);

const StatCard = ({
  label,
  value,
  accent = "text-gray-800",
}: {
  label: string;
  value: string | number;
  accent?: string;
}) => (
  <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
    <p className="text-[12px] text-gray-500">{label}</p>
    <p className={`text-base font-bold mt-0.5 ${accent}`}>{value}</p>
  </div>
);

const CourseDetailContent = ({
  course,
  statistics,
  activeTab,
}: {
  course?: ICourse;
  statistics?: ICourseStatistics;
  activeTab: string;
}) => {
  const { t } = useTranslation();
  const op = statistics?.operational ?? {};
  const fin = statistics?.financial ?? {};
  const rating = statistics?.rating ?? {};

  if (activeTab === "operational") {
    return (
      <div className="grid grid-cols-2 xmd:grid-cols-3 gap-2">
        <StatCard
          label={t("course.stat_total_classes")}
          value={op.total_classes ?? 0}
        />
        <StatCard
          label={t("course.stat_active_classes")}
          value={op.active_classes ?? 0}
        />
        <StatCard
          label={t("course.stat_total_students")}
          value={op.total_students ?? 0}
        />
        <StatCard
          label={t("course.stat_studying_students")}
          value={op.studying_students ?? 0}
        />
        <StatCard
          label={t("course.stat_reserved_students")}
          value={op.reserved_students ?? 0}
        />
        <StatCard
          label={t("course.stat_completed_students")}
          value={op.completed_students ?? 0}
        />
      </div>
    );
  }

  if (activeTab === "financial") {
    return (
      <div className="grid grid-cols-2 xmd:grid-cols-3 gap-2">
        <StatCard
          label={t("course.stat_revenue_sales")}
          value={money(fin.revenue_sales)}
          accent="text-emerald-600"
        />
        <StatCard
          label={t("course.stat_recognized_revenue")}
          value={money(fin.recognized_revenue)}
          accent="text-emerald-600"
        />
        <StatCard
          label={t("course.stat_refunds")}
          value={money(fin.refunds)}
          accent="text-amber-600"
        />
        <StatCard
          label={t("course.stat_debt")}
          value={money(fin.debt)}
          accent="text-red-500"
        />
        <StatCard
          label={t("course.stat_balance")}
          value={money(fin.balance)}
        />
      </div>
    );
  }

  if (activeTab === "rating") {
    return (
      <div className="grid grid-cols-2 xmd:grid-cols-3 gap-2">
        <StatCard
          label={t("course.stat_average_rating")}
          value={`${rating.average_rating ?? 0} / 5`}
          accent="text-yellow-500"
        />
        <StatCard
          label={t("course.stat_total_reviews")}
          value={rating.total_reviews ?? 0}
        />
        <StatCard
          label={t("course.stat_satisfaction_rate")}
          value={`${rating.satisfaction_rate ?? 0}%`}
        />
      </div>
    );
  }

  // basic
  return (
    <div className="divide-y divide-gray-100">
      <InfoRow label={t("course.name")} value={course?.name} />
      <InfoRow label={t("course.code")} value={course?.code} />
      <InfoRow
        label={t("course.status")}
        value={
          course?.is_active
            ? t("course.status_active")
            : t("course.status_inactive")
        }
      />
      <InfoRow
        label={t("course.duration_label")}
        value={
          course?.duration_minutes != null
            ? `${course.duration_minutes} ${t("course.minutes")}`
            : undefined
        }
      />
      <InfoRow
        label={t("course.price_amount")}
        value={
          course?.price_per_lesson != null
            ? money(course.price_per_lesson)
            : undefined
        }
      />
      <InfoRow label={t("course.description")} value={course?.description} />
    </div>
  );
};

export default CourseDetailContent;
