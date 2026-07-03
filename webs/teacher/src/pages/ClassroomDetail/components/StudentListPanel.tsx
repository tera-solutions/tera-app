import { useMemo, useState } from "react";
import {
  ArrowUpTrayOutlined,
  Button,
  ChatBubbleLeftRightOutlined,
  EyeOutlined,
  PlusOutlined,
  Select,
  Spin,
} from "tera-dls";
import moment from "moment";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import EmptyState from "_common/components/EmptyState";
import ErrorRetry from "_common/components/ErrorRetry";
import SearchInput from "_common/components/SearchInput";
import StudentDetailModal from "_common/components/StudentDetailModal";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { todo } from "_common/utils/todo";

import type { ClassStudent, StudentRowStatus } from "../_interface";
import { getStudentStatus, STUDENT_STATUS_OPTIONS } from "../constants";
import { StudentService } from "@tera/modules/education";
import { toClassStudentResult } from "../_utils";

const COLUMNS = [
  "STT",
  "Học viên",
  "Ngày sinh",
  "SĐT",
  "Email",
  "Điểm TB",
  "Điểm danh",
  "Trạng thái",
  "Thao tác",
];

const StudentListPanel = ({ classId }: { classId: number | null }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  // Prefixed keys avoid colliding with other ClassroomDetail tab panels that
  // may sync their own filters (search/status/page) to the same URL.
  const [filters, setFilters] = useUrlFilters({
    student_search: { type: "string", default: "" },
    student_status: { type: "string", default: "" as StudentRowStatus | "" },
    student_page: { type: "number", default: 1 },
    student_per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
  });
  const [searchDraft, setSearchDraft] = useDebouncedSearch(
    filters.student_search,
    (trimmed) => setFilters({ student_search: trimmed, student_page: 1 }),
  );

  const listParams = {
    class_id: classId ?? 0,
    search: filters.student_search || undefined,
    status: filters.student_status || undefined,
    page: filters.student_page,
    per_page: filters.student_per_page,
  };

  const query = StudentService.useStudentList({ params: listParams });
  const { isLoading, isError, refetch } = query;
  const data = useMemo(
    () => toClassStudentResult(query.data?.data),
    [query.data],
  );

  const students = data.items;
  const total = data.total;
  // The endpoint currently fixes its own page size; trust the response so the
  // range text and pager stay correct whether or not `per_page` is honoured.
  const perPage = data.per_page || filters.student_per_page;
  const selectedStatus = STUDENT_STATUS_OPTIONS.find(
    (o) => o.value === filters.student_status,
  );

  const from = total === 0 ? 0 : (filters.student_page - 1) * perPage + 1;

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) {
      setFilters({ student_per_page: nextSize, student_page: 1 });
    } else {
      setFilters({ student_page: nextPage });
    }
  };

  const body = () => {
    if (isLoading)
      return (
        <tr>
          <td colSpan={COLUMNS.length}>
            <Spin spinning>
              <div className="h-40" />
            </Spin>
          </td>
        </tr>
      );

    if (isError)
      return (
        <tr>
          <td colSpan={COLUMNS.length}>
            <div className="flex h-40 items-center justify-center">
              <ErrorRetry
                onRetry={() => refetch()}
                message="Không tải được danh sách học viên"
              />
            </div>
          </td>
        </tr>
      );

    if (students.length === 0)
      return (
        <tr>
          <td colSpan={COLUMNS.length}>
            <EmptyState description="Không có học viên phù hợp" />
          </td>
        </tr>
      );

    return students.map((student, i) => {
      const st = getStudentStatus(student.status);
      return (
        <tr key={student.id} className="text-slate-700">
          <td className="px-4 py-3 text-slate-400">{from + i}</td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <Avatar src={student.avatar} alt={student.name} />
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-800">
                  {student.name || "—"}
                </p>
                {student.code && (
                  <p className="truncate text-[11px] text-slate-400">
                    {student.code}
                  </p>
                )}
              </div>
            </div>
          </td>
          <td className="px-4 py-3 text-slate-500">
            {student.dob ? moment(student.dob, "YYYY-MM-DD").format("DD/MM/YYYY") : "—"}
          </td>
          <td className="px-4 py-3 text-slate-500">{student.phone || "—"}</td>
          <td className="px-4 py-3 text-slate-500">{student.email || "—"}</td>
          <td className="px-4 py-3 text-slate-500">
            {student.avg_score != null ? student.avg_score : "—"}
          </td>
          <td className="px-4 py-3 text-slate-500">
            {student.attendance_rate != null ? `${student.attendance_rate}%` : "—"}
          </td>
          <td className="px-4 py-3">
            <Badge className={`px-2.5 py-0.5 text-[11px] ${st.badge}`}>
              {st.label}
            </Badge>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Xem chi tiết"
                onClick={() => setSelectedStudentId(student.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
              >
                <EyeOutlined />
              </button>
              <button
                type="button"
                title="Nhận xét"
                onClick={todo}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
              >
                <ChatBubbleLeftRightOutlined />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-700">
          Danh sách học viên ({total})
        </p>
        <div className="flex items-center gap-2">
          <Button
            outlined
            icon={<ArrowUpTrayOutlined />}
            onClick={todo}
            className="text-brand border-brand hover:bg-brand"
          >
            Nhập danh sách
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={todo}
            className="whitespace-nowrap bg-brand hover:bg-brand/80"
          >
            Thêm học viên
          </Button>
        </div>
      </div>

      <div className="mb-3 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Tìm kiếm học viên..."
          wrapperClassName="sm:max-w-xs"
        />
        <div className="sm:w-48">
          <Select
            value={filters.student_status === "" ? undefined : filters.student_status}
            selectedValue={selectedStatus}
            placeholder="Tất cả trạng thái"
            allowClear
            options={STUDENT_STATUS_OPTIONS}
            onChange={(value) =>
              setFilters({
                student_status: (value as StudentRowStatus | undefined) ?? "",
                student_page: 1,
              })
            }
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full min-w-200 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
              {COLUMNS.map((col) => (
                <th key={col} className="whitespace-nowrap px-4 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{body()}</tbody>
        </table>
      </div>

      <TablePagination
        total={total}
        page={filters.student_page}
        perPage={perPage}
        unit="học viên"
        onChange={handleChangePage}
      />

      <StudentDetailModal
        studentId={selectedStudentId}
        open={selectedStudentId != null}
        onClose={() => setSelectedStudentId(null)}
      />
    </div>
  );
};

export default StudentListPanel;
