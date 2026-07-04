import { useMemo, useState } from "react";
import { Button, PlusOutlined } from "tera-dls";

import Card from "_common/components/Card";
import DonutStatsCard from "_common/components/DonutStatsCard";
import SearchInput from "_common/components/SearchInput";
import SortControl from "_common/components/SortControl";
import StatusTabs from "_common/components/StatusTabs";
import StudentDetailModal from "_common/components/StudentDetailModal";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useMeta } from "_common/hooks/useMeta";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { todo } from "_common/utils/todo";
import { StudentService } from "@tera/modules/education";

import type { StudentSortBy, StudentSortDir } from "./_interface";
import { SORT_OPTIONS, STUDENT_STATUS_META, STUDENT_SUMMARY_SEGMENTS } from "./constants";
import { toStudentListResult, toStudentSummary } from "./_utils";
import StudentStats from "./components/StudentStats";
import StudentTable from "./components/StudentTable";
import StudentFilterSidebar, {
  type StudentFilterDraft,
} from "./components/StudentFilterSidebar";

const Students = () => {
  const { getTabs, getItem } = useMeta();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  const [filters, setFilters] = useUrlFilters({
    search: { type: "string", default: "" },
    class_id: { type: "number", default: 0 },
    level_id: { type: "number", default: 0 },
    status: { type: "string", default: "" },
    date_from: { type: "string", default: "" },
    date_to: { type: "string", default: "" },
    sort_by: { type: "string", default: "name" as StudentSortBy },
    sort_dir: { type: "string", default: "asc" as StudentSortDir },
    page: { type: "number", default: 1 },
    per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
  });

  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );
  const filterValues: StudentFilterDraft = {
    class_id: filters.class_id,
    level_id: filters.level_id,
    date_from: filters.date_from,
    date_to: filters.date_to,
  };

  const listParams = {
    search: filters.search || undefined,
    class_id: filters.class_id || undefined,
    level_id: filters.level_id || undefined,
    status: filters.status || undefined,
    date_from: filters.date_from || undefined,
    date_to: filters.date_to || undefined,
    sort_by: filters.sort_by,
    sort_dir: filters.sort_dir,
    page: filters.page,
    per_page: filters.per_page,
  };
  const listQuery = StudentService.useStudentList({ params: listParams });
  const { isLoading, isFetching, isError, refetch } = listQuery;

  const data = useMemo(() => toStudentListResult(listQuery.data?.data), [listQuery.data]);

  // Totals come from `/edu/student/summary` (server-wide, ignores pagination);
  // fall back to counting the loaded page if that endpoint has no value yet.
  const summaryQuery = StudentService.useStudentSummary();
  const isSummaryLoading = summaryQuery.isLoading;
  const summary = useMemo(
    () => toStudentSummary(summaryQuery.data?.data, data.items),
    [summaryQuery.data, data.items],
  );

  const perPage = data.per_page || filters.per_page;
  const from = data.total === 0 ? 0 : (filters.page - 1) * perPage + 1;

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) {
      setFilters({ per_page: nextSize, page: 1 });
    } else {
      setFilters({ page: nextPage });
    }
  };

  const resetFilters = () => {
    setFilters({
      class_id: 0,
      level_id: 0,
      date_from: "",
      date_to: "",
      page: 1,
    });
  };

  const handleTabChange = (key: string) =>
    setFilters({ status: key === "all" ? "" : key, page: 1 });

  const handleSort = (sortBy: StudentSortBy) => {
    if (filters.sort_by === sortBy) {
      setFilters({ sort_dir: filters.sort_dir === "asc" ? "desc" : "asc" });
    } else {
      setFilters({ sort_by: sortBy, sort_dir: "asc" });
    }
  };

  const toggleSortDir = () =>
    setFilters({ sort_dir: filters.sort_dir === "asc" ? "desc" : "asc" });

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Học viên</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý thông tin học tập của học viên
          </p>
        </div>
        <Button
          icon={<PlusOutlined />}
          onClick={todo}
          className="whitespace-nowrap bg-brand hover:bg-brand/80"
        >
          Thêm học viên
        </Button>
      </div>

      <div className="mb-4">
        <StudentStats summary={summary} loading={isSummaryLoading} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <Card>
          <StatusTabs
            className="mb-3"
            tabs={getTabs(STUDENT_STATUS_META)}
            activeKey={filters.status || "all"}
            onChange={handleTabChange}
          />

          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Tìm kiếm học viên..."
              wrapperClassName="flex-1"
            />
            <SortControl
              sortBy={filters.sort_by}
              sortDir={filters.sort_dir}
              options={SORT_OPTIONS}
              onSortByChange={(value) => handleSort(value as StudentSortBy)}
              onToggleDir={toggleSortDir}
            />
          </div>
          <StudentTable
            items={data.items}
            loading={isLoading || isFetching}
            isError={isError}
            onRetry={() => refetch()}
            sortBy={filters.sort_by}
            sortDir={filters.sort_dir}
            onSortChange={handleSort}
            onView={(student) => setSelectedStudentId(student.id)}
            onComment={todo}
            onMessage={todo}
            from={from}
          />

          <TablePagination
            total={data.total}
            page={filters.page}
            perPage={perPage}
            unit="học viên"
            onChange={handleChangePage}
          />
        </Card>

        <div className="hidden flex-col gap-4 xl:flex">
          <StudentFilterSidebar
            draft={filterValues}
            onChange={(patch) => setFilters({ ...patch, page: 1 })}
            onReset={resetFilters}
          />

          <DonutStatsCard
            title="Thống kê"
            centerValue={String(summary.total)}
            centerCaption="Tổng học viên"
            loading={isSummaryLoading}
            legend={STUDENT_SUMMARY_SEGMENTS.map(({ key, metaValue, fallbackLabel, fallbackColor, value }) => {
              const meta = getItem(STUDENT_STATUS_META, metaValue);
              return {
                key,
                label: meta?.label ?? fallbackLabel,
                color: meta?.color ?? fallbackColor,
                value: value(summary),
              };
            })}
          />
        </div>
      </div>

      <StudentDetailModal
        studentId={selectedStudentId}
        open={selectedStudentId != null}
        onClose={() => setSelectedStudentId(null)}
      />
    </div>
  );
};

export default Students;
