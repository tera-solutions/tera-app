import { useEffect, useMemo } from "react";
import moment from "moment";
import { ArrowDownTrayOutlined, Button, Spin } from "tera-dls";

import EmptyState from "_common/components/EmptyState";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { toClassrooms } from "pages/Classroom/_utils";
import { toClassSessions } from "pages/ClassroomDetail/_utils";
import {
  AttendanceService,
  ClassRoomService,
  ClassSessionService,
} from "@tera/modules/education";

import { SESSION_RANGE_MONTHS } from "./constants";
import { useAttendanceSession } from "./hooks/useAttendanceSession";
import AttendanceHeader from "./components/AttendanceHeader";
import AttendanceEditor from "./components/AttendanceEditor";

const SESSION_RANGE = {
  date_from: moment().subtract(SESSION_RANGE_MONTHS, "months").format("YYYY-MM-DD"),
  date_to: moment().add(SESSION_RANGE_MONTHS, "months").format("YYYY-MM-DD"),
};

const Attendance = () => {
  const [filters, setFilters] = useUrlFilters({
    class_id: { type: "number", default: 0 },
    session_id: { type: "number", default: 0 },
  }, { syncDefaultsOnMount: true });

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

  const session = useAttendanceSession({ classId, sessionId });

  const exportMutation = AttendanceService.useAttendanceExport();
  const handleExport = () =>
    exportMutation.mutate({
      params: { class_id: classId ?? undefined, session_id: sessionId ?? undefined },
    });

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
          icon={<ArrowDownTrayOutlined />}
          onClick={handleExport}
          disabled={!classId || !sessionId || exportMutation.isPending}
          className="whitespace-nowrap bg-brand hover:bg-brand/80"
        >
          {exportMutation.isPending ? "Đang xuất..." : "Xuất báo cáo"}
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
          <AttendanceEditor session={session} />
        )}
      </div>
    </div>
  );
};

export default Attendance;
