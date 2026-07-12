import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notification, Spin } from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import { CARD } from "_common/constants/dashboard";
import ErrorRetry from "_common/components/ErrorRetry";
import useConfirm from "_common/hooks/useConfirm";
import { PATHS } from "_common/components/Layout/Menu/menus";
import {
  ClassRoomService,
  ClassSessionService,
  LessonPlanService,
  LessonService,
} from "@tera/modules/education";
import { toSessionDetail } from "pages/Schedule/_utils";
import { toClassroomDetail } from "pages/ClassroomDetail/_utils";
import { toLessonPlan } from "pages/LessonPlan/_utils";
import { useAttendanceSession } from "pages/Attendance/hooks/useAttendanceSession";
import AttendanceEditor from "pages/Attendance/components/AttendanceEditor";
import StudentNotes from "pages/Lesson/components/StudentNotes";

import SessionSummaryCard from "./components/SessionSummaryCard";
import ClassroomCard from "./components/ClassroomCard";
import LessonPlanCard from "./components/LessonPlanCard";
import SessionTabs from "./components/SessionTabs";
import type { SessionRuntimeTab } from "./components/SessionTabs";
import SessionActionBar from "./components/SessionActionBar";

const SessionRuntime = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { id } = useParams<{ id: string }>();
  const sessionId = id ? Number(id) : null;

  const [tab, setTab] = useState<SessionRuntimeTab>("attendance");

  const detailQuery = ClassSessionService.useClassSessionDetail({
    id: sessionId ?? "",
  });
  const { isLoading, isError, refetch } = detailQuery;
  const detail = useMemo(
    () => toSessionDetail(detailQuery.data),
    [detailQuery.data],
  );

  const classRoomQuery = ClassRoomService.useClassRoomDetail(
    { id: detail?.class_id ?? "" },
    { enabled: !!detail?.class_id },
  );
  const classRoom = useMemo(
    () => toClassroomDetail(classRoomQuery.data?.data).detail,
    [classRoomQuery.data],
  );

  const lessonPlanQuery = LessonPlanService.useLessonPlanDetail(
    { id: classRoom?.lesson_plan_id ?? "" },
    { enabled: !!classRoom?.lesson_plan_id },
  );
  const lessonPlan = useMemo(() => {
    const payload = lessonPlanQuery.data?.data;
    if (!payload) return undefined;
    return toLessonPlan(payload.plan ?? payload);
  }, [lessonPlanQuery.data]);

  const attendanceSession = useAttendanceSession({
    classId: detail?.class_id ?? null,
    sessionId: detail?.id ?? null,
  });
  const hasAttendance = attendanceSession.hasSavedAttendance;

  const sessionLessonQuery = LessonService.useLessonList(
    {
      params: {
        per_page: 1,
        filters: {
          class_room_id: detail?.class_id,
          lesson_date: detail?.date,
        },
      },
    },
    { enabled: !!detail?.class_id && !!detail?.date },
  );
  const hasLesson = (sessionLessonQuery.data?.data?.items?.length ?? 0) > 0;

  const { mutate: startSession, isPending: isStarting } =
    ClassSessionService.useClassSessionStart();
  const handleStart = () => {
    if (!sessionId) return;
    startSession(
      { id: sessionId, params: {} },
      {
        onSuccess: (res: any) => {
          notification.success({
            message: res?.msg ?? "Đã bắt đầu buổi học",
          });
        },
        onError: (err: any) => {
          notification.error({
            message: err?.msg ?? err?.message ?? "Bắt đầu buổi học thất bại",
          });
        },
      },
    );
  };

  const { mutate: endSession, isPending: isEnding } =
    ClassSessionService.useClassSessionEnd();
  const handleEnd = () => {
    if (!sessionId) return;
    confirm.warning({
      title: "Kết thúc buổi học",
      content: <p>Bạn có chắc chắn muốn kết thúc buổi học này?</p>,
      onOk: () => {
        endSession(
          { id: sessionId, params: {} },
          {
            onSuccess: (res: any) => {
              notification.success({
                message: res?.msg ?? "Đã kết thúc buổi học",
              });
            },
            onError: (err: any) => {
              notification.error({
                message: err?.msg ?? err?.message ?? "Kết thúc buổi học thất bại",
              });
            },
          },
        );
      },
    });
  };

  const notFound = !isLoading && (isError || !detail?.id);

  const renderTab = () => {
    if (!detail) return null;
    switch (tab) {
      case "notes":
        return <StudentNotes classId={detail.class_id} sessionId={detail.id} />;
      default:
        return <AttendanceEditor session={attendanceSession} />;
    }
  };

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Lịch dạy", onClick: () => navigate(PATHS.schedule) },
          { label: "Chi tiết buổi học" },
        ]}
      />

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => refetch()}
            message="Không tìm thấy buổi học hoặc bạn không có quyền truy cập"
            iconClassName="h-8 w-8"
            messageClassName="text-sm text-slate-500"
            secondaryAction={{
              label: "Về lịch dạy",
              onClick: () => navigate(PATHS.schedule),
            }}
          />
        </div>
      ) : (
        <Spin spinning={isLoading}>
          {detail && detail.id ? (
            <div className="flex flex-col gap-4">
              <SessionSummaryCard detail={detail} />

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ClassroomCard
                  loading={classRoomQuery.isLoading}
                  classId={detail.class_id}
                  classRoom={classRoom}
                  onViewDetail={() => navigate(`${PATHS.classroom}/${detail.class_id}`)}
                />
                <LessonPlanCard
                  loading={lessonPlanQuery.isLoading}
                  lessonPlanId={classRoom?.lesson_plan_id}
                  lessonPlan={lessonPlan}
                  onView={() =>
                    classRoom?.lesson_plan_id &&
                    navigate(`${PATHS.lessonPlans}/${classRoom.lesson_plan_id}`)
                  }
                />
              </div>

              <div className={`${CARD} p-4`}>
                <SessionTabs tab={tab} onChange={setTab} />

                {renderTab()}

                <SessionActionBar
                  status={detail.status}
                  isStarting={isStarting}
                  isEnding={isEnding}
                  onStart={handleStart}
                  onEnd={handleEnd}
                  hasAttendance={hasAttendance}
                  attendanceLoading={attendanceSession.loading}
                  hasLesson={hasLesson}
                  lessonLoading={sessionLessonQuery.isLoading}
                />
              </div>
            </div>
          ) : isLoading ? (
            <div className="h-[50vh]" />
          ) : (
            <p className="py-20 text-center text-sm text-slate-400">
              Không tải được chi tiết buổi học
            </p>
          )}
        </Spin>
      )}
    </div>
  );
};

export default SessionRuntime;
