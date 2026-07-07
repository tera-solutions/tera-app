import { useEffect, useMemo, useState } from "react";
import { notification } from "tera-dls";

import { AttendanceService, StudentService } from "@tera/modules/education";
import {
  toAttendanceRecords,
  toClassStudentResult,
} from "pages/ClassroomDetail/_utils";
import type { AttendanceStatus } from "pages/ClassroomDetail/_interface";

import type { AttendanceRow } from "../_interface";
import { summarizeAttendance, toAttendanceRows } from "../_utils";

interface UseAttendanceSessionArgs {
  classId: number | null;
  sessionId: number | null;
}

/**
 * Editable attendance for a single class session: loads the roster plus any
 * existing records, tracks per-student draft status, and batches the dirty
 * rows on save. Shared by the standalone Attendance page and the in-lesson
 * attendance step so both behave identically.
 */
export const useAttendanceSession = ({
  classId,
  sessionId,
}: UseAttendanceSessionArgs) => {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const rosterParams = { class_id: classId ?? 0, per_page: 200 };
  const rosterQuery = StudentService.useStudentList(
    { params: rosterParams },
    { enabled: !!classId },
  );
  const roster = useMemo(
    () => toClassStudentResult(rosterQuery.data?.data).items,
    [rosterQuery.data],
  );

  const attendanceParams = {
    class_id: classId ?? 0,
    session_id: sessionId ?? 0,
    per_page: 200,
  };
  const recordsQuery = AttendanceService.useAttendanceList(
    { params: attendanceParams },
    { enabled: !!classId && !!sessionId },
  );
  const records = useMemo(
    () => toAttendanceRecords(recordsQuery.data?.data?.items),
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
    setNote("");
    setSelectedIds(new Set());
  }, [roster, records]);

  const counts = useMemo(() => summarizeAttendance(rows), [rows]);
  const absentRows = useMemo(
    () => rows.filter((r) => r.status === "absent"),
    [rows],
  );
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

  const setStatusForSelected = (status: AttendanceStatus) => {
    if (selectedIds.size === 0) return;
    setRows((prev) =>
      prev.map((r) =>
        selectedIds.has(r.student_id) ? { ...r, status, dirty: true } : r,
      ),
    );
  };

  const markAllPresent = () => {
    setRows((prev) => prev.map((r) => ({ ...r, status: "present", dirty: true })));
  };

  const upsertMutation = AttendanceService.useUpsertAttendance();

  const save = async (): Promise<boolean> => {
    if (dirtyRows.length === 0) return true;
    setSaving(true);
    try {
      const results = await Promise.allSettled(
        dirtyRows.map((row) =>
          upsertMutation.mutateAsync({
            id: row.record_id ?? undefined,
            params: {
              class_id: classId,
              session_id: sessionId,
              student_id: row.student_id,
              status: row.status,
              note: note || undefined,
            },
          } as any),
        ),
      );
      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed > 0) {
        notification.error({
          message: `Lưu điểm danh thất bại cho ${failed} học viên`,
        });
        return false;
      }
      notification.success({ message: "Lưu điểm danh thành công" });
      setRows((prev) => prev.map((r) => ({ ...r, dirty: false })));
      return true;
    } finally {
      setSaving(false);
    }
  };

  return {
    rows,
    selectedIds,
    note,
    setNote,
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
