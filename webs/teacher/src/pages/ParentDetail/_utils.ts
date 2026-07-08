import type { ParentChild, ParentChildStats, ParentDetail, ScheduleSlot } from "./_interface";

export const toParentDetail = (raw: any): ParentDetail | null => {
  if (!raw) return null;
  return {
    id: raw.id ?? 0,
    name: raw.name ?? "",
    avatar: raw.avatar_url ?? raw.avatar ?? "",
    phone: raw.phone ?? "",
    email: raw.email ?? "",
  };
};

/**
 * `ParentResource.children[]` only carries `{id,name,avatar,relation}` — the
 * class/course is resolved by cross-referencing the teacher's own roster map
 * (studentId -> {class_id,class_name}), same fix used on the Parents list.
 * Children the teacher doesn't teach are dropped (access guard upstream).
 */
export const toParentChildren = (
  raw: any[] | null | undefined,
  studentRosterMap: Map<number, { class_id: number; class_name: string; course_id: number | null }>,
): ParentChild[] =>
  (raw ?? [])
    .filter((c) => studentRosterMap.has(c.id))
    .map((c) => {
      const roster = studentRosterMap.get(c.id)!;
      return {
        id: c.id ?? 0,
        name: c.name ?? "",
        avatar: c.avatar_url ?? c.avatar ?? "",
        relation: c.relation ?? "",
        class_id: roster.class_id,
        class_name: roster.class_name,
        course_id: roster.course_id,
      };
    });

export const toChildStats = (raw: any): ParentChildStats => ({
  attendance_rate: raw?.attendance_rate ?? 0,
  avg_score: raw?.avg_score ?? null,
  homework_completion: raw?.homework_completion ?? 0,
});

export const toScheduleSlots = (raw: any[] | null | undefined): ScheduleSlot[] =>
  (raw ?? []).map((item) => ({
    weekday: item.weekday ?? 0,
    start_time: item.start_time ?? "",
    end_time: item.end_time ?? "",
  }));
