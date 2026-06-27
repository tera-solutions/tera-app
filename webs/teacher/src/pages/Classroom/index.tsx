import { useMemo, useState } from "react";
import classNames from "classnames";
import {
  AcademicCapOutlined,
  ArrowPathOutlined,
  Button,
  CheckBadgeOutlined,
  ClipboardDocumentCheckOutlined,
  Empty,
  ExclamationTriangleOutlined,
  ListBulletOutlined,
  notification,
  PlusOutlined,
  Spin,
  TableCellsOutlined,
  UsersOutlined,
} from "tera-dls";

import Card from "_common/components/Card";

import type {
  ClassroomStatus,
  ClassroomSummary,
  ClassroomView,
} from "./_interface";
import { PER_PAGE } from "./constants";
import { summarize } from "./normalize";
import { useClassroomList, useClassroomSummary } from "./hooks";
import ClassroomToolbar, {
  type LevelOption,
} from "./components/ClassroomToolbar";
import StatisticCard from "./components/StatisticCard";
import ClassroomCard from "./components/ClassroomCard";
import ClassroomGridCard from "./components/ClassroomGridCard";

const Classroom = () => {
  const [view, setView] = useState<ClassroomView>("list");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ClassroomStatus | "">("");
  const [level, setLevel] = useState<string | "">("");
  const [limit, setLimit] = useState(PER_PAGE);

  const { data, isLoading, isError, refetch } = useClassroomList({
    per_page: limit,
  });

  const { data: summaryData, isLoading: isSummaryLoading } =
    useClassroomSummary();

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

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return classrooms.filter((c) => {
      if (
        keyword &&
        !`${c.name} ${c.level} ${c.room}`.toLowerCase().includes(keyword)
      )
        return false;
      if (status !== "" && c.status !== status) return false;
      if (level !== "" && c.level !== level) return false;
      return true;
    });
  }, [classrooms, search, status, level]);

  const hasMore = classrooms.length < total;

  const handleCreate = () =>
    notification.open({ message: "Tính năng đang được phát triển" });

  const renderList = () => {
    if (isError)
      return (
        <div className="flex h-[40vh] flex-col items-center justify-center gap-2 text-center">
          <ExclamationTriangleOutlined className="h-7 w-7 text-red-400" />
          <p className="text-sm text-slate-400">
            Không tải được danh sách lớp học
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-brand hover:bg-sky-100 [&_svg]:h-3.5 [&_svg]:w-3.5"
          >
            <ArrowPathOutlined />
            Thử lại
          </button>
        </div>
      );

    if (!isLoading && filtered.length === 0)
      return (
        <Empty
          className="py-12"
          classNameImage="w-32 mx-auto"
          description={
            classrooms.length === 0
              ? "Bạn chưa được phân công lớp nào"
              : "Không tìm thấy lớp học phù hợp"
          }
        />
      );

    return (
      <Spin spinning={isLoading}>
        {view === "list" ? (
          <div className="flex flex-col gap-3">
            {filtered.map((classroom) => (
              <ClassroomCard key={classroom.id} classroom={classroom} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((classroom) => (
              <ClassroomGridCard key={classroom.id} classroom={classroom} />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="mt-4 flex justify-center">
            <Button
              type="alternative"
              onClick={() => setLimit((prev) => prev + PER_PAGE)}
            >
              Xem thêm
            </Button>
          </div>
        )}
      </Spin>
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
          search={search}
          status={status}
          level={level}
          levelOptions={levelOptions}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onLevelChange={setLevel}
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
                onClick={() => setView(key)}
                className={classNames(
                  "flex h-8 w-8 items-center justify-center rounded-md transition-colors [&_svg]:h-4 [&_svg]:w-4",
                  view === key
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
      </Card>
    </div>
  );
};

export default Classroom;
