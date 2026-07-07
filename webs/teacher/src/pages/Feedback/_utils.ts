import type { FeedbackSummary, StudentFeedbackRow } from "./_interface";

export const toFeedbackSummary = (raw: any): FeedbackSummary => ({
  total_students: raw?.total_students ?? 0,
  evaluated_rate: raw?.evaluated_rate ?? 0,
  total_comments: raw?.total_comments ?? 0,
  avg_rating: raw?.avg_rating ?? null,
  satisfaction_rate: raw?.satisfaction_rate ?? 0,
});

interface EvaluationAggregate {
  avg_score: number | null;
  latest_comment: string;
  updated_at: string;
  classification_label: string | null;
}

/** Groups raw `edu_evaluations` rows (one per evaluation) by `target_id` into per-student stats. */
const aggregateEvaluationsByStudent = (raw: any[]): Map<number, EvaluationAggregate> => {
  const byStudent = new Map<number, any[]>();
  raw.forEach((item) => {
    const studentId = item?.target_id;
    if (!studentId) return;
    byStudent.set(studentId, [...(byStudent.get(studentId) ?? []), item]);
  });

  const aggregates = new Map<number, EvaluationAggregate>();
  byStudent.forEach((evaluations, studentId) => {
    const sorted = [...evaluations].sort((a, b) =>
      (b.evaluated_at ?? b.created_at ?? "").localeCompare(a.evaluated_at ?? a.created_at ?? ""),
    );
    const scored = evaluations.filter((e) => e.score != null);

    aggregates.set(studentId, {
      avg_score: scored.length
        ? scored.reduce((sum, e) => sum + Number(e.score), 0) / scored.length
        : null,
      latest_comment: sorted.find((e) => e.comment)?.comment ?? "",
      updated_at: sorted[0]?.evaluated_at ?? sorted[0]?.created_at ?? "",
      classification_label: sorted[0]?.classification_label ?? null,
    });
  });
  return aggregates;
};

export const toStudentFeedbackRows = (
  students: any[] | null | undefined,
  evaluations: any[] | null | undefined,
  studentClassMap?: Map<number, number>,
): StudentFeedbackRow[] => {
  const aggregates = aggregateEvaluationsByStudent(evaluations ?? []);
  return (students ?? []).map((s) => {
    const aggregate = aggregates.get(s?.id);
    return {
      student_id: s?.id ?? 0,
      student_code: s?.code ?? "",
      student_name: s?.name ?? "",
      class_room_id: studentClassMap?.get(s?.id) ?? null,
      class_name: s?.class_name ?? s?.level?.name ?? "",
      status: s?.status ?? "",
      avatar: s?.avatar ?? "",
      avg_score: aggregate?.avg_score ?? null,
      latest_comment: aggregate?.latest_comment ?? "",
      updated_at: aggregate?.updated_at ?? "",
      classification_label: aggregate?.classification_label ?? null,
    };
  });
};

/** Rank (1-based position by avg_score, ties broken by original order) among the roster, honestly derived client-side. */
export const rankOf = (
  studentId: number,
  rows: StudentFeedbackRow[],
): { rank: number; total: number } | null => {
  const scored = rows.filter((r) => r.avg_score != null);
  if (scored.length === 0) return null;
  const sorted = [...scored].sort((a, b) => (b.avg_score as number) - (a.avg_score as number));
  const rank = sorted.findIndex((r) => r.student_id === studentId);
  if (rank === -1) return null;
  return { rank: rank + 1, total: scored.length };
};
