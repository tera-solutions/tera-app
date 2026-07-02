import { useRef, useState } from "react";
import {
  ArrowUpTrayOutlined,
  DocumentTextOutlined,
  notification,
  Spin,
} from "tera-dls";

import { LessonMaterialService } from "@tera/modules/education";
import { materialTypeOf } from "_common/utils/material";

import { MATERIAL_ACCEPT, MATERIAL_MAX_SIZE } from "../constants";

interface MaterialUploaderProps {
  lessonId: number;
}

/** Uploads the file to the shared file service, then attaches it to the lesson. */
const MaterialUploader = ({ lessonId }: MaterialUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<string[]>([]);
  const [error, setError] = useState("");

  const { mutateAsync: uploadFile } =
    LessonMaterialService.useLessonMaterialUpload();
  const { mutateAsync: attachMaterial } =
    LessonMaterialService.useLessonMaterialAttach();

  const attach = async (file: File) => {
    console.log(file)

    setPending((prev) => [...prev, file.name]);
    try {
      const uploaded = await uploadFile(file);
      await attachMaterial({
        lessonId,
        file_id: uploaded.id,
        material_type: materialTypeOf(file.name),
      });
      notification.success({ message: `Đã đính kèm "${file.name}"` });
    } catch (err: any) {
      notification.error({
        message: err?.msg ?? err?.message ?? `Đính kèm "${file.name}" thất bại`,
      });
    } finally {
      setPending((prev) => prev.filter((name) => name !== file.name));
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;

    const tooBig = picked.find((f) => f.size > MATERIAL_MAX_SIZE);
    if (tooBig) {
      setError(`File quá lớn (tối đa 10MB): ${tooBig.name}`);
      return;
    }
    setError("");
    picked.forEach(attach);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 px-3 py-2.5 text-sm text-slate-500 hover:border-brand hover:text-brand [&_svg]:h-4 [&_svg]:w-4"
      >
        <ArrowUpTrayOutlined />
        Tải tài liệu (pdf, doc, ppt, ảnh — tối đa 10MB)
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={MATERIAL_ACCEPT}
        className="hidden"
        onChange={handleSelect}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      {pending.length > 0 && (
        <ul className="flex flex-col gap-1">
          {pending.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 [&_svg]:h-4 [&_svg]:w-4"
            >
              <Spin spinning size="small" />
              <DocumentTextOutlined className="shrink-0 text-brand" />
              <span className="min-w-0 flex-1 truncate">{name}</span>
              <span className="shrink-0 text-[11px] text-slate-400">
                Đang tải...
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MaterialUploader;
