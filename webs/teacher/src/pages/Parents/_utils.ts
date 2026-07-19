import type { ParentRow, ParentSummary, RosterEntry } from "./_interface";

/**
 * `crm/parent/list` (like `edu/student/list`) is business-scoped only, not
 * teacher-scoped — every parent in the business is returned, same as
 * `/students` shows every business student regardless of who teaches them.
 * So parents are never filtered out here; `studentRosterMap` (built by
 * scanning the teacher's own classes, same pattern as `/students`'
 * `studentClassMap`) is used purely to ENRICH each child with a class name
 * when the API's `children[]` doesn't carry one — never to hide a row.
 * Filtering a parent out just because their child isn't in one of this
 * teacher's classes previously made freshly created students/parents vanish
 * from their own list right after creation.
 */
export const toParentRows = (
  raw: any[] | null | undefined,
  studentRosterMap: Map<number, RosterEntry>,
): ParentRow[] =>
  (raw ?? []).map((p) => {
    const children = (p.children ?? []).map((c: any) => {
      const roster = studentRosterMap.get(c.id);
      return {
        id: c.id ?? 0,
        name: c.name ?? "",
        class_id: roster?.class_id ?? 0,
        class_name: roster?.class_name ?? "",
      };
    });

    return {
      id: p.id ?? 0,
      name: p.name ?? "",
      avatar: p.avatar_url ?? p.avatar ?? "",
      relation: p.children?.[0]?.relation ?? "",
      phone: p.phone ?? "",
      email: p.email ?? "",
      children,
    };
  });

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
