import moment from "moment";

import type { RankingRow, RankingSummary } from "./_interface";

interface EvalPoint {
  score: number;
  evaluated_at: string;
  classification_label: string | null;
}

/** Groups raw `edu_evaluations` rows by `target_id`, sorted oldest → newest. */
const historyByStudent = (raw: any[]): Map<number, EvalPoint[]> => {
  const byStudent = new Map<number, EvalPoint[]>();
  raw.forEach((item) => {
    const studentId = item?.target_id;
    if (!studentId || item?.score == null) return;
    const point: EvalPoint = {
      score: Number(item.score),
      evaluated_at: item.evaluated_at ?? item.created_at ?? "",
      classification_label: item.classification_label ?? null,
    };
    byStudent.set(studentId, [...(byStudent.get(studentId) ?? []), point]);
  });
  byStudent.forEach((points) =>
    points.sort((a, b) => a.evaluated_at.localeCompare(b.evaluated_at)),
  );
  return byStudent;
};

const avgInMonthKey = (points: EvalPoint[], monthKey: string): number | null => {
  const inMonth = points.filter((p) => p.evaluated_at.slice(0, 7) === monthKey);
  if (!inMonth.length) return null;
  return inMonth.reduce((sum, p) => sum + p.score, 0) / inMonth.length;
};

const avgInMonth = (points: EvalPoint[], monthsAgo: number): number | null =>
  avgInMonthKey(points, moment().subtract(monthsAgo, "months").format("YYYY-MM"));

/**
 * `monthFilter` (YYYY-MM) scopes the ranking score to that month's average;
 * omitted, it falls back to each student's latest evaluation ever.
 */
export const toRankingRows = (
  students: any[] | null | undefined,
  evaluations: any[] | null | undefined,
  studentClassMap?: Map<number, string>,
  monthFilter?: string,
): RankingRow[] => {
  const history = historyByStudent(evaluations ?? []);

  return (students ?? []).map((s) => {
    const points = history.get(s?.id) ?? [];
    const latest = points[points.length - 1];
    const monthAvg = monthFilter ? avgInMonthKey(points, monthFilter) : null;
    const score = monthFilter ? monthAvg : latest?.score ?? null;
    const classification = monthFilter
      ? points.filter((p) => p.evaluated_at.slice(0, 7) === monthFilter).at(-1)?.classification_label ?? null
      : latest?.classification_label ?? null;

    return {
      student_id: s?.id ?? 0,
      student_name: s?.name ?? "",
      student_avatar: s?.avatar_url ?? s?.avatar ?? "",
      class_name: studentClassMap?.get(s?.id) ?? "",
      score: score != null ? Math.round(score * 10) / 10 : null,
      classification_label: classification,
      history: points.map((p) => p.score),
      prev_month_score: avgInMonth(points, 1),
      curr_month_score: avgInMonth(points, 0),
    };
  });
};

export const rankedByScore = (rows: RankingRow[]): RankingRow[] =>
  [...rows]
    .filter((r) => r.score != null)
    .sort((a, b) => (b.score as number) - (a.score as number));

export const summarize = (rows: RankingRow[], classCount: number): RankingSummary => {
  const scored = rows.filter((r) => r.score != null);
  const avg = scored.length
    ? scored.reduce((sum, r) => sum + (r.score as number), 0) / scored.length
    : 0;
  const good = scored.filter((r) => (r.score as number) >= 8).length;

  return {
    total_students: rows.length,
    avg_score: Math.round(avg * 100) / 100,
    total_classes: classCount,
    good_rate: scored.length ? Math.round((good / scored.length) * 100) : 0,
  };
};

export const scoreHistogram = (rows: RankingRow[]): [number, number, number, number] => {
  const buckets: [number, number, number, number] = [0, 0, 0, 0];
  rows.forEach((r) => {
    if (r.score == null) return;
    const idx = Math.min(3, Math.floor(r.score / 2.5));
    buckets[idx] += 1;
  });
  return buckets;
};

/** Biggest improvers: this-month avg vs last-month avg, both real when present. */
export const toProgressRows = (rows: RankingRow[]) =>
  rows
    .filter((r) => r.prev_month_score != null && r.curr_month_score != null)
    .map((r) => ({
      ...r,
      delta_pct: Math.round(
        (((r.curr_month_score as number) - (r.prev_month_score as number)) /
          (r.prev_month_score as number)) *
          100,
      ),
    }))
    .sort((a, b) => b.delta_pct - a.delta_pct);
