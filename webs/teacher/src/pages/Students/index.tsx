import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { Button, notification, PlusOutlined } from "tera-dls";

import Card from "_common/components/Card";
import DonutStatsCard from "_common/components/DonutStatsCard";
import QuotaMeter from "_common/components/QuotaMeter";
import { PATHS } from "_common/components/Layout/Menu/menus";
import SearchInput from "_common/components/SearchInput";
import SortControl from "_common/components/SortControl";
import StatusTabs from "_common/components/StatusTabs";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import useConfirm from "_common/hooks/useConfirm";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useMeta } from "_common/hooks/useMeta";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { StudentAPI } from "@tera/api";
import { ClassRoomService, EvaluationService, StudentService } from "@tera/modules/education";

import type { StudentListItem, StudentSortBy, StudentSortDir } from "./_interface";
import { SORT_OPTIONS, STUDENT_STATUS_META, STUDENT_SUMMARY_SEGMENTS } from "./constants";
import { enrichStudentRows, toStudentListResult, toStudentSummary } from "./_utils";
import StudentStats from "./components/StudentStats";
import StudentTable from "./components/StudentTable";
import StudentFormModal from "./components/StudentFormModal";
import StudentFilterSidebar, {
  type StudentFilterDraft,
} from "./components/StudentFilterSidebar";

const Students = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { getTabs, getItem } = useMeta();

  const [editingId, setEditingId] = useState<number | null>(null);
  const { mutate: deleteStudent } = StudentService.useStudentDelete();

  const handleEditStudent = (student: StudentListItem) => setEditingId(student.id);
  const handleDeleteStudent = (student: StudentListItem) =>
    confirm.warning({
      title: "Xóa học viên",
      content: `Xóa học viên "${student.name}"? Thao tác này không thể hoàn tác.`,
      onOk: () =>
        deleteStudent(
          { id: student.id },
          {
            onSuccess: () => notification.success({ message: "Đã xóa học viên" }),
            onError: (e: any) =>
              notification.error({ message: e?.data?.msg ?? "Không thể xóa học viên" }),
          },
        ),
    });

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
  }, { syncDefaultsOnMount: true });

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

  const rawData = useMemo(() => toStudentListResult(listQuery.data?.data), [listQuery.data]);

  // Student list/detail carries no class field for the teacher role, so it's
  // resolved by scanning the teacher's own classes' rosters — same fix as
  // Feedback/StudentDetail.
  const classesQuery = ClassRoomService.useClassRoomList({ params: { per_page: 50 } });
  const classes = useMemo(() => classesQuery.data?.data?.items ?? [], [classesQuery.data]);

  const rosterQueries = useQueries({
    queries: classes.map((c: any) => ({
      queryKey: ["students", "class-roster", c.id],
      queryFn: () => StudentAPI.getList({ params: { class_id: c.id, per_page: 100 } }),
      enabled: classes.length > 0,
    })),
  });
  const studentClassMap = useMemo(() => {
    const map = new Map<number, string>();
    classes.forEach((c: any, i: number) => {
      const items = (rosterQueries[i]?.data as any)?.data?.items ?? [];
      items.forEach((s: any) => {
        if (!map.has(s.id)) map.set(s.id, c.name);
      });
    });
    return map;
  }, [classes, rosterQueries]);

  // No dedicated avg-score field either — the latest `Evaluation` score per
  // student stands in, same as Feedback/Ranking.
  const evaluationsQuery = EvaluationService.useEvaluationList({
    params: { filters: { evaluation_type: "student" } },
  });
  const studentScoreMap = useMemo(() => {
    const map = new Map<number, { score: number; date: string }>();
    (evaluationsQuery.data?.data?.items ?? []).forEach((e: any) => {
      if (e.score == null || !e.target_id) return;
      const date = e.evaluated_at ?? e.created_at ?? "";
      const current = map.get(e.target_id);
      if (!current || date >= current.date) map.set(e.target_id, { score: Number(e.score), date });
    });
    return new Map(Array.from(map, ([id, v]) => [id, v.score]));
  }, [evaluationsQuery.data]);

  const data = useMemo(
    () => ({ ...rawData, items: enrichStudentRows(rawData.items, studentClassMap, studentScoreMap) }),
    [rawData, studentClassMap, studentScoreMap],
  );

  const summaryQuery = StudentService.useStudentSummary();
  const isSummaryLoading = summaryQuery.isLoading;
  const summary = useMemo(
    () => toStudentSummary(summaryQuery.data?.data, data.items),
    [summaryQuery.data, data.items],
  );

  const perPage = data.per_page || filters.per_page;

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) {
      setFilters({ per_page: nextSize, page: 1 });
    } else {
      setFilters({ page: nextPage });
    }
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      class_id: 0,
      level_id: 0,
      status: "",
      date_from: "",
      date_to: "",
      sort_by: "name",
      sort_dir: "asc",
      page: 1,
      per_page: DEFAULT_PAGE_SIZE,
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Học viên</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý thông tin học tập của học viên
          </p>
        </div>
        <div className="flex items-center gap-2">
          <QuotaMeter resource="students" used={summary.total} unit="học viên" />
          <Button
            outlined
            onClick={() => navigate(PATHS.transfer)}
            className="text-brand border-brand hover:bg-brand"
          >
            Chuyển lớp
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate(PATHS.enrollmentNew)}
            className="whitespace-nowrap bg-brand hover:bg-brand/80"
          >
            Ghi danh học viên
          </Button>
        </div>
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
            onView={(student) => navigate(`${PATHS.studentDetail}/${student.id}`)}
            onComment={(student) => navigate(`${PATHS.evaluation}?student_id=${student.id}`)}
            onMessage={() => navigate(PATHS.messages)}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
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

      <StudentFormModal
        open={editingId !== null}
        studentId={editingId}
        onClose={() => setEditingId(null)}
      />
    </div>
  );
};

export default Students;
