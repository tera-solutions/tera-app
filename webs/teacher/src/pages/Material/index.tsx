import { useMemo, useState } from "react";
import moment from "moment";
import { Button, CloudArrowUpOutlined, FolderPlusOutlined, notification } from "tera-dls";

import Card from "_common/components/Card";
import SearchInput from "_common/components/SearchInput";
import SortControl from "_common/components/SortControl";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { MaterialService } from "@tera/modules/education";
import useConfirm from "_common/hooks/useConfirm";

import type { MaterialRow, MaterialSortBy, MaterialSortDir } from "./_interface";
import { MATERIAL_SORT_OPTIONS, MATERIAL_STAT_SEGMENTS } from "./constants";
import { summarizeMaterials, toMaterials } from "./_utils";
import MaterialTable from "./components/MaterialTable";
import MaterialFilterSidebar from "./components/MaterialFilterSidebar";
import UploadMaterialModal from "./components/UploadMaterialModal";

/** Backend has no material summary endpoint — fetch a wide page to derive stat
 * cards + "recent materials" client-side, same pattern as Wallet's summary fetch. */
const SUMMARY_FETCH_SIZE = 100;

const Material = () => {
  const confirm = useConfirm();
  const [uploadOpen, setUploadOpen] = useState(false);

  const [filters, setFilters] = useUrlFilters(
    {
      search: { type: "string", default: "" },
      type: { type: "string", default: "" },
      sort_by: { type: "string", default: "created_at" as MaterialSortBy },
      sort_dir: { type: "string", default: "desc" as MaterialSortDir },
      page: { type: "number", default: 1 },
      per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );
  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  const summaryQuery = MaterialService.useMaterialList({
    params: { page: 1, per_page: SUMMARY_FETCH_SIZE, sort_by: "updated_at", sort_dir: "desc" },
  });
  const summaryItems = useMemo(() => toMaterials(summaryQuery.data), [summaryQuery.data]);
  const summary = useMemo(() => summarizeMaterials(summaryItems), [summaryItems]);
  const recentItems = useMemo(() => summaryItems.slice(0, 5), [summaryItems]);

  const listParams: Record<string, unknown> = {
    page: filters.page,
    per_page: filters.per_page,
    search: filters.search || undefined,
    material_type: filters.type || undefined,
    sort_by: filters.sort_by,
    sort_dir: filters.sort_dir,
  };
  const listQuery = MaterialService.useMaterialList({ params: listParams });
  const { isLoading, isFetching, isError, refetch } = listQuery;
  const items = useMemo(() => toMaterials(listQuery.data), [listQuery.data]);
  const total = listQuery.data?.data?.pagination?.total ?? items.length;
  const perPage = listQuery.data?.data?.pagination?.per_page ?? filters.per_page;

  const { mutate: deleteMaterial } = MaterialService.useMaterialDelete();

  const handleDelete = (row: MaterialRow) => {
    confirm.warning({
      title: "Xóa tài liệu",
      content: `Bạn có chắc muốn xóa "${row.name}"?`,
      onOk: () =>
        deleteMaterial(
          { id: row.id },
          {
            onSuccess: () => notification.success({ message: "Đã xóa tài liệu" }),
            onError: (error: any) =>
              notification.error({
                message: error?.data?.msg ?? error?.message ?? "Không thể xóa tài liệu",
              }),
          },
        ),
    });
  };

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) setFilters({ per_page: nextSize, page: 1 });
    else setFilters({ page: nextPage });
  };

  const handleSegmentClick = (types: string[] | null) =>
    setFilters({ type: types?.length === 1 ? types[0] : "", page: 1 });

  const toggleSortDir = () =>
    setFilters({ sort_dir: filters.sort_dir === "asc" ? "desc" : "asc" });

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Tài liệu &amp; học liệu</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý và chia sẻ tài liệu, học liệu dạy học
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            outlined
            icon={<FolderPlusOutlined />}
            onClick={() =>
              notification.warning({ message: "Tính năng đang được phát triển" })
            }
            className="text-brand border-brand hover:bg-brand"
          >
            Tạo thư mục
          </Button>
          <Button
            icon={<CloudArrowUpOutlined />}
            onClick={() => setUploadOpen(true)}
            className="whitespace-nowrap bg-brand hover:bg-brand/80"
          >
            Tải tài liệu lên
          </Button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {MATERIAL_STAT_SEGMENTS.map((segment) => {
          const count =
            segment.types === null
              ? summary.total
              : segment.types.reduce((sum, t) => sum + (summary.byType[t] ?? 0), 0);
          return (
            <button
              key={segment.key}
              type="button"
              onClick={() => handleSegmentClick(segment.types)}
              className="rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm transition-colors hover:border-brand/40"
            >
              <p className="text-lg font-bold text-slate-800">{count}</p>
              <p className="text-xs font-medium text-slate-500">{segment.label}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <Card>
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Tìm kiếm tài liệu..."
              wrapperClassName="flex-1"
            />
            <SortControl
              sortBy={filters.sort_by}
              sortDir={filters.sort_dir}
              options={MATERIAL_SORT_OPTIONS}
              onSortByChange={(value) => setFilters({ sort_by: value as MaterialSortBy })}
              onToggleDir={toggleSortDir}
            />
          </div>

          <MaterialTable
            items={items}
            loading={isLoading || isFetching}
            isError={isError}
            onRetry={() => refetch()}
            onView={() => undefined}
            onDelete={handleDelete}
          />

          <TablePagination
            total={total}
            page={filters.page}
            perPage={perPage}
            unit="tài liệu"
            onChange={handleChangePage}
          />
        </Card>

        <div className="hidden flex-col gap-4 xl:flex">
          <MaterialFilterSidebar
            draft={{ type: filters.type }}
            onChange={(patch) => setFilters({ ...patch, page: 1 })}
            onReset={() => setFilters({ type: "", page: 1 })}
          />

          <Card>
            <p className="mb-3 text-sm font-semibold text-slate-700">Tài liệu gần đây</p>
            <div className="flex flex-col gap-3">
              {recentItems.length === 0 && (
                <p className="text-xs text-slate-400">Chưa có tài liệu nào</p>
              )}
              {recentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2">
                  <p className="min-w-0 flex-1 truncate text-sm text-slate-700">{item.name}</p>
                  <p className="shrink-0 text-xs text-slate-400">
                    {item.updatedAt ? moment(item.updatedAt).format("DD/MM/YYYY") : "—"}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <UploadMaterialModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
};

export default Material;
