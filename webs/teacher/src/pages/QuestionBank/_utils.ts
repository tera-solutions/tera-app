import type { QuestionDifficulty, QuestionRow, QuestionSummary } from "./_interface";

export const toQuestions = (raw: any): QuestionRow[] =>
  (raw?.data?.items ?? []).map((item: any) => ({
    id: item.id,
    code: item.question_code,
    content: item.content,
    type: item.question_type,
    skill: item.skill,
    difficulty: item.difficulty ?? "easy",
    categoryName: item.category?.category_name ?? null,
    score: Number(item.score ?? 0),
    answersCount: item.answers_count ?? 0,
    status: item.status ?? "draft",
    createdBy: item.created_by ?? null,
    createdAt: item.created_at ?? null,
  }));

export const summarizeQuestions = (items: QuestionRow[], currentUserId?: number | null): QuestionSummary => {
  const byDifficulty: Record<QuestionDifficulty, number> = { easy: 0, medium: 0, hard: 0 };
  let mine = 0;
  items.forEach((item) => {
    byDifficulty[item.difficulty] = (byDifficulty[item.difficulty] ?? 0) + 1;
    if (currentUserId && item.createdBy === currentUserId) mine += 1;
  });
  return { total: items.length, mine, byDifficulty };
};
