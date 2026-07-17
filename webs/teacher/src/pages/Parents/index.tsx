import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { AcademicCapOutlined, Button, notification, PlusOutlined, RectangleGroupOutlined, UserGroupOutlined } from "tera-dls";

import Card from "_common/components/Card";
import QuotaMeter from "_common/components/QuotaMeter";
import SearchInput from "_common/components/SearchInput";
import StatisticCard from "_common/components/StatisticCard";
import TablePagination from "_common/components/TablePagination";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import useConfirm from "_common/hooks/useConfirm";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { StudentAPI } from "@tera/api";
import { ClassRoomService } from "@tera/modules/education";
import { ParentService } from "@tera/modules/crm";

import type { ParentRow, RosterEntry } from "./_interface";
import { toParentRows, toParentSummary } from "./_utils";
import ParentTable from "./components/ParentTable";
import ParentFilterSidebar from "./components/ParentFilterSidebar";
import ParentForm from "./components/ParentForm";

const Parents = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ParentRow | null>(null);

  const { mutate: deleteParent } = ParentService.useParentDelete();

  const [filters, setFilters] = useUrlFilters(
    {
      search: { type: "string", default: "" },
      class_id: { type: "number", default: 0 },
      page: { type: "number", default: 1 },
      per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );

  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  // `crm/parent/list` has no teacher/class scoping (unlike Student/ClassRoom),
  // so the teacher's own roster is built by scanning their classes — same fix
  // used in Feedback/StudentDetail/Ranking.
  const classesQuery = ClassRoomService.useClassRoomList({ params: { per_page: 50 } });
  const classes = useMemo(() => classesQuery.data?.data?.items ?? [], [classesQuery.data]);

  const rosterQueries = useQueries({
    queries: classes.map((c: any) => ({
      queryKey: ["parents", "class-roster", c.id],
      queryFn: () => StudentAPI.getList({ params: { class_id: c.id, per_page: 100 } }),
      enabled: classes.length > 0,
    })),
  });
  const rosterLoading = classesQuery.isLoading || rosterQueries.some((q) => q.isLoading);

  const studentRosterMap = useMemo(() => {
    const map = new Map<number, RosterEntry>();
    classes.forEach((c: any, i: number) => {
      const items = (rosterQueries[i]?.data as any)?.data?.items ?? [];
      items.forEach((s: any) => {
        if (!map.has(s.id)) map.set(s.id, { class_id: c.id, class_name: c.name });
      });
    });
    return map;
  }, [classes, rosterQueries]);

  const rosterOptions = useMemo(
    () =>
      Array.from(studentRosterMap.entries()).map(([id, roster]) => {
        const student = classes
          .flatMap((_c: any, i: number) => (rosterQueries[i]?.data as any)?.data?.items ?? [])
          .find((s: any) => s.id === id);
        return { id, name: student?.name ?? `#${id}`, class_name: roster.class_name };
      }),
    [studentRosterMap, classes, rosterQueries],
  );

  const parentsQuery = ParentService.useParentList({ params: { per_page: 200 } });
  const isLoading = rosterLoading || parentsQuery.isLoading;

  const allRows = useMemo(
    () => toParentRows(parentsQuery.data?.data?.items, studentRosterMap),
    [parentsQuery.data, studentRosterMap],
  );

  const filteredRows = useMemo(() => {
    let rows = allRows;
    if (filters.class_id) {
      rows = rows.filter((r) => r.children.some((c) => c.class_id === filters.class_id));
    }
    const keyword = filters.search.trim().toLowerCase();
    if (keyword) {
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(keyword) ||
          r.phone.toLowerCase().includes(keyword) ||
          r.email.toLowerCase().includes(keyword),
      );
    }
    return rows;
  }, [allRows, filters.class_id, filters.search]);

  const summary = useMemo(() => toParentSummary(filteredRows), [filteredRows]);

  const perPage = filters.per_page;
  const pagedRows = useMemo(() => {
    const start = (filters.page - 1) * perPage;
    return filteredRows.slice(start, start + perPage);
  }, [filteredRows, filters.page, perPage]);

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) {
      setFilters({ per_page: nextSize, page: 1 });
    } else {
      setFilters({ page: nextPage });
    }
  };

  const handleView = (parent: ParentRow) => navigate(`${PATHS.parentDetail}/${parent.id}`);
  const handleMessage = () => navigate(PATHS.messages);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const handleEdit = (parent: ParentRow) => {
    setEditing(parent);
    setFormOpen(true);
  };
  const handleDelete = (parent: ParentRow) =>
    confirm.warning({
      title: "Xóa phụ huynh",
      content: `Xóa phụ huynh "${parent.name}"? Thao tác này không thể hoàn tác.`,
      onOk: () =>
        deleteParent(
          { id: parent.id },
          {
            onSuccess: () => notification.success({ message: "Đã xóa phụ huynh" }),
            onError: (error: any) =>
              notification.error({ message: error?.data?.msg ?? "Không thể xóa phụ huynh" }),
          },
        ),
    });

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Phụ huynh</h1>
          <p className="mt-0.5 text-sm text-slate-400">Quản lý liên lạc phụ huynh học viên</p>
        </div>
        <div className="flex items-center gap-2">
          <QuotaMeter
            resource="parents"
            used={parentsQuery.data?.data?.pagination?.total ?? allRows.length}
            unit="phụ huynh"
          />
          <Button icon={<PlusOutlined />} onClick={handleCreate}>
            Thêm phụ huynh
          </Button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatisticCard
          icon={<UserGroupOutlined />}
          value={summary.total_parents}
          label="Tổng phụ huynh"
          iconClassName="bg-sky-50 text-brand"
          loading={isLoading}
        />
        <StatisticCard
          icon={<AcademicCapOutlined />}
          value={summary.total_children}
          label="Con đang học"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<RectangleGroupOutlined />}
          value={summary.total_classes}
          label="Lớp liên quan"
          iconClassName="bg-violet-50 text-violet-500"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <Card>
          <SearchInput
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT..."
            wrapperClassName="mb-3"
          />
          <ParentTable
            items={pagedRows}
            loading={isLoading}
            isError={parentsQuery.isError}
            onRetry={() => parentsQuery.refetch()}
            onView={handleView}
            onMessage={handleMessage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <TablePagination
            total={filteredRows.length}
            page={filters.page}
            perPage={perPage}
            unit="phụ huynh"
            onChange={handleChangePage}
          />
        </Card>

        <div className="hidden xl:block">
          <ParentFilterSidebar
            classId={filters.class_id}
            onChange={(patch) => setFilters({ ...patch, page: 1 })}
            onReset={() => setFilters({ search: "", class_id: 0, page: 1 })}
            rows={filteredRows}
            loading={isLoading}
          />
        </div>
      </div>

      <ParentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        rosterOptions={rosterOptions}
        parent={editing}
      />
    </div>
  );
};

export default Parents;
