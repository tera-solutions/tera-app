import { useEffect, useMemo, useState } from "react";
import {
  ArrowPathOutlined,
  ArrowUpTrayOutlined,
  Button,
  ChatBubbleLeftRightOutlined,
  Empty,
  ExclamationTriangleOutlined,
  EyeOutlined,
  Input,
  MagnifyingGlassOutlined,
  notification,
  Pagination,
  PlusOutlined,
  Select,
  Spin,
  UserOutlined,
} from "tera-dls";
import moment from "moment";

import { useClassStudents } from "../hooks";
import type { ClassStudent, StudentRowStatus } from "../_interface";
import { getStudentStatus, STUDENT_STATUS_OPTIONS } from "../constants";

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

const PER_PAGE = 20;

const todo = () =>
  notification.open({ message: "Tính năng đang được phát triển" });

const Avatar = ({ student }: { student: ClassStudent }) =>
  student.avatar ? (
    <img
      src={student.avatar}
      alt={student.name}
      className="h-8 w-8 shrink-0 rounded-full object-cover"
    />
  ) : (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-brand [&_svg]:h-4 [&_svg]:w-4">
      <UserOutlined />
    </span>
  );

const StudentListPanel = ({ classId }: { classId: number | null }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<StudentRowStatus | "">("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to the first page whenever the filters change.
  useEffect(() => setPage(1), [debouncedSearch, status]);

  const { data, isLoading, isError, refetch } = useClassStudents(classId, {
    search: debouncedSearch || undefined,
    status: status || undefined,
    page,
    per_page: PER_PAGE,
  });

  const students = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;
  // The endpoint currently fixes its own page size; trust the response so the
  // range text and pager stay correct whether or not `per_page` is honoured.
  const perPage = data?.per_page || PER_PAGE;
  const selectedStatus = STUDENT_STATUS_OPTIONS.find((o) => o.value === status);

  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

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
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
              <ExclamationTriangleOutlined className="h-6 w-6 text-red-400" />
              <p className="text-sm text-slate-400">
                Không tải được danh sách học viên
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
          </td>
        </tr>
      );

    if (students.length === 0)
      return (
        <tr>
          <td colSpan={COLUMNS.length}>
            <Empty
              className="py-12"
              classNameImage="w-28 mx-auto"
              description="Không có học viên phù hợp"
            />
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
              <Avatar student={student} />
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
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${st.badge}`}
            >
              {st.label}
            </span>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Xem chi tiết"
                onClick={todo}
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
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm học viên..."
          prefix={<MagnifyingGlassOutlined className="h-4 w-4 text-slate-400" />}
          className="pl-10 sm:max-w-xs"
        />
        <div className="sm:w-48">
          <Select
            value={status === "" ? undefined : status}
            selectedValue={selectedStatus}
            placeholder="Tất cả trạng thái"
            allowClear
            options={STUDENT_STATUS_OPTIONS}
            onChange={(value) =>
              setStatus((value as StudentRowStatus | undefined) ?? "")
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

      {total > 0 && (
        <div className="mt-3 flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
          <span>
            Hiển thị {from} - {to} trong tổng số {total} học viên
          </span>
          {total > perPage && (
            <Pagination
              total={total}
              current={page}
              pageSize={perPage}
              onChange={(p) => setPage(p ?? 1)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default StudentListPanel;
