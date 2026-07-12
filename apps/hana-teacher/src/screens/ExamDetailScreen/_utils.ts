import { ExamDetailInfo, ExamResultRow, ExamScoreStats, ExamSessionSummaryStats, ExamStatus } from './types';

const EXAM_TYPE_ICON: Record<string, Pick<ExamDetailInfo, 'iconName' | 'iconBg' | 'iconColor'>> = {
  final:    { iconName: 'clipboard-outline',        iconBg: '#FFF7ED', iconColor: '#F97316' },
  midterm:  { iconName: 'file-edit-outline',        iconBg: '#EEF5FF', iconColor: '#2196F3' },
  quiz:     { iconName: 'format-text',              iconBg: '#F5F3FF', iconColor: '#8B5CF6' },
  practice: { iconName: 'book-open-outline',        iconBg: '#F0FDF4', iconColor: '#22C55E' },
  other:    { iconName: 'file-document-outline',    iconBg: '#EEF5FF', iconColor: '#2196F3' },
};

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export function toExamDetailInfo(raw: any, duration: number): ExamDetailInfo | undefined {
  if (!raw?.id) return undefined;
  const icon = EXAM_TYPE_ICON[raw.exam?.exam_type ?? 'other'] ?? EXAM_TYPE_ICON.other;

  return {
    id: raw.id,
    examId: raw.exam?.id ?? raw.exam_id ?? null,
    title: raw.exam?.exam_name ?? '',
    className: raw.class?.name ?? '',
    roomName: raw.room?.room_name ?? '',
    teacherName: raw.teacher?.full_name ?? '',
    duration,
    examDate: formatDate(raw.exam_date),
    status: (raw.status ?? 'scheduled') as ExamStatus,
    ...icon,
  };
}

/** Join `registrations[]` (candidate roster) with `results[]` (scores) by student. */
export function toExamResultRows(raw: any): ExamResultRow[] {
  const registrations: any[] = Array.isArray(raw?.registrations) ? raw.registrations : [];
  const results: any[] = Array.isArray(raw?.results) ? raw.results : [];
  const resultByStudent = new Map<number, any>();
  results.forEach((r) => resultByStudent.set(r.student_id, r));

  return registrations.map((reg) => {
    const result = resultByStudent.get(reg.student_id);
    return {
      registrationId: reg.id,
      studentId: reg.student_id,
      studentCode: reg.student?.code ?? '',
      studentName: reg.student?.name ?? '',
      registrationStatus: (reg.status ?? 'registered') as ExamResultRow['registrationStatus'],
      // API returns decimal columns as strings; coerce for numeric comparisons.
      totalScore: result?.total_score != null ? Number(result.total_score) : null,
      passed: result?.passed ?? null,
      grade: result?.grade ?? null,
    };
  });
}

export function scoreStats(rows: ExamResultRow[]): ExamScoreStats {
  const scored = rows.filter((r) => r.totalScore != null);
  const scores = scored.map((r) => r.totalScore as number);
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
}

export function sessionSummaryStats(rows: ExamResultRow[]): ExamSessionSummaryStats {
  const submittedCount = rows.filter((r) => r.registrationStatus !== 'registered').length;
  const needsRegradeCount = rows.filter(
    (r) => r.registrationStatus === 'submitted' && r.totalScore == null,
  ).length;

  return {
    submittedCount,
    completionRate: rows.length ? Math.round((submittedCount / rows.length) * 100) : 0,
    needsRegradeCount,
  };
}
