import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import classNames from "classnames";
import {
  CheckBadgeOutlined,
  ClipboardDocumentCheckOutlined,
  DocumentTextOutlined,
  Spin,
  UsersOutlined,
} from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import ComingSoon from "_common/components/ComingSoon";
import ErrorRetry from "_common/components/ErrorRetry";
import SkillBars from "_common/components/SkillBars";
import StatisticCard from "_common/components/StatisticCard";
import { PATHS } from "_common/components/Layout/Menu/menus";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { StudentAPI } from "@tera/api";
import { AttendanceService, EvaluationService, StudentService, ClassRoomService } from "@tera/modules/education";

import type { DetailTab } from "./_interface";
import { DETAIL_TABS } from "./constants";
import { toAttendanceHistory, toComments, toCurrentClass, toStudentDetail, toStudentStats } from "./_utils";
import StudentProfileCard from "./components/StudentProfileCard";
import StudentGuardiansCard from "./components/StudentGuardiansCard";
import LearningProgressCard from "./components/LearningProgressCard";
import ProgressChart from "./components/ProgressChart";
import CurrentClassTable from "./components/CurrentClassTable";
import RecentComments from "./components/RecentComments";
import StudentMaterialsCard from "./components/StudentMaterialsCard";
import StudentAttendanceTable from "./components/StudentAttendanceTable";
import StudentScoresPanel from "./components/StudentScoresPanel";
import StudentHistoryPanel from "./components/StudentHistoryPanel";
import StudentLevelHistoryTab from "./components/StudentLevelHistoryTab";
import StudentExamTab from "./components/StudentExamTab";
import StudentCertificatesTab from "./components/StudentCertificatesTab";
import ClassAssignmentPanel from "pages/ClassroomDetail/components/ClassAssignmentPanel";

const StudentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const studentId = id ? Number(id) : null;

  const [tab, setTab] = useState<DetailTab>("overview");

  const detailQuery = StudentService.useStudentDetail({ id: studentId ?? "" });
  const { isLoading, isError, refetch } = detailQuery;
  const detail = useMemo(
    () => toStudentDetail(detailQuery.data?.data?.student),
    [detailQuery.data],
  );

  const statsQuery = StudentService.useStudentStats({ id: studentId ?? "" });
  const stats = useMemo(() => toStudentStats(statsQuery.data?.data), [statsQuery.data]);

  // Students have no permitted student→class endpoint (crm/enrollment is
  // admin-only for the teacher role), so the current class is found by
  // scanning the teacher's own classes' rosters for this student's id.
  const classesQuery = ClassRoomService.useClassRoomList({ params: { per_page: 50 } });
  const classes = useMemo(() => classesQuery.data?.data?.items ?? [], [classesQuery.data]);

  const rosterQueries = useQueries({
    queries: classes.map((c: any) => ({
      queryKey: ["student-detail", "class-roster", c.id],
      queryFn: () => StudentAPI.getList({ params: { class_id: c.id, per_page: 100 } }),
      enabled: !!studentId && classes.length > 0,
    })),
  });
  const rosterLoading = rosterQueries.some((q) => q.isLoading);

  const classId = useMemo(() => {
    for (let i = 0; i < classes.length; i++) {
      const items = (rosterQueries[i]?.data as any)?.data?.items ?? [];
      if (items.some((s: any) => s.id === studentId)) return classes[i].id;
    }
    return null;
  }, [classes, rosterQueries, studentId]);

  const classDetailQuery = ClassRoomService.useClassRoomDetail(
    { id: classId ?? "" },
    { enabled: !!classId },
  );
  const currentClass = useMemo(
    () => toCurrentClass(classDetailQuery.data?.data?.class),
    [classDetailQuery.data],
  );

  const evaluationsQuery = EvaluationService.useEvaluationList({
    params: { filters: { evaluation_type: "student", target_id: studentId ?? undefined } },
  });
  const evaluationItems = evaluationsQuery.data?.data?.items ?? [];
  const comments = useMemo(() => toComments(evaluationItems), [evaluationItems]);
  const progressPoints = useMemo(
    () =>
      [...evaluationItems]
        .filter((e: any) => e.score != null && e.evaluated_at)
        .sort((a: any, b: any) => a.evaluated_at.localeCompare(b.evaluated_at))
        .map((e: any) => ({ date: e.evaluated_at, score: Number(e.score) })),
    [evaluationItems],
  );

  const [attendancePage, setAttendancePage] = useState(1);
  const [attendancePerPage, setAttendancePerPage] = useState(DEFAULT_PAGE_SIZE);
  const attendanceQuery = AttendanceService.useAttendanceList(
    {
      params: {
        page: attendancePage,
        per_page: attendancePerPage,
        filters: { student_id: studentId ?? 0 },
      },
    },
    { enabled: !!studentId },
  );
  const attendanceRows = useMemo(
    () => toAttendanceHistory(attendanceQuery.data?.data?.items),
    [attendanceQuery.data],
  );
  const attendancePagination = attendanceQuery.data?.data?.pagination;

  const handleAttendancePageChange = (nextPage: number, nextSize: number) => {
    if (nextSize !== attendancePerPage) {
      setAttendancePerPage(nextSize);
      setAttendancePage(1);
    } else {
      setAttendancePage(nextPage);
    }
  };

  const notFound = !isLoading && (isError || !detail?.id);

  const renderTab = () => {
    if (tab === "attendance")
      return (
        <Card>
          <p className="mb-2 text-sm font-semibold text-slate-700">Lịch sử điểm danh</p>
          <StudentAttendanceTable
            rows={attendanceRows}
            isLoading={attendanceQuery.isLoading}
            isError={attendanceQuery.isError}
            onRetry={() => attendanceQuery.refetch()}
          />
          <TablePagination
            total={attendancePagination?.total ?? 0}
            page={attendancePagination?.current_page ?? attendancePage}
            perPage={attendancePagination?.per_page ?? attendancePerPage}
            unit="buổi điểm danh"
            onChange={handleAttendancePageChange}
          />
        </Card>
      );

    if (tab === "scores")
      return (
        <Card>
          <p className="mb-2 text-sm font-semibold text-slate-700">Điểm đánh giá</p>
          <StudentScoresPanel
            evaluations={evaluationItems}
            isLoading={evaluationsQuery.isLoading}
            isError={evaluationsQuery.isError}
            onRetry={() => evaluationsQuery.refetch()}
          />
        </Card>
      );

    if (tab === "assignment")
      return (
        <Card>
          <p className="mb-2 text-sm font-semibold text-slate-700">Bài tập của lớp</p>
          <ClassAssignmentPanel classId={classId} />
        </Card>
      );

    if (tab === "exam")
      return (
        <Card>
          <p className="mb-2 text-sm font-semibold text-slate-700">Bài kiểm tra</p>
          <StudentExamTab studentId={studentId} />
        </Card>
      );

    if (tab === "history")
      return (
        <Card>
          <p className="mb-2 text-sm font-semibold text-slate-700">Lịch sử ghi danh</p>
          <StudentHistoryPanel studentId={studentId} />
        </Card>
      );

    if (tab === "certificates")
      return (
        <Card>
          <p className="mb-2 text-sm font-semibold text-slate-700">Chứng chỉ</p>
          <StudentCertificatesTab studentId={studentId} />
        </Card>
      );

    if (tab === "level-history")
      return (
        <Card>
          <p className="mb-2 text-sm font-semibold text-slate-700">Lịch sử trình độ</p>
          <StudentLevelHistoryTab studentId={studentId} />
        </Card>
      );

    if (tab !== "overview")
      return (
        <Card animated={false}>
          <ComingSoon />
        </Card>
      );
    return (
      <Card>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="lg:border-r lg:border-slate-100 lg:pr-4">
            <p className="mb-2 text-sm font-semibold text-slate-700">Tiến độ học tập</p>
            <LearningProgressCard stats={stats} loading={statsQuery.isLoading} />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">Kỹ năng</p>
            <SkillBars skills={stats.skills} />
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="mb-2 text-sm font-semibold text-slate-700">Xu hướng điểm đánh giá</p>
          <ProgressChart points={progressPoints} />
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="mb-2 text-sm font-semibold text-slate-700">Lớp học hiện tại</p>
          <CurrentClassTable
            currentClass={currentClass}
            isLoading={rosterLoading || classDetailQuery.isLoading}
          />
        </div>
      </Card>
    );
  };

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb
          items={[
            { label: "Học viên", onClick: () => navigate(PATHS.students) },
            { label: "Chi tiết học viên" },
          ]}
        />
      </div>

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => refetch()}
            message="Không tìm thấy học viên hoặc bạn không có quyền truy cập"
            iconClassName="h-8 w-8"
            messageClassName="text-sm text-slate-500"
            secondaryAction={{ label: "Về danh sách học viên", onClick: () => navigate(PATHS.students) }}
          />
        </div>
      ) : (
        <Spin spinning={isLoading}>
          {detail ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
                <StudentProfileCard detail={detail} />

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatisticCard
                      icon={<CheckBadgeOutlined />}
                      value={stats.avg_score ?? "—"}
                      label="Điểm trung bình"
                      iconClassName="bg-emerald-50 text-emerald-500"
                      loading={statsQuery.isLoading}
                    />
                    <StatisticCard
                      icon={<ClipboardDocumentCheckOutlined />}
                      value={`${stats.attendance_rate}%`}
                      label="Tỷ lệ điểm danh"
                      iconClassName="bg-sky-50 text-brand"
                      loading={statsQuery.isLoading}
                    />
                    <StatisticCard
                      icon={<DocumentTextOutlined />}
                      value={`${stats.assignment_completion}%`}
                      label="Bài tập"
                      iconClassName="bg-violet-50 text-violet-500"
                      loading={statsQuery.isLoading}
                    />
                    <StatisticCard
                      icon={<UsersOutlined />}
                      value={stats.total_sessions}
                      label="Buổi học"
                      iconClassName="bg-amber-50 text-amber-500"
                      loading={statsQuery.isLoading}
                    />
                  </div>

                  <Card animated={false}>
                    <div className="flex gap-1 overflow-x-auto scrollbar-none">
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
                  </Card>

                  {renderTab()}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Nhận xét gần đây</p>
                  <RecentComments comments={comments} />
                </Card>

                <Card>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Tài liệu học tập</p>
                  <StudentMaterialsCard courseId={currentClass?.course_id ?? null} />
                </Card>

                <Card>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Người giám hộ</p>
                  <StudentGuardiansCard parents={detail.parents} />
                </Card>
              </div>
            </div>
          ) : isLoading ? (
            <div className="h-[50vh]" />
          ) : (
            <p className="py-20 text-center text-sm text-slate-400">Không tải được chi tiết học viên</p>
          )}
        </Spin>
      )}
    </div>
  );
};

export default StudentDetail;
