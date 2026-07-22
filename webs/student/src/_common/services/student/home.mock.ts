import { IHomeData } from "./_interface";

/**
 * Dữ liệu giả cho màn Trang chủ, dựng theo đúng mockup
 * agents/claude/student/screen/desktop/trang chu.png.
 *
 * Chưa có ảnh minh họa bài học nên `thumbnail` để null; UI tự vẽ ô gradient +
 * emoji thay ảnh (xem `LessonThumb`). Khi backend trả URL ảnh thật thì
 * `thumbnail` sẽ được ưu tiên, không cần sửa UI.
 */
export const homeMock: IHomeData = {
  student: {
    name: "Minh",
    avatar: null,
    streak: 7,
    xp: 320,
  },
  today_topic: "Động vật",
  continue_lesson: {
    id: 12,
    lesson_no: 12,
    title: "Động vật trong rừng",
    progress: 65,
    thumbnail: null,
    emoji: "🦁",
    gradient: "from-emerald-200 to-lime-100",
  },
  weekly_progress: {
    percent: 65,
    lessons_completed: 13,
    lessons_total: 20,
    exercises_done: 8,
    exercises_total: 12,
    study_time_minutes: 390,
  },
  upcoming_lessons: [
    {
      id: 13,
      title: "Bài 13: Động vật biển",
      date: "2026-07-23T08:00:00Z",
      time_label: "Ngày mai, 08:00",
    },
    {
      id: 14,
      title: "Bài 14: Chim và côn trùng",
      date: "2026-07-24T09:30:00Z",
      time_label: "Thứ 6, 09:30",
    },
  ],
  suggested_lessons: [
    {
      id: 15,
      lesson_no: 15,
      title: "Sinh vật biển",
      duration_minutes: 12,
      is_new: true,
      thumbnail: null,
      emoji: "🐬",
      gradient: "from-sky-200 to-cyan-100",
    },
    {
      id: 16,
      lesson_no: 16,
      title: "Động vật nông trại",
      duration_minutes: 15,
      is_new: true,
      thumbnail: null,
      emoji: "🐄",
      gradient: "from-amber-200 to-yellow-100",
    },
    {
      id: 17,
      lesson_no: 17,
      title: "Côn trùng quanh em",
      duration_minutes: 10,
      is_new: true,
      thumbnail: null,
      emoji: "🐞",
      gradient: "from-rose-200 to-orange-100",
    },
    {
      id: 18,
      lesson_no: 18,
      title: "Các loại chim",
      duration_minutes: 14,
      is_new: false,
      thumbnail: null,
      emoji: "🐦",
      gradient: "from-indigo-200 to-sky-100",
    },
  ],
};

export const unreadNotificationMock = { count: 3 };
