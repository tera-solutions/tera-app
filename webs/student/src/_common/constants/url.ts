/**
 * Route của web học viên — đặt theo mục "3. Điều kiện truy cập" trong
 * agents/claude/student/tasks/086..104.
 */
export const STUDENT_PAGE_URL = {
  home: "/home",
  classes: "/classes",
  classDetail: (id: number | string) => `/classes/${id}`,
  lessons: "/lessons",
  lessonDetail: (id: number | string) => `/lesson/${id}`,
  exercises: "/exercises",
  practice: "/practice",
  achievements: "/achievements",
  friends: "/friends",
  parentDashboard: "/parent-dashboard",
  settings: "/settings",
  schedule: "/schedule",
  rewards: "/rewards",
  companion: "/companion",
  library: "/library",
  libraryVideo: (id: number | string) => `/library/${id}`,
  profile: "/profile",
} as const;
