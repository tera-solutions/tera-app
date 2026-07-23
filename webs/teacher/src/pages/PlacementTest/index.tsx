import { useMemo, useState } from "react";
import {
  AcademicCapOutlined,
  Button,
  CheckBadgeOutlined,
  ClipboardDocumentListOutlined,
  notification,
  PlusOutlined,
  Select,
  UsersOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import DonutStatsCard from "_common/components/DonutStatsCard";
import StatisticCard from "_common/components/StatisticCard";
import StatusTabs from "_common/components/StatusTabs";
import TablePagination from "_common/components/TablePagination";
import useConfirm from "_common/hooks/useConfirm";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { PlacementTestService } from "@tera/modules/education";

import type { PlacementTestRow } from "./_interface";
import { PLACEMENT_TEST_TABS } from "./constants";
import {
  summarizePlacementTests,
  toPlacementTestDetail,
  toPlacementTestResults,
  toPlacementTests,
} from "./_utils";
import PlacementTestTable from "./components/PlacementTestTable";
import PlacementTestForm from "./components/PlacementTestForm";
import TestResultTable from "./components/TestResultTable";
import RecordResultForm from "./components/RecordResultForm";
import PlacementTestQuestionList from "./components/PlacementTestQuestionList";
import GeneratePlacementTestQuestionsModal from "./components/GeneratePlacementTestQuestionsModal";

const CEFR_COLORS: Record<string, string> = {
  "Pre-A1": "#94a3b8",
  A1: "#ef4444",
  A2: "#f59e0b",
  B1: "#0ea5e9",
  B2: "#10b981",
  C1: "#8b5cf6",
};

const PlacementTest = () => {
  const confirm = useConfirm();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PlacementTestRow | null>(null);
  const [resultFormOpen, setResultFormOpen] = useState(false);
  const [generateQuestionsOpen, setGenerateQuestionsOpen] = useState(false);

  const [filters, setFilters] = useUrlFilters(
    {
      tab: { type: "string", default: "tests" },
      resultTestId: { type: "number", default: undefined as number | undefined, param: "result_test_id" },
      questionsTestId: { type: "number", default: undefined as number | undefined, param: "questions_test_id" },
      page: { type: "number", default: 1 },
      per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );

  const listQuery = PlacementTestService.usePlacementTestList({
    params: { page: filters.page, per_page: filters.per_page, sort_by: "created_at", sort_dir: "desc" },
  });
  const items = useMemo(() => toPlacementTests(listQuery.data), [listQuery.data]);
  const overview = useMemo(() => summarizePlacementTests(items), [items]);
  const total = listQuery.data?.data?.pagination?.total ?? items.length;

  const resultTestId = filters.resultTestId ?? items[0]?.id;
  const resultTest = items.find((t) => t.id === resultTestId) ?? null;
  const resultsQuery = PlacementTestService.usePlacementTestResults(
    { id: resultTestId ?? "", params: { per_page: 100 } },
    { enabled: !!resultTestId },
  );
  const results = useMemo(() => toPlacementTestResults(resultsQuery.data), [resultsQuery.data]);

  const questionsTestId = filters.questionsTestId ?? items[0]?.id;
  const questionsTest = items.find((t) => t.id === questionsTestId) ?? null;
  const questionsDetailQuery = PlacementTestService.usePlacementTestDetail(
    { id: questionsTestId ?? "" },
    { enabled: !!questionsTestId },
  );
  const questionsDetail = useMemo(
    () => toPlacementTestDetail(questionsDetailQuery.data),
    [questionsDetailQuery.data],
  );

  const { mutate: publishTest } = PlacementTestService.usePlacementTestPublish();
  const { mutate: deleteTest } = PlacementTestService.usePlacementTestDelete();

  const handlePublish = (row: PlacementTestRow) =>
    publishTest(
      { id: row.id },
      {
        onSuccess: () => notification.success({ message: "Đã xuất bản bài kiểm tra" }),
        onError: (error: any) =>
          notification.error({ message: error?.data?.msg ?? "Không thể xuất bản bài kiểm tra" }),
      },
    );

  const handleDelete = (row: PlacementTestRow) => {
    confirm.warning({
      title: "Xóa bài kiểm tra",
      content: `Bạn có chắc muốn xóa "${row.title}"?`,
      onOk: () =>
        deleteTest(
          { id: row.id },
          {
            onSuccess: () => notification.success({ message: "Đã xóa bài kiểm tra" }),
            onError: (error: any) =>
              notification.error({ message: error?.data?.msg ?? "Không thể xóa bài kiểm tra" }),
          },
        ),
    });
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (row: PlacementTestRow) => {
    setEditing(row);
    setFormOpen(true);
  };

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Kiểm tra đầu vào</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Tạo đề kiểm tra, tổ chức kiểm tra và đánh giá năng lực đầu vào của học viên.
          </p>
        </div>
        <Button icon={<PlusOutlined />} onClick={openCreate} className="whitespace-nowrap bg-brand hover:bg-brand/80">
          Tạo bài kiểm tra mới
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatisticCard
          icon={<ClipboardDocumentListOutlined />}
          value={overview.totalTests}
          label="Bài kiểm tra"
          iconClassName="bg-sky-50 text-brand"
          loading={listQuery.isLoading}
        />
        <StatisticCard
          icon={<UsersOutlined />}
          value={overview.totalAttempts}
          label="Lượt kiểm tra"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={listQuery.isLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={`${overview.completionRate}%`}
          label="Tỷ lệ hoàn thành"
          iconClassName="bg-amber-50 text-amber-500"
          loading={listQuery.isLoading}
        />
        <StatisticCard
          icon={<AcademicCapOutlined />}
          value={overview.avgScore}
          label="Điểm trung bình"
          iconClassName="bg-violet-50 text-violet-500"
          loading={listQuery.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <Card>
          <StatusTabs
            className="mb-3"
            tabs={PLACEMENT_TEST_TABS}
            activeKey={filters.tab}
            onChange={(key) => setFilters({ tab: key })}
          />

          {filters.tab === "tests" && (
            <>
              <PlacementTestTable
                items={items}
                loading={listQuery.isLoading}
                isError={listQuery.isError}
                onRetry={() => listQuery.refetch()}
                onEdit={openEdit}
                onPublish={handlePublish}
                onDelete={handleDelete}
              />
              <TablePagination
                total={total}
                page={filters.page}
                perPage={filters.per_page}
                unit="bài kiểm tra"
                onChange={(page, per_page) => setFilters({ page, per_page })}
              />
            </>
          )}

          {filters.tab === "questions" && (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <Select
                  className="w-full sm:w-72"
                  value={questionsTestId}
                  onChange={(v: number) => setFilters({ questionsTestId: v })}
                  options={items.map((t) => ({ value: t.id, label: t.title }))}
                  placeholder="Chọn bài kiểm tra"
                />
                <Button
                  outlined
                  disabled={!questionsTest}
                  onClick={() => setGenerateQuestionsOpen(true)}
                  className="whitespace-nowrap text-brand border-brand hover:bg-brand"
                >
                  Thêm câu hỏi từ ngân hàng
                </Button>
              </div>
              <PlacementTestQuestionList
                questions={questionsDetail?.questions ?? []}
                loading={questionsDetailQuery.isLoading}
              />
            </>
          )}

          {filters.tab === "results" && (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <Select
                  className="w-full sm:w-72"
                  value={resultTestId}
                  onChange={(v: number) => setFilters({ resultTestId: v })}
                  options={items.map((t) => ({ value: t.id, label: t.title }))}
                  placeholder="Chọn bài kiểm tra"
                />
                <Button
                  outlined
                  disabled={!resultTest}
                  onClick={() => setResultFormOpen(true)}
                  className="whitespace-nowrap text-brand border-brand hover:bg-brand"
                >
                  Ghi nhận kết quả
                </Button>
              </div>
              <TestResultTable
                items={results}
                loading={resultsQuery.isLoading}
                isError={resultsQuery.isError}
                onRetry={() => resultsQuery.refetch()}
              />
            </>
          )}
        </Card>

        <div className="hidden xl:block">
          <DonutStatsCard
            title="Trình độ theo CEFR"
            centerValue={String(overview.totalAttempts)}
            centerCaption="Tổng lượt làm"
            loading={listQuery.isLoading}
            legend={Object.entries(overview.cefrDistribution).map(([level, value]) => ({
              key: level,
              label: level,
              color: CEFR_COLORS[level] ?? "#94a3b8",
              value,
            }))}
          />
        </div>
      </div>

      <PlacementTestForm open={formOpen} editing={editing} onClose={() => setFormOpen(false)} />
      <RecordResultForm open={resultFormOpen} test={resultTest} onClose={() => setResultFormOpen(false)} />
      <GeneratePlacementTestQuestionsModal
        open={generateQuestionsOpen}
        testId={questionsTestId ?? null}
        testTitle={questionsTest?.title}
        onClose={() => setGenerateQuestionsOpen(false)}
      />
    </div>
  );
};

export default PlacementTest;
