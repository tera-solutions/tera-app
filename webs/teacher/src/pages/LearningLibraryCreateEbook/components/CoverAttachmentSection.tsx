import { useRef } from "react";
import { ArrowDownTrayOutlined, Button, CloudArrowUpOutlined, InformationCircleOutlined, PaperClipOutlined, PlusOutlined, TrashOutlined, XMarkOutlined, notification } from "tera-dls";

import Card from "_common/components/Card";

import type { AttachmentDraft } from "../_interface";

let attachmentIdCounter = 0;

interface CoverAttachmentSectionProps {
  title: string;
  gradient: string;
  emoji: string;
  customCoverUrl: string;
  onUploadCover: (file?: File) => void;
  onRemoveCover: () => void;
  attachments: AttachmentDraft[];
  onChangeAttachments: (attachments: AttachmentDraft[]) => void;
}

const CoverAttachmentSection = ({
  title,
  gradient,
  emoji,
  customCoverUrl,
  onUploadCover,
  onRemoveCover,
  attachments,
  onChangeAttachments,
}: CoverAttachmentSectionProps) => {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const handleAddAttachment = (file?: File) => {
    if (!file) return;
    attachmentIdCounter += 1;
    onChangeAttachments([
      ...attachments,
      { id: `att-new-${attachmentIdCounter}`, name: file.name, sizeLabel: `${(file.size / (1024 * 1024)).toFixed(1)} MB` },
    ]);
  };

  const handleRemoveAttachment = (id: string) => onChangeAttachments(attachments.filter((a) => a.id !== id));

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-800">4. Ảnh bìa &amp; Tệp đính kèm</p>

      <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
        Ảnh bìa ebook
        <span title="Ảnh hiển thị làm trang bìa và thumbnail của ebook">
          <InformationCircleOutlined className="h-3.5 w-3.5 text-slate-300" />
        </span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-4xl ${gradient}`}>
          {customCoverUrl ? (
            <img src={customCoverUrl} alt="Ảnh bìa" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1 px-2 text-center">
              <span>{emoji}</span>
              <span className="text-sm font-bold leading-tight text-white drop-shadow">{title || "Tiêu đề ebook"}</span>
            </div>
          )}
          {customCoverUrl && (
            <button
              type="button"
              onClick={onRemoveCover}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <XMarkOutlined className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => coverInputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 px-3 text-center hover:border-brand"
        >
          <CloudArrowUpOutlined className="h-7 w-7 text-slate-300" />
          <p className="text-xs text-slate-500">
            Kéo &amp; thả ảnh vào đây
            <br />
            hoặc <span className="font-medium text-brand">Browse</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Định dạng: JPG, PNG
            <br />
            Kích thước tối ưu: 1200x1600px
          </p>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(e) => onUploadCover(e.target.files?.[0])}
          />
        </div>
      </div>

      <p className="mb-2 mt-4 text-sm font-medium text-slate-700">Tệp đính kèm (PDF, Worksheet, Audio....)</p>
      <div className="flex flex-col gap-2">
        {attachments.map((att) => (
          <div key={att.id} className="flex items-center gap-2.5 rounded-lg border border-slate-100 px-3 py-2">
            <PaperClipOutlined className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{att.name}</span>
            <span className="shrink-0 text-xs text-slate-400">{att.sizeLabel}</span>
            <button
              type="button"
              onClick={() => notification.success({ message: `Đang tải xuống "${att.name}"...` })}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-sky-50 hover:text-brand"
            >
              <ArrowDownTrayOutlined className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleRemoveAttachment(att.id)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-500"
            >
              <TrashOutlined className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Button
        outlined
        icon={<PlusOutlined />}
        className="mt-3 w-full border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
        onClick={() => attachmentInputRef.current?.click()}
      >
        Thêm tệp đính kèm
      </Button>
      <input
        ref={attachmentInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          handleAddAttachment(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </Card>
  );
};

export default CoverAttachmentSection;
