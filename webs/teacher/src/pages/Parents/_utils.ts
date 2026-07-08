import type { ParentRow, ParentSummary, RosterEntry } from "./_interface";

/**
 * `crm/parent/list` has no teacher/class scoping (unlike Student/ClassRoom),
 * so it returns every parent in the business. Each parent's `children[]` is
 * intersected against the teacher's own roster (built by scanning their
 * classes, same pattern as `Feedback`/`StudentDetail`) to keep only parents
 * who actually have a child in one of the teacher's classes, and to drop any
 * children the teacher doesn't teach from the row.
 */
export const toParentRows = (
  raw: any[] | null | undefined,
  studentRosterMap: Map<number, RosterEntry>,
): ParentRow[] => {
  const rows: ParentRow[] = [];

  (raw ?? []).forEach((p) => {
    const ownChildren = (p.children ?? []).filter((c: any) => studentRosterMap.has(c.id));
    if (ownChildren.length === 0) return;

    rows.push({
      id: p.id ?? 0,
      name: p.name ?? "",
      avatar: p.avatar_url ?? p.avatar ?? "",
      relation: ownChildren[0]?.relation ?? "",
      phone: p.phone ?? "",
      email: p.email ?? "",
      children: ownChildren.map((c: any) => {
        const roster = studentRosterMap.get(c.id);
        return {
          id: c.id ?? 0,
          name: c.name ?? "",
          class_id: roster?.class_id ?? 0,
          class_name: roster?.class_name ?? "",
        };
      }),
    });
  });

  return rows;
};

export const toParentSummary = (rows: ParentRow[]): ParentSummary => {
  const childIds = new Set<number>();
  const classIds = new Set<number>();
  rows.forEach((r) =>
    r.children.forEach((c) => {
      childIds.add(c.id);
      if (c.class_id) classIds.add(c.class_id);
    }),
  );

  return {
    total_parents: rows.length,
    total_children: childIds.size,
    total_classes: classIds.size,
  };
};
