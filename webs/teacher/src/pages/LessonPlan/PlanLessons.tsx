import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import moment from "moment";
import {
  BookOpenOutlined,
  DocumentTextOutlined,
  notification,
  Spin,
} from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";
import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import ClassroomInfoCard from "_common/components/ClassroomInfoCard";
import SearchInput from "_common/components/SearchInput";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useMeta } from "_common/hooks/useMeta";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import StatusBadge from "_common/components/StatusBadge";
import { PATHS } from "_common/components/Layout/Menu/menus";
import {
  ClassRoomService,
  LessonPlanService,
  LessonService,
} from "@tera/modules/education";
import { toClassrooms } from "pages/Classroom/_utils";
import { getCoverGradient } from "pages/Classroom/constants";

import type { Lesson } from "./_interface";
import { LESSON_PLAN_STATUS_META, LESSON_STATUS_META } from "./constants";
import { toLessonPlan, toLessons, toLessonTemplateSummaries } from "./_utils";
import LessonTable from "./components/LessonTable";
import LessonFilterCard from "./components/LessonFilterCard";
import LessonTemplateList from "./components/LessonTemplateList";
import TeachingProgressCard from "./components/TeachingProgressCard";

const PlanLessons = observer(() => {
  const navigate = useNavigate();
  const { getTabs } = useMeta();
  const { id } = useParams<{ id: string }>();
  const planId = id ? Number(id) : null;

  const [filters, setFilters] = useUrlFilters({
    status: { type: "string", default: "all" },
    search: { type: "string", default: "" },
    page: { type: "number", default: 1 },
    pageSize: { type: "number", default: DEFAULT_PAGE_SIZE },
    classroomId: {
      type: "number",
      default: undefined as number | undefined,
      param: "class_id",
    },
    dateFrom: { type: "string", default: "" },
    dateTo: { type: "string", default: "" },
  }, { syncDefaultsOnMount: true });
  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );
  const [cancelling, setCancelling] = useState<Lesson | null>(null);
  const [reason, setReason] = useState("");

  const { mutate: cancelLesson, isPending: isCancelling } =
    LessonService.useLessonCancel();

  const handleTabChange = (key: string) => setFilters({ status: key, page: 1 });

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

  // Plan detail supplies the header (name / code / status).
  const planQuery = LessonPlanService.useLessonPlanDetail({ id: planId ?? "" });
  const detail = planQuery.data?.data;
  const plan = useMemo(
    () => (detail ? toLessonPlan(detail.plan ?? detail) : undefined),
    [detail],
  );
  const templates = useMemo(
    () => toLessonTemplateSummaries((detail?.plan ?? detail)?.lessons),
    [detail],
  );

  const classroomsQuery = ClassRoomService.useClassRoomList(
    { params: { per_page: 20, filters: { lesson_plan_id: planId } } },
    { enabled: !!planId },
  );
  const classrooms = useMemo(
    () => (planId ? toClassrooms(classroomsQuery.data?.data?.items) : []),
    [classroomsQuery.data, planId],
  );
  const selectedClassroom =
    classrooms.find((c) => c.id === filters.classroomId) ?? classrooms[0];

  const handleClassroomChange = (classroomId: number) =>
    setFilters({ classroomId, page: 1 });

  // Table: server-side filtered, sorted and paginated.
  const lessonsQuery = LessonService.useLessonList(
    {
      params: {
        page: filters.page,
        per_page: filters.pageSize,
        search: filters.search || undefined,
        sort_by: "lesson_no",
        sort_dir: "desc",
        filters: {
          class_room_id: selectedClassroom?.id,
          lesson_plan_id: planId,
          status: filters.status === "all" ? undefined : filters.status,
          date_from: filters.dateFrom || undefined,
          date_to: filters.dateTo || undefined,
        },
      },
    },
    { enabled: !!selectedClassroom?.id },
  );
  const { isFetching, isError, refetch } = lessonsQuery;
  const lessons = useMemo(
    () => toLessons(lessonsQuery.data?.data?.items),
    [lessonsQuery.data],
  );
  const pagination = lessonsQuery.data?.data?.pagination;
  const total = pagination?.total ?? lessons.length;
  const perPage = pagination?.per_page ?? filters.pageSize;

  // Unfiltered snapshot for the progress card, independent of the table's
  // active status/search/date filters or the current page — a genuinely
  // different data need from the table above, not a duplicate of it.
  const lessonStatsQuery = LessonService.useLessonList(
    {
      params: {
        per_page: 200,
        filters: { class_room_id: selectedClassroom?.id, lesson_plan_id: planId },
      },
    },
    { enabled: !!selectedClassroom?.id },
  );
  const allLessons = useMemo(
    () => toLessons(lessonStatsQuery.data?.data?.items),
    [lessonStatsQuery.data],
  );

  const isLoading =
    planQuery.isLoading || classroomsQuery.isLoading || lessonsQuery.isLoading;

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) {
      setFilters({ pageSize: nextSize, page: 1 });
    } else {
      setFilters({ page: nextPage });
    }
  };

  const handleView = (lesson: Lesson) =>
    navigate(`${PATHS.lesson}/${lesson.id}`);

  const handleEditTemplates = () =>
    navigate(`${PATHS.lessonPlans}/${planId}/edit`);

  const handleCancel = (lesson: Lesson) => {
    setCancelling(lesson);
    setReason("");
  };

  const submitCancel = () => {
    if (!cancelling || !reason.trim()) return;
    cancelLesson(
      { id: cancelling.id, params: { reason: reason.trim() } },
      {
        onSuccess: (res: any) => {
          notification.success({
            message: res?.msg ?? "Đã hủy buổi học",
          });
          setCancelling(null);
          refetch();
        },
        onError: (err: any) => {
          notification.error({
            message: err?.msg ?? err?.message ?? "Hủy buổi học thất bại",
          });
        },
      },
    );
  };

  const meta = plan
    ? [plan.plan_code, plan.course_name, `v${plan.version}`]
        .filter(Boolean)
        .join(" • ")
    : "";

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Giáo án", onClick: () => navigate(PATHS.lessonPlans) },
          { label: "Chi tiết giáo án" },
        ]}
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Spin spinning={planQuery.isLoading}>
          <Card animated={false}>
            <div className="flex items-center gap-3">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br ${getCoverGradient(
                  plan?.id ?? 0,
                )} text-white [&_svg]:h-6 [&_svg]:w-6`}
              >
                {plan?.avatar ? (
                  <img
                    src={plan.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <DocumentTextOutlined />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-base font-bold text-slate-800">
                    {plan?.plan_name || "Giáo án"}
                  </p>
                  {plan && (
                    <StatusBadge
                      name={LESSON_PLAN_STATUS_META}
                      value={plan.status}
                      className="shrink-0"
                    />
                  )}
                </div>
                {meta && (
                  <p className="mt-1 truncate text-xs font-medium text-slate-600">
                    {meta}
                  </p>
                )}
                {plan?.description && (
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {plan.description}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </Spin>

        <ClassroomInfoCard
          loading={classroomsQuery.isLoading}
          classroom={selectedClassroom}
          classrooms={classrooms}
          onChangeClassroom={handleClassroomChange}
          icon={<BookOpenOutlined />}
        />
      </div>

      <Card className="mb-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">Bài học mẫu</p>
          {plan && plan.status !== "published" && (
            <button
              type="button"
              onClick={handleEditTemplates}
              className="text-xs font-medium text-brand hover:underline"
            >
              Chỉnh sửa
            </button>
          )}
        </div>
        <LessonTemplateList templates={templates} loading={planQuery.isLoading} />
        {plan?.status === "published" && (
          <p className="mt-3 text-xs text-slate-400">
            Giáo án đã xuất bản không thể chỉnh sửa trực tiếp.
          </p>
        )}
      </Card>

      {selectedClassroom ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
          <Card>
            <div className="mb-3 flex gap-1 overflow-x-auto border-b border-slate-100 scrollbar-none">
              {getTabs(LESSON_STATUS_META).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleTabChange(item.key)}
                  className={classNames(
                    "whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                    filters.status === item.key
                      ? "border-brand text-brand"
                      : "border-transparent text-slate-500 hover:text-slate-700",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <SearchInput
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Tìm kiếm theo tên bài học..."
              wrapperClassName="flex-1 mb-3"
            />

            <LessonTable
              lessons={lessons}
              avatarUrl={selectedClassroom.cover_image}
              loading={isLoading}
              fetching={isFetching}
              isError={isError}
              onRetry={() => refetch()}
              onView={handleView}
              onDelete={handleCancel}
            />

            <TablePagination
              total={total}
              page={filters.page}
              perPage={perPage}
              unit="buổi học"
              onChange={handleChangePage}
            />
          </Card>

          <div className="flex flex-col gap-4">
            <LessonFilterCard
              range={dateRange}
              onRangeChange={handleRangeChange}
              onRangeClear={handleRangeClear}
            />
            <TeachingProgressCard lessons={allLessons} total={allLessons.length} />
          </div>
        </div>
      ) : (
        !isLoading && (
          <Card>
            <p className="py-12 text-center text-sm text-slate-400">
              Chưa có lớp học nào sử dụng giáo án này.
            </p>
          </Card>
        )
      )}

      <FormScaff
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        isEdit={false}
        titleCreate="Hủy buổi học"
        titleEdit="Hủy buổi học"
        okText="Xác nhận hủy"
        cancelText="Đóng"
        confirmLoading={isCancelling}
        okButtonProps={{ disabled: !reason.trim() }}
        onOk={submitCancel}
      >
        <p className="mb-2 text-sm text-slate-600">
          Nhập lý do hủy buổi học <b>{cancelling?.lesson_title}</b>:
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Lý do hủy..."
          className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand"
        />
      </FormScaff>
    </div>
  );
});

export default PlanLessons;
