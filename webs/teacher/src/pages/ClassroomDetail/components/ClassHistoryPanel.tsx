import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { LessonService } from "@tera/modules/education";
import type { Lesson } from "pages/LessonPlan/_interface";
import { toLessons } from "pages/LessonPlan/_utils";
import { LESSON_STATUS_META } from "pages/LessonPlan/constants";

/**
 * The class's session log — every generated lesson, newest first.
 * `edu/lesson/list` honours `class_room_id` and is teacher-scoped.
 */
const ClassHistoryPanel = ({ classId }: { classId: number | null }) => {
  const navigate = useNavigate();

  const query = LessonService.useLessonList(
    { params: { per_page: 200, filters: { class_room_id: classId ?? 0 } } },
    { enabled: !!classId },
  );
  const items = useMemo(() => {
    const lessons = toLessons(query.data?.data?.items);
    return [...lessons].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, [query.data]);

  const columns: TableColumn<Lesson>[] = [
    {
      key: "lesson",
      title: "Buổi học",
      render: (row) => (
        <div>
          <span className="font-medium text-slate-800">
            Buổi {row.lesson_no}
            {row.lesson_title ? ` — ${row.lesson_title}` : ""}
          </span>
        </div>
      ),
    },
    {
      key: "date",
      title: "Ngày học",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => (row.date ? moment(row.date).format("DD/MM/YYYY") : "—"),
    },
    {
      key: "time",
      title: "Thời gian",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => (row.start_time ? `${row.start_time} - ${row.end_time}` : "—"),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => <StatusBadge name={LESSON_STATUS_META} value={row.status} />,
    },
  ];

  return (
    <Table
      columns={columns}
      data={items}
      rowKey={(row) => row.id}
      isLoading={query.isLoading}
      isError={query.isError}
      onRetry={() => query.refetch()}
      errorMessage="Không tải được lịch sử lớp học"
      emptyText="Lớp học chưa có buổi học nào"
      minWidthClassName="min-w-200"
      onRowClick={(row) => navigate(`${PATHS.lesson}/${row.id}`)}
    />
  );
};

export default ClassHistoryPanel;
