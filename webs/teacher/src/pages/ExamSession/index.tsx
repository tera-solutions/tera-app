import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";
import {
  ArrowDownTrayOutlined,
  Button,
  CalendarDaysOutlined,
  CheckBadgeOutlined,
  ChartBarOutlined,
  ClipboardDocumentCheckOutlined,
  ClipboardDocumentListOutlined,
  EyeOutlined,
  notification,
  PencilSquareOutlined,
  PlusOutlined,
  StarOutlined,
  Spin,
  UserMinusOutlined,
  UsersOutlined,
} from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import ComingSoon from "_common/components/ComingSoon";
import ErrorRetry from "_common/components/ErrorRetry";
import SearchInput from "_common/components/SearchInput";
import StatisticCard from "_common/components/StatisticCard";
import StatusTabs from "_common/components/StatusTabs";
import TablePagination from "_common/components/TablePagination";
import { CARD } from "_common/constants/dashboard";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { todo } from "_common/utils/todo";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useMeta } from "_common/hooks/useMeta";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { ExamResultService, ExamService, ExamSessionService } from "@tera/modules/education";

import type { ExamResultRow, ExamSessionStatus } from "./_interface";
import { EXAM_SESSION_STATUS_META, EXAM_TABS, ExamTabKey } from "./constants";
import {
  examSessionSummary,
  scoreStats,
  sessionSummaryStats,
  toExamResultRows,
  toExamSessionHeader,
  toExamSessionRows,
} from "./_utils";
import StudentResultTable from "./components/StudentResultTable";
import GradeResultForm from "./components/GradeResultForm";
import ScoreCharts from "./components/ScoreCharts";
import ExamInfoCard from "./components/ExamInfoCard";
import ExamSessionTable from "./components/ExamSessionTable";
import ExamSessionFilterSidebar from "./components/ExamSessionFilterSidebar";
import GenerateExamModal from "../ExamDetail/components/GenerateExamModal";
import RegisterStudentsModal from "./components/RegisterStudentsModal";

const ExamSessionList = () => {
  const navigate = useNavigate();
  const { getTabs } = useMeta();
  const [generateOpen, setGenerateOpen] = useState(false);

  const [filters, setFilters] = useUrlFilters(
    {
      search: { type: "string", default: "" },
      status: { type: "string", default: "" as ExamSessionStatus | "" },
      classId: { type: "number", default: undefined as number | undefined, param: "class_id" },
      examDate: { type: "string", default: "", param: "exam_date" },
      page: { type: "number", default: 1 },
      pageSize: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );
  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  const listQuery = ExamSessionService.useExamSessionList({
    params: {
      page: filters.page,
      per_page: filters.pageSize,
      search: filters.search || undefined,
      filters: {
        status: filters.status || undefined,
        class_room_id: filters.classId,
        exam_date: filters.examDate || undefined,
      },
    },
  });
  const { isLoading, isFetching, isError, refetch } = listQuery;
  const pagination = listQuery.data?.data?.pagination;
  const rows = useMemo(() => toExamSessionRows(listQuery.data?.data?.items), [listQuery.data]);
  const total = pagination?.total ?? rows.length;
  const perPage = pagination?.per_page ?? filters.pageSize;
  const summary = useMemo(() => examSessionSummary(rows), [rows]);

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) setFilters({ pageSize: nextSize, page: 1 });
    else setFilters({ page: nextPage });
  };

  const handleTabChange = (key: string) =>
    setFilters({ status: (key === "all" ? "" : key) as ExamSessionStatus | "", page: 1 });

  const handleFilterChange = (patch: { class_id?: number; exam_date?: string }) =>
    setFilters({
      ...("class_id" in patch && { classId: patch.class_id }),
      ...("exam_date" in patch && { examDate: patch.exam_date }),
      page: 1,
    });

  const handleResetFilters = () =>
    setFilters({
      search: "",
      status: "",
      classId: undefined,
      examDate: "",
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Bài kiểm tra</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý lịch kiểm tra và kết quả các lớp bạn phụ trách
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            outlined
            onClick={() => setGenerateOpen(true)}
            className="whitespace-nowrap text-brand border-brand hover:bg-brand"
          >
            Sinh đề từ ngân hàng câu hỏi
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate(`${PATHS.exam}/new`)}
            className="whitespace-nowrap bg-brand hover:bg-brand/80"
          >
            Tạo bài kiểm tra
          </Button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatisticCard
          icon={<ClipboardDocumentListOutlined />}
          value={summary.total}
          label="Tổng bài kiểm tra"
          iconClassName="bg-sky-50 text-brand"
          loading={isLoading}
        />
        <StatisticCard
          icon={<CalendarDaysOutlined />}
          value={summary.scheduled}
          label="Đã lên lịch"
          iconClassName="bg-amber-50 text-amber-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<ChartBarOutlined />}
          value={summary.in_progress}
          label="Đang diễn ra"
          iconClassName="bg-violet-50 text-violet-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={summary.closed}
          label="Đã đóng"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <Card>
          <StatusTabs
            className="mb-3"
            tabs={getTabs(EXAM_SESSION_STATUS_META)}
            activeKey={filters.status || "all"}
            onChange={handleTabChange}
          />

          <SearchInput
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Tìm kiếm bài kiểm tra theo tên..."
            wrapperClassName="mb-3"
          />

          <ExamSessionTable
            data={rows}
            isLoading={isLoading || isFetching}
            isError={isError}
            onRetry={() => refetch()}
          />

          <TablePagination
            total={total}
            page={filters.page}
            perPage={perPage}
            unit="bài kiểm tra"
            onChange={handleChangePage}
          />
        </Card>

        <div className="hidden xl:block">
          <ExamSessionFilterSidebar
            draft={{ class_id: filters.classId, exam_date: filters.examDate }}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            summary={summary}
            loading={isLoading}
          />
        </div>
      </div>

      <GenerateExamModal open={generateOpen} onClose={() => setGenerateOpen(false)} />
    </div>
  );
};

const ExamSessionDetail = ({ sessionId }: { sessionId: number }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<ExamTabKey>("results");
  const [gradingRow, setGradingRow] = useState<ExamResultRow | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);

  const detailQuery = ExamSessionService.useExamSessionDetail({ id: sessionId });
  const header = useMemo(() => toExamSessionHeader(detailQuery.data?.data), [detailQuery.data]);
  const rows = useMemo(() => toExamResultRows(detailQuery.data?.data), [detailQuery.data]);
  const registeredStudentIds = useMemo(() => rows.map((r) => r.student_id), [rows]);

  const { mutate: publishResult } = ExamResultService.useExamResultPublish();
  const handlePublish = (row: ExamResultRow) =>
    publishResult(
      { id: row.registration_id },
      {
        onSuccess: () => {
          notification.success({ message: "Đã công bố kết quả cho học viên" });
          detailQuery.refetch();
        },
        onError: (error: any) =>
          notification.error({ message: error?.data?.msg ?? "Không thể công bố kết quả" }),
      },
    );
  const stats = useMemo(() => scoreStats(rows), [rows]);
  const summary = useMemo(() => sessionSummaryStats(rows), [rows]);

  const examQuery = ExamService.useExamDetail({ id: header?.exam_id ?? "" });
  const exam = examQuery.data?.data;
  const totalScore = exam?.total_score ?? 100;

  const notFound = !detailQuery.isLoading && (detailQuery.isError || !header?.id);

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Bài kiểm tra", onClick: () => navigate(PATHS.exam) },
          { label: header?.exam_name, onClick: () => navigate(`${PATHS.exam}/${header.exam_id}`) },
          { label: "Thông tin bài kiểm tra" },
        ]}
      />

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => detailQuery.refetch()}
            message="Không tìm thấy bài kiểm tra hoặc bạn không có quyền truy cập"
            secondaryAction={{ label: "Về danh sách", onClick: () => navigate(PATHS.exam) }}
          />
        </div>
      ) : (
        <Spin spinning={detailQuery.isLoading}>
          {header && (
            <div className="flex flex-col gap-4">
              <ExamInfoCard
                sessionId={header.id}
                examName={header.exam_name}
                classroomName={header.class_name}
                sessionName={header.session_name}
                status={header.status}
                duration={exam?.duration ?? 0}
                examDate={header.exam_date ? moment(header.exam_date).format("DD/MM/YYYY HH:mm") : ""}
                roomName={header.room_name}
                teacherName={header.teacher_name}
                totalScore={exam?.total_score ?? 0}
                passingScore={exam?.passing_score ?? 0}
              />

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                <StatisticCard icon={<ChartBarOutlined />} value={stats.avg || "—"} label="Điểm trung bình" iconClassName="bg-sky-50 text-brand" />
                <StatisticCard
                  icon={<StarOutlined />}
                  value={stats.max || "—"}
                  label="Điểm cao nhất"
                  iconClassName="bg-amber-50 text-amber-500"
                />
                <StatisticCard
                  icon={<UserMinusOutlined />}
                  value={stats.min || "—"}
                  label="Điểm thấp nhất"
                  iconClassName="bg-rose-50 text-rose-500"
                />
                <StatisticCard
                  icon={<CheckBadgeOutlined />}
                  value={`${stats.passRate}%`}
                  label="Tỷ lệ đạt"
                  iconClassName="bg-emerald-50 text-emerald-500"
                />
                <StatisticCard
                  icon={<UsersOutlined />}
                  value={`${summary.submittedCount}/${rows.length}`}
                  label="Hoàn thành bài"
                  iconClassName="bg-violet-50 text-violet-500"
                />
                <StatisticCard
                  icon={<ClipboardDocumentCheckOutlined />}
                  value={summary.needsRegradeCount}
                  label="Cần chấm lại"
                  sublabel={summary.needsRegradeCount ? "bài" : undefined}
                  iconClassName="bg-orange-50 text-orange-500"
                />
              </div>

              <div className={`${CARD} p-4`}>
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100">
                  <div className="flex gap-1 overflow-x-auto scrollbar-none">
                    {EXAM_TABS.map((item) => (
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
                  {tab === "results" && header?.status !== "closed" && (
                    <Button
                      outlined
                      icon={<PlusOutlined />}
                      onClick={() => setRegisterOpen(true)}
                      className="mb-2 shrink-0 whitespace-nowrap text-brand border-brand hover:bg-brand"
                    >
                      Đăng ký học viên
                    </Button>
                  )}
                </div>

                {tab === "results" && (
                  <StudentResultTable
                    rows={rows}
                    totalScore={totalScore}
                    isLoading={detailQuery.isLoading}
                    isError={detailQuery.isError}
                    onRetry={() => detailQuery.refetch()}
                    onGrade={setGradingRow}
                    onPublish={handlePublish}
                  />
                )}
                {tab === "analysis" && (
                  <ScoreCharts rows={rows} totalScore={totalScore} passRate={stats.passRate} />
                )}
                {(tab === "questions" || tab === "detail") && <ComingSoon />}
              </div>
            </div>
          )}
        </Spin>
      )}

      <GradeResultForm
        open={!!gradingRow}
        onClose={() => setGradingRow(null)}
        row={gradingRow}
        onGraded={() => detailQuery.refetch()}
      />

      <RegisterStudentsModal
        open={registerOpen}
        sessionId={sessionId}
        registeredStudentIds={registeredStudentIds}
        onClose={() => setRegisterOpen(false)}
        onRegistered={() => detailQuery.refetch()}
      />
    </div>
  );
};

const ExamSession = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <ExamSessionList />;
  return <ExamSessionDetail sessionId={Number(id)} />;
};

export default ExamSession;
