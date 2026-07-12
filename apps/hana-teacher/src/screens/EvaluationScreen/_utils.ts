import type { EvaluationEntry, EvaluationSummary, StudentEvaluationRow } from './types';

export const toEvaluationSummary = (raw: any): EvaluationSummary => ({
  totalStudents: raw?.total_students ?? 0,
  evaluatedRate: raw?.evaluated_rate ?? 0,
  totalComments: raw?.total_comments ?? 0,
  avgRating: raw?.avg_rating ?? null,
  satisfactionRate: raw?.satisfaction_rate ?? 0,
});

interface EvaluationAggregate {
  avgScore: number | null;
  latestComment: string;
  updatedAt: string;
  classificationLabel: string | null;
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
      (b.evaluated_at ?? b.created_at ?? '').localeCompare(a.evaluated_at ?? a.created_at ?? ''),
    );
    const scored = evaluations.filter((e) => e.score != null);

    aggregates.set(studentId, {
      avgScore: scored.length ? scored.reduce((sum, e) => sum + Number(e.score), 0) / scored.length : null,
      latestComment: sorted.find((e) => e.comment)?.comment ?? '',
      updatedAt: sorted[0]?.evaluated_at ?? sorted[0]?.created_at ?? '',
      classificationLabel: sorted[0]?.classification_label ?? null,
    });
  });
  return aggregates;
};

export const toStudentEvaluationRows = (
  students: any[] | null | undefined,
  evaluations: any[] | null | undefined,
  studentClassMap?: Map<number, number>,
): StudentEvaluationRow[] => {
  const aggregates = aggregateEvaluationsByStudent(evaluations ?? []);
  return (students ?? []).map((s) => {
    const aggregate = aggregates.get(s?.id);
    return {
      studentId: s?.id ?? 0,
      studentCode: s?.code ?? '',
      studentName: s?.name ?? '',
      classRoomId: studentClassMap?.get(s?.id) ?? null,
      className: s?.class_name ?? s?.level?.name ?? '',
      status: s?.status ?? '',
      avatar: s?.avatar ?? '',
      avgScore: aggregate?.avgScore ?? null,
      latestComment: aggregate?.latestComment ?? '',
      updatedAt: aggregate?.updatedAt ?? '',
      classificationLabel: aggregate?.classificationLabel ?? null,
    };
  });
};

export const toEvaluationEntries = (raw: any[], studentId: number): EvaluationEntry[] =>
  raw
    .filter((e) => e.target_id === studentId)
    .map((e) => ({
      id: e.id ?? 0,
      targetId: e.target_id,
      comment: e.comment ?? '',
      evaluatedAt: e.evaluated_at ?? e.created_at ?? '',
      classificationLabel: e.classification_label ?? null,
      evaluationPeriodLabel: e.evaluation_period_label ?? null,
    }))
    .sort((a, b) => b.evaluatedAt.localeCompare(a.evaluatedAt));

/** Rank (1-based position by avg score, ties broken by original order) among the roster. */
export const rankOf = (studentId: number, rows: StudentEvaluationRow[]): { rank: number; total: number } | null => {
  const scored = rows.filter((r) => r.avgScore != null);
  if (scored.length === 0) return null;
  const sorted = [...scored].sort((a, b) => (b.avgScore as number) - (a.avgScore as number));
  const rank = sorted.findIndex((r) => r.studentId === studentId);
  if (rank === -1) return null;
  return { rank: rank + 1, total: scored.length };
};

export const getRank = (avgScore: number | null): { label: string; color: string } => {
  if (avgScore == null) return { label: '—', color: '#64748B' };
  if (avgScore >= 8) return { label: 'Giỏi', color: '#10B981' };
  if (avgScore >= 6.5) return { label: 'Khá', color: '#D97706' };
  return { label: 'Trung bình', color: '#64748B' };
};

export const formatDate = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};
