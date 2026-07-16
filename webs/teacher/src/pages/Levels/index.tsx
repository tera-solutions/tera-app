import { useMemo, useState } from "react";
import { Button, notification, PlusOutlined } from "tera-dls";

import Card from "_common/components/Card";
import SearchInput from "_common/components/SearchInput";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import useConfirm from "_common/hooks/useConfirm";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { LevelService } from "@tera/modules/education";

import LevelFormModal, { type LevelRow } from "./LevelFormModal";

interface LevelListRow extends LevelRow {
  course?: { name?: string } | null;
}

const Levels = () => {
  const confirm = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<LevelRow | null>(null);

  const [filters, setFilters] = useUrlFilters(
    {
      search: { type: "string", default: "" },
      page: { type: "number", default: 1 },
      per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );

  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  const query = LevelService.useLevelList({
    params: { search: filters.search || undefined, page: filters.page, per_page: filters.per_page },
  });
  const rows = useMemo<LevelListRow[]>(() => query.data?.data?.items ?? [], [query.data]);
  const total = query.data?.data?.pagination?.total ?? 0;

  const { mutate: suspend } = LevelService.useLevelSuspend();
  const { mutate: restore } = LevelService.useLevelRestore();

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (level: LevelListRow) => {
    setEditing(level);
    setModalOpen(true);
  };

  const toggleStatus = (level: LevelListRow) => {
    const isActive = level.status === "active";
    const fn = isActive ? suspend : restore;
    confirm.warning({
      title: isActive ? "Ngừng trình độ" : "Kích hoạt lại",
      content: isActive
        ? `Ngừng áp dụng trình độ "${level.level_name}"?`
        : `Kích hoạt lại trình độ "${level.level_name}"?`,
      onOk: () =>
        fn(
          { id: level.id },
          {
            onSuccess: () =>
              notification.success({ message: isActive ? "Đã ngừng trình độ" : "Đã kích hoạt lại" }),
            onError: (e: any) =>
              notification.error({ message: e?.data?.msg ?? "Có lỗi xảy ra" }),
          },
        ),
    });
  };

  const columns: TableColumn<LevelListRow>[] = [
    {
      key: "name",
      title: "Trình độ",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.level_name}</p>
          <p className="text-xs text-slate-400">{row.level_code}</p>
        </div>
      ),
    },
    {
      key: "course",
      title: "Khóa học",
      render: (row) => <span className="text-sm text-slate-600">{row.course?.name ?? "—"}</span>,
    },
    {
      key: "order",
      title: "Thứ tự",
      render: (row) => <span className="text-sm text-slate-600">{row.level_order}</span>,
    },
    {
      key: "cefr",
      title: "CEFR",
      render: (row) => <span className="text-sm text-slate-500">{row.cefr_level || "—"}</span>,
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            row.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
          }`}
        >
          {row.status === "active" ? "Đang áp dụng" : "Ngừng"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "",
      headerClassName: "px-4 py-3 text-right",
      cellClassName: "px-4 py-3 text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="text-xs font-medium text-brand hover:underline"
          >
            Sửa
          </button>
          <button
            type="button"
            onClick={() => toggleStatus(row)}
            className="text-xs font-medium text-slate-500 hover:underline"
          >
            {row.status === "active" ? "Ngừng" : "Kích hoạt"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Trình độ</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý cấp độ / trình độ học viên theo khóa học.
          </p>
        </div>
        <Button icon={<PlusOutlined />} onClick={openCreate} className="bg-brand hover:bg-brand/80">
          Thêm trình độ
        </Button>
      </div>

      <Card>
        <SearchInput
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Tìm trình độ..."
          wrapperClassName="mb-3 sm:w-72"
        />
        <Table
          columns={columns}
          data={rows}
          rowKey={(row) => row.id}
          isLoading={query.isLoading || query.isFetching}
          isError={query.isError}
          onRetry={() => query.refetch()}
          emptyText="Chưa có trình độ nào"
          minWidthClassName="min-w-[640px]"
        />
        <TablePagination
          total={total}
          page={filters.page}
          perPage={filters.per_page}
          unit="trình độ"
          onChange={(page, perPage) =>
            perPage !== filters.per_page
              ? setFilters({ per_page: perPage, page: 1 })
              : setFilters({ page })
          }
        />
      </Card>

      <LevelFormModal open={modalOpen} level={editing} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Levels;
