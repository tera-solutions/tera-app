import type { StudentListItem, StudentListResult, StudentSummary } from "./_interface";

const toStudentListItem = (raw: any): StudentListItem => ({
  id: raw.id ?? 0,
  code: raw.code ?? "",
  name: raw.name ?? "",
  avatar: raw.avatar ?? "",
  dob: raw.dob ?? "",
  class_name: raw.class_name ?? raw.class?.name ?? "",
  class_level: raw.level?.name ?? raw.class?.course?.name ?? "",
  phone: raw.phone ?? raw.parent_phone ?? "",
  avg_score: raw.avg_score ?? null,
  status: raw.status ?? "",
  enrolled_at: raw.enrolled_at ?? "",
});

export const toStudentListResult = (raw: any): StudentListResult => {
  const items = (raw?.items ?? []).map(toStudentListItem);
  const pagination = raw?.pagination ?? raw?.meta ?? {};
  return {
    items,
    total: pagination.total ?? items.length,
    page: pagination.current_page ?? pagination.page ?? 1,
    per_page: pagination.per_page ?? items.length,
  };
};

/**
 * `edu_student` list/detail resources carry no `class`/`avg_score` field at
 * all (the teacher-scoped Student endpoint only returns identity/profile
 * data) — every row rendered "—" for "Lớp học"/"Điểm TB"/"Xếp loại" as a
 * result. Both are filled in from data the app already fetches elsewhere on
 * this session's screens: class via the roster-scan pattern
 * (`Feedback`/`StudentDetail`), score via the latest `Evaluation` per
 * student (`Feedback`/`Ranking`'s stand-in for a dedicated avg-score field).
 * "Xếp loại" needs no separate source — it's already a pure function of
 * `avg_score` via `getRank()`.
 */
export const enrichStudentRows = (
  items: StudentListItem[],
  studentClassMap: Map<number, string>,
  studentScoreMap: Map<number, number>,
): StudentListItem[] =>
  items.map((item) => ({
    ...item,
    class_name: item.class_name || studentClassMap.get(item.id) || "",
    avg_score: item.avg_score ?? studentScoreMap.get(item.id) ?? null,
  }));

/** Prefer the server-provided summary; fall back to counting the loaded page. */
export const toStudentSummary = (
  raw: any,
  items: StudentListItem[],
): StudentSummary => ({
  total: raw?.total ?? items.length,
  active: raw?.active ?? items.filter((i) => i.status === "active").length,
  dropped: raw?.dropped ?? items.filter((i) => i.status === "dropped").length,
  completed: raw?.completed ?? items.filter((i) => i.status === "completed").length,
});
