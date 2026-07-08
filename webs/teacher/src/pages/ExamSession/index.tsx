import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";
import { CheckBadgeOutlined, ChartBarOutlined, StarOutlined, Spin, UsersOutlined } from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import ErrorRetry from "_common/components/ErrorRetry";
import StatisticCard from "_common/components/StatisticCard";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import { CARD } from "_common/constants/dashboard";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { ExamService, ExamSessionService } from "@tera/modules/education";

import type { ExamResultRow } from "./_interface";
import { EXAM_SESSION_STATUS_META, EXAM_TABS, ExamTabKey } from "./constants";
import { scoreStats, toExamResultRows, toExamSessionHeader } from "./_utils";
import StudentResultTable from "./components/StudentResultTable";
import GradeResultForm from "./components/GradeResultForm";
import ScoreCharts from "./components/ScoreCharts";

const ExamSessionList = () => {
  const navigate = useNavigate();
  const listQuery = ExamSessionService.useExamSessionList({ params: { per_page: 50 } });
  const items = listQuery.data?.data?.items ?? [];

  const columns: TableColumn<any>[] = [
    { key: "exam", title: "Bài kiểm tra", render: (row) => row.exam?.exam_name ?? "—" },
    { key: "class", title: "Lớp", render: (row) => row.class?.name ?? "—" },
    {
      key: "date",
      title: "Ngày thi",
      render: (row) => (row.exam_date ? moment(row.exam_date).format("DD/MM/YYYY") : "—"),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => <StatusBadge name={EXAM_SESSION_STATUS_META} value={row.status} />,
    },
  ];

  return (
    <div className="p-4 xmd:p-6">
      <h1 className="mb-4 text-xl font-bold text-slate-800">Bài kiểm tra</h1>
      <Card>
        <Table
          columns={columns}
          data={items}
          rowKey={(row) => row.id}
          isLoading={listQuery.isLoading}
          isError={listQuery.isError}
          onRetry={() => listQuery.refetch()}
          emptyText="Chưa có lịch kiểm tra nào"
          onRowClick={(row) => navigate(`${PATHS.exam}/session/${row.id}`)}
        />
      </Card>
    </div>
  );
};

const ExamSessionDetail = ({ sessionId }: { sessionId: number }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<ExamTabKey>("results");
  const [gradingRow, setGradingRow] = useState<ExamResultRow | null>(null);

  const detailQuery = ExamSessionService.useExamSessionDetail({ id: sessionId });
  const header = useMemo(() => toExamSessionHeader(detailQuery.data?.data), [detailQuery.data]);
  const rows = useMemo(() => toExamResultRows(detailQuery.data?.data), [detailQuery.data]);
  const stats = useMemo(() => scoreStats(rows), [rows]);

  const examQuery = ExamService.useExamDetail({ id: header?.exam_id ?? "" });
  const totalScore = examQuery.data?.data?.total_score ?? 100;

  const notFound = !detailQuery.isLoading && (detailQuery.isError || !header?.id);

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Bài kiểm tra", onClick: () => navigate(PATHS.exam) },
          { label: header?.exam_name || "Kết quả bài kiểm tra" },
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h1 className="text-xl font-bold text-slate-800">{header.exam_name}</h1>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {header.class_name}
                    {header.exam_date ? ` · ${moment(header.exam_date).format("DD/MM/YYYY")}` : ""}
                  </p>
                </div>
                <StatusBadge name={EXAM_SESSION_STATUS_META} value={header.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatisticCard icon={<ChartBarOutlined />} value={stats.avg || "—"} label="Điểm TB" iconClassName="bg-sky-50 text-brand" />
                <StatisticCard icon={<StarOutlined />} value={stats.max || "—"} label="Điểm cao nhất" iconClassName="bg-amber-50 text-amber-500" />
                <StatisticCard icon={<CheckBadgeOutlined />} value={`${stats.passRate}%`} label="Tỷ lệ đạt" iconClassName="bg-emerald-50 text-emerald-500" />
                <StatisticCard icon={<UsersOutlined />} value={stats.totalCount} label="Tổng HV" sublabel={stats.pendingCount ? `${stats.pendingCount} chưa nhập điểm` : undefined} iconClassName="bg-violet-50 text-violet-500" />
              </div>

              <div className={`${CARD} p-4`}>
                <div className="mb-4 flex gap-1 overflow-x-auto border-b border-slate-100 scrollbar-none">
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

                {tab === "results" ? (
                  <StudentResultTable
                    rows={rows}
                    isLoading={detailQuery.isLoading}
                    isError={detailQuery.isError}
                    onRetry={() => detailQuery.refetch()}
                    onGrade={setGradingRow}
                  />
                ) : (
                  <ScoreCharts rows={rows} totalScore={totalScore} passRate={stats.passRate} />
                )}
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
    </div>
  );
};

const ExamSession = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <ExamSessionList />;
  return <ExamSessionDetail sessionId={Number(id)} />;
};

export default ExamSession;
