import { useMemo, useState } from "react";
import { ArrowDownTrayOutlined, notification, Spin } from "tera-dls";

import SearchInput from "_common/components/SearchInput";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { FileAPI } from "@tera/api/common/FileAPI";
import { MaterialService } from "@tera/modules/education";

import type { ClassMaterial } from "../_interface";
import { toClassMaterials } from "../_utils";

const MATERIAL_TYPE_META = "material_type";
const MATERIAL_STATUS_META = "material_status";

interface MaterialsPanelProps {
  courseId?: number;
  lessonPlanId?: number;
}

const MaterialsPanel = ({ courseId, lessonPlanId }: MaterialsPanelProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleDownload = async (material: ClassMaterial) => {
    if (!material.file_id) return;
    setDownloadingId(material.id);
    try {
      const file = await FileAPI.download(material.file_id);
      const link = document.createElement("a");
      link.href = file.src;
      link.download = file.name || material.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      notification.error({
        message: err?.msg ?? err?.message ?? "Tải tài liệu thất bại",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const courseQuery = MaterialService.useMaterialList(
    { params: { per_page: 100, filters: { entity_type: "course", entity_id: courseId } } },
    { enabled: !!courseId },
  );
  const lessonPlanQuery = MaterialService.useMaterialList(
    { params: { per_page: 100, filters: { entity_type: "lesson_plan", entity_id: lessonPlanId } } },
    { enabled: !!lessonPlanId },
  );

  const isLoading = courseQuery.isLoading || lessonPlanQuery.isLoading;
  const isError = courseQuery.isError || lessonPlanQuery.isError;

  const materials = useMemo(
    () =>
      toClassMaterials(
        courseQuery.data?.data?.items,
        lessonPlanQuery.data?.data?.items,
      ),
    [courseQuery.data, lessonPlanQuery.data],
  );

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return materials;
    return materials.filter((m) => m.name.toLowerCase().includes(keyword));
  }, [materials, search]);

  const total = filtered.length;
  const pagedMaterials = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage],
  );

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) {
      setPerPage(nextSize);
      setPage(1);
    } else {
      setPage(nextPage);
    }
  };

  const columns: TableColumn<ClassMaterial>[] = [
    {
      key: "name",
      title: "Tài liệu",
      render: (m) => (
        <>
          <p className="font-medium">{m.name || "—"}</p>
          {m.file_name && (
            <p className="mt-0.5 truncate text-xs text-slate-400">
              {m.file_name}
              {m.file_size && ` · ${m.file_size}`}
            </p>
          )}
          <div className="mt-1">
            <StatusBadge name={MATERIAL_TYPE_META} value={m.type} />
          </div>
        </>
      ),
    },
    {
      key: "category",
      title: "Danh mục",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (m) => m.category || "—",
    },
    {
      key: "version",
      title: "Phiên bản",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (m) => (m.version > 0 ? `v${m.version}` : "—"),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (m) => <StatusBadge name={MATERIAL_STATUS_META} value={m.status} />,
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (m) =>
        downloadingId === m.id ? (
          <span className="flex h-8 w-8 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
            <Spin spinning size="small" />
          </span>
        ) : (
          <button
            type="button"
            title="Tải xuống"
            disabled={!m.file_id}
            onClick={() => handleDownload(m)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand disabled:cursor-not-allowed disabled:text-slate-200 disabled:hover:bg-transparent [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <ArrowDownTrayOutlined />
          </button>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <SearchInput
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Tìm kiếm tài liệu..."
      />

      <Table
        columns={columns}
        data={pagedMaterials}
        rowKey={(m) => m.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => {
          courseQuery.refetch();
          lessonPlanQuery.refetch();
        }}
        errorMessage="Không tải được tài liệu"
        emptyText="Chưa có tài liệu nào cho lớp học này"
        minWidthClassName="min-w-[640px]"
      />

      <TablePagination
        total={total}
        page={page}
        perPage={perPage}
        unit="tài liệu"
        onChange={handleChangePage}
      />
    </div>
  );
};

export default MaterialsPanel;
