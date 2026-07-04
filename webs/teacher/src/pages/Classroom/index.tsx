import { useMemo } from "react";
import classNames from "classnames";
import {
  AcademicCapOutlined,
  Button,
  CheckBadgeOutlined,
  ClipboardDocumentCheckOutlined,
  ListBulletOutlined,
  notification,
  PlusOutlined,
  Spin,
  TableCellsOutlined,
  UsersOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import ErrorRetry from "_common/components/ErrorRetry";
import SearchInput from "_common/components/SearchInput";
import SortControl from "_common/components/SortControl";
import StatisticCard from "_common/components/StatisticCard";
import StatusTabs from "_common/components/StatusTabs";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useMeta } from "_common/hooks/useMeta";
import { useUrlFilters } from "_common/hooks/useUrlFilters";

import type {
  ClassroomSortBy,
  ClassroomSortDir,
  ClassroomStatus,
  ClassroomSummary,
  ClassroomView,
} from "./_interface";
import { SORT_BY_OPTIONS } from "./constants";
import { toClassrooms, toClassroomSummary, summarize } from "./_utils";
import ClassroomFilterSidebar, {
  type ClassroomFilterDraft,
} from "./components/ClassroomFilterSidebar";
import ClassroomCard from "./components/ClassroomCard";
import ClassroomGridCard from "./components/ClassroomGridCard";
import { ClassRoomService } from "@tera/modules/education";

/** Kept in sync with the `class_status` metadata list (see ClassStatus enum). */
const CLASS_STATUS_META = "class_status";

const Classroom = () => {
  const { getTabs } = useMeta();

  const [filters, setFilters] = useUrlFilters({
    view: { type: "string", default: "list" as ClassroomView },
    search: { type: "string", default: "" },
    status: { type: "string", default: "" as ClassroomStatus | "" },
    courseId: {
      type: "number",
      default: undefined as number | undefined,
      param: "course_id",
    },
    shift: { type: "string", default: "" },
    startFrom: { type: "string", default: "", param: "start_from" },
    startTo: { type: "string", default: "", param: "start_to" },
    sort_by: { type: "string", default: "created_at" as ClassroomSortBy },
    sort_dir: { type: "string", default: "desc" as ClassroomSortDir },
    page: { type: "number", default: 1 },
    pageSize: { type: "number", default: DEFAULT_PAGE_SIZE },
  });
  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  const listQuery = ClassRoomService.useClassRoomList({
    params: {
      page: filters.page,
      per_page: filters.pageSize,
      search: filters.search || undefined,
      filters: {
        status: filters.status || undefined,
        course_id: filters.courseId,
        shift: filters.shift || undefined,
        start_from: filters.startFrom || undefined,
        start_to: filters.startTo || undefined,
      },
      sort_by: filters.sort_by,
      sort_dir: filters.sort_dir,
    },
  });
  const { isLoading, isFetching, isError, refetch } = listQuery;
  const pagination = listQuery.data?.data?.pagination;
  const data = useMemo(
    () => ({
      items: toClassrooms(listQuery.data?.data?.items),
      total: pagination?.total ?? listQuery.data?.data?.items?.length ?? 0,
    }),
    [listQuery.data],
  );
  const perPage = pagination?.per_page ?? filters.pageSize;

  const summaryQuery = ClassRoomService.useClassRoomSummary();
  const isSummaryLoading = summaryQuery.isLoading;
  const summaryData = useMemo(
    () => toClassroomSummary(summaryQuery.data?.data),
    [summaryQuery.data],
  );

  const classrooms = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? classrooms.length;

  // Totals come from `/class-room/summary` (server-wide); completion rate has no
  // summary field, so it falls back to the loaded list.
  const summary = useMemo<ClassroomSummary>(() => {
    const list = summarize(classrooms);
    return {
      total_classes_managed:
        summaryData?.total_classes_managed ?? list.total_classes_managed,
      total_students: summaryData?.total_students ?? list.total_students,
      active_classes: summaryData?.active_classes ?? list.active_classes,
      avg_completion_rate:
        summaryData?.avg_completion_rate ?? list.avg_completion_rate,
    };
  }, [summaryData, classrooms]);

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) {
      setFilters({ pageSize: nextSize, page: 1 });
    } else {
      setFilters({ page: nextPage });
    }
  };

  const handleCreate = () =>
    notification.open({ message: "Tính năng đang được phát triển" });

  const handleTabChange = (key: string) =>
    setFilters({ status: (key === "all" ? "" : key) as ClassroomStatus | "", page: 1 });

  const toggleSortDir = () =>
    setFilters({ sort_dir: filters.sort_dir === "asc" ? "desc" : "asc" });

  const handleFilterChange = (patch: Partial<ClassroomFilterDraft>) =>
    setFilters({
      // Check key presence, not `!== undefined` — clearing a field (e.g. the
      // course select) sends `{ course_id: undefined }`, which is otherwise
      // indistinguishable from the key being absent/untouched.
      ...("course_id" in patch && { courseId: patch.course_id }),
      ...("shift" in patch && { shift: patch.shift }),
      ...("start_from" in patch && { startFrom: patch.start_from }),
      ...("start_to" in patch && { startTo: patch.start_to }),
      page: 1,
    });

  const handleResetFilters = () =>
    setFilters({
      courseId: undefined,
      shift: "",
      startFrom: "",
      startTo: "",
      page: 1,
    });

  const renderList = () => {
    if (isError)
      return (
        <div className="flex h-[40vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => refetch()}
            message="Không tải được danh sách lớp học"
            iconClassName="h-7 w-7"
          />
        </div>
      );

    if (!isLoading && classrooms.length === 0)
      return (
        <EmptyState
          classNameImage="w-32 mx-auto"
          description="Không tìm thấy lớp học phù hợp"
        />
      );

    return (
      <div className="w-full min-h-25 flex items-center">
        <Spin spinning={isLoading || isFetching}>
          {filters.view === "list" ? (
            <div className="w-full flex flex-col gap-3">
              {classrooms.map((classroom) => (
                <ClassroomCard key={classroom.id} classroom={classroom} />
              ))}
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {classrooms.map((classroom) => (
                <ClassroomGridCard key={classroom.id} classroom={classroom} />
              ))}
            </div>
          )}
        </Spin>
      </div>
    );
  };

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Lớp học</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý và theo dõi các lớp bạn chủ nhiệm
          </p>
        </div>
        <Button
          icon={<PlusOutlined />}
          onClick={handleCreate}
          className="whitespace-nowrap bg-brand hover:bg-brand/80"
        >
          Tạo lớp học
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatisticCard
          icon={<UsersOutlined />}
          value={summary.total_classes_managed}
          label="Lớp chủ nhiệm"
          sublabel="Tổng số lớp"
          iconClassName="bg-sky-50 text-brand"
          loading={isSummaryLoading}
        />
        <StatisticCard
          icon={<AcademicCapOutlined />}
          value={summary.total_students}
          label="Học viên"
          sublabel="Tổng số học viên"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={isSummaryLoading}
        />
        <StatisticCard
          icon={<ClipboardDocumentCheckOutlined />}
          value={summary.active_classes}
          label="Lớp đang hoạt động"
          sublabel="Đang diễn ra"
          iconClassName="bg-amber-50 text-amber-500"
          loading={isSummaryLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={`${summary.avg_completion_rate}%`}
          label="Tỷ lệ hoàn thành"
          sublabel="Trung bình các lớp"
          iconClassName="bg-violet-50 text-violet-500"
          loading={isSummaryLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <Card>
          <StatusTabs
            className="mb-3"
            tabs={getTabs(CLASS_STATUS_META)}
            activeKey={filters.status || "all"}
            onChange={handleTabChange}
          />

          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Tìm kiếm lớp học, học viên..."
              wrapperClassName="flex-1"
            />
            <div className="flex items-center gap-2">
              <SortControl
                sortBy={filters.sort_by}
                sortDir={filters.sort_dir}
                options={SORT_BY_OPTIONS}
                onSortByChange={(value) =>
                  setFilters({ sort_by: value as ClassroomSortBy, page: 1 })
                }
                onToggleDir={toggleSortDir}
              />

              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
                {(
                  [
                    { key: "list", icon: <ListBulletOutlined /> },
                    { key: "grid", icon: <TableCellsOutlined /> },
                  ] as const
                ).map(({ key, icon }) => (
                  <button
                    key={key}
                    type="button"
                    title={key === "list" ? "Dạng danh sách" : "Dạng lưới"}
                    onClick={() => setFilters({ view: key })}
                    className={classNames(
                      "flex h-8 w-8 items-center justify-center rounded-md transition-colors [&_svg]:h-4 [&_svg]:w-4",
                      filters.view === key
                        ? "bg-white text-brand shadow-sm"
                        : "text-slate-500 hover:text-slate-700",
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {renderList()}

          <TablePagination
            total={total}
            page={filters.page}
            perPage={perPage}
            unit="lớp học"
            onChange={handleChangePage}
          />
        </Card>

        <div className="hidden xl:block">
          <ClassroomFilterSidebar
            draft={{
              course_id: filters.courseId,
              shift: filters.shift,
              start_from: filters.startFrom,
              start_to: filters.startTo,
            }}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default Classroom;
