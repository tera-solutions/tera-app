import type {
  ExamResultRow,
  ExamSessionHeader,
  ExamSessionRow,
  ExamSessionSummary,
  ExamSkill,
} from "./_interface";
import { EXAM_SKILLS } from "./_interface";

export const toExamSessionHeader = (raw: any): ExamSessionHeader | undefined => {
  if (!raw?.id) return undefined;
  return {
    id: raw.id,
    exam_id: raw.exam?.id ?? raw.exam_id ?? null,
    exam_name: raw.exam?.exam_name ?? "",
    class_name: raw.class?.name ?? "",
    session_name: raw.class_session
      ? `Buổi ${raw.class_session.session_no ?? ""} — ${raw.class_session.session_date ?? ""}`.trim()
      : "",
    room_name: raw.room?.room_name ?? "",
    teacher_name: raw.teacher?.full_name ?? "",
    exam_date: raw.exam_date ?? "",
    status: (raw.status ?? "scheduled") as ExamSessionHeader["status"],
  };
};

export const toExamSessionRows = (raw: any[]): ExamSessionRow[] =>
  (raw ?? []).map((item) => ({
    id: item.id,
    exam_id: item.exam?.id ?? item.exam_id ?? null,
    exam_name: item.exam?.exam_name ?? "",
    exam_type: item.exam?.exam_type ?? "",
    class_id: item.class?.id ?? item.class_room_id ?? null,
    class_name: item.class?.name ?? "",
    room_name: item.room?.room_name ?? "",
    exam_date: item.exam_date ?? "",
    start_time: item.start_time ?? "",
    end_time: item.end_time ?? "",
    status: (item.status ?? "scheduled") as ExamSessionRow["status"],
    registrations_count: item.registrations_count ?? 0,
  }));

/** No dedicated summary endpoint — totals are derived from the loaded page, same
 * fallback pattern used by Classroom/summarize() when a server summary is missing. */
export const examSessionSummary = (rows: ExamSessionRow[]): ExamSessionSummary => ({
  total: rows.length,
  scheduled: rows.filter((r) => r.status === "scheduled").length,
  in_progress: rows.filter((r) => r.status === "in_progress").length,
  closed: rows.filter((r) => r.status === "closed").length,
});

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
      if (value != null) scores[skill] = Number(value);
    });

    return {
      registration_id: reg.id,
      student_id: reg.student_id,
      student_code: reg.student?.code ?? "",
      student_name: reg.student?.name ?? "",
      student_avatar: reg.student?.avatar_url ?? "",
      registration_status: (reg.status ?? "registered") as ExamResultRow["registration_status"],
      scores,
      // API returns decimal columns (total_score, etc.) as strings; coerce so
      // downstream numeric reduce/sum logic doesn't fall into string concatenation.
      total_score: result?.total_score != null ? Number(result.total_score) : null,
      passed: result?.passed ?? null,
      grade: result?.grade ?? null,
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

/** Extra per-session tiles the results header needs beyond `scoreStats()`. */
export const sessionSummaryStats = (rows: ExamResultRow[]) => {
  const scored = rows.filter((r) => r.total_score != null);
  const top = scored.reduce<ExamResultRow | null>(
    (best, r) => (!best || (r.total_score as number) > (best.total_score as number) ? r : best),
    null,
  );
  const bottom = scored.reduce<ExamResultRow | null>(
    (worst, r) => (!worst || (r.total_score as number) < (worst.total_score as number) ? r : worst),
    null,
  );
  const submittedCount = rows.filter((r) => r.registration_status !== "registered").length;
  const needsRegradeCount = rows.filter(
    (r) => r.registration_status === "submitted" && r.total_score == null,
  ).length;

  return {
    topStudent: top,
    bottomStudent: bottom,
    submittedCount,
    completionRate: rows.length ? Math.round((submittedCount / rows.length) * 100) : 0,
    needsRegradeCount,
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
