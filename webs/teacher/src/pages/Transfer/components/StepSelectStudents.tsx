import { useMemo, useState } from "react";
import moment from "moment";
import { Button, Select } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import SearchInput from "_common/components/SearchInput";
import Table, { TableColumn } from "_common/components/Table";
import { ClassRoomService, EnrollmentService } from "@tera/modules/education";

import type { TransferEnrollmentRow } from "../_interface";
import { toTransferRows } from "../_utils";

interface StepSelectStudentsProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  onNext: (rows: TransferEnrollmentRow[]) => void;
}

const StepSelectStudents = ({ selectedIds, onChange, onNext }: StepSelectStudentsProps) => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<number | "">("");

  const classesQuery = ClassRoomService.useClassRoomList({ params: { per_page: 50 } });
  const classes = classesQuery.data?.data?.items ?? [];

  const enrollmentsQuery = EnrollmentService.useEnrollmentList({
    params: { per_page: 200, filters: { status: "studying" } },
  });
  const rows = useMemo(() => toTransferRows(enrollmentsQuery.data?.data?.items), [enrollmentsQuery.data]);

  const filtered = rows.filter((r) => {
    if (classFilter && r.class_id !== classFilter) return false;
    if (search.trim() && !r.student_name.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  const selectedRows = rows.filter((r) => selectedIds.includes(r.enrollment_id));
  const distinctCourseIds = Array.from(new Set(selectedRows.map((r) => r.course_id)));
  const hasMixedCourses = distinctCourseIds.length > 1;

  const toggle = (id: number) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]);

  const columns: TableColumn<TransferEnrollmentRow>[] = [
    {
      key: "select",
      title: "",
      headerClassName: "px-3 py-3 w-10",
      cellClassName: "px-3 py-3",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.enrollment_id)}
          onChange={() => toggle(row.enrollment_id)}
          className="h-4 w-4 rounded border-slate-300 accent-brand"
        />
      ),
    },
    {
      key: "student",
      title: "Học viên",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar src={row.avatar} alt={row.student_name} />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-800">{row.student_name || "—"}</p>
            {row.student_code && <p className="truncate text-[11px] text-slate-400">{row.student_code}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "class",
      title: "Lớp hiện tại",
      render: (row) =>
        row.class_name ? (
          <Badge className="bg-sky-50 px-2.5 py-0.5 text-[11px] text-brand">{row.class_name}</Badge>
        ) : (
          "—"
        ),
    },
    {
      key: "enrolled_at",
      title: "Ngày đăng ký",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => (row.enrolled_at ? moment(row.enrolled_at, "YYYY-MM-DD").format("DD/MM/YYYY") : "—"),
    },
    {
      key: "sessions",
      title: "Thời gian học",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => `${row.completed_lessons} buổi`,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm học viên..."
          wrapperClassName="flex-1"
        />
        <Select
          value={classFilter}
          onChange={(value: any) => setClassFilter(value || "")}
          options={[{ value: "", label: "Tất cả lớp" }, ...classes.map((c: any) => ({ value: c.id, label: c.name }))]}
          className="sm:w-56"
        />
      </div>

      <Table
        columns={columns}
        data={filtered}
        rowKey={(row) => row.enrollment_id}
        isLoading={enrollmentsQuery.isLoading}
        isError={enrollmentsQuery.isError}
        onRetry={() => enrollmentsQuery.refetch()}
        emptyText="Không có học viên phù hợp"
        minWidthClassName="min-w-200"
      />

      {hasMixedCourses && (
        <Badge className="w-fit bg-amber-50 px-3 py-1.5 text-xs text-amber-600">
          Chỉ có thể chuyển các học viên cùng khoá học trong một lần chuyển
        </Badge>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">Đã chọn {selectedIds.length} học viên</span>
        <Button
          disabled={selectedIds.length === 0 || hasMixedCourses}
          onClick={() => onNext(selectedRows)}
        >
          Bước tới →
        </Button>
      </div>
    </div>
  );
};

export default StepSelectStudents;
