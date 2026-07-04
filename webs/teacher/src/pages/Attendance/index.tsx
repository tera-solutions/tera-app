import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { notification, Spin } from "tera-dls";

import EmptyState from "_common/components/EmptyState";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
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
  StudentService,
  TimetableService,
} from "@tera/modules/education";

import type { AttendanceRow } from "./_interface";
import { SESSION_RANGE_MONTHS } from "./constants";
import { summarizeAttendance, toAttendanceRows } from "./_utils";
import AttendanceHeader from "./components/AttendanceHeader";
import AttendanceSummary from "./components/AttendanceSummary";
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
  });

  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const classesQuery = ClassRoomService.useClassRoomList({
    params: { per_page: 100 },
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

  const sessionsQuery = TimetableService.useTimetableCalendar({
    class_id: classId ?? 0,
    ...SESSION_RANGE,
  });
  const sessions = useMemo(() => {
    const list = toClassSessions(sessionsQuery.data?.data);
    const today = moment().startOf("day");
    // Nearest upcoming (today or future) session first; past sessions after,
    // nearest-to-today first.
    const rank = (date: string) => {
      const diff = moment(date).startOf("day").diff(today, "days");
      return diff >= 0 ? [0, diff] : [1, -diff];
    };
    return [...list].sort((a, b) => {
      const [groupA, valA] = rank(a.date);
      const [groupB, valB] = rank(b.date);
      return groupA - groupB || valA - valB;
    });
  }, [sessionsQuery.data]);

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

  // Rebuild the editable draft whenever the roster/records for the selected
  // class+session change; local edits are lost on purpose when switching.
  useEffect(() => {
    setRows(toAttendanceRows(roster, records));
    setNote("");
    setSelectedId(null);
  }, [roster, records]);

  const counts = useMemo(() => summarizeAttendance(rows), [rows]);
  const absentRows = useMemo(() => rows.filter((r) => r.status === "absent"), [rows]);
  const dirtyRows = useMemo(() => rows.filter((r) => r.dirty), [rows]);

  const setStatus = (studentId: number, status: AttendanceStatus) => {
    setRows((prev) =>
      prev.map((r) =>
        r.student_id === studentId ? { ...r, status, dirty: true } : r,
      ),
    );
  };

  const markAllPresent = () => {
    setRows((prev) => prev.map((r) => ({ ...r, status: "present", dirty: true })));
  };

  const upsertMutation = AttendanceService.useUpsertAttendance();
  const exportMutation = AttendanceService.useAttendanceExport();
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

  const handleExport = () => {
    exportMutation.mutate({
      params: { class_id: classId, session_id: sessionId },
    } as any);
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
      </div>

      <div className="flex flex-col gap-4">
        <AttendanceHeader
          classes={classes}
          classId={classId}
          onClassChange={(id) => setFilters({ class_id: id, session_id: 0 })}
          sessions={sessions}
          sessionId={sessionId}
          onSessionChange={(id) => setFilters({ session_id: id })}
          studentCount={roster.length}
          onExport={handleExport}
          exporting={exportMutation.isPending}
        />

        {!classId ? null : sessionsQuery.isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Spin spinning>
              <div className="h-20" />
            </Spin>
          </div>
        ) : !sessionId ? (
          <EmptyState description="Lớp học này chưa có buổi học nào" />
        ) : (
          <>
            <AttendanceSummary
              counts={counts}
              loading={rosterQuery.isLoading || recordsQuery.isLoading}
            />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <AttendanceGrid
                  rows={rows}
                  loading={rosterQuery.isLoading || recordsQuery.isLoading}
                  isError={rosterQuery.isError || recordsQuery.isError}
                  onRetry={() => {
                    rosterQuery.refetch();
                    recordsQuery.refetch();
                  }}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onSetStatus={setStatus}
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
              </div>

              <AttendanceSidebar
                counts={counts}
                absentRows={absentRows}
                note={note}
                onNoteChange={setNote}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Attendance;
