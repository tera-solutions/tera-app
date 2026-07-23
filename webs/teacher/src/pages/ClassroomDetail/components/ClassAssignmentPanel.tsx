import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Button, PlusOutlined } from "tera-dls";

import Badge from "_common/components/Badge";
import SearchInput from "_common/components/SearchInput";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useMeta } from "_common/hooks/useMeta";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { AssignmentService } from "@tera/modules/education";
import type { Assignment } from "pages/Assignment/_interface";
import { toAssignments, isOverdue } from "pages/Assignment/_utils";
import { ASSIGNMENT_STATUS_META, ASSIGNMENT_TYPE_META } from "pages/Assignment/constants";

/** Assignments scoped to this class — the real `edu/assignment/list` honours `class_room_id`. */
const ClassAssignmentPanel = ({ classId }: { classId: number | null }) => {
  const navigate = useNavigate();
  const { getLabel } = useMeta();

  const [filters, setFilters] = useUrlFilters(
    {
      assignment_search: { type: "string", default: "" },
      assignment_page: { type: "number", default: 1 },
      assignment_page_size: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );
  const [searchDraft, setSearchDraft] = useDebouncedSearch(
    filters.assignment_search,
    (trimmed) => setFilters({ assignment_search: trimmed, assignment_page: 1 }),
  );

  const query = AssignmentService.useAssignmentList(
    {
      params: {
        page: filters.assignment_page,
        per_page: filters.assignment_page_size,
        search: filters.assignment_search || undefined,
        filters: { class_room_id: classId ?? 0 },
      },
    },
    { enabled: !!classId },
  );
  const items = useMemo(() => toAssignments(query.data?.data?.items), [query.data]);
  const pagination = query.data?.data?.pagination;
  const total = pagination?.total ?? items.length;
  const perPage = pagination?.per_page ?? filters.assignment_page_size;

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) setFilters({ assignment_page_size: nextSize, assignment_page: 1 });
    else setFilters({ assignment_page: nextPage });
  };

  const columns: TableColumn<Assignment>[] = [
    {
      key: "name",
      title: "Tên bài tập",
      render: (row) => <span className="font-medium text-slate-800">{row.name || "—"}</span>,
    },
    {
      key: "type",
      title: "Loại",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => getLabel(ASSIGNMENT_TYPE_META, row.type) || "—",
    },
    {
      key: "due_date",
      title: "Hạn nộp",
      cellClassName: "px-4 py-3",
      render: (row) =>
        row.due_date ? (
          <span className={isOverdue(row.due_date) ? "text-red-500" : "text-slate-500"}>
            {moment(row.due_date).format("DD/MM/YYYY HH:mm")}
          </span>
        ) : (
          "—"
        ),
    },
    {
      key: "max_score",
      title: "Điểm tối đa",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => row.max_score || "—",
    },
    {
      key: "submissions",
      title: "Đã nộp",
      render: (row) => (
        <Badge className="bg-sky-50 px-2.5 py-0.5 text-[11px] text-brand">{row.student_count}</Badge>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => <StatusBadge name={ASSIGNMENT_STATUS_META} value={row.status} />,
    },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <SearchInput
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Tìm kiếm bài tập..."
          wrapperClassName="flex-1"
        />
        <Button
          icon={<PlusOutlined />}
          disabled={!classId}
          onClick={() => navigate(`${PATHS.assignment}/new`, { state: { class_room_id: classId } })}
          className="shrink-0 whitespace-nowrap bg-brand hover:bg-brand/80"
        >
          Giao bài tập
        </Button>
      </div>
      <Table
        columns={columns}
        data={items}
        rowKey={(row) => row.id}
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => query.refetch()}
        errorMessage="Không tải được danh sách bài tập"
        emptyText="Lớp học chưa có bài tập nào"
        minWidthClassName="min-w-200"
        onRowClick={(row) => navigate(`${PATHS.assignmentDetail}/${row.id}`)}
      />
      <TablePagination
        total={total}
        page={filters.assignment_page}
        perPage={perPage}
        unit="bài tập"
        onChange={handleChangePage}
      />
    </div>
  );
};

export default ClassAssignmentPanel;
