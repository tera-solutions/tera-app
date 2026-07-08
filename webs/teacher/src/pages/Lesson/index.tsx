import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";
import {
  Button,
  CheckOutlined,
  ClipboardDocumentListOutlined,
  notification,
  PlayOutlined,
  Spin,
} from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import { CARD } from "_common/constants/dashboard";
import ErrorRetry from "_common/components/ErrorRetry";
import useConfirm from "_common/hooks/useConfirm";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { todo } from "_common/utils/todo";
import {
  ClassSessionService,
  LessonActivityService,
  LessonMaterialService,
  LessonPlanService,
  LessonService,
} from "@tera/modules/education";
import { toLessonPlan } from "pages/LessonPlan/_utils";
import { toClassSessions } from "pages/ClassroomDetail/_utils";
import { useAttendanceSession } from "pages/Attendance/hooks/useAttendanceSession";
import AttendanceEditor from "pages/Attendance/components/AttendanceEditor";

import type {
  LessonActivity,
  LessonActivityStatus,
  LessonDetailTab,
  LessonMaterial,
} from "./_interface";
import { DETAIL_TABS } from "./constants";
import { toLessonDetail } from "./_utils";
import LessonHeader from "./components/LessonHeader";
import LessonStatRow from "./components/LessonStatRow";
import ObjectiveList from "./components/ObjectiveList";
import MaterialList from "./components/MaterialList";
import MaterialUploader from "./components/MaterialUploader";
import ActivityTimeline from "./components/ActivityTimeline";
import LessonSidebar from "./components/LessonSidebar";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-sm font-semibold text-slate-700">{children}</p>
);

const Lesson = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const lessonId = id ? Number(id) : null;

  const [tab, setTab] = useState<LessonDetailTab>("overview");
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const confirm = useConfirm();

  const detailQuery = LessonService.useLessonDetail({ id: lessonId ?? "" });
  const { isLoading, isError, refetch } = detailQuery;

  const detail = useMemo(() => {
    const payload = detailQuery.data?.data;
    if (!payload) return undefined;
    return toLessonDetail(payload.lesson ?? payload);
  }, [detailQuery.data]);

  const materials = detail?.materials ?? [];

  const lessonPlanQuery = LessonPlanService.useLessonPlanDetail(
    { id: detail?.lesson_plan_id ?? "" },
    { enabled: !!detail?.lesson_plan_id },
  );
  const lessonPlan = useMemo(() => {
    const payload = lessonPlanQuery.data?.data;
    if (!payload) return undefined;
    return toLessonPlan(payload.plan ?? payload);
  }, [lessonPlanQuery.data]);

  // Resolve which class session this lesson maps to so attendance can be taken
  // in-place. Prefer the session on the lesson's own date; otherwise fall back
  // to the session nearest today.
  const attendanceClassId = detail?.class_room_id ?? null;
  const sessionListParams = {
    class_id: attendanceClassId ?? 0,
    per_page: 100,
    date_from: moment().subtract(6, "months").format("YYYY-MM-DD"),
    date_to: moment().add(6, "months").format("YYYY-MM-DD"),
  };
  const sessionsQuery = ClassSessionService.useClassSessionList(
    { params: sessionListParams },
    { enabled: !!attendanceClassId },
  );
  const attendanceSessionId = useMemo(() => {
    const list = toClassSessions(sessionsQuery.data?.data?.items);
    if (list.length === 0) return null;
    const onLessonDate = detail?.date
      ? list.find((s) => s.date === detail.date)
      : undefined;
    if (onLessonDate) return onLessonDate.id;
    const today = moment().startOf("day");
    const nearest = [...list].sort(
      (a, b) =>
        Math.abs(moment(a.date).startOf("day").diff(today, "days")) -
        Math.abs(moment(b.date).startOf("day").diff(today, "days")),
    );
    return nearest[0]?.id ?? null;
  }, [sessionsQuery.data, detail?.date]);

  const attendanceSession = useAttendanceSession({
    classId: attendanceClassId,
    sessionId: attendanceSessionId,
  });

  // Live activity progress. Persisted to `edu_lesson_activities` via the
  // activity status endpoint; kept as optimistic local state so Start/Complete
  // feel instant, rolled back if the request fails.
  const [activityStatuses, setActivityStatuses] = useState<
    Record<string, LessonActivityStatus>
  >({});

  useEffect(() => {
    if (!detail) return;
    setActivityStatuses(
      Object.fromEntries(
        detail.activities.map((a) => [String(a.id), a.status]),
      ),
    );
  }, [detail?.id]);

  const activities: LessonActivity[] = useMemo(
    () =>
      (detail?.activities ?? []).map((a) => ({
        ...a,
        status: activityStatuses[String(a.id)] ?? a.status,
      })),
    [detail?.activities, activityStatuses],
  );

  const { mutate: persistActivityStatus } =
    LessonActivityService.useLessonActivityUpdateStatus();

  const setActivityStatus = (
    activityId: LessonActivity["id"],
    status: LessonActivityStatus,
  ) => {
    const prevStatus = activityStatuses[String(activityId)] ?? "pending";
    setActivityStatuses((prev) => ({ ...prev, [String(activityId)]: status }));
    persistActivityStatus(
      { id: activityId, status },
      {
        onSuccess: (res: any) => {
          notification.success({
            message:
              res?.msg ??
              (status === "in_progress"
                ? "Đã bắt đầu hoạt động"
                : status === "completed"
                  ? "Đã hoàn thành hoạt động"
                  : "Đã cập nhật hoạt động"),
          });
        },
        onError: (err: any) => {
          setActivityStatuses((prev) => ({
            ...prev,
            [String(activityId)]: prevStatus,
          }));
          notification.error({
            message:
              err?.msg ?? err?.message ?? "Cập nhật hoạt động thất bại",
          });
        },
      },
    );
  };

  const { mutate: detachMaterial } = LessonMaterialService.useLessonMaterialDetach();

  const handleDeleteMaterial = (material: LessonMaterial) => {
    confirm.warning({
      title: "Xóa tài liệu",
      content: (
        <p>
          Bạn có chắc muốn xóa tài liệu <b>{material.name}</b>?
        </p>
      ),
      onOk: () => {
        setDeletingId(material.id);
        detachMaterial(
          { id: material.id },
          {
            onSuccess: (res: any) => {
              notification.success({
                message: res?.msg ?? "Xóa tài liệu thành công",
              });
            },
            onError: (err: any) => {
              notification.error({
                message: err?.msg ?? err?.message ?? "Xóa tài liệu thất bại",
              });
            },
            onSettled: () => setDeletingId(null),
          },
        );
      },
    });
  };

  const notFound = !isLoading && (isError || !detail?.id);

  // Start has no dedicated endpoint — it's a plain status update.
  const { mutate: updateLesson, isPending: isStarting } =
    LessonService.useLessonUpdate();
  const handleStart = () => {
    if (!lessonId) return;
    updateLesson(
      { id: lessonId, params: { status: "in_progress" } },
      {
        onSuccess: (res: any) => {
          notification.success({
            message: res?.msg ?? "Đã bắt đầu buổi học",
          });
          setTab("attendance");
        },
        onError: (err: any) => {
          notification.error({
            message: err?.msg ?? err?.message ?? "Bắt đầu buổi học thất bại",
          });
        },
      },
    );
  };

  // End uses `POST /edu/lesson/complete/{id}` — no body.
  const { mutate: completeLesson, isPending: isEnding } =
    LessonService.useLessonComplete();
  const handleEnd = () => {
    if (!lessonId) return;
    completeLesson(
      { id: lessonId, params: {} },
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
  };

  const renderTab = () => {
    if (!detail) return null;
    switch (tab) {
      case "content":
        return (
          <div>
            <SectionTitle>Mục tiêu bài học</SectionTitle>
            <ObjectiveList objectives={detail.objectives} />
          </div>
        );
      case "activities":
        return (
          <div>
            <SectionTitle>Hoạt động trong bài</SectionTitle>
            <ActivityTimeline
              activities={activities}
              onStart={(activityId) =>
                setActivityStatus(activityId, "in_progress")
              }
              onComplete={(activityId) =>
                setActivityStatus(activityId, "completed")
              }
            />
          </div>
        );
      case "materials":
        return (
          <div>
            <SectionTitle>Tài liệu sử dụng</SectionTitle>
            <div className="mb-4">
              <MaterialUploader lessonId={detail.id} />
            </div>
            <MaterialList
              materials={materials}
              onDelete={handleDeleteMaterial}
              deletingId={deletingId}
            />
          </div>
        );
      case "attendance":
        if (!attendanceSessionId) {
          return (
            <p className="py-8 text-center text-sm text-slate-400">
              Buổi học này chưa gắn với buổi điểm danh nào.
            </p>
          );
        }
        return (
          <div>
            <SectionTitle>Điểm danh buổi học</SectionTitle>
            <AttendanceEditor session={attendanceSession} />
          </div>
        );
      case "notes":
        return (
          <p className="py-8 text-center text-sm text-slate-400">
            Sử dụng "Ghi chú nhanh" ở cột bên phải để lưu ghi chú cho bài học.
          </p>
        );
      default:
        return (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <div>
                <SectionTitle>Mục tiêu bài học</SectionTitle>
                <ObjectiveList objectives={detail.objectives} />
              </div>
              <div>
                <SectionTitle>Tài liệu sử dụng</SectionTitle>
                <MaterialList materials={materials} />
              </div>
            </div>
            <div>
              <SectionTitle>Hoạt động trong bài</SectionTitle>
              <ActivityTimeline activities={activities} />
            </div>
          </div>
        );
    }
  };

  const isInProgress = detail?.status === "in_progress";
  // "End" goes through the cancel endpoint, which sets status to "cancelled".
  const isEnded = detail?.status === "completed" || detail?.status === "cancelled";

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Giáo án", onClick: () => navigate(PATHS.lessonPlans) },
          { label: "Chi tiết giáo án", onClick: () => navigate(`${PATHS.lessonPlans}/${detail.lesson_plan_id}`) },
          { label: "Chi tiết bài học" },
        ]}
      />

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => refetch()}
            message="Không tìm thấy bài học hoặc bạn không có quyền truy cập"
            iconClassName="h-8 w-8"
            messageClassName="text-sm text-slate-500"
            secondaryAction={{
              label: "Về danh sách giáo án",
              onClick: () => navigate(PATHS.lessonPlans),
            }}
          />
        </div>
      ) : (
        <Spin spinning={isLoading}>
          {detail && detail.id ? (
            <div className="flex flex-col gap-4">
              <LessonHeader
                detail={detail}
                onEdit={todo}
                onMore={() =>
                  notification.open({
                    message: "Tính năng đang được phát triển",
                  })
                }
              />

              <LessonStatRow detail={detail} />

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
                <div className={`${CARD} p-4`}>
                  <div className="mb-4 flex gap-1 overflow-x-auto border-b border-slate-100 scrollbar-none">
                    {DETAIL_TABS.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setTab(item.key)}
                        className={classNames(
                          "whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                          tab === item.key
                            ? "border-brand text-brand"
                            : "border-transparent text-slate-500 hover:text-slate-700",
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {renderTab()}

                  <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                    <Button
                      outlined
                      icon={<ClipboardDocumentListOutlined />}
                      onClick={todo}
                      className="text-brand border-brand hover:bg-brand"
                    >
                      Xem kế hoạch bài học
                    </Button>
                    {isEnded ? (
                      <Button
                        type="alternative"
                        disabled
                        className="w-full"
                        icon={<CheckOutlined />}
                      >
                        Buổi học đã kết thúc
                      </Button>
                    ) : isInProgress ? (
                      <Button
                        type="success"
                        icon={<CheckOutlined />}
                        onClick={handleEnd}
                        loading={isEnding}
                        className="whitespace-nowrap"
                      >
                        Kết thúc buổi học
                      </Button>
                    ) : (
                      <Button
                        icon={<PlayOutlined />}
                        onClick={handleStart}
                        loading={isStarting}
                        className="whitespace-nowrap bg-brand hover:bg-brand/80"
                      >
                        Bắt đầu giảng dạy
                      </Button>
                    )}
                  </div>
                </div>

                <div className="xl:block">
                  <LessonSidebar
                    detail={detail}
                    courseName={lessonPlan?.course_name}
                    level={lessonPlan?.level_name}
                  />
                </div>
              </div>
            </div>
          ) : isLoading ? (
            // `Spin` only centers its spinner when it has children to overlay —
            // an empty/falsy child renders the bare icon un-centered.
            <div className="h-[50vh]" />
          ) : (
            <p className="py-20 text-center text-sm text-slate-400">
              Không tải được chi tiết bài học
            </p>
          )}
        </Spin>
      )}
    </div>
  );
};

export default Lesson;
