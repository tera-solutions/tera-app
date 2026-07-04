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
