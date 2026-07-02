import { useState } from "react";
import { ArrowDownTrayOutlined, notification, Spin, TrashOutlined } from "tera-dls";

import { FileAPI } from "@tera/api/common/FileAPI";

import type { LessonMaterial } from "../_interface";
import { DEFAULT_MATERIAL_STYLE, MATERIAL_STYLE } from "../constants";

interface MaterialListProps {
  materials: LessonMaterial[];
  onDelete?: (material: LessonMaterial) => void;
  deletingId?: number | string | null;
}

const MaterialList = ({ materials, onDelete, deletingId }: MaterialListProps) => {
  const [downloadingId, setDownloadingId] = useState<number | string | null>(
    null,
  );

  const handleDownload = async (material: LessonMaterial) => {
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

  if (materials.length === 0) {
    return (
      <p className="text-sm text-slate-400">Chưa có tài liệu đính kèm.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {materials.map((material) => {
        const style = MATERIAL_STYLE[material.ext] ?? DEFAULT_MATERIAL_STYLE;
        const meta = [style.label, material.size].filter(Boolean).join(" • ");
        return (
          <div
            key={material.id}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${style.badge}`}
            >
              {style.label}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700">
                {material.name}
              </p>
              <p className="text-xs text-slate-400">{meta}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {downloadingId === material.id ? (
                <span className="flex h-8 w-8 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
                  <Spin spinning size="small" />
                </span>
              ) : material.file_id ? (
                <button
                  type="button"
                  onClick={() => handleDownload(material)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-brand hover:bg-sky-50 [&_svg]:h-4 [&_svg]:w-4"
                  title="Tải xuống"
                >
                  <ArrowDownTrayOutlined />
                </button>
              ) : (
                <span className="flex h-8 w-8 items-center justify-center text-slate-300 [&_svg]:h-4 [&_svg]:w-4">
                  <ArrowDownTrayOutlined />
                </span>
              )}

              {onDelete &&
                (deletingId === material.id ? (
                  <span className="flex h-8 w-8 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
                    <Spin spinning size="small" />
                  </span>
                ) : (
                  <button
                    type="button"
                    title="Xóa"
                    onClick={() => onDelete(material)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 [&_svg]:h-4 [&_svg]:w-4"
                  >
                    <TrashOutlined />
                  </button>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MaterialList;
