import moment from "moment";
import { useNavigate } from "react-router-dom";

import SearchInput from "_common/components/SearchInput";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { ExamSessionService } from "@tera/modules/education";
import { EXAM_SESSION_STATUS_META } from "pages/ExamSession/constants";

import ScoreBoardPanel from "./ScoreBoardPanel";

/** Exam sessions scoped to this class — `edu/exam-session/list` honours `class_room_id`. */
const ClassScoresPanel = ({ classId }: { classId: number | null }) => {
  const navigate = useNavigate();

  const [filters, setFilters] = useUrlFilters(
    {
      scores_search: { type: "string", default: "" },
      scores_page: { type: "number", default: 1 },
      scores_page_size: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );
  const [searchDraft, setSearchDraft] = useDebouncedSearch(
    filters.scores_search,
    (trimmed) => setFilters({ scores_search: trimmed, scores_page: 1 }),
  );

  const query = ExamSessionService.useExamSessionList(
    {
      params: {
        page: filters.scores_page,
        per_page: filters.scores_page_size,
        search: filters.scores_search || undefined,
        filters: { class_room_id: classId ?? 0 },
      },
    },
    { enabled: !!classId },
  );
  const items = query.data?.data?.items ?? [];
  const pagination = query.data?.data?.pagination;
  const total = pagination?.total ?? items.length;
  const perPage = pagination?.per_page ?? filters.scores_page_size;

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) setFilters({ scores_page_size: nextSize, scores_page: 1 });
    else setFilters({ scores_page: nextPage });
  };

  const columns: TableColumn<any>[] = [
    {
      key: "exam",
      title: "Bài kiểm tra",
      render: (row) => <span className="font-medium text-slate-800">{row.exam?.exam_name ?? "—"}</span>,
    },
    {
      key: "room",
      title: "Phòng",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => row.room?.room_name ?? "—",
    },
    {
      key: "date",
      title: "Ngày thi",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => (row.exam_date ? moment(row.exam_date).format("DD/MM/YYYY") : "—"),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => <StatusBadge name={EXAM_SESSION_STATUS_META} value={row.status} />,
    },
  ];

  return (
    <div>
      <ScoreBoardPanel classId={classId} />

      <p className="mb-3 mt-6 text-sm font-semibold text-slate-700">Bài kiểm tra</p>
      <div className="mb-3">
        <SearchInput
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Tìm kiếm bài kiểm tra..."
        />
      </div>
      <Table
        columns={columns}
        data={items}
        rowKey={(row) => row.id}
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => query.refetch()}
        errorMessage="Không tải được danh sách bài kiểm tra"
        emptyText="Lớp học chưa có bài kiểm tra nào"
        minWidthClassName="min-w-200"
        onRowClick={(row) => navigate(`${PATHS.exam}/session/${row.id}`)}
      />
      <TablePagination
        total={total}
        page={filters.scores_page}
        perPage={perPage}
        unit="bài kiểm tra"
        onChange={handleChangePage}
      />
    </div>
  );
};

export default ClassScoresPanel;
