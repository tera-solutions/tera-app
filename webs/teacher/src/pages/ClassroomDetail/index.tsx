import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";
import {
  ArrowPathOutlined,
  ChevronRightOutlined,
  ExclamationTriangleOutlined,
  notification,
  Spin,
} from "tera-dls";

import { CARD } from "_common/constants/dashboard";
import { PATHS } from "_common/components/Layout/Menu/menus";

import type { DetailTab } from "./_interface";
import { DETAIL_TABS } from "./constants";
import {
  useClassAttendance,
  useClassroomDetail,
  useClassSessions,
} from "./hooks";
import ClassroomInfoCard from "./components/ClassroomInfoCard";
import OverviewStats from "./components/OverviewStats";
import ResultSummaryCard from "./components/ResultSummaryCard";
import UpcomingSessions from "./components/UpcomingSessions";
import ClassNotifications from "./components/ClassNotifications";
import StudentListPanel from "./components/StudentListPanel";
import AttendancePanel from "./components/AttendancePanel";
import SessionListPanel from "./components/SessionListPanel";
import ComingSoon from "./components/ComingSoon";

const SESSION_RANGE = {
  date_from: moment().subtract(6, "months").format("YYYY-MM-DD"),
  date_to: moment().add(6, "months").format("YYYY-MM-DD"),
};

const todo = () =>
  notification.open({ message: "Tính năng đang được phát triển" });

const ClassroomDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const classId = id ? Number(id) : null;

  const [tab, setTab] = useState<DetailTab>("students");

  const {
    data: detailData,
    isLoading,
    isError,
    refetch,
  } = useClassroomDetail(classId);

  const {
    data: sessions = [],
    isLoading: isSessionsLoading,
    isError: isSessionsError,
    refetch: refetchSessions,
  } = useClassSessions(classId, SESSION_RANGE);

  const {
    data: attendance = [],
    isLoading: isAttendanceLoading,
    isError: isAttendanceError,
    refetch: refetchAttendance,
  } = useClassAttendance(classId, tab === "attendance");

  const detail = detailData?.detail;
  const statistics = detailData?.statistics;
  const notFound = !isLoading && (isError || !detail?.id);

  const sortedSessions = useMemo(
    () =>
      [...sessions].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)),
    [sessions],
  );

  const upcomingSessions = useMemo(() => {
    const done = ["completed", "done", "cancelled", "canceled"];
    const pending = sortedSessions.filter(
      (s) => !done.includes(s.status?.toLowerCase()),
    );
    if (pending.length > 0) return pending.slice(0, 5);
    const today = moment().format("YYYY-MM-DD");
    return sortedSessions.filter((s) => s.date >= today).slice(0, 5);
  }, [sortedSessions]);

  const renderTab = () => {
    if (!statistics) return null;
    switch (tab) {
      case "students":
        return <StudentListPanel classId={classId} />;
      case "attendance":
        return (
          <AttendancePanel
            records={attendance}
            loading={isAttendanceLoading}
            isError={isAttendanceError}
            onRetry={() => refetchAttendance()}
          />
        );
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
      <div className="mb-4 flex items-center gap-1.5 text-sm text-slate-400 [&_svg]:h-4 [&_svg]:w-4">
        <button
          type="button"
          onClick={() => navigate(PATHS.classroom)}
          className="hover:text-brand"
        >
          Lớp học
        </button>
        <ChevronRightOutlined />
        <span className="font-medium text-slate-600">Chi tiết lớp học</span>
      </div>

      {notFound ? (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-center">
          <ExclamationTriangleOutlined className="h-8 w-8 text-red-400" />
          <p className="text-sm text-slate-500">
            Không tìm thấy lớp học hoặc bạn không có quyền truy cập
          </p>
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-brand hover:bg-sky-100 [&_svg]:h-3.5 [&_svg]:w-3.5"
            >
              <ArrowPathOutlined />
              Thử lại
            </button>
            <button
              type="button"
              onClick={() => navigate(PATHS.classroom)}
              className="rounded-full px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              Về danh sách lớp
            </button>
          </div>
        </div>
      ) : (
        <Spin spinning={isLoading}>
          {detail && statistics ? (
            <div className="flex flex-col gap-4">
              <ClassroomInfoCard
                detail={detail}
                maxStudents={detail.max_students}
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
                  <UpcomingSessions
                    sessions={upcomingSessions}
                    loading={isSessionsLoading}
                    isError={isSessionsError}
                    onRetry={() => refetchSessions()}
                  />
                  <ClassNotifications onCreate={todo} />
                </div>
              </div>
            </div>
          ) : (
            !isLoading && (
              <p className="py-20 text-center text-sm text-slate-400">
                Không tải được chi tiết lớp học
              </p>
            )
          )}
        </Spin>
      )}
    </div>
  );
};

export default ClassroomDetail;
