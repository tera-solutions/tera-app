import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import moment from "moment";
import {
  ArchiveBoxOutlined,
  Button,
  CheckBadgeOutlined,
  ClockOutlined,
  DocumentTextOutlined,
  notification,
  PlusOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import SearchInput from "_common/components/SearchInput";
import SortControl from "_common/components/SortControl";
import StatusTabs from "_common/components/StatusTabs";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import useConfirm from "_common/hooks/useConfirm";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useMeta } from "_common/hooks/useMeta";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { PATHS } from "_common/components/Layout/Menu/menus";
import StatisticCard from "_common/components/StatisticCard";
import { LessonPlanService } from "@tera/modules/education";

import type { LessonPlan, LessonPlanSortBy, LessonPlanSortDir } from "./_interface";
import { LESSON_PLAN_STATUS_META, SORT_BY_OPTIONS } from "./constants";
import { summarizePlans, toLessonPlans } from "./_utils";
import LessonPlanTable from "./components/LessonPlanTable";
import LessonFilterCard from "./components/LessonFilterCard";
import PlanStatusSidebar from "./components/PlanStatusSidebar";

const LessonPlanPage = observer(() => {
  const navigate = useNavigate();
  const { getLabel, getTabs } = useMeta();

  const [filters, setFilters] = useUrlFilters({
    status: { type: "string", default: "all" },
    courseId: {
      type: "number",
      default: undefined as number | undefined,
      param: "course_id",
    },
    search: { type: "string", default: "" },
    page: { type: "number", default: 1 },
    pageSize: { type: "number", default: DEFAULT_PAGE_SIZE },
    dateFrom: { type: "string", default: "" },
    dateTo: { type: "string", default: "" },
    sortBy: { type: "string", default: "created_at" as LessonPlanSortBy },
    sortDir: { type: "string", default: "desc" as LessonPlanSortDir },
  }, { syncDefaultsOnMount: true });
  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  const confirm = useConfirm();
  const { mutate: archive } = LessonPlanService.useLessonPlanArchive();

  const handleTabChange = (key: string) => setFilters({ status: key, page: 1 });
  const handleCourseChange = (courseId: number | string | undefined) =>
    setFilters({ courseId: courseId as number | undefined, page: 1 });

  const dateRange: [moment.Moment, moment.Moment] | undefined =
    filters.dateFrom && filters.dateTo
      ? [moment(filters.dateFrom), moment(filters.dateTo)]
      : undefined;
  const handleRangeChange = (range: [moment.Moment, moment.Moment]) =>
    setFilters({
      dateFrom: range[0].format("YYYY-MM-DD"),
      dateTo: range[1].format("YYYY-MM-DD"),
      page: 1,
    });
  const handleRangeClear = () =>
    setFilters({ dateFrom: "", dateTo: "", page: 1 });
  const handleResetFilters = () =>
    setFilters({
      status: "all",
      courseId: undefined,
      search: "",
      dateFrom: "",
      dateTo: "",
      sortBy: "created_at",
      sortDir: "desc",
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });

  // Stats/sidebar reflect every plan for the course, independent of the active
  // status tab or the current page.
  const statsQuery = LessonPlanService.useLessonPlanList({
    params: { filters: { course_id: filters.courseId } },
  });
  const stats = useMemo(() => {
    const all = toLessonPlans(statsQuery.data?.data?.items);
    const total = statsQuery.data?.data?.pagination?.total ?? all.length;
    return summarizePlans(all, total);
  }, [statsQuery.data]);

  // The table is filtered (status + search) and paginated server-side.
  const plansQuery = LessonPlanService.useLessonPlanList({
    params: {
      page: filters.page,
      per_page: filters.pageSize,
      search: filters.search || undefined,
      filters: {
        status: filters.status === "all" ? undefined : filters.status,
        course_id: filters.courseId,
        from_date: filters.dateFrom || undefined,
        to_date: filters.dateTo || undefined,
      },
      sort_by: filters.sortBy,
      sort_dir: filters.sortDir,
    },
  });
  const { isLoading, isFetching, isError, refetch } = plansQuery;

  const plans = useMemo(
    () => toLessonPlans(plansQuery.data?.data?.items),
    [plansQuery.data],
  );
  const pagination = plansQuery.data?.data?.pagination;
  const total = pagination?.total ?? plans.length;
  // Server enforces its own min page size; the pager follows the response.
  const perPage = pagination?.per_page ?? filters.pageSize;

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) {
      setFilters({ pageSize: nextSize, page: 1 });
    } else {
      setFilters({ page: nextPage });
    }
  };

  const toggleSortDir = () =>
    setFilters({ sortDir: filters.sortDir === "asc" ? "desc" : "asc" });

  const handleCreate = () => navigate(`${PATHS.lessonPlans}/new`);

  const handleEdit = (plan: LessonPlan) =>
    navigate(`${PATHS.lessonPlans}/${plan.id}/edit`);

  const handleView = (plan: LessonPlan) =>
    navigate(`${PATHS.lessonPlans}/${plan.id}`);

  const handleArchive = (plan: LessonPlan) => {
    confirm.warning({
      title: "Ngừng sử dụng giáo án",
      content: (
        <p>
          Bạn có chắc muốn ngừng sử dụng giáo án <b>{plan.plan_name}</b>?
        </p>
      ),
      onOk: () =>
        archive(
          { id: plan.id },
          {
            onSuccess: (res: any) => {
              notification.success({
                message: res?.msg ?? "Ngừng sử dụng giáo án thành công",
              });
              refetch();
            },
            onError: (err: any) => {
              notification.error({
                message:
                  err?.msg ?? err?.message ?? "Ngừng sử dụng giáo án thất bại",
              });
            },
          },
        ),
    });
  };

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Giáo án</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý và theo dõi giáo án giảng dạy
          </p>
        </div>
        <Button
          icon={<PlusOutlined />}
          onClick={handleCreate}
          className="whitespace-nowrap bg-brand hover:bg-brand/80"
        >
          Soạn giáo án
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatisticCard
          icon={<DocumentTextOutlined />}
          value={stats.total}
          label="Tổng giáo án"
          sublabel="Tất cả giáo án"
          iconClassName="bg-sky-50 text-brand"
          loading={isLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={stats.published}
          label={getLabel(LESSON_PLAN_STATUS_META, "published")}
          sublabel="Đang áp dụng"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<ClockOutlined />}
          value={stats.in_review}
          label={`${getLabel(LESSON_PLAN_STATUS_META, "draft")} / ${getLabel(
            LESSON_PLAN_STATUS_META,
            "reviewing",
          )}`}
          sublabel="Chưa xuất bản"
          iconClassName="bg-amber-50 text-amber-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<ArchiveBoxOutlined />}
          value={stats.archived}
          label={getLabel(LESSON_PLAN_STATUS_META, "archived")}
          sublabel="Ngừng áp dụng"
          iconClassName="bg-slate-100 text-slate-500"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <Card>
          <StatusTabs
            className="mb-3"
            tabs={getTabs(LESSON_PLAN_STATUS_META)}
            activeKey={filters.status}
            onChange={handleTabChange}
          />

          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Tìm kiếm theo tên hoặc mã giáo án..."
              wrapperClassName="flex-1"
            />
            <SortControl
              sortBy={filters.sortBy}
              sortDir={filters.sortDir}
              options={SORT_BY_OPTIONS}
              onSortByChange={(value) =>
                setFilters({ sortBy: value as LessonPlanSortBy, page: 1 })
              }
              onToggleDir={toggleSortDir}
            />
          </div>

          <LessonPlanTable
            plans={plans}
            loading={isLoading}
            fetching={isFetching}
            isError={isError}
            onRetry={() => refetch()}
            onView={handleView}
            onEdit={handleEdit}
            onArchive={handleArchive}
          />

          <TablePagination
            total={total}
            page={filters.page}
            perPage={perPage}
            unit="giáo án"
            onChange={handleChangePage}
          />
        </Card>

        <div className="hidden flex-col gap-4 xl:flex">
          <LessonFilterCard
            courseId={filters.courseId}
            onCourseChange={handleCourseChange}
            range={dateRange}
            onRangeChange={handleRangeChange}
            onRangeClear={handleRangeClear}
            onReset={handleResetFilters}
          />
          <PlanStatusSidebar stats={stats} />
        </div>
      </div>
    </div>
  );
});

export default LessonPlanPage;
