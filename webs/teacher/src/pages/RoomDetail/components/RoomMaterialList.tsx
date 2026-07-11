import { useState } from "react";
import { ArrowDownTrayOutlined, DocumentTextOutlined, notification, Spin } from "tera-dls";

import EmptyState from "_common/components/EmptyState";
import ErrorRetry from "_common/components/ErrorRetry";
import { FileAPI } from "@tera/api/common/FileAPI";
import { MaterialService } from "@tera/modules/education";

interface RoomMaterialListProps {
  courseId?: number | null;
}

const RoomMaterialList = ({ courseId }: RoomMaterialListProps) => {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const query = MaterialService.useMaterialList(
    { params: { per_page: 20, filters: { entity_type: "course", entity_id: courseId } } },
    { enabled: !!courseId },
  );
  const { isLoading, isError, refetch } = query;
  const materials = query.data?.data?.items ?? [];

  const handleDownload = async (material: any) => {
    const fileId = material.current_file?.file_id;
    if (!fileId) return;
    setDownloadingId(material.id);
    try {
      const file = await FileAPI.download(fileId);
      const link = document.createElement("a");
      link.href = file.src;
      link.download = file.name || material.material_name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      notification.error({ message: err?.msg ?? err?.message ?? "Tải tài liệu thất bại" });
    } finally {
      setDownloadingId(null);
    }
  };

  if (!courseId) {
    return <EmptyState description="Không có tài liệu cho buổi học này" className="py-6" />;
  }

  if (isLoading) {
    return (
      <Spin spinning>
        <div className="h-20" />
      </Spin>
    );
  }

  if (isError) {
    return (
      <div className="flex h-20 items-center justify-center">
        <ErrorRetry onRetry={() => refetch()} message="Không tải được tài liệu" />
      </div>
    );
  }

  if (materials.length === 0) {
    return <EmptyState description="Chưa có tài liệu nào" className="py-6" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {materials.map((m: any) => (
        <div
          key={m.id}
          className="flex items-center gap-2 rounded-xl border border-slate-100 p-2.5"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-brand [&_svg]:h-4 [&_svg]:w-4">
            <DocumentTextOutlined />
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
            {m.material_name || "—"}
          </p>
          {downloadingId === m.id ? (
            <Spin spinning size="small" />
          ) : (
            <button
              type="button"
              title="Tải xuống"
              disabled={!m.current_file?.file_id}
              onClick={() => handleDownload(m)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand disabled:cursor-not-allowed disabled:text-slate-200 [&_svg]:h-4.5 [&_svg]:w-4.5"
            >
              <ArrowDownTrayOutlined />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default RoomMaterialList;
