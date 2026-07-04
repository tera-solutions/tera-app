import { useMemo, useState } from "react";
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
import StatisticCard from "_common/components/StatisticCard";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useUrlFilters } from "_common/hooks/useUrlFilters";

import type {
  ClassroomStatus,
  ClassroomSummary,
  ClassroomView,
} from "./_interface";
import { toClassrooms, toClassroomSummary, summarize } from "./_utils";
import ClassroomToolbar, {
  type LevelOption,
} from "./components/ClassroomToolbar";
import ClassroomCard from "./components/ClassroomCard";
import ClassroomGridCard from "./components/ClassroomGridCard";
import { ClassRoomService } from "@tera/modules/education";

const Classroom = () => {
  const [filters, setFilters] = useUrlFilters({
    view: { type: "string", default: "list" as ClassroomView },
    search: { type: "string", default: "" },
    status: { type: "string", default: "" as ClassroomStatus | "" },
    level: { type: "string", default: "" },
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
      filters: { status: filters.status || undefined },
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

  const levelOptions = useMemo<LevelOption[]>(() => {
    const set = new Set<string>();
    classrooms.forEach((c) => c.level && set.add(c.level));
    return Array.from(set, (value) => ({ value, label: value }));
  }, [classrooms]);

  // Status and search are filtered server-side; level has no matching API
  // filter, so it's applied on top of the current page's results.
  const filtered = useMemo(() => {
    if (filters.level === "") return classrooms;
    return classrooms.filter((c) => c.level === filters.level);
  }, [classrooms, filters.level]);

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) {
      setFilters({ pageSize: nextSize, page: 1 });
    } else {
      setFilters({ page: nextPage });
    }
  };

  const handleCreate = () =>
    notification.open({ message: "Tính năng đang được phát triển" });

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

    if (!isLoading && filtered.length === 0)
      return (
        <EmptyState
          classNameImage="w-32 mx-auto"
          description={
            classrooms.length === 0
              ? "Bạn chưa được phân công lớp nào"
              : "Không tìm thấy lớp học phù hợp"
          }
        />
      );

    return (
      <div className="w-full min-h-25 flex items-center">
        <Spin spinning={isLoading || isFetching}>
          {filters.view === "list" ? (
            <div className="w-full flex flex-col gap-3">
              {filtered.map((classroom) => (
                <ClassroomCard key={classroom.id} classroom={classroom} />
              ))}
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((classroom) => (
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

      <div className="mb-4">
        <ClassroomToolbar
          search={searchDraft}
          status={filters.status}
          level={filters.level}
          levelOptions={levelOptions}
          onSearchChange={setSearchDraft}
          onStatusChange={(status) => setFilters({ status, page: 1 })}
          onLevelChange={(level) => setFilters({ level, page: 1 })}
        />
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

      <Card>
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-700">
            Danh sách lớp học
          </p>
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

        {renderList()}

        <TablePagination
          total={total}
          page={filters.page}
          perPage={perPage}
          unit="lớp học"
          onChange={handleChangePage}
        />
      </Card>
    </div>
  );
};

export default Classroom;
