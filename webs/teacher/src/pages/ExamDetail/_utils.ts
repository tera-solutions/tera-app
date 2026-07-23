import { scoreStats, toExamResultRows } from "../ExamSession/_utils";
import type { ExamBank, ExamQuestionRow, ExamSessionSummary, SiblingExam } from "./_interface";

const toExamQuestionRow = (raw: any): ExamQuestionRow => ({
  id: raw.id ?? 0,
  skill: raw.skill ?? "",
  question_type: raw.question_type ?? "",
  content: raw.content ?? "",
  answer_key: Array.isArray(raw.answer_key) ? raw.answer_key : [],
  file_id: raw.file_id ?? null,
  file_name: raw.file_name ?? null,
  file_url: raw.file_url ?? null,
  score: Number(raw.score ?? 0),
  difficulty: raw.difficulty ?? "",
});

export const toExamBank = (raw: any): ExamBank | undefined => {
  if (!raw?.id) return undefined;
  return {
    id: raw.id,
    code: raw.exam_code ?? "",
    name: raw.exam_name ?? "",
    type: raw.exam_type ?? "",
    course_name: raw.course?.name ?? "",
    level_name: raw.level?.level_name ?? "",
    // API returns decimal columns (total_score, passing_score) as strings;
    // coerce so numeric comparisons (e.g. passing_score <= total_score) don't
    // fall into lexicographic string comparison.
    duration: Number(raw.duration ?? 0),
    total_score: Number(raw.total_score ?? 0),
    passing_score: Number(raw.passing_score ?? 0),
    status: (raw.status ?? "draft") as ExamBank["status"],
    questions_count: Number(raw.questions_count ?? 0),
    questions: Array.isArray(raw.questions) ? raw.questions.map(toExamQuestionRow) : [],
    course_id: raw.course_id ?? raw.course?.id ?? null,
    level_id: raw.level_id ?? null,
  };
};

export const toSiblingExams = (raw: any[] | null | undefined, currentId: number): SiblingExam[] =>
  (raw ?? []).map((exam) => ({
    id: exam.id,
    name: exam.exam_name ?? "",
    type: exam.exam_type ?? "",
    active: exam.id === currentId,
  }));

/**
 * Joins each exam session with its own detail payload (registrations/results)
 * to compute a per-sitting average score ("Điểm TB") for the "Các lần kiểm
 * tra" list.
 */
export const toExamSessionSummaries = (
  sessions: any[],
  detailById: Map<number, any>,
): ExamSessionSummary[] =>
  sessions.map((s) => {
    const rows = toExamResultRows(detailById.get(s.id));
    const stats = scoreStats(rows);
    return {
      id: s.id,
      exam_date: s.exam_date ?? "",
      status: s.status ?? "",
      class_name: s.class?.name ?? "",
      total_students: rows.length,
      submitted: stats.gradedCount,
      avg_score: stats.avg,
    };
  });
