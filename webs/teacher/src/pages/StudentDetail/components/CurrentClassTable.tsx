import moment from "moment";

import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import { toTime } from "_common/utils/schedule";
import { scheduleDaysLabel } from "pages/RoomDetail/_utils";

import type { CurrentClass } from "../_interface";

const toDisplayDate = (value: string) => (value ? moment(value, "YYYY-MM-DD").format("DD/MM/YYYY") : "—");

interface CurrentClassTableProps {
  currentClass: CurrentClass | null;
  isLoading?: boolean;
}

const CurrentClassTable = ({ currentClass, isLoading }: CurrentClassTableProps) => {
  const columns: TableColumn<CurrentClass>[] = [
    { key: "name", title: "Lớp học", cellClassName: "px-4 py-3 font-medium", render: (c) => c.name || "—" },
    {
      key: "teacher_name",
      title: "Giáo viên",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (c) => c.teacher_name || "—",
    },
    {
      key: "schedule",
      title: "Lịch học",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (c) =>
        c.schedules.length > 0
          ? `${scheduleDaysLabel(c.schedules)} (${toTime(c.schedules[0]?.start_time)} - ${toTime(c.schedules[0]?.end_time)})`
          : "—",
    },
    {
      key: "start_date",
      title: "Ngày bắt đầu",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (c) => toDisplayDate(c.start_date),
    },
    {
      key: "end_date",
      title: "Ngày kết thúc",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (c) => toDisplayDate(c.end_date),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (c) => <StatusBadge name="class_status" value={c.status} />,
    },
  ];

  return (
    <Table
      columns={columns}
      data={currentClass ? [currentClass] : []}
      rowKey={(c) => c.id}
      isLoading={isLoading}
      emptyText="Học viên hiện chưa được xếp vào lớp học nào"
      minWidthClassName="min-w-[720px]"
    />
  );
};

export default CurrentClassTable;
