import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import moment from "moment";
import { Button, EyeOutlined, PencilSquareOutlined, Spin } from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import ErrorRetry from "_common/components/ErrorRetry";
import EmptyState from "_common/components/EmptyState";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { ExamService, ExamSessionService } from "@tera/modules/education";
import { ExamSessionAPI } from "@tera/api";

import { toExamBank, toExamSessionSummaries, toSiblingExams } from "./_utils";
import ExamCoverCard from "./components/ExamCoverCard";
import ExamStatGrid from "./components/ExamStatGrid";
import ScoreDistributionChart from "./components/ScoreDistributionChart";
import ExamTypeSidebar from "./components/ExamTypeSidebar";

import { scoreHistogram, scoreStats, toExamResultRows } from "../ExamSession/_utils";
import StudentResultTable from "../ExamSession/components/StudentResultTable";

const ExamDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const examId = id ? Number(id) : null;

  const examQuery = ExamService.useExamDetail({ id: examId ?? "" });
  const exam = useMemo(() => toExamBank(examQuery.data?.data), [examQuery.data]);
  const notFound = !examQuery.isLoading && (examQuery.isError || !exam?.id);

  const sessionsQuery = ExamSessionService.useExamSessionList(
    { params: { per_page: 50, filters: { exam_id: examId ?? undefined } } },
    { enabled: !!examId },
  );
  const sessions = sessionsQuery.data?.data?.items ?? [];

  // The exam bank has no aggregate stats of its own — fold in the detail of
  // every session that used it (usually a handful of sittings).
  const sessionDetailQueries = useQueries({
    queries: sessions.map((s: any) => ({
      queryKey: ["exam-session", "detail", s.id],
      queryFn: () => ExamSessionAPI.getDetail({ id: s.id }),
      enabled: sessions.length > 0,
    })),
  });
  const sessionDetailById = useMemo(() => {
    const map = new Map<number, any>();
    sessions.forEach((s: any, i: number) => {
      map.set(s.id, (sessionDetailQueries[i]?.data as any)?.data);
    });
    return map;
  }, [sessions, sessionDetailQueries]);
  const rows = useMemo(
    () => sessionDetailQueries.flatMap((q) => toExamResultRows((q.data as any)?.data)),
    [sessionDetailQueries],
  );
  const isAggregating = sessionDetailQueries.some((q) => q.isLoading);
  const sessionSummaries = useMemo(
    () => toExamSessionSummaries(sessions, sessionDetailById),
    [sessions, sessionDetailById],
  );

  const siblingQuery = ExamService.useExamList(
    {
      params: {
        per_page: 20,
        filters: {
          course_id: exam?.course_id ?? undefined,
          level_id: exam?.level_id ?? undefined,
        },
      },
    },
    { enabled: !!exam },
  );
  const siblingExams = useMemo(
    () => toSiblingExams(siblingQuery.data?.data?.items, exam?.id ?? 0),
    [siblingQuery.data, exam],
  );

  const stats = useMemo(() => scoreStats(rows), [rows]);
  const histogram = useMemo(
    () => scoreHistogram(rows, exam?.total_score || 100),
    [rows, exam],
  );
  const daysAgo = sessions.length
    ? Math.max(
        0,
        moment().diff(
          moment(sessions.reduce((min: any, s: any) => (s.exam_date < min ? s.exam_date : min), sessions[0].exam_date)),
          "days",
        ),
      )
    : 0;

  // Quick-access shortcut for the header action: jump to the most recently
  // scheduled sitting's results/grading page (the list below covers the rest).
  const latestSession = sessions.length
    ? sessions.reduce((latest: any, s: any) => (s.exam_date > latest.exam_date ? s : latest), sessions[0])
    : null;

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb
          items={[
            { label: "Bài kiểm tra", onClick: () => navigate(PATHS.exam) },
            { label: exam?.name || "Chi tiết bài kiểm tra" },
          ]}
        />
        {exam && (
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              outlined
              icon={<PencilSquareOutlined />}
              onClick={() => navigate(`${PATHS.exam}/${exam.id}/edit`)}
              className="text-brand border-brand hover:bg-brand"
            >
              Sửa
            </Button>
            <Button
              disabled={!latestSession}
              onClick={() => latestSession && navigate(`${PATHS.exam}/session/${latestSession.id}`)}
              className="whitespace-nowrap bg-brand hover:bg-brand/80"
            >
              Xem đợt thi gần nhất
            </Button>
          </div>
        )}
      </div>

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => examQuery.refetch()}
            message="Không tìm thấy bài kiểm tra hoặc bạn không có quyền truy cập"
            secondaryAction={{ label: "Về danh sách", onClick: () => navigate(PATHS.exam) }}
          />
        </div>
      ) : (
        <Spin spinning={examQuery.isLoading}>
          {exam && (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
              <div className="flex flex-col gap-4">
                <ExamCoverCard exam={exam} />

                <ExamStatGrid
                  totalStudents={stats.totalCount}
                  daysAgo={daysAgo}
                  avgScore={stats.avg}
                  maxScore={stats.max}
                  passRate={stats.passRate}
                  failRate={stats.totalCount ? 100 - stats.passRate : 0}
                  loading={sessionsQuery.isLoading || isAggregating}
                />

                <Card>
                  <p className="mb-3 text-sm font-semibold text-slate-700">Kết quả học viên</p>
                  <StudentResultTable
                    rows={rows}
                    totalScore={exam.total_score}
                    isLoading={sessionsQuery.isLoading || isAggregating}
                    showSkillColumns={false}
                  />
                </Card>

                <Card>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Các lần kiểm tra</p>
                  {sessionSummaries.length === 0 ? (
                    <EmptyState description="Bài kiểm tra chưa được lên lịch thi" className="py-6" />
                  ) : (
                    <div className="flex flex-col divide-y divide-slate-100">
                      {sessionSummaries.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => navigate(`${PATHS.exam}/session/${s.id}`)}
                          className="flex items-center justify-between gap-3 py-2.5 text-left text-sm hover:text-brand"
                        >
                          <span className="truncate">{s.class_name || "—"}</span>
                          <span className="flex shrink-0 items-center gap-3 text-slate-400">
                            <span title="Điểm TB">
                              {s.submitted > 0 ? `TB: ${s.avg_score}` : "Chưa chấm"}
                            </span>
                            <span>{s.exam_date ? moment(s.exam_date).format("DD/MM/YYYY") : "—"}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              <div className="flex flex-col gap-4">
                <ExamTypeSidebar exams={siblingExams} isLoading={siblingQuery.isLoading} />
                <ScoreDistributionChart
                  buckets={histogram as [number, number, number, number]}
                  totalScore={exam.total_score}
                  loading={sessionsQuery.isLoading || isAggregating}
                />
                <Card>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Hoạt động gần đây</p>
                  <EmptyState description="Chưa có hoạt động nào" className="py-6" />
                </Card>
              </div>
            </div>
          )}
        </Spin>
      )}
    </div>
  );
};

export default ExamDetail;
