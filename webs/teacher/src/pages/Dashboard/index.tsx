import DashboardGreeting from "./components/DashboardGreeting";
import DashboardHero from "./components/DashboardHero";
import QuickActions from "./components/QuickActions";
import StatsRow from "./widgets/StatsRow";
import ScheduleTodayWidget from "./widgets/ScheduleTodayWidget";
import WeekScheduleWidget from "./widgets/WeekScheduleWidget";
import AssignmentWidget from "./widgets/AssignmentWidget";
import NotificationWidget from "./widgets/NotificationWidget";
import AttendanceWidget from "./widgets/AttendanceWidget";
import ProgressWidget from "./widgets/ProgressWidget";
import LessonPlanWidget from "./widgets/LessonPlanWidget";
import MyClassesWidget from "./widgets/MyClassesWidget";

const Dashboard = () => {
  return (
    <>
      {/* ===================== MOBILE ===================== */}
      <div className="xmd:hidden">
        <DashboardHero />

        <div className="-mt-sidebar-collapsed flex flex-col gap-4 px-4 pt-4">
          <StatsRow />
          <QuickActions />
          <ScheduleTodayWidget />
          <WeekScheduleWidget />
          <AssignmentWidget />
          <NotificationWidget />
        </div>
      </div>

      {/* ===================== DESKTOP ===================== */}
      <div className="hidden p-6 xmd:block">
        <div className="mb-5">
          <DashboardGreeting />
        </div>

        <StatsRow />

        <div className="mt-5 grid grid-cols-4 gap-5">
          <ScheduleTodayWidget />
          <WeekScheduleWidget />
          <AttendanceWidget />
          <AssignmentWidget />
          <NotificationWidget />
          <ProgressWidget />
          <LessonPlanWidget />
          <MyClassesWidget />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
