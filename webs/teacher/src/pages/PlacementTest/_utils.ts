import type { PlacementTestOverview, PlacementTestResultRow, PlacementTestRow } from "./_interface";

export const toPlacementTests = (raw: any): PlacementTestRow[] =>
  (raw?.data?.items ?? []).map((item: any) => ({
    id: item.id,
    code: item.test_code,
    title: item.title,
    description: item.description ?? null,
    cefrLevel: item.cefr_level ?? null,
    skills: item.skills ?? [],
    questionCount: item.question_count ?? 0,
    durationMinutes: item.duration_minutes ?? 0,
    status: item.status ?? "draft",
    attempts: item.stats?.attempts ?? item.results_count ?? 0,
    avgScore: item.stats?.avg_score ?? null,
    completionRate: item.stats?.completion_rate ?? 0,
    createdAt: item.created_at ?? null,
  }));

export const toPlacementTestResults = (raw: any): PlacementTestResultRow[] =>
  (raw?.data?.items ?? []).map((item: any) => ({
    id: item.id,
    studentId: item.student_id,
    studentName: item.student?.name ?? null,
    score: item.score != null ? Number(item.score) : null,
    cefrResult: item.cefr_result ?? null,
    completionRate: item.completion_rate ?? 0,
    status: item.status ?? "in_progress",
    completedAt: item.completed_at ?? null,
  }));

export const summarizePlacementTests = (items: PlacementTestRow[]): PlacementTestOverview => {
  const totalAttempts = items.reduce((sum, i) => sum + i.attempts, 0);
  const scored = items.filter((i) => i.avgScore != null);
  const avgScore =
    scored.length > 0
      ? Math.round((scored.reduce((sum, i) => sum + (i.avgScore ?? 0), 0) / scored.length) * 10) / 10
      : 0;
  const cefrDistribution: Record<string, number> = {};
  items.forEach((i) => {
    if (!i.cefrLevel) return;
    cefrDistribution[i.cefrLevel] = (cefrDistribution[i.cefrLevel] ?? 0) + i.attempts;
  });

  return {
    totalTests: items.length,
    totalAttempts,
    totalCompleted: totalAttempts,
    completionRate:
      items.length > 0
        ? Math.round(items.reduce((sum, i) => sum + i.completionRate, 0) / items.length)
        : 0,
    avgScore,
    cefrDistribution,
  };
};
