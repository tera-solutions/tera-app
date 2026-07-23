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
 * class/course, when known, is filled in by cross-referencing the roster map
 * (studentId -> {class_id,class_name,course_id}) built from class rosters,
 * same pattern as the Parents list. A child not found there (not yet
 * enrolled in any class, or simply outside the fetched page of classes) is
 * still kept — it's a real child of this parent, just without class info
 * yet — never dropped. Dropping them previously made the page show "parent
 * not found / no permission" even when the API call succeeded, just because
 * none of the parent's children were resolvable to a class.
 */
export const toParentChildren = (
  raw: any[] | null | undefined,
  studentRosterMap: Map<number, { class_id: number; class_name: string; course_id: number | null }>,
): ParentChild[] =>
  (raw ?? []).map((c) => {
    const roster = studentRosterMap.get(c.id);
    return {
      id: c.id ?? 0,
      name: c.name ?? "",
      avatar: c.avatar_url ?? c.avatar ?? "",
      relation: c.relation ?? "",
      class_id: roster?.class_id ?? 0,
      class_name: roster?.class_name ?? "",
      course_id: roster?.course_id ?? null,
    };
  });

export const toChildStats = (raw: any): ParentChildStats => ({
  attendance_rate: raw?.attendance_rate ?? 0,
  avg_score: raw?.avg_score ?? null,
  assignment_completion: raw?.homework_completion ?? 0,
});

export const toScheduleSlots = (raw: any[] | null | undefined): ScheduleSlot[] =>
  (raw ?? []).map((item) => ({
    weekday: item.weekday ?? 0,
    start_time: item.start_time ?? "",
    end_time: item.end_time ?? "",
  }));
