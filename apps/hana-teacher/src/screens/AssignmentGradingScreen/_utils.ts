import type {
  AssignmentGradingHeader,
  SubmissionDetailData,
  SubmissionRow,
  SubmissionStatus,
} from './types';

export const toGradingHeader = (raw: any): AssignmentGradingHeader | undefined => {
  const assignment = raw?.assignment;
  if (!assignment?.id) return undefined;
  return {
    id: assignment.id,
    name: assignment.assignment_name ?? '',
    className: assignment.class?.name ?? '',
    maxScore: Number(assignment.max_score ?? 10),
    progress: {
      total: raw.progress?.total ?? 0,
      submitted: raw.progress?.submitted ?? 0,
      graded: raw.progress?.graded ?? 0,
      pending: raw.progress?.pending ?? 0,
    },
  };
};

export const toSubmissionRows = (raw: any[] | null | undefined): SubmissionRow[] =>
  (raw ?? []).map((item) => ({
    id: item.id ?? 0,
    studentId: item.student_id ?? item.student?.id ?? 0,
    studentName: item.student?.name ?? 'Học viên',
    studentAvatar: item.student?.avatar_url ?? '',
    status: (item.status ?? 'assigned') as SubmissionStatus,
    submittedAt: item.submitted_at ?? null,
    score: item.score ?? null,
  }));

export const toSubmissionDetail = (raw: any): SubmissionDetailData => ({
  id: raw.id ?? 0,
  studentId: raw.student_id ?? raw.student?.id ?? 0,
  answer: raw.answer ?? '',
  files: Array.isArray(raw.files)
    ? raw.files.map((f: any) => ({ url: f.url ?? f.file_url ?? '', type: f.type ?? 'file', name: f.name }))
    : [],
  submittedAt: raw.submitted_at ?? null,
  score: raw.score ?? null,
  comment: raw.comment ?? '',
  status: (raw.status ?? 'assigned') as SubmissionStatus,
});

/** A submission is editable once graded/reviewed; otherwise it's a first-time grade (grade vs update endpoint). */
export const isGraded = (status: SubmissionStatus): boolean => status === 'graded' || status === 'reviewed';

export const scoreBuckets = (rows: SubmissionRow[], maxScore: number): number[] => {
  const step = maxScore / 4 || 1;
  const buckets = [0, 0, 0, 0];
  rows.forEach((row) => {
    if (row.score == null) return;
    const idx = Math.min(3, Math.floor(row.score / step));
    buckets[idx] += 1;
  });
  return buckets;
};

export const formatDateTime = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const date = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${date} ${time}`;
};
