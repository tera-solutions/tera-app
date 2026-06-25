import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import {
  AcademicCapOutlined,
  ArrowRightOnRectangleOutlined,
  ArrowTrendingUpOutlined,
  BellOutlined,
  BookOpenOutlined,
  CalendarDaysOutlined,
  ChartBarOutlined,
  ChatBubbleLeftRightOutlined,
  ClipboardDocumentCheckOutlined,
  DocumentTextOutlined,
  PencilSquareOutlined,
  SquaresPlusOutlined,
  UsersOutlined,
} from "tera-dls";

import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { AuthApi } from "@tera/api/auth/auth";
import { useStores } from "@tera/stores/useStores";

import { PATHS } from "_common/components/Layout/Menu/menus";
import { HERO_GRADIENT } from "_common/constants/dashboard";
import { tokenStorage } from "_common/constants/auth";
import { useStates } from "_common/hooks/useStates";
import { getUserDisplay } from "_common/utils/user";

import DashboardCard from "./components/DashboardCard";
import QuickActionCard from "./components/QuickActionCard";
import StatCard from "./components/StatCard";
import {
  ATTENDANCE_SUMMARY,
  COMPLETION_RATE,
  GRADING_QUEUE,
  HOMEROOM_CLASSES,
  MY_CLASSES,
  NOTIFICATIONS,
  RECENT_LESSON_PLANS,
  STATS,
  STUDENTS,
  TODAY_SCHEDULE,
  TODOS,
  type ClassItem,
  type ScheduleItem,
  type TodoItem,
} from "./mock";

const STAT_ICONS: Record<string, ReactNode> = {
  students: <AcademicCapOutlined />,
  classes: <UsersOutlined />,
  sessions: <CalendarDaysOutlined />,
  completion: <ChartBarOutlined />,
};

const STAT_ICON_STYLES: Record<string, string> = {
  students: "bg-sky-50 text-sky-500",
  classes: "bg-emerald-50 text-emerald-500",
  sessions: "bg-violet-50 text-violet-500",
  completion: "bg-amber-50 text-amber-500",
};

const QUICK_ACTIONS = [
  {
    label: "Điểm danh",
    icon: <ClipboardDocumentCheckOutlined />,
    to: PATHS.attendance,
    iconClassName: "bg-sky-50 text-sky-500",
  },
  {
    label: "Nhập điểm",
    icon: <PencilSquareOutlined />,
    to: PATHS.grading,
    iconClassName: "bg-emerald-50 text-emerald-500",
  },
  {
    label: "Bài tập",
    icon: <DocumentTextOutlined />,
    to: PATHS.homework,
    badge: 3,
    iconClassName: "bg-orange-50 text-orange-500",
  },
  {
    label: "Nhận xét",
    icon: <ChatBubbleLeftRightOutlined />,
    to: PATHS.comments,
    iconClassName: "bg-violet-50 text-violet-500",
  },
  {
    label: "Lịch dạy",
    icon: <CalendarDaysOutlined />,
    to: PATHS.schedule,
    iconClassName: "bg-sky-50 text-sky-500",
  },
  {
    label: "Giáo án",
    icon: <BookOpenOutlined />,
    to: PATHS.lessonPlans,
    iconClassName: "bg-rose-50 text-rose-500",
  },
  {
    label: "Báo cáo",
    icon: <ChartBarOutlined />,
    to: PATHS.reports,
    iconClassName: "bg-amber-50 text-amber-500",
  },
  {
    label: "Khác",
    icon: <SquaresPlusOutlined />,
    to: PATHS.more,
    iconClassName: "bg-slate-100 text-slate-500",
  },
];

const TODO_TONES: Record<TodoItem["tone"], string> = {
  sky: "bg-sky-50 text-sky-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
  rose: "bg-rose-50 text-rose-600",
};

const ProgressRing = ({ value }: { value: number }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-brand"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-800">{value}%</span>
        <span className="text-[10px] text-slate-400">Hoàn thành</span>
      </div>
    </div>
  );
};

const ScheduleRow = ({ item }: { item: ScheduleItem }) => (
  <div className="flex items-center gap-3 py-2.5">
    <div className="w-14 shrink-0 text-center">
      <p className="text-sm font-semibold text-slate-800">{item.time}</p>
      <p className="text-[11px] text-slate-400">{item.endTime}</p>
    </div>
    <span
      className={`h-9 w-1 rounded-full ${
        item.status === "done" ? "bg-slate-200" : "bg-brand"
      }`}
    />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-slate-800">
        {item.className}
      </p>
      <p className="truncate text-xs text-slate-400">{item.room}</p>
    </div>
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        item.status === "done"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-sky-50 text-sky-600"
      }`}
    >
      {item.status === "done" ? "Đã dạy" : "Sắp diễn ra"}
    </span>
  </div>
);

const ClassRow = ({ item }: { item: ClassItem }) => (
  <div className="flex items-center gap-3 py-2.5">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sm font-semibold text-brand">
      {item.level.slice(0, 1)}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
      <p className="text-xs text-slate-400">{item.students} học viên</p>
    </div>
  </div>
);

const TodoRow = ({ item }: { item: TodoItem }) => (
  <div className="flex items-center justify-between py-2.5">
    <div className="flex items-center gap-3">
      <span className={`h-2.5 w-2.5 rounded-full ${TODO_TONES[item.tone]}`} />
      <span className="text-sm text-slate-700">{item.label}</span>
    </div>
    <span
      className={`flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold ${TODO_TONES[item.tone]}`}
    >
      {item.count}
    </span>
  </div>
);

const NotificationList = () => (
  <div className="divide-y divide-slate-100">
    {NOTIFICATIONS.map((n) => (
      <div key={n.id} className="flex items-start gap-3 py-2.5">
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-brand [&_svg]:h-4 [&_svg]:w-4">
          <BellOutlined />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-800">
            {n.title}
          </p>
          <p className="text-xs text-slate-400">{n.time}</p>
        </div>
        {n.unread && (
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
        )}
      </div>
    ))}
  </div>
);

const StudentsCard = () => (
  <DashboardCard
    title="Học viên"
    icon={<AcademicCapOutlined />}
    actionLabel="Tổng số"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-slate-800">72</p>
        <p className="text-xs text-slate-400">học viên đang theo học</p>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 [&_svg]:h-4 [&_svg]:w-4">
        <ArrowTrendingUpOutlined />
        8%
      </div>
    </div>
    <div className="mt-3 flex -space-x-2">
      {STUDENTS.map((s) => (
        <span
          key={s.id}
          title={s.name}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-sky-100 text-xs font-semibold text-sky-600"
        >
          {s.name.slice(0, 1)}
        </span>
      ))}
      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-500">
        +68
      </span>
    </div>
  </DashboardCard>
);

const Dashboard = observer(() => {
  const {
    globalStore: { user, clear },
  } = useStores();
  const {
    commonStore: { clear: clearCommon },
  } = useStates();
  const { name, role, initials } = getUserDisplay(user);

  // Same logout workflow as the admin portal (AuthApi.logout + clear stores);
  // route guards handle the redirect to login.
  const handleLogoutCleanup = () => {
    clear();
    clearCommon();
    tokenStorage.clearTokens();
  };

  const { mutate: onLogout } = useMutationLegacy({
    mutationFn: AuthApi.logout,
    onSuccess: handleLogoutCleanup,
    onError: handleLogoutCleanup,
  });

  return (
    <>
      {/* ===================== MOBILE ===================== */}
      <div className="xmd:hidden">
        <div className={`${HERO_GRADIENT} rounded-b-[30%] px-4 pr-10 pb-20 pt-10 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">Hana Edu ⭐</p>
              <p className="text-sm font-medium">Xin chào, {name} 👋</p>
              <p className="mt-0.5 text-xs text-white/80">
                Chúc cô một ngày dạy học hiệu quả!
              </p>
            </div>
            <div className="relative shrink-0">
              <div className="h-16 w-16 overflow-hidden rounded-full border-[3px] border-white bg-sky-100 shadow-sm">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xl font-bold text-brand">
                    {initials}
                  </span>
                )}
              </div>
              <span className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-white px-2.5 py-1 shadow-md">
                <AcademicCapOutlined className="h-3.5 w-3.5 text-brand" />
                <span className="text-[11px] font-semibold text-brand">
                  {role}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="-mt-18 flex flex-col gap-4 px-4 pt-4">
          <DashboardCard
            title="Lịch dạy hôm nay"
            icon={<CalendarDaysOutlined />}
            actionLabel="Xem tất cả"
          >
            <div className="divide-y divide-slate-100">
              {TODAY_SCHEDULE.map((item) => (
                <ScheduleRow key={item.id} item={item} />
              ))}
            </div>
          </DashboardCard>

          <div className="grid grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <QuickActionCard key={action.label} {...action} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DashboardCard title="Lớp chủ nhiệm" icon={<UsersOutlined />}>
              <p className="text-3xl font-bold text-slate-800">3</p>
              <p className="text-xs text-slate-400">
                {HOMEROOM_CLASSES.map((c) => c.name).join(" · ")}
              </p>
            </DashboardCard>
            <StudentsCard />
          </div>

          <DashboardCard
            title="Việc cần làm"
            icon={<ClipboardDocumentCheckOutlined />}
          >
            <div className="divide-y divide-slate-100">
              {TODOS.map((item) => (
                <TodoRow key={item.id} item={item} />
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Thông báo mới"
            icon={<BellOutlined />}
            actionLabel="Xem tất cả"
          >
            <NotificationList />
          </DashboardCard>
        </div>
      </div>

      {/* ===================== DESKTOP ===================== */}
      <div className="hidden xmd:block p-6">
        <div className="grid grid-cols-4 gap-5">
          {STATS.map((stat) => (
            <StatCard
              key={stat.key}
              value={stat.value}
              label={stat.label}
              icon={STAT_ICONS[stat.key]}
              iconClassName={STAT_ICON_STYLES[stat.key]}
            />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-4 gap-5">
          <DashboardCard
            className="col-span-2"
            title="Lịch dạy hôm nay"
            icon={<CalendarDaysOutlined />}
            actionLabel="Xem tất cả"
          >
            <div className="divide-y divide-slate-100">
              {TODAY_SCHEDULE.map((item) => (
                <ScheduleRow key={item.id} item={item} />
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Điểm danh"
            icon={<ClipboardDocumentCheckOutlined />}
          >
            <p className="text-3xl font-bold text-slate-800">
              {ATTENDANCE_SUMMARY.present}
              <span className="text-base font-normal text-slate-400">
                /{ATTENDANCE_SUMMARY.total}
              </span>
            </p>
            <p className="text-xs text-slate-400">Có mặt hôm nay</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${ATTENDANCE_SUMMARY.rate}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-medium text-emerald-600">
              Tỷ lệ {ATTENDANCE_SUMMARY.rate}%
            </p>
          </DashboardCard>

          <DashboardCard
            title="Thông báo mới"
            icon={<BellOutlined />}
            actionLabel="Xem tất cả"
          >
            <NotificationList />
          </DashboardCard>

          <DashboardCard
            title="Bài tập cần chấm"
            icon={<DocumentTextOutlined />}
            actionLabel="Xem tất cả"
          >
            <div className="divide-y divide-slate-100">
              {GRADING_QUEUE.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {g.className}
                    </p>
                    <p className="text-xs text-slate-400">{g.task}</p>
                  </div>
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-50 px-2 text-xs font-semibold text-orange-600">
                    {g.count}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Tiến độ học tập"
            icon={<ChartBarOutlined />}
            bodyClassName="flex items-center gap-4"
          >
            <ProgressRing value={COMPLETION_RATE} />
            <ul className="flex-1 space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-slate-500">Đã hoàn thành</span>
                <span className="font-semibold text-slate-800">85%</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-500">Đang học</span>
                <span className="font-semibold text-slate-800">10%</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-500">Chưa bắt đầu</span>
                <span className="font-semibold text-slate-800">5%</span>
              </li>
            </ul>
          </DashboardCard>

          <DashboardCard
            title="Giáo án gần đây"
            icon={<BookOpenOutlined />}
            actionLabel="Xem tất cả"
          >
            <div className="divide-y divide-slate-100">
              {RECENT_LESSON_PLANS.map((lp) => (
                <div
                  key={lp.id}
                  className="flex items-center justify-between py-2.5"
                >
                  <p className="min-w-0 truncate text-sm font-medium text-slate-800">
                    {lp.name}
                  </p>
                  <span className="shrink-0 text-xs text-slate-400">
                    {lp.updatedAt}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Lớp học của tôi"
            icon={<UsersOutlined />}
            actionLabel="Xem tất cả"
          >
            <div className="divide-y divide-slate-100">
              {MY_CLASSES.map((item) => (
                <ClassRow key={item.id} item={item} />
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Lịch dạy tuần này"
            icon={<CalendarDaysOutlined />}
            bodyClassName="grid grid-cols-7 gap-1.5"
          >
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, idx) => {
              const sessions = [2, 3, 1, 4, 2, 0, 0][idx];
              return (
                <div
                  key={day}
                  className="flex flex-col items-center gap-1.5 rounded-lg bg-slate-50 py-2"
                >
                  <span className="text-[11px] text-slate-400">{day}</span>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                      sessions > 0
                        ? "bg-brand text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {sessions}
                  </span>
                </div>
              );
            })}
          </DashboardCard>
        </div>
      </div>
    </>
  );
});

export default Dashboard;
