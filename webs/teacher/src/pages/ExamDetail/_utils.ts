import type { ExamBank, SiblingExam } from "./_interface";

export const toExamBank = (raw: any): ExamBank | undefined => {
  if (!raw?.id) return undefined;
  return {
    id: raw.id,
    code: raw.exam_code ?? "",
    name: raw.exam_name ?? "",
    type: raw.exam_type ?? "",
    course_name: raw.course?.name ?? "",
    level_name: raw.level?.level_name ?? "",
    duration: raw.duration ?? 0,
    total_score: raw.total_score ?? 0,
    passing_score: raw.passing_score ?? 0,
    status: (raw.status ?? "draft") as ExamBank["status"],
    questions_count: raw.questions_count ?? 0,
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
