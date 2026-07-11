import { useRef } from "react";
import { PaperClipOutlined, notification } from "tera-dls";

import type { Attachment } from "../_interface";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPT = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png";

interface AttachmentUploadProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  disabled?: boolean;
}

/**
 * Picks local files and turns them into pending Attachments on the message
 * draft. Messages has no backend file/material service yet (mock-data page),
 * so files are held as local object URLs rather than uploaded anywhere.
 */
const AttachmentUpload = ({ attachments, onChange, disabled }: AttachmentUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;

    const tooBig = picked.find((f) => f.size > MAX_SIZE);
    if (tooBig) {
      notification.error({ message: `File quá lớn (tối đa 10MB): ${tooBig.name}` });
      return;
    }

    const next: Attachment[] = picked.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.type || file.name.split(".").pop() || "file",
      url: URL.createObjectURL(file),
    }));
    onChange([...attachments, ...next]);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 disabled:opacity-40 [&_svg]:h-5 [&_svg]:w-5"
      >
        <PaperClipOutlined />
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT}
        className="hidden"
        onChange={handleSelect}
      />
    </>
  );
};

export default AttachmentUpload;
