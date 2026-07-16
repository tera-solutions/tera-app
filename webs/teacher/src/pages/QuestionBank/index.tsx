import { useMemo, useState } from "react";
import {
  BookOpenOutlined,
  Button,
  CheckBadgeOutlined,
  notification,
  PlusOutlined,
  StarOutlined,
  UserOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import DonutStatsCard from "_common/components/DonutStatsCard";
import SearchInput from "_common/components/SearchInput";
import StatisticCard from "_common/components/StatisticCard";
import StatusTabs from "_common/components/StatusTabs";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import useConfirm from "_common/hooks/useConfirm";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { QuestionService } from "@tera/modules/education";
import { ProfileService } from "@tera/modules/system";

import type { QuestionRow, QuestionSortDir } from "./_interface";
import { QUESTION_DIFFICULTY_COLORS, QUESTION_DIFFICULTY_LABELS, QUESTION_TAB_OPTIONS } from "./constants";
import { summarizeQuestions, toQuestions } from "./_utils";
import QuestionTable from "./components/QuestionTable";
import QuestionBankFilterSidebar from "./components/QuestionBankFilterSidebar";
import QuestionFormModal from "./components/QuestionFormModal";

const SUMMARY_FETCH_SIZE = 100;

const QuestionBank = () => {
  const confirm = useConfirm();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<QuestionRow | null>(null);

  const [filters, setFilters] = useUrlFilters(
    {
      tab: { type: "string", default: "all" },
      search: { type: "string", default: "" },
      skill: { type: "string", default: "" },
      type: { type: "string", default: "" },
      difficulty: { type: "string", default: "" },
      sort_dir: { type: "string", default: "desc" as QuestionSortDir },
      page: { type: "number", default: 1 },
      per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );
  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  const profileQuery = ProfileService.useProfile();
  const currentUserId = profileQuery.data?.data?.id ?? null;

  const summaryQuery = QuestionService.useQuestionList({
    params: { page: 1, per_page: SUMMARY_FETCH_SIZE },
  });
  const summaryItems = useMemo(() => toQuestions(summaryQuery.data), [summaryQuery.data]);
  const summary = useMemo(
    () => summarizeQuestions(summaryItems, currentUserId),
    [summaryItems, currentUserId],
  );

  const listParams: Record<string, unknown> = {
    page: filters.page,
    per_page: filters.per_page,
    search: filters.search || undefined,
    skill: filters.skill || undefined,
    question_type: filters.type || undefined,
    difficulty: filters.difficulty || undefined,
    created_by: filters.tab === "mine" ? currentUserId : undefined,
    sort_by: "created_at",
    sort_dir: filters.sort_dir,
  };
  const listQuery = QuestionService.useQuestionList({ params: listParams });
  const { isLoading, isFetching, isError, refetch } = listQuery;
  const rawItems = useMemo(() => toQuestions(listQuery.data), [listQuery.data]);
  // `created_by` isn't a server-side filter (backend only supports
  // question_type/skill/difficulty/level_id/category_id/status) — apply the
  // "của tôi" tab client-side against the current page instead.
  const items = useMemo(
    () => (filters.tab === "mine" ? rawItems.filter((q) => q.createdBy === currentUserId) : rawItems),
    [rawItems, filters.tab, currentUserId],
  );
  const total = listQuery.data?.data?.pagination?.total ?? items.length;
  const perPage = listQuery.data?.data?.pagination?.per_page ?? filters.per_page;

  const { mutate: deleteQuestion } = QuestionService.useQuestionDelete();

  const handleDelete = (row: QuestionRow) => {
    confirm.warning({
      title: "Xóa câu hỏi",
      content: `Bạn có chắc muốn xóa câu hỏi "${row.code}"?`,
      onOk: () =>
        deleteQuestion(
          { id: row.id },
          {
            onSuccess: () => notification.success({ message: "Đã xóa câu hỏi" }),
            onError: (error: any) =>
              notification.error({
                message: error?.data?.msg ?? error?.message ?? "Không thể xóa câu hỏi",
              }),
          },
        ),
    });
  };

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) setFilters({ per_page: nextSize, page: 1 });
    else setFilters({ page: nextPage });
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (row: QuestionRow) => {
    setEditing(row);
    setFormOpen(true);
  };

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Ngân hàng câu hỏi</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Tạo, quản lý và sử dụng câu hỏi cho bài kiểm tra, bài tập và đánh giá.
          </p>
        </div>
        <Button icon={<PlusOutlined />} onClick={openCreate} className="whitespace-nowrap bg-brand hover:bg-brand/80">
          Thêm câu hỏi mới
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatisticCard
          icon={<BookOpenOutlined />}
          value={summary.total}
          label="Tổng số câu hỏi"
          iconClassName="bg-sky-50 text-brand"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<UserOutlined />}
          value={summary.mine}
          label="Câu hỏi của tôi"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={summary.byDifficulty.easy}
          label="Câu hỏi dễ"
          iconClassName="bg-amber-50 text-amber-500"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<StarOutlined />}
          value={summary.byDifficulty.hard}
          label="Câu hỏi khó"
          iconClassName="bg-violet-50 text-violet-500"
          loading={summaryQuery.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <Card>
          <StatusTabs
            className="mb-3"
            tabs={QUESTION_TAB_OPTIONS}
            activeKey={filters.tab}
            onChange={(key) => setFilters({ tab: key, page: 1 })}
          />

          <div className="mb-3">
            <SearchInput
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Tìm kiếm câu hỏi..."
            />
          </div>

          <QuestionTable
            items={items}
            loading={isLoading || isFetching}
            isError={isError}
            onRetry={() => refetch()}
            onView={openEdit}
            onEdit={openEdit}
            onDelete={handleDelete}
          />

          <TablePagination
            total={total}
            page={filters.page}
            perPage={perPage}
            unit="câu hỏi"
            onChange={handleChangePage}
          />
        </Card>

        <div className="hidden flex-col gap-4 xl:flex">
          <QuestionBankFilterSidebar
            draft={{ skill: filters.skill, type: filters.type, difficulty: filters.difficulty }}
            onChange={(patch) => setFilters({ ...patch, page: 1 })}
            onReset={() => setFilters({ skill: "", type: "", difficulty: "", page: 1 })}
          />

          <DonutStatsCard
            title="Phân bố theo độ khó"
            centerValue={String(summary.total)}
            centerCaption="Tổng câu hỏi"
            loading={summaryQuery.isLoading}
            legend={(Object.keys(QUESTION_DIFFICULTY_LABELS) as (keyof typeof QUESTION_DIFFICULTY_LABELS)[]).map(
              (key) => ({
                key,
                label: QUESTION_DIFFICULTY_LABELS[key],
                color: QUESTION_DIFFICULTY_COLORS[key],
                value: summary.byDifficulty[key],
              }),
            )}
          />
        </div>
      </div>

      <QuestionFormModal open={formOpen} editing={editing} onClose={() => setFormOpen(false)} />
    </div>
  );
};

export default QuestionBank;
