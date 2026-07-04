import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import moment from "moment";
import {
  ArrowPathOutlined,
  BookOpenOutlined,
  ChevronDownOutlined,
  DocumentTextOutlined,
  Dropdown,
  MapPinOutlined,
  Modal,
  notification,
  Spin,
} from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
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

import type { Lesson } from "./_interface";
import { LESSON_PLAN_STATUS_META, LESSON_STATUS_META } from "./constants";
import { toLessonPlan, toLessons } from "./_utils";
import LessonTable from "./components/LessonTable";
import LessonFilterCard from "./components/LessonFilterCard";
import TeachingProgressCard from "./components/TeachingProgressCard";

const PlanLessons = observer(() => {
  const navigate = useNavigate();
  const { getTabs } = useMeta();
  const { id } = useParams<{ id: string }>();
  const planId = id ? Number(id) : null;

  const [filters, setFilters] = useUrlFilters({
    tab: { type: "string", default: "all" },
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
  });
  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );
  const [cancelling, setCancelling] = useState<Lesson | null>(null);
  const [reason, setReason] = useState("");

  const { mutate: cancelLesson, isPending: isCancelling } =
    LessonService.useLessonCancel();

  const handleTabChange = (key: string) => setFilters({ tab: key, page: 1 });

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

  const classroomsQuery = ClassRoomService.useClassRoomList(
    { params: { per_page: 50, filters: { course_id: plan?.course_id } } },
    { enabled: !!plan?.course_id },
  );
  const classrooms = useMemo(
    () =>
      plan?.course_id ? toClassrooms(classroomsQuery.data?.data?.items) : [],
    [classroomsQuery.data, plan?.course_id],
  );
  const selectedClassroom =
    classrooms.find((c) => c.id === filters.classroomId) ?? classrooms[0];

  const handleClassroomChange = (classroomId: number) =>
    setFilters({ classroomId, page: 1 });

  const lessonsQuery = LessonService.useLessonList(
    {
      params: {
        page: filters.page,
        per_page: filters.pageSize,
        search: filters.search || undefined,
        filters: {
          class_room_id: selectedClassroom?.id,
          status: filters.tab === "all" ? undefined : filters.tab,
          from_date: filters.dateFrom || undefined,
          to_date: filters.dateTo || undefined,
        },
      },
    },
    { enabled: !!selectedClassroom?.id },
  );
  const { isFetching, isError, refetch } = lessonsQuery;
  const isLoading =
    planQuery.isLoading || classroomsQuery.isLoading || lessonsQuery.isLoading;
  const lessons = useMemo(
    () => toLessons(lessonsQuery.data?.data?.items),
    [lessonsQuery.data],
  );
  const pagination = lessonsQuery.data?.data?.pagination;
  const total = pagination?.total ?? lessons.length;
  const perPage = pagination?.per_page ?? filters.pageSize;

  // Unfiltered snapshot for the progress card, independent of the active
  // status/search filters or the current page.
  const lessonStatsQuery = LessonService.useLessonList(
    { params: { filters: { class_room_id: selectedClassroom?.id } } },
    { enabled: !!selectedClassroom?.id },
  );
  const lessonStats = useMemo(
    () => toLessons(lessonStatsQuery.data?.data?.items),
    [lessonStatsQuery.data],
  );
  const lessonStatsTotal =
    lessonStatsQuery.data?.data?.pagination?.total ?? lessonStats.length;

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) {
      setFilters({ pageSize: nextSize, page: 1 });
    } else {
      setFilters({ page: nextPage });
    }
  };

  const handleView = (lesson: Lesson) =>
    navigate(`${PATHS.lesson}/${lesson.id}`);

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

      <Spin spinning={isLoading}>
        <Card className="mb-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sky-50 text-brand [&_svg]:h-5 [&_svg]:w-5">
                {plan?.avatar ? (
                  <img
                    src={plan.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <DocumentTextOutlined />
                )}
              </span>
              <div className="min-w-0">
                <p className="text-base font-bold text-slate-800">
                  {plan?.plan_name || "Giáo án"}
                </p>
                {meta && <p className="mt-0.5 text-xs text-slate-400">{meta}</p>}
                {plan?.description && (
                  <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
                )}
              </div>
            </div>
            {plan && (
              <StatusBadge
                name={LESSON_PLAN_STATUS_META}
                value={plan.status}
                className="shrink-0"
              />
            )}
          </div>
        </Card>

        {selectedClassroom && (
          <Card className="mb-4" animated={false}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sky-50 text-brand [&_svg]:h-6 [&_svg]:w-6">
                  {selectedClassroom.cover_image ? (
                    <img
                      src={selectedClassroom.cover_image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookOpenOutlined />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-800">
                    {selectedClassroom.name || "—"}
                  </p>
                  {selectedClassroom.level && (
                    <p className="truncate text-xs text-slate-400">
                      {selectedClassroom.level}
                    </p>
                  )}
                  {(selectedClassroom.room || selectedClassroom.branch) && (
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400 [&_svg]:h-3.5 [&_svg]:w-3.5">
                      <MapPinOutlined />
                      {[selectedClassroom.room, selectedClassroom.branch]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  )}
                </div>
              </div>

              {classrooms.length > 1 && (
                <Dropdown
                  trigger="click"
                  menu={{
                    itemClassName:
                      "text-slate-700 hover:bg-brand! hover:text-white!",
                    items: classrooms.map((classroom) => ({
                      key: String(classroom.id),
                      label: classroom.name || "—",
                      onClick: () => handleClassroomChange(classroom.id),
                    })),
                  }}
                >
                  <button
                    type="button"
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 [&_svg]:h-3.5 [&_svg]:w-3.5"
                  >
                    <ArrowPathOutlined />
                    Đổi lớp
                    <ChevronDownOutlined />
                  </button>
                </Dropdown>
              )}
            </div>
          </Card>
        )}

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
                      filters.tab === item.key
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
              <TeachingProgressCard lessons={lessonStats} total={lessonStatsTotal} />
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
      </Spin>

      <Modal
        title="Hủy buổi học"
        open={!!cancelling}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        confirmLoading={isCancelling}
        okButtonProps={{ disabled: !reason.trim() }}
        onOk={submitCancel}
        onCancel={() => setCancelling(null)}
        destroyOnClose
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
      </Modal>
    </div>
  );
});

export default PlanLessons;
