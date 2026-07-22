import { IScheduleMonth, IStudentClass, IStudyStats } from "./_interface";

/** Đúng 5 lớp trong mockup screen/desktop/lop hoc.png */
export const classListMock: IStudentClass[] = [
  {
    id: 1,
    name: "Animals Adventure",
    thumbnail: null,
    lesson_done: 5,
    lesson_total: 20,
    teacher: { name: "Cô Hana", avatar: null },
    date: "2026-07-27",
    time: "16:00 - 16:45",
    completion_percent: 25,
    status: "today",
    emoji: "🦁",
    gradient: "from-emerald-200 to-lime-100",
  },
  {
    id: 2,
    name: "ABC Phonics",
    thumbnail: null,
    lesson_done: 8,
    lesson_total: 20,
    teacher: { name: "Cô Hana", avatar: null },
    date: "2026-07-28",
    time: "16:00 - 16:45",
    completion_percent: 40,
    status: "studying",
    emoji: "🔤",
    gradient: "from-sky-200 to-cyan-100",
  },
  {
    id: 3,
    name: "My Family",
    thumbnail: null,
    lesson_done: 1,
    lesson_total: 20,
    teacher: { name: "Cô Mai", avatar: null },
    date: "2026-07-29",
    time: "16:00 - 16:45",
    completion_percent: 5,
    status: "upcoming",
    emoji: "👨‍👩‍👧",
    gradient: "from-amber-200 to-orange-100",
  },
  {
    id: 4,
    name: "Colors & Shapes",
    thumbnail: null,
    lesson_done: 12,
    lesson_total: 20,
    teacher: { name: "Cô Mai", avatar: null },
    date: "2026-07-30",
    time: "16:00 - 16:45",
    completion_percent: 60,
    status: "upcoming",
    emoji: "⭐",
    gradient: "from-yellow-200 to-rose-100",
  },
  {
    id: 5,
    name: "Daily Conversation",
    thumbnail: null,
    lesson_done: 20,
    lesson_total: 20,
    teacher: { name: "Thầy Nam", avatar: null },
    date: "2026-07-31",
    time: "16:00 - 16:45",
    completion_percent: 100,
    status: "completed",
    emoji: "💬",
    gradient: "from-indigo-200 to-sky-100",
  },
];

export const studyStatsMock: IStudyStats = {
  lessons_completed: 20,
  lessons_total: 20,
  exercises_done: 12,
  study_time_minutes: 390,
  xp: 320,
};

/** Ngày có lịch học trong tháng hiện tại (mock sinh theo tháng đang xem) */
export const buildScheduleMock = (
  year: number,
  month: number,
): IScheduleMonth => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // giả lập lịch học các ngày 6, 8, 13, 20, 27 nếu tháng đó có
  const days = [6, 8, 13, 20, 27].filter((d) => d <= daysInMonth);
  return {
    days_with_class: days.map((d) => `${year}-${pad(month + 1)}-${pad(d)}`),
  };
};
