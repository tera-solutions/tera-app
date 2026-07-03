import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";
import { Spin } from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import { CARD } from "_common/constants/dashboard";
import ErrorRetry from "_common/components/ErrorRetry";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { todo } from "_common/utils/todo";

import type { DetailTab } from "./_interface";
import { DETAIL_TABS } from "./constants";
import ClassroomInfoCard from "./components/ClassroomInfoCard";
import OverviewStats from "./components/OverviewStats";
import ResultSummaryCard from "./components/ResultSummaryCard";
import UpcomingSessions from "./components/UpcomingSessions";
import ClassNotifications from "./components/ClassNotifications";
import StudentListPanel from "./components/StudentListPanel";
import AttendancePanel from "./components/AttendancePanel";
import SessionListPanel from "./components/SessionListPanel";
import ComingSoon from "./components/ComingSoon";
import { toClassroomDetail, toClassSessions } from "./_utils";
import {
  ClassRoomService,
  LessonPlanService,
  TimetableService,
} from "@tera/modules/education";

const SESSION_RANGE = {
  date_from: moment().subtract(6, "months").format("YYYY-MM-DD"),
  date_to: moment().add(6, "months").format("YYYY-MM-DD"),
};

const ClassroomDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const classId = id ? Number(id) : null;

  const [tab, setTab] = useState<DetailTab>("students");

  const detailQuery = ClassRoomService.useClassRoomDetail({ id: classId ?? "" });
  const { isLoading, isError, refetch } = detailQuery;
  const detailData = useMemo(
    () => (detailQuery.data ? toClassroomDetail(detailQuery.data.data) : undefined),
    [detailQuery.data],
  );

  // 1 classroom -> 1 lesson plan. Prefer the direct FK when the class-room
  // response carries one; fall back to a course_id-based lookup otherwise.
  const lessonPlanId = detailData?.detail.lesson_plan_id ?? undefined;
  const courseId = detailData?.detail.course_id ?? undefined;

  const lessonPlanDetailQuery = LessonPlanService.useLessonPlanDetail({
    id: lessonPlanId ?? "",
  });
  const lessonPlanListQuery = LessonPlanService.useLessonPlanList({
    params: {
      per_page: 1,
      filters: { course_id: lessonPlanId ? undefined : courseId },
    },
  });

  const lessonPlan = useMemo(() => {
    if (lessonPlanId) {
      const payload = lessonPlanDetailQuery.data?.data;
      const plan = payload?.plan ?? payload;
      return plan?.id ? { id: plan.id, name: plan.plan_name } : undefined;
    }
    if (!courseId) return undefined;
    const item = lessonPlanListQuery.data?.data?.items?.[0];
    return item ? { id: item.id, name: item.plan_name } : undefined;
  }, [lessonPlanId, courseId, lessonPlanDetailQuery.data, lessonPlanListQuery.data]);

  const sessionsQuery = TimetableService.useTimetableCalendar(
    {
      class_id: classId ?? 0,
      ...SESSION_RANGE,
    },
    { enabled: tab === "schedule" && !!classId },
  );
  const {
    isLoading: isSessionsLoading,
    isError: isSessionsError,
    refetch: refetchSessions,
  } = sessionsQuery;
  const sortedSessions = useMemo(
    () => toClassSessions(sessionsQuery.data?.data),
    [sessionsQuery.data],
  );

  const detail = detailData?.detail;
  const statistics = detailData?.statistics;
  const notFound = !isLoading && (isError || !detail?.id);

  const renderTab = () => {
    if (!statistics) return null;
    switch (tab) {
      case "students":
        return <StudentListPanel classId={classId} />;
      case "attendance":
        return <AttendancePanel classId={classId} />;
      case "schedule":
        return (
          <SessionListPanel
            sessions={sortedSessions}
            loading={isSessionsLoading}
            isError={isSessionsError}
            onRetry={() => refetchSessions()}
          />
        );
      default:
        return <ComingSoon />;
    }
  };

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Lớp học", onClick: () => navigate(PATHS.classroom) },
          { label: "Chi tiết lớp học" },
        ]}
      />

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => refetch()}
            message="Không tìm thấy lớp học hoặc bạn không có quyền truy cập"
            iconClassName="h-8 w-8"
            messageClassName="text-sm text-slate-500"
            secondaryAction={{
              label: "Về danh sách lớp",
              onClick: () => navigate(PATHS.classroom),
            }}
          />
        </div>
      ) : (
        <Spin spinning={isLoading}>
          {detail && statistics ? (
            <div className="flex flex-col gap-4">
              <ClassroomInfoCard
                detail={detail}
                maxStudents={detail.max_students}
                lessonPlan={lessonPlan}
                onViewLessonPlan={() =>
                  navigate(`${PATHS.lessonPlans}/${lessonPlan?.id}`)
                }
                onEdit={todo}
                onExport={todo}
              />

              <OverviewStats statistics={statistics} />

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
                </div>

                <div className="flex flex-col gap-4">
                  <ResultSummaryCard statistics={statistics} />
                  <UpcomingSessions schedules={detail.schedules} />
                  <ClassNotifications onCreate={todo} />
                </div>
              </div>
            </div>
          ) : isLoading ? (
            // `Spin` only centers its spinner when it has children to overlay —
            // an empty/falsy child renders the bare icon un-centered.
            <div className="h-[50vh]" />
          ) : (
            <p className="py-20 text-center text-sm text-slate-400">
              Không tải được chi tiết lớp học
            </p>
          )}
        </Spin>
      )}
    </div>
  );
};

export default ClassroomDetail;
