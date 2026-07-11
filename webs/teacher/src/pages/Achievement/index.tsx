import { useMemo, useState } from "react";
import {
  AcademicCapOutlined,
  CheckBadgeOutlined,
  ClipboardDocumentCheckOutlined,
  ClockOutlined,
  StarOutlined,
  UsersOutlined,
} from "tera-dls";

import StatisticCard from "_common/components/StatisticCard";
import { AchievementService } from "@tera/modules/hr";
import { ProfileService } from "@tera/modules/system";

import type { ChartPeriod } from "./_interface";
import {
  toCareerStats,
  toOverview,
  toProgressPoints,
  toTeacherProfile,
  toTeacherReviews,
} from "./_utils";
import TeacherProfileCard from "./components/TeacherProfileCard";
import ProgressChart from "./components/ProgressChart";
import StudentReviewList from "./components/StudentReviewList";

const Achievement = () => {
  const [period, setPeriod] = useState<ChartPeriod>("month");

  const profileQuery = ProfileService.useProfile();
  const profile = useMemo(() => toTeacherProfile(profileQuery.data?.data), [profileQuery.data]);

  const summaryQuery = AchievementService.useAchievementSummary();
  const careerStats = useMemo(
    () => toCareerStats(summaryQuery.data?.data?.career_stats),
    [summaryQuery.data],
  );
  const overview = useMemo(
    () => toOverview(summaryQuery.data?.data?.overview),
    [summaryQuery.data],
  );

  const progressQuery = AchievementService.useAchievementProgress(period);
  const progressPoints = useMemo(
    () => toProgressPoints(progressQuery.data?.data?.chart_data),
    [progressQuery.data],
  );

  const reviewsQuery = AchievementService.useTeacherReviewList({ params: { per_page: 20 } });
  const reviews = useMemo(
    () => toTeacherReviews(reviewsQuery.data?.data?.items),
    [reviewsQuery.data],
  );

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">Thành tích</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Tổng hợp thành tích giảng dạy và đánh giá từ học viên
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_1fr]">
        <TeacherProfileCard profile={profile} loading={profileQuery.isLoading} />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatisticCard
            icon={<AcademicCapOutlined />}
            value={careerStats.total_classes}
            label="Lớp"
            sublabel="Tổng số lớp"
            iconClassName="bg-sky-50 text-brand"
            loading={summaryQuery.isLoading}
          />
          <StatisticCard
            icon={<ClockOutlined />}
            value={careerStats.total_hours}
            label="Giờ"
            sublabel="Tổng giờ dạy"
            iconClassName="bg-violet-50 text-violet-500"
            loading={summaryQuery.isLoading}
          />
          <StatisticCard
            icon={<UsersOutlined />}
            value={careerStats.total_students}
            label="HV"
            sublabel="Tổng học viên"
            iconClassName="bg-emerald-50 text-emerald-500"
            loading={summaryQuery.isLoading}
          />
          <StatisticCard
            icon={<CheckBadgeOutlined />}
            value={`${careerStats.rating_rate}%`}
            label="Rating"
            sublabel="Tỷ lệ đánh giá tốt"
            iconClassName="bg-amber-50 text-amber-500"
            loading={summaryQuery.isLoading}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatisticCard
          icon={<StarOutlined />}
          value={overview.avg_rating || "—"}
          label="Đánh giá TB"
          iconClassName="bg-amber-50 text-amber-500"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={`${overview.satisfaction_rate}%`}
          label="Hài lòng"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<ClipboardDocumentCheckOutlined />}
          value={overview.sessions_count}
          label="Buổi dạy"
          sublabel="Trong tháng"
          iconClassName="bg-sky-50 text-brand"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<AcademicCapOutlined />}
          value={overview.active_classes}
          label="Lớp hiện tại"
          iconClassName="bg-violet-50 text-violet-500"
          loading={summaryQuery.isLoading}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <ProgressChart
          points={progressPoints}
          period={period}
          onPeriodChange={setPeriod}
          loading={progressQuery.isLoading}
        />

        <StudentReviewList
          reviews={reviews}
          isLoading={reviewsQuery.isLoading}
          isError={reviewsQuery.isError}
          onRetry={() => reviewsQuery.refetch()}
        />
      </div>
    </div>
  );
};

export default Achievement;
