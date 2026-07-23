import type { AssignmentHeader, SubmissionDetail, SubmissionRow } from "./_interface";

export const toSubmissionRow = (raw: any): SubmissionRow => ({
  id: raw.id ?? 0,
  student_id: raw.student_id ?? raw.student?.id ?? 0,
  student_name: raw.student?.name ?? "",
  student_avatar: raw.student?.avatar_url ?? "",
  status: (raw.status ?? "assigned") as SubmissionRow["status"],
  submitted_at: raw.submitted_at ?? null,
  score: raw.score ?? null,
});

export const toSubmissionRows = (raw: any[] | null | undefined): SubmissionRow[] =>
  (raw ?? []).map(toSubmissionRow);

export const toSubmissionDetail = (raw: any): SubmissionDetail => ({
  id: raw.id ?? 0,
  student_id: raw.student_id ?? raw.student?.id ?? 0,
  answer: raw.answer ?? "",
  files: Array.isArray(raw.files)
    ? raw.files.map((f: any) => ({ url: f.url ?? f.file_url ?? "", type: f.type ?? "file", name: f.name }))
    : [],
  submitted_at: raw.submitted_at ?? null,
  score: raw.score ?? null,
  comment: raw.comment ?? "",
  status: (raw.status ?? "assigned") as SubmissionDetail["status"],
  resultPublished: !!raw.result_published,
});

export const toAssignmentHeader = (raw: any): AssignmentHeader | undefined => {
  const assignment = raw?.assignment;
  if (!assignment) return undefined;
  return {
    id: assignment.id,
    name: assignment.assignment_name ?? "",
    class_name: assignment.class?.name ?? "",
    max_score: assignment.max_score ?? 10,
    progress: {
      total: raw.progress?.total ?? 0,
      submitted: raw.progress?.submitted ?? 0,
      graded: raw.progress?.graded ?? 0,
      pending: raw.progress?.pending ?? 0,
    },
  };
};

/** A submission is editable once graded/reviewed; otherwise it's a first-time grade. */
export const isGraded = (status: SubmissionRow["status"] | SubmissionDetail["status"]): boolean =>
  status === "graded" || status === "reviewed";

export const scoreBuckets = (rows: SubmissionRow[], maxScore: number) => {
  const step = maxScore / 4;
  const buckets = [0, 0, 0, 0];
  rows.forEach((row) => {
    if (row.score == null) return;
    const idx = Math.min(3, Math.floor(row.score / step));
    buckets[idx] += 1;
  });
  return buckets;
};
