import { useMemo, useState } from "react";
import { ArrowDownTrayOutlined, DocumentTextOutlined, notification, Spin } from "tera-dls";

import EmptyState from "_common/components/EmptyState";
import { FileAPI } from "@tera/api/common/FileAPI";
import { MaterialService } from "@tera/modules/education";

import type { ClassMaterial } from "pages/ClassroomDetail/_interface";
import { toClassMaterials } from "pages/ClassroomDetail/_utils";

const StudentMaterialsCard = ({ courseId }: { courseId: number | null }) => {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const query = MaterialService.useMaterialList(
    { params: { per_page: 5, filters: { entity_type: "course", entity_id: courseId } } },
    { enabled: !!courseId },
  );
  const materials = useMemo(
    () => toClassMaterials(query.data?.data?.items, undefined),
    [query.data],
  );

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
      notification.error({ message: err?.msg ?? err?.message ?? "Tải tài liệu thất bại" });
    } finally {
      setDownloadingId(null);
    }
  };

  if (!courseId || (!query.isLoading && materials.length === 0)) {
    return <EmptyState description="Chưa có tài liệu học tập" className="py-6" />;
  }

  return (
    <Spin spinning={query.isLoading}>
      <div className="flex flex-col gap-2">
        {materials.map((m) => (
          <div key={m.id} className="flex items-center gap-2.5 rounded-xl border border-slate-100 p-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-brand [&_svg]:h-4.5 [&_svg]:w-4.5">
              <DocumentTextOutlined />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700">{m.name || "—"}</p>
              {m.file_size && <p className="text-[11px] text-slate-400">{m.file_size}</p>}
            </div>
            {downloadingId === m.id ? (
              <Spin spinning size="small" />
            ) : (
              <button
                type="button"
                title="Tải xuống"
                disabled={!m.file_id}
                onClick={() => handleDownload(m)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand disabled:cursor-not-allowed disabled:text-slate-200 [&_svg]:h-4.5 [&_svg]:w-4.5"
              >
                <ArrowDownTrayOutlined />
              </button>
            )}
          </div>
        ))}
      </div>
    </Spin>
  );
};

export default StudentMaterialsCard;
