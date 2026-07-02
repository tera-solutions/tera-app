import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import moment from "moment";
import {
  ArchiveBoxOutlined,
  Button,
  CheckBadgeOutlined,
  ClockOutlined,
  DocumentTextOutlined,
  notification,
  Pagination,
  PlusOutlined,
} from "tera-dls";

import AnimatedHeight from "_common/components/AnimatedHeight";
import Card from "_common/components/Card";
import CourseSelect from "_common/components/CourseSelect";
import SearchInput from "_common/components/SearchInput";
import useConfirm from "_common/hooks/useConfirm";
import { useMeta } from "_common/hooks/useMeta";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { LessonPlanService } from "@tera/modules/education";

import StatisticCard from "pages/Classroom/components/StatisticCard";

import type { LessonPlan } from "./_interface";
import { LESSON_PLAN_STATUS_META, PER_PAGE } from "./constants";
import { summarizePlans, toLessonPlans } from "./_utils";
import LessonPlanTable from "./components/LessonPlanTable";
import LessonPlanFormModal from "./components/LessonPlanFormModal";
import LessonFilterCard from "./components/LessonFilterCard";
import PlanStatusSidebar from "./components/PlanStatusSidebar";

const LessonPlanPage = observer(() => {
  const navigate = useNavigate();
  const { getLabel, getTabs } = useMeta();

  const [filters, setFilters] = useUrlFilters({
    tab: { type: "string", default: "all" },
    courseId: {
      type: "number",
      default: undefined as number | undefined,
      param: "course_id",
    },
    search: { type: "string", default: "" },
    page: { type: "number", default: 1 },
    pageSize: { type: "number", default: PER_PAGE },
    dateFrom: { type: "string", default: "" },
    dateTo: { type: "string", default: "" },
  });
  const [searchDraft, setSearchDraft] = useState(filters.search);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LessonPlan | null>(null);

  const confirm = useConfirm();
  const { mutate: archive } = LessonPlanService.useLessonPlanArchive();

  // Debounce typed text before it lands in the URL/query.
  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = searchDraft.trim();
      if (trimmed !== filters.search) setFilters({ search: trimmed, page: 1 });
    }, 400);
    return () => clearTimeout(t);
  }, [searchDraft]);

  const handleTabChange = (key: string) => setFilters({ tab: key, page: 1 });
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
        status: filters.tab === "all" ? undefined : filters.tab,
        course_id: filters.courseId,
        from_date: filters.dateFrom || undefined,
        to_date: filters.dateTo || undefined,
      },
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

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (plan: LessonPlan) => {
    setEditing(plan);
    setFormOpen(true);
  };

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
          Thêm giáo án
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
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-1 gap-1 overflow-x-auto border-b border-slate-100 scrollbar-none">
              {getTabs(LESSON_PLAN_STATUS_META).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleTabChange(item.key)}
                  className={classNames(
                    "whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                    filters.tab === item.key
                      ? "border-brand text-brand"
                      : "border-transparent text-slate-500 hover:text-slate-700",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="w-48">
              <CourseSelect
                value={filters.courseId}
                onChange={handleCourseChange}
                placeholder="Tất cả khóa học"
                allowClear
              />
            </div>
          </div>

          <div className="mb-3">
            <SearchInput
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Tìm kiếm theo tên hoặc mã giáo án..."
            />
          </div>

          <AnimatedHeight>
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
          </AnimatedHeight>

          {total > 0 && (
            <div className="mt-4 flex justify-end">
              <Pagination
                total={total}
                current={filters.page}
                pageSize={perPage}
                onChange={(p, size) => handleChangePage(p ?? 1, size ?? perPage)}
              />
            </div>
          )}
        </Card>

        <div className="hidden flex-col gap-4 xl:flex">
          <LessonFilterCard
            range={dateRange}
            onRangeChange={handleRangeChange}
            onRangeClear={handleRangeClear}
          />
          <PlanStatusSidebar stats={stats} />
        </div>
      </div>

      <LessonPlanFormModal
        open={formOpen}
        editing={editing}
        onClose={() => setFormOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
});

export default LessonPlanPage;
