import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { ChatBubbleLeftRightOutlined, EyeOutlined, Select } from "tera-dls";
import moment from "moment";

import Avatar from "_common/components/Avatar";
import { PATHS } from "_common/components/Layout/Menu/menus";
import SearchInput from "_common/components/SearchInput";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useMeta } from "_common/hooks/useMeta";
import { useUrlFilters } from "_common/hooks/useUrlFilters";

import type { ClassStudent, StudentRowStatus } from "../_interface";
import { StudentService } from "@tera/modules/education";
import { toClassStudentResult } from "../_utils";

const STUDENT_STATUS_META = "student_status";

const StudentListPanel = observer(({ classId }: { classId: number | null }) => {
  const navigate = useNavigate();
  const { getOptions } = useMeta();
  const statusOptions = getOptions(STUDENT_STATUS_META);

  // Prefixed keys avoid colliding with other ClassroomDetail tab panels that
  // may sync their own filters (search/status/page) to the same URL.
  const [filters, setFilters] = useUrlFilters({
    student_search: { type: "string", default: "" },
    student_status: { type: "string", default: "" as StudentRowStatus | "" },
    student_page: { type: "number", default: 1 },
    student_per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
  }, { syncDefaultsOnMount: true });
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
  const selectedStatus = statusOptions.find(
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

  const columns: TableColumn<ClassStudent>[] = [
    {
      key: "stt",
      title: "STT",
      cellClassName: "px-4 py-3 text-slate-400",
      render: (student, i) => from + i,
    },
    {
      key: "student",
      title: "Học viên",
      render: (student) => (
        <div className="flex items-center gap-2">
          <Avatar src={student.avatar} alt={student.name} />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-800">{student.name || "—"}</p>
            {student.code && <p className="truncate text-[11px] text-slate-400">{student.code}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "dob",
      title: "Ngày sinh",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (student) => (student.dob ? moment(student.dob, "YYYY-MM-DD").format("DD/MM/YYYY") : "—"),
    },
    { key: "phone", title: "SĐT", cellClassName: "px-4 py-3 text-slate-500", render: (student) => student.phone || "—" },
    { key: "email", title: "Email", cellClassName: "px-4 py-3 text-slate-500", render: (student) => student.email || "—" },
    {
      key: "avg_score",
      title: "Điểm TB",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (student) => (student.avg_score != null ? student.avg_score : "—"),
    },
    {
      key: "attendance_rate",
      title: "Điểm danh",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (student) => (student.attendance_rate != null ? `${student.attendance_rate}%` : "—"),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (student) => <StatusBadge name={STUDENT_STATUS_META} value={student.status} />,
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (student) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Xem chi tiết"
            onClick={() => navigate(`${PATHS.studentDetail}/${student.id}`)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <EyeOutlined />
          </button>
          <button
            type="button"
            title="Nhận xét"
            onClick={() => navigate(`${PATHS.comments}?student_id=${student.id}`)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <ChatBubbleLeftRightOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Tìm kiếm học viên..."
          wrapperClassName="flex-1"
        />
        <div className="sm:w-48">
          <Select
            value={filters.student_status === "" ? undefined : filters.student_status}
            selectedValue={selectedStatus}
            placeholder="Tất cả trạng thái"
            allowClear
            options={statusOptions}
            onChange={(value) =>
              setFilters({
                student_status: (value as StudentRowStatus | undefined) ?? "",
                student_page: 1,
              })
            }
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={students}
        rowKey={(student) => student.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        errorMessage="Không tải được danh sách học viên"
        emptyText="Không có học viên phù hợp"
        minWidthClassName="min-w-200"
      />

      <TablePagination
        total={total}
        page={filters.student_page}
        perPage={perPage}
        unit="học viên"
        onChange={handleChangePage}
      />
    </div>
  );
});

export default StudentListPanel;
