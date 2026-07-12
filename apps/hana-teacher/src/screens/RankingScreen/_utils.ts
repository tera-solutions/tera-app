import type { MonthOption, ProgressRow, RankingRow, RankingSummary } from './types';

const pad2 = (n: number): string => String(n).padStart(2, '0');

export const monthKeyOf = (dateStr: string): string => (dateStr ? dateStr.slice(0, 7) : '');

/** "YYYY-MM" for N months before today (0 = current month). */
export const monthKeyOffset = (monthsAgo: number): string => {
  const d = new Date();
  d.setDate(1); // avoid month-length rollover (e.g. Mar 31 - 1 month)
  d.setMonth(d.getMonth() - monthsAgo);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
};

export const formatMonthLabel = (monthKey: string): string => {
  const [y, m] = monthKey.split('-');
  return `Tháng ${m}/${y}`;
};

export const MONTH_OPTIONS: MonthOption[] = Array.from({ length: 6 }, (_, i) => {
  const value = monthKeyOffset(i);
  return { value, label: formatMonthLabel(value) };
});

interface EvalPoint {
  score: number;
  evaluatedAt: string;
  classificationLabel: string | null;
}

/** Groups raw `edu_evaluations` rows by `target_id`, sorted oldest → newest. */
const historyByStudent = (raw: any[]): Map<number, EvalPoint[]> => {
  const byStudent = new Map<number, EvalPoint[]>();
  raw.forEach((item) => {
    const studentId = item?.target_id;
    if (!studentId || item?.score == null) return;
    const point: EvalPoint = {
      score: Number(item.score),
      evaluatedAt: item.evaluated_at ?? item.created_at ?? '',
      classificationLabel: item.classification_label ?? null,
    };
    byStudent.set(studentId, [...(byStudent.get(studentId) ?? []), point]);
  });
  byStudent.forEach((points) => points.sort((a, b) => a.evaluatedAt.localeCompare(b.evaluatedAt)));
  return byStudent;
};

const avgInMonthKey = (points: EvalPoint[], monthKey: string): number | null => {
  const inMonth = points.filter((p) => monthKeyOf(p.evaluatedAt) === monthKey);
  if (!inMonth.length) return null;
  return inMonth.reduce((sum, p) => sum + p.score, 0) / inMonth.length;
};

const avgInMonth = (points: EvalPoint[], monthsAgo: number): number | null =>
  avgInMonthKey(points, monthKeyOffset(monthsAgo));

/**
 * `monthFilter` (YYYY-MM) scopes the ranking score to that month's average;
 * omitted, it falls back to each student's latest evaluation ever.
 */
export const toRankingRows = (
  students: any[] | null | undefined,
  evaluations: any[] | null | undefined,
  studentClassMap: Map<number, string> | undefined,
  monthFilter?: string,
): RankingRow[] => {
  const history = historyByStudent(evaluations ?? []);

  return (students ?? []).map((s) => {
    const points = history.get(s?.id) ?? [];
    const latest = points[points.length - 1];
    const monthAvg = monthFilter ? avgInMonthKey(points, monthFilter) : null;
    const score = monthFilter ? monthAvg : (latest?.score ?? null);
    const classification = monthFilter
      ? (points.filter((p) => monthKeyOf(p.evaluatedAt) === monthFilter).at(-1)?.classificationLabel ?? null)
      : (latest?.classificationLabel ?? null);

    return {
      studentId: s?.id ?? 0,
      studentName: s?.name ?? '',
      studentAvatar: s?.avatar_url ?? s?.avatar ?? '',
      className: studentClassMap?.get(s?.id) ?? '',
      score: score != null ? Math.round(score * 10) / 10 : null,
      classificationLabel: classification,
      history: points.map((p) => p.score),
      prevMonthScore: avgInMonth(points, 1),
      currMonthScore: avgInMonth(points, 0),
    };
  });
};

export const rankedByScore = (rows: RankingRow[]): RankingRow[] =>
  [...rows].filter((r) => r.score != null).sort((a, b) => (b.score as number) - (a.score as number));

export const summarize = (rows: RankingRow[], classCount: number): RankingSummary => {
  const scored = rows.filter((r) => r.score != null);
  const avg = scored.length ? scored.reduce((sum, r) => sum + (r.score as number), 0) / scored.length : 0;
  const good = scored.filter((r) => (r.score as number) >= 8).length;

  return {
    totalStudents: rows.length,
    avgScore: Math.round(avg * 100) / 100,
    totalClasses: classCount,
    goodRate: scored.length ? Math.round((good / scored.length) * 100) : 0,
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
export const toProgressRows = (rows: RankingRow[]): ProgressRow[] =>
  rows
    .filter((r) => r.prevMonthScore != null && r.currMonthScore != null)
    .map((r) => ({
      ...r,
      deltaPct: Math.round(
        (((r.currMonthScore as number) - (r.prevMonthScore as number)) / (r.prevMonthScore as number)) * 100,
      ),
    }))
    .sort((a, b) => b.deltaPct - a.deltaPct);
