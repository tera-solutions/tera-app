import type { AssignmentDetailData, AttachmentItem, SubmissionRow } from './types';

export const toAssignmentDetail = (raw: any): AssignmentDetailData | undefined => {
  const assignment = raw?.assignment;
  if (!assignment?.id) return undefined;
  return {
    id: assignment.id,
    code: assignment.assignment_code ?? '',
    name: assignment.assignment_name ?? '',
    type: assignment.assignment_type ?? 'homework',
    instruction: assignment.instruction ?? '',
    className: assignment.class?.name ?? assignment.course?.name ?? '',
    dueDate: assignment.due_date ?? '',
    maxScore: Number(assignment.max_score ?? 0),
    status: (assignment.status ?? 'draft') as AssignmentDetailData['status'],
    progress: {
      total: raw.progress?.total ?? 0,
      submitted: raw.progress?.submitted ?? 0,
      graded: raw.progress?.graded ?? 0,
      pending: raw.progress?.pending ?? 0,
    },
  };
};

const formatDate = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

export const formatDueDate = (iso: string): string => {
  if (!iso) return 'Chưa đặt hạn';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Chưa đặt hạn';
  const date = formatDate(iso);
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${date} ${time}`;
};

const formatSize = (bytes?: number | null): string => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const toAttachmentItems = (raw: any[] | null | undefined): AttachmentItem[] =>
  (raw ?? []).map((item) => ({
    id: String(item.id ?? ''),
    name: item.material_name ?? 'Tài liệu',
    type: (item.material_type ?? 'other').toString().toUpperCase(),
    size: formatSize(item.file_size),
    date: formatDate(item.created_at ?? ''),
  }));

export const toSubmissionRows = (raw: any[] | null | undefined): SubmissionRow[] =>
  (raw ?? []).map((item) => ({
    id: item.id ?? 0,
    studentId: item.student_id ?? item.student?.id ?? 0,
    studentName: item.student?.name ?? 'Học viên',
    status: (item.status ?? 'assigned') as SubmissionRow['status'],
    score: item.score ?? null,
  }));
