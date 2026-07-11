import { useMemo } from "react";

import Avatar from "_common/components/Avatar";
import SearchInput from "_common/components/SearchInput";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { EvaluationService, StudentService } from "@tera/modules/education";

interface CommentRow {
  id: number;
  target_id: number;
  comment: string;
  score: number | null;
  classification_label: string;
  evaluation_period_label: string;
  evaluated_at: string | null;
}

/**
 * Student evaluations scoped to this class — `edu/evaluation/list` honours
 * `class_room_id`. The evaluation resource carries only `target_id` (no student
 * name), so names are joined from the class roster.
 */
const ClassCommentsPanel = ({ classId }: { classId: number | null }) => {
  const [filters, setFilters] = useUrlFilters(
    {
      comments_search: { type: "string", default: "" },
      comments_page: { type: "number", default: 1 },
      comments_page_size: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );
  const [searchDraft, setSearchDraft] = useDebouncedSearch(
    filters.comments_search,
    (trimmed) => setFilters({ comments_search: trimmed, comments_page: 1 }),
  );

  const query = EvaluationService.useEvaluationList(
    {
      params: {
        page: filters.comments_page,
        per_page: filters.comments_page_size,
        search: filters.comments_search || undefined,
        filters: { class_room_id: classId ?? 0, evaluation_type: "student" },
      },
    },
    { enabled: !!classId },
  );

  const rosterQuery = StudentService.useStudentList(
    { params: { class_id: classId ?? 0, per_page: 100 } },
    { enabled: !!classId },
  );
  const studentNameMap = useMemo(() => {
    const map = new Map<number, { name: string; avatar: string }>();
    (rosterQuery.data?.data?.items ?? []).forEach((s: any) =>
      map.set(s.id, { name: s.name ?? `#${s.id}`, avatar: s.avatar ?? "" }),
    );
    return map;
  }, [rosterQuery.data]);

  const items: CommentRow[] = query.data?.data?.items ?? [];
  const pagination = query.data?.data?.pagination;
  const total = pagination?.total ?? items.length;
  const perPage = pagination?.per_page ?? filters.comments_page_size;

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) setFilters({ comments_page_size: nextSize, comments_page: 1 });
    else setFilters({ comments_page: nextPage });
  };

  const columns: TableColumn<CommentRow>[] = [
    {
      key: "student",
      title: "Học viên",
      render: (row) => {
        const student = studentNameMap.get(row.target_id);
        return (
          <div className="flex items-center gap-2">
            <Avatar src={student?.avatar} alt={student?.name} sizeClassName="size-7" />
            <span className="truncate font-medium text-slate-800">
              {student?.name ?? `HV #${row.target_id}`}
            </span>
          </div>
        );
      },
    },
    {
      key: "comment",
      title: "Nội dung nhận xét",
      cellClassName: "px-4 py-3 text-slate-600",
      render: (row) => row.comment || "Không có nội dung nhận xét",
    },
    {
      key: "score",
      title: "Điểm",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => (row.score != null ? row.score : "—"),
    },
    {
      key: "classification",
      title: "Phân loại",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => row.classification_label || "—",
    },
    {
      key: "period",
      title: "Kỳ đánh giá",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => row.evaluation_period_label || "—",
    },
    {
      key: "evaluated_at",
      title: "Ngày đánh giá",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) =>
        row.evaluated_at ? new Date(row.evaluated_at).toLocaleDateString("vi-VN") : "—",
    },
  ];

  return (
    <div>
      <div className="mb-3">
        <SearchInput
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Tìm kiếm nhận xét..."
        />
      </div>
      <Table
        columns={columns}
        data={items}
        rowKey={(row) => row.id}
        isLoading={query.isLoading || rosterQuery.isLoading}
        isError={query.isError}
        onRetry={() => query.refetch()}
        errorMessage="Không tải được nhận xét"
        emptyText="Lớp học chưa có nhận xét nào"
        minWidthClassName="min-w-200"
      />
      <TablePagination
        total={total}
        page={filters.comments_page}
        perPage={perPage}
        unit="nhận xét"
        onChange={handleChangePage}
      />
    </div>
  );
};

export default ClassCommentsPanel;
