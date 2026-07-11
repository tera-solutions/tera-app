import { useRef, useState } from "react";
import { ArrowUpTrayOutlined, DocumentTextOutlined, notification, Spin } from "tera-dls";

import { FileAPI } from "@tera/api/common/FileAPI";
import { MaterialService } from "@tera/modules/education";

import { ATTACHMENT_ACCEPT, ATTACHMENT_MAX_SIZE, materialTypeOf } from "../constants";

interface UploadAttachmentProps {
  /** Entity the uploaded material is attached to, e.g. an assignment id. */
  entityType: "assignment";
  entityId: number;
  onUploaded?: () => void;
}

/** Uploads a file to the shared file service, registers it as a Material, then attaches it to the given entity. */
const UploadAttachment = ({ entityType, entityId, onUploaded }: UploadAttachmentProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<string[]>([]);
  const [error, setError] = useState("");

  const { mutateAsync: createMaterial } = MaterialService.useMaterialCreate();
  const { mutateAsync: attachMaterial } = MaterialService.useMaterialAttach();

  const uploadOne = async (file: File) => {
    setPending((prev) => [...prev, file.name]);
    try {
      const uploaded = await FileAPI.upload(file, { title: file.name });
      const material = await createMaterial({
        params: {
          material_name: file.name,
          material_type: materialTypeOf(file.name),
          access_type: "student",
          file_id: uploaded.id,
          file_name: file.name,
          file_size: file.size,
        },
      });
      const materialId = (material as any)?.data?.id;
      if (materialId) {
        await attachMaterial({ id: materialId, entity_type: entityType, entity_id: entityId });
      }
      notification.success({ message: `Đã đính kèm "${file.name}"` });
      onUploaded?.();
    } catch (err: any) {
      notification.error({
        message: err?.data?.msg ?? err?.message ?? `Đính kèm "${file.name}" thất bại`,
      });
    } finally {
      setPending((prev) => prev.filter((name) => name !== file.name));
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;

    const tooBig = picked.find((f) => f.size > ATTACHMENT_MAX_SIZE);
    if (tooBig) {
      setError(`File quá lớn (tối đa 10MB): ${tooBig.name}`);
      return;
    }
    setError("");
    picked.forEach(uploadOne);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 px-3 py-2.5 text-sm text-slate-500 hover:border-brand hover:text-brand [&_svg]:h-4 [&_svg]:w-4"
      >
        <ArrowUpTrayOutlined />
        Đính kèm tài liệu (pdf, doc, ppt, ảnh — tối đa 10MB)
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ATTACHMENT_ACCEPT}
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
              <span className="shrink-0 text-[11px] text-slate-400">Đang tải...</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UploadAttachment;
