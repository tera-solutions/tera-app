import { useTranslation } from "react-i18next";

import { STUDENT_PAGE_URL } from "_common/constants/url";
import { useStudentHome } from "_common/services/student/home.service";

import ContinueLearningCard from "./containers/ContinueLearningCard";
import LearningProgressCard from "./containers/LearningProgressCard";
import QuickLinkCard from "./containers/QuickLinkCard";
import SuggestedLessonGrid from "./containers/SuggestedLessonGrid";
import UpcomingLessonList from "./containers/UpcomingLessonList";
import WelcomeBanner from "./containers/WelcomeBanner";

/** [086] Trang chủ — agents/claude/student/tasks/086_trang_chu_screen.md */
const HomePage = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useStudentHome();

  if (isLoading) {
    return (
      <div className="flex animate-pulse flex-col gap-4">
        <div className="h-52 rounded-hana-lg bg-white/70" />
        <div className="grid gap-4 xl:grid-cols-12">
          <div className="h-44 rounded-hana bg-white/70 xl:col-span-5" />
          <div className="h-44 rounded-hana bg-white/70 xl:col-span-3" />
          <div className="h-44 rounded-hana bg-white/70 xl:col-span-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <WelcomeBanner topic={data?.today_topic} />

      <div className="grid gap-4 xl:grid-cols-12">
        <ContinueLearningCard
          lesson={data?.continue_lesson}
          className="xl:col-span-5"
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-3 xl:grid-cols-1">
          <QuickLinkCard
            emoji="🎒"
            title={t("home.quick_class_title")}
            description={t("home.quick_class_desc")}
            to={STUDENT_PAGE_URL.classes}
          />
          <QuickLinkCard
            emoji="👨‍👩‍👧"
            title={t("home.quick_parent_title")}
            description={t("home.quick_parent_desc")}
            to={STUDENT_PAGE_URL.parentDashboard}
          />
        </div>

        {/* Cột phải chạy suốt 2 hàng như mockup desktop */}
        <div className="flex flex-col gap-4 xl:col-span-4 xl:row-span-2">
          <LearningProgressCard progress={data?.weekly_progress} />
          <UpcomingLessonList lessons={data?.upcoming_lessons} />
        </div>

        <SuggestedLessonGrid
          lessons={data?.suggested_lessons}
          className="xl:col-span-8"
        />
      </div>
    </div>
  );
};

export default HomePage;
