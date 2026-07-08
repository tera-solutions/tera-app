import type { ExamResultRow, ExamSessionHeader, ExamSkill } from "./_interface";
import { EXAM_SKILLS } from "./_interface";

export const toExamSessionHeader = (raw: any): ExamSessionHeader | undefined => {
  if (!raw?.id) return undefined;
  return {
    id: raw.id,
    exam_id: raw.exam?.id ?? raw.exam_id ?? null,
    exam_name: raw.exam?.exam_name ?? "",
    class_name: raw.class?.name ?? "",
    room_name: raw.room?.room_name ?? "",
    teacher_name: raw.teacher?.full_name ?? "",
    exam_date: raw.exam_date ?? "",
    status: (raw.status ?? "scheduled") as ExamSessionHeader["status"],
  };
};

/** Join `registrations[]` (the candidate roster) with `results[]` (per-skill scores) by student. */
export const toExamResultRows = (raw: any): ExamResultRow[] => {
  const registrations: any[] = Array.isArray(raw?.registrations) ? raw.registrations : [];
  const results: any[] = Array.isArray(raw?.results) ? raw.results : [];
  const resultByStudent = new Map<number, any>();
  results.forEach((r) => resultByStudent.set(r.student_id, r));

  return registrations.map((reg) => {
    const result = resultByStudent.get(reg.student_id);
    const scores: Partial<Record<ExamSkill, number>> = {};
    EXAM_SKILLS.forEach((skill) => {
      const value = result?.[`${skill}_score`];
      if (value != null) scores[skill] = value;
    });

    return {
      registration_id: reg.id,
      student_id: reg.student_id,
      student_name: reg.student?.name ?? "",
      student_avatar: reg.student?.avatar_url ?? "",
      registration_status: (reg.status ?? "registered") as ExamResultRow["registration_status"],
      scores,
      total_score: result?.total_score ?? null,
      passed: result?.passed ?? null,
    };
  });
};

export const scoreStats = (rows: ExamResultRow[]) => {
  const scored = rows.filter((r) => r.total_score != null);
  const scores = scored.map((r) => r.total_score as number);
  const avg = scores.length ? scores.reduce((s, v) => s + v, 0) / scores.length : 0;
  const max = scores.length ? Math.max(...scores) : 0;
  const min = scores.length ? Math.min(...scores) : 0;
  const passCount = scored.filter((r) => r.passed).length;
  const passRate = scored.length ? Math.round((passCount / scored.length) * 100) : 0;

  return {
    avg: Math.round(avg * 100) / 100,
    max,
    min,
    passRate,
    gradedCount: scored.length,
    totalCount: rows.length,
    pendingCount: rows.length - scored.length,
  };
};

export const scoreHistogram = (rows: ExamResultRow[], totalScore: number) => {
  const step = totalScore / 4 || 1;
  const buckets = [0, 0, 0, 0];
  rows.forEach((row) => {
    if (row.total_score == null) return;
    const idx = Math.min(3, Math.floor(row.total_score / step));
    buckets[idx] += 1;
  });
  return buckets;
};
