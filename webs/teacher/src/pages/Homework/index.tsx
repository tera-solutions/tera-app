import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  CheckBadgeOutlined,
  ClipboardDocumentListOutlined,
  DocumentTextOutlined,
  PlusOutlined,
  Button,
  notification,
} from "tera-dls";

import Card from "_common/components/Card";
import SearchInput from "_common/components/SearchInput";
import StatisticCard from "_common/components/StatisticCard";
import StatusTabs from "_common/components/StatusTabs";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import useConfirm from "_common/hooks/useConfirm";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useMeta } from "_common/hooks/useMeta";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { AssignmentService } from "@tera/modules/education";
import { SubmissionAPI } from "@tera/api";

import type { Homework, AssignmentStatus } from "./_interface";
import { ASSIGNMENT_STATUS_META } from "./constants";
import { toHomeworks, toHomeworkSummary } from "./_utils";
import HomeworkTable from "./components/HomeworkTable";
import HomeworkFilterSidebar, { HomeworkFilterDraft } from "./components/HomeworkFilterSidebar";
import HomeworkForm from "./components/HomeworkForm";

const Homework = () => {
  const { getTabs } = useMeta();
  const confirm = useConfirm();
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Homework | null>(null);

  const [filters, setFilters] = useUrlFilters(
    {
      search: { type: "string", default: "" },
      status: { type: "string", default: "" as AssignmentStatus | "" },
      classId: { type: "number", default: undefined as number | undefined, param: "class_id" },
      levelId: { type: "number", default: undefined as number | undefined, param: "level_id" },
      page: { type: "number", default: 1 },
      pageSize: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );
  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  const listQuery = AssignmentService.useAssignmentList({
    params: {
      page: filters.page,
      per_page: filters.pageSize,
      search: filters.search || undefined,
      filters: {
        status: filters.status || undefined,
        class_room_id: filters.classId,
        level_id: filters.levelId,
      },
    },
  });
  const { isLoading, isFetching, isError, refetch } = listQuery;
  const pagination = listQuery.data?.data?.pagination;
  const homeworks = useMemo(() => toHomeworks(listQuery.data?.data?.items), [listQuery.data]);
  const total = pagination?.total ?? homeworks.length;
  const perPage = pagination?.per_page ?? filters.pageSize;

  const summaryQuery = AssignmentService.useAssignmentSummary({
    params: {
      filters: {
        class_room_id: filters.classId,
        level_id: filters.levelId,
      },
    },
  });
  const summary = useMemo(() => toHomeworkSummary(summaryQuery.data?.data), [summaryQuery.data]);

  // The list endpoint only counts total assigned students per row
  // (`submissions_count`), not how many actually submitted — that requires a
  // per-assignment query. Bounded to the current page, same workaround used
  // by the Feedback page's class-roster scan.
  const submittedQueries = useQueries({
    queries: homeworks.map((hw) => ({
      queryKey: ["homework", "submitted-count", hw.id],
      queryFn: () => SubmissionAPI.getSubmitted({ assignmentId: hw.id, params: { per_page: 1 } }),
      enabled: homeworks.length > 0,
    })),
  });
  const submittedCounts = useMemo(() => {
    const map: Record<number, number> = {};
    homeworks.forEach((hw, i) => {
      map[hw.id] = (submittedQueries[i]?.data as any)?.data?.pagination?.total ?? 0;
    });
    return map;
  }, [homeworks, submittedQueries]);
  const totalSubmitted = Object.values(submittedCounts).reduce((sum, n) => sum + n, 0);
  const totalExpected = homeworks.reduce((sum, hw) => sum + hw.student_count, 0);
  const submittedRate = totalExpected ? Math.round((totalSubmitted / totalExpected) * 100) : 0;

  const { mutate: deleteAssignment } = AssignmentService.useAssignmentDelete();

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) setFilters({ pageSize: nextSize, page: 1 });
    else setFilters({ page: nextPage });
  };

  const handleTabChange = (key: string) =>
    setFilters({ status: (key === "all" ? "" : key) as AssignmentStatus | "", page: 1 });

  const handleFilterChange = (patch: Partial<HomeworkFilterDraft>) =>
    setFilters({
      ...("class_id" in patch && { classId: patch.class_id }),
      ...("level_id" in patch && { levelId: patch.level_id }),
      page: 1,
    });

  const handleResetFilters = () =>
    setFilters({
      search: "",
      status: "",
      classId: undefined,
      levelId: undefined,
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });

  const openCreateForm = () => {
    setEditingItem(null);
    setFormOpen(true);
  };
  const openEditForm = (item: Homework) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: Homework) => {
    confirm.warning({
      title: "Xóa bài tập",
      content: (
        <p>
          Bạn có chắc muốn xóa bài tập <b>{item.name}</b>?
        </p>
      ),
      onOk: () =>
        deleteAssignment(
          { id: item.id },
          {
            onSuccess: () => notification.success({ message: "Xóa bài tập thành công" }),
            onError: (error: any) =>
              notification.error({
                message: error?.data?.msg ?? error?.message ?? "Không thể xóa bài tập",
              }),
          },
        ),
    });
  };

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Bài tập</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý và theo dõi bài tập của các lớp bạn phụ trách
          </p>
        </div>
        <Button icon={<PlusOutlined />} onClick={openCreateForm} className="whitespace-nowrap">
          Tạo bài tập
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatisticCard
          icon={<DocumentTextOutlined />}
          value={summary.total}
          label="Tổng bài tập"
          iconClassName="bg-sky-50 text-brand"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={summary.assigned}
          label="Đã giao"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<ClipboardDocumentListOutlined />}
          value={summary.draft}
          label="Chưa giao"
          iconClassName="bg-amber-50 text-amber-500"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={`${totalSubmitted}/${totalExpected}`}
          label="Nộp bài"
          sublabel="Trong trang hiện tại"
          iconClassName="bg-violet-50 text-violet-500"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <Card>
          <StatusTabs
            className="mb-3"
            tabs={getTabs(ASSIGNMENT_STATUS_META)}
            activeKey={filters.status || "all"}
            onChange={handleTabChange}
          />

          <SearchInput
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Tìm kiếm bài tập theo tên..."
            wrapperClassName="mb-3"
          />

          <HomeworkTable
            data={homeworks}
            submittedCounts={submittedCounts}
            isLoading={isLoading || isFetching}
            isError={isError}
            onRetry={() => refetch()}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />

          <TablePagination
            total={total}
            page={filters.page}
            perPage={perPage}
            unit="bài tập"
            onChange={handleChangePage}
          />
        </Card>

        <div className="hidden xl:block">
          <HomeworkFilterSidebar
            draft={{ class_id: filters.classId, level_id: filters.levelId }}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            submittedRate={submittedRate}
            totalSubmitted={totalSubmitted}
            totalExpected={totalExpected}
            loading={isLoading}
          />
        </div>
      </div>

      <HomeworkForm open={formOpen} onClose={() => setFormOpen(false)} editingItem={editingItem} />
    </div>
  );
};

export default Homework;
