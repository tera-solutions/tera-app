import type {
  AchievementOverview,
  CareerStats,
  ProgressPoint,
  TeacherProfile,
  TeacherReview,
} from "./_interface";

export const toTeacherProfile = (raw: any): TeacherProfile => ({
  full_name: raw?.full_name ?? "",
  avatar_url: raw?.avatar_url ?? "",
  role_name: raw?.role_name ?? "Giáo viên",
});

export const toCareerStats = (raw: any): CareerStats => ({
  total_classes: raw?.total_classes ?? 0,
  total_hours: raw?.total_hours ?? 0,
  total_students: raw?.total_students ?? 0,
  rating_rate: raw?.rating_rate ?? 0,
});

export const toOverview = (raw: any): AchievementOverview => ({
  avg_rating: raw?.avg_rating ?? 0,
  satisfaction_rate: raw?.satisfaction_rate ?? 0,
  sessions_count: raw?.sessions_count ?? 0,
  active_classes: raw?.active_classes ?? 0,
});

export const toProgressPoints = (raw: any[] | null | undefined): ProgressPoint[] =>
  (raw ?? []).map((p) => ({
    label: p.label ?? "",
    rating: p.rating ?? null,
    students: p.students ?? 0,
    sessions: p.sessions ?? 0,
  }));

export const toTeacherReview = (raw: any): TeacherReview => ({
  id: raw.id ?? 0,
  student_name: raw.student?.name ?? "Học viên",
  student_avatar: raw.student?.avatar_url ?? "",
  rating: raw.rating ?? 0,
  content: raw.content ?? "",
  created_at: raw.created_at ?? "",
});

export const toTeacherReviews = (raw: any[] | null | undefined): TeacherReview[] =>
  (raw ?? []).map(toTeacherReview);
