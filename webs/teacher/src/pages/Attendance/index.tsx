import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { ArrowDownTrayOutlined, Button, notification, Spin } from "tera-dls";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { todo } from "_common/utils/todo";
import { toClassrooms } from "pages/Classroom/_utils";
import {
  toAttendanceRecords,
  toClassSessions,
  toClassStudentResult,
} from "pages/ClassroomDetail/_utils";
import type { AttendanceStatus } from "pages/ClassroomDetail/_interface";
import {
  AttendanceService,
  ClassRoomService,
  ClassSessionService,
  StudentService,
} from "@tera/modules/education";

import type { AttendanceRow } from "./_interface";
import { SESSION_RANGE_MONTHS } from "./constants";
import { summarizeAttendance, toAttendanceRows } from "./_utils";
import AttendanceHeader from "./components/AttendanceHeader";
import AttendanceGrid from "./components/AttendanceGrid";
import AttendanceSidebar from "./components/AttendanceSidebar";

const SESSION_RANGE = {
  date_from: moment().subtract(SESSION_RANGE_MONTHS, "months").format("YYYY-MM-DD"),
  date_to: moment().add(SESSION_RANGE_MONTHS, "months").format("YYYY-MM-DD"),
};

const Attendance = () => {
  const [filters, setFilters] = useUrlFilters({
    class_id: { type: "number", default: 0 },
    session_id: { type: "number", default: 0 },
  }, { syncDefaultsOnMount: true });

  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [note, setNote] = useState("");

  const classesQuery = ClassRoomService.useClassRoomList({
    params: { per_page: 20 },
  });
  const classes = useMemo(
    () => toClassrooms(classesQuery.data?.data?.items),
    [classesQuery.data],
  );

  const classId = filters.class_id || classes[0]?.id || null;

  useEffect(() => {
    if (!filters.class_id && classes[0]?.id) {
      setFilters({ class_id: classes[0].id });
    }
  }, [classes, filters.class_id]);

  const sessionsQuery = ClassSessionService.useClassSessionList(
    { params: { class_id: filters.class_id, per_page: 100, ...SESSION_RANGE } },
    { enabled: !!filters.class_id },
  );
  const sessions = useMemo(() => {
    if (sessionsQuery.isPlaceholderData) return [];

    const list = toClassSessions(sessionsQuery.data?.data?.items);
    const today = moment().startOf("day");
    const rank = (date: string) => {
      const diff = moment(date).startOf("day").diff(today, "days");
      return diff >= 0 ? [0, diff] : [1, -diff];
    };
    return [...list].sort((a, b) => {
      const [groupA, valA] = rank(a.date);
      const [groupB, valB] = rank(b.date);
      return groupA - groupB || valA - valB;
    });
  }, [sessionsQuery.data, sessionsQuery.isPlaceholderData]);

  const sessionsLoading = sessionsQuery.isLoading || sessionsQuery.isPlaceholderData;

  const sessionId = filters.session_id || sessions[0]?.id || null;

  useEffect(() => {
    if (!filters.session_id && sessions[0]?.id) {
      setFilters({ session_id: sessions[0].id });
    }
  }, [sessions, filters.session_id]);

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
  const absentRows = useMemo(() => rows.filter((r) => r.status === "absent"), [rows]);
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
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (dirtyRows.length === 0) return;
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
      } else {
        notification.success({ message: "Lưu điểm danh thành công" });
        setRows((prev) => prev.map((r) => ({ ...r, dirty: false })));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Điểm danh</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý điểm danh học viên theo buổi học
          </p>
        </div>
        <Button
          outlined
          icon={<ArrowDownTrayOutlined />}
          onClick={todo}
          className="whitespace-nowrap text-brand border-brand hover:bg-brand"
        >
          Xuất báo cáo
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <AttendanceHeader
          classes={classes}
          classId={classId}
          onClassChange={(id) => setFilters({ class_id: id, session_id: 0 })}
          classesLoading={classesQuery.isLoading}
          sessions={sessions}
          sessionId={sessionId}
          onSessionChange={(id) => setFilters({ session_id: id })}
          sessionsLoading={sessionsLoading}
        />

        {!classId ? null : sessionsLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Spin spinning>
              <div className="h-20" />
            </Spin>
          </div>
        ) : !sessionId ? (
          <EmptyState description="Lớp học này chưa có buổi học nào" />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
              <Card>
                <AttendanceGrid
                  rows={rows}
                  loading={rosterQuery.isLoading || recordsQuery.isLoading}
                  isError={rosterQuery.isError || recordsQuery.isError}
                  onRetry={() => {
                    rosterQuery.refetch();
                    recordsQuery.refetch();
                  }}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                  onSetStatus={setStatusForSelected}
                  onMarkAllPresent={markAllPresent}
                />

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={dirtyRows.length === 0 || saving}
                    onClick={handleSave}
                    className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/80 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                  >
                    {saving ? "Đang lưu..." : "Lưu điểm danh"}
                  </button>
                </div>
              </Card>

              <div className="hidden xl:block">
                <AttendanceSidebar
                  counts={counts}
                  absentRows={absentRows}
                  note={note}
                  onNoteChange={setNote}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Attendance;
