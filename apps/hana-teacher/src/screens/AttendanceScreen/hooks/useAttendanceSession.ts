import { useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';

import { AttendanceService, StudentService } from '@tera/modules/education';
import { getListData } from '@tera/commons/hooks';

import { toAttendanceRows, summarizeAttendance } from '../_utils';
import type { AttendanceApiStatus, AttendanceResponse, AttendanceRow, RosterStudentResponse } from '../types';

interface UseAttendanceSessionArgs {
  classId: number | null;
  sessionId: number | null;
}

/**
 * Editable attendance for a single class session: loads the roster plus any
 * existing records, tracks per-student draft status, and batches the dirty
 * rows on save. Mirrors the web `useAttendanceSession` hook
 * (webs/teacher/src/pages/Attendance/hooks/useAttendanceSession.ts).
 */
export const useAttendanceSession = ({ classId, sessionId }: UseAttendanceSessionArgs) => {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);

  const rosterQuery = StudentService.useStudentList(
    { params: { class_id: classId ?? 0, per_page: 200 } },
    { enabled: !!classId },
  );
  // `getListData` falls back to a brand-new `[]` whenever `data` isn't loaded
  // yet, so it must be memoized on the query's `data` — otherwise `roster`
  // gets a new array reference on every render, the effect below never sees
  // stable deps, and `setRows`/`setSelectedIds` loop forever.
  const roster = useMemo(
    () => getListData<RosterStudentResponse>(rosterQuery.data).items,
    [rosterQuery.data],
  );

  const recordsQuery = AttendanceService.useAttendanceList(
    { params: { class_id: classId ?? 0, session_id: sessionId ?? 0, per_page: 200 } as any },
    { enabled: !!classId && !!sessionId },
  );
  const records = useMemo(
    () => getListData<AttendanceResponse>(recordsQuery.data).items,
    [recordsQuery.data],
  );

  // Last-saved status per student, used to restore a row if its pending
  // (unsaved) status change is undone by deselecting it.
  const savedStatuses = useMemo(() => {
    const baseRows = toAttendanceRows(roster, records);
    return new Map(baseRows.map((r) => [r.student_id, r.status]));
  }, [roster, records]);

  useEffect(() => {
    setRows(toAttendanceRows(roster, records));
    setSelectedIds(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster, records]);

  const counts = useMemo(() => summarizeAttendance(rows), [rows]);
  const absentRows = useMemo(() => rows.filter((r) => r.status === 'absent'), [rows]);
  const dirtyRows = useMemo(() => rows.filter((r) => r.dirty), [rows]);

  const toggleSelect = (studentId: number) => {
    const wasSelected = selectedIds.has(studentId);

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });

    if (wasSelected) {
      setRows((prev) =>
        prev.map((r) =>
          r.student_id === studentId && r.dirty
            ? { ...r, status: savedStatuses.get(studentId) ?? null, dirty: false }
            : r,
        ),
      );
    }
  };

  const setStatusForSelected = (status: AttendanceApiStatus) => {
    if (selectedIds.size === 0) return;
    setRows((prev) => prev.map((r) => (selectedIds.has(r.student_id) ? { ...r, status, dirty: true } : r)));
  };

  const upsertMutation = AttendanceService.useUpsertAttendance();

  const persistRows = async (
    rowsToSave: AttendanceRow[],
    successMessage: string,
    failureMessagePrefix: string,
  ): Promise<boolean> => {
    if (rowsToSave.length === 0) return true;
    setSaving(true);
    try {
      const results = await Promise.allSettled(
        rowsToSave.map((row) =>
          upsertMutation.mutateAsync({
            id: row.record_id ?? undefined,
            params: {
              class_id: classId,
              session_id: sessionId,
              student_id: row.student_id,
              status: row.status,
            },
          } as any),
        ),
      );
      const failed = results.filter((r) => r.status === 'rejected').length;
      if (failed > 0) {
        Toast.show({ type: 'error', text1: `${failureMessagePrefix} ${failed} học viên` });
        return false;
      }
      Toast.show({ type: 'success', text1: successMessage });
      const savedIds = new Set(rowsToSave.map((r) => r.student_id));
      setRows((prev) => prev.map((r) => (savedIds.has(r.student_id) ? { ...r, dirty: false } : r)));
      setSelectedIds(new Set());
      return true;
    } finally {
      setSaving(false);
    }
  };

  const save = () => persistRows(dirtyRows, 'Lưu điểm danh thành công', 'Lưu điểm danh thất bại cho');

  /** Marks every student present and saves immediately, no separate "Lưu" step. */
  const markAllPresent = () => {
    const updatedRows = rows.map((r) => ({ ...r, status: 'present' as AttendanceApiStatus, dirty: true }));
    setRows(updatedRows);
    return persistRows(updatedRows, 'Đã đánh dấu có mặt tất cả', 'Đánh dấu có mặt thất bại cho');
  };

  return {
    rows,
    selectedIds,
    counts,
    absentRows,
    dirtyCount: dirtyRows.length,
    saving,
    loading: rosterQuery.isLoading || recordsQuery.isLoading,
    isError: rosterQuery.isError || recordsQuery.isError,
    refetch: () => {
      rosterQuery.refetch();
      recordsQuery.refetch();
    },
    toggleSelect,
    setStatusForSelected,
    markAllPresent,
    save,
  };
};

export type AttendanceSessionState = ReturnType<typeof useAttendanceSession>;
