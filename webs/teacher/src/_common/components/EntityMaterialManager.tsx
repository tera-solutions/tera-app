import { useMemo, useState } from "react";
import { ArrowDownTrayOutlined, DocumentTextOutlined, notification, Spin, TrashOutlined } from "tera-dls";

import { FileAPI } from "@tera/api/common/FileAPI";
import { MaterialService } from "@tera/modules/education";

import MaterialSelect from "_common/components/MaterialSelect";
import { formatFileSize } from "pages/Material/_utils";

type MaterialEntityType = "course" | "lesson_plan" | "lesson" | "assignment" | "evaluation";

interface AttachedMaterial {
  id: number;
  mappingId: number | null;
  name: string;
  fileId: number | string | null;
  fileName: string | null;
  fileSize: number | null;
}

interface EntityMaterialManagerProps {
  entityType: MaterialEntityType;
  entityId: number;
  emptyText?: string;
  /** Hides the attach picker and detach buttons — download-only preview. */
  readOnly?: boolean;
}

/**
 * Replaces the old per-page "upload your own file" widgets — every material
 * now lives in the shared bank (`/materials`); this only lets a teacher pick
 * an existing one and link/unlink it here (`edu_material_mappings`), so
 * there's one file, one status/version history, wherever it's used.
 */
const EntityMaterialManager = ({ entityType, entityId, emptyText, readOnly }: EntityMaterialManagerProps) => {
  const [downloadingId, setDownloadingId] = useState<number | string | null>(null);
  const [pickedId, setPickedId] = useState<number | string | undefined>(undefined);

  const query = MaterialService.useMaterialList({
    params: { per_page: 50, filters: { entity_type: entityType, entity_id: entityId } },
  });
  const materials: AttachedMaterial[] = useMemo(
    () =>
      (query.data?.data?.items ?? []).map((item: any) => ({
        id: item.id,
        mappingId:
          (item.mappings ?? []).find(
            (m: any) => m.entity_type === entityType && Number(m.entity_id) === Number(entityId),
          )?.id ?? null,
        name: item.material_name ?? "",
        fileId: item.current_file?.file_id ?? null,
        fileName: item.current_file?.file_name ?? null,
        fileSize: item.current_file?.file_size ?? null,
      })),
    [query.data, entityType, entityId],
  );

  const { mutate: attach, isPending: isAttaching } = MaterialService.useMaterialAttach();
  const { mutate: detach } = MaterialService.useMaterialDetachMapping();
  const [detachingId, setDetachingId] = useState<number | null>(null);

  const handlePick = (materialId: number | string | undefined) => {
    if (!materialId) return;
    attach(
      { id: materialId, entity_type: entityType, entity_id: entityId },
      {
        onSuccess: () => {
          notification.success({ message: "Đã đính kèm tài liệu" });
          setPickedId(undefined);
        },
        onError: (err: any) =>
          notification.error({ message: err?.data?.msg ?? err?.message ?? "Đính kèm tài liệu thất bại" }),
      },
    );
  };

  const handleDetach = (material: AttachedMaterial) => {
    if (!material.mappingId) return;
    setDetachingId(material.id);
    detach(
      { id: material.mappingId },
      {
        onSuccess: () => notification.success({ message: "Đã gỡ tài liệu" }),
        onError: (err: any) =>
          notification.error({ message: err?.data?.msg ?? err?.message ?? "Gỡ tài liệu thất bại" }),
        onSettled: () => setDetachingId(null),
      },
    );
  };

  const handleDownload = async (material: AttachedMaterial) => {
    if (!material.fileId) return;
    setDownloadingId(material.id);
    try {
      const file = await FileAPI.download(material.fileId);
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

  return (
    <div className="flex flex-col gap-2">
      {query.isLoading ? (
        <Spin spinning>
          <div className="h-10" />
        </Spin>
      ) : materials.length === 0 ? (
        <p className="text-sm text-slate-400">{emptyText ?? "Chưa có tài liệu đính kèm."}</p>
      ) : (
        materials.map((material) => (
          <div
            key={material.id}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-brand [&_svg]:h-4.5 [&_svg]:w-4.5">
              <DocumentTextOutlined />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700">{material.name || "—"}</p>
              {material.fileName && (
                <p className="text-[11px] text-slate-400">
                  {material.fileName}
                  {material.fileSize ? ` · ${formatFileSize(material.fileSize)}` : ""}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {downloadingId === material.id ? (
                <Spin spinning size="small" />
              ) : (
                <button
                  type="button"
                  title="Tải xuống"
                  disabled={!material.fileId}
                  onClick={() => handleDownload(material)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand disabled:cursor-not-allowed disabled:text-slate-200 [&_svg]:h-4.5 [&_svg]:w-4.5"
                >
                  <ArrowDownTrayOutlined />
                </button>
              )}
              {!readOnly &&
                (detachingId === material.id ? (
                  <Spin spinning size="small" />
                ) : (
                  <button
                    type="button"
                    title="Gỡ tài liệu"
                    disabled={!material.mappingId}
                    onClick={() => handleDetach(material)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:text-slate-200 [&_svg]:h-4 [&_svg]:w-4"
                  >
                    <TrashOutlined />
                  </button>
                ))}
            </div>
          </div>
        ))
      )}

      {!readOnly && (
        <MaterialSelect
          value={pickedId}
          onChange={(v) => {
            setPickedId(v);
            handlePick(v);
          }}
          placeholder={isAttaching ? "Đang đính kèm..." : "Chọn tài liệu để đính kèm"}
        />
      )}
    </div>
  );
};

export default EntityMaterialManager;
