import { useRef } from "react";
import { InformationCircleOutlined, PhotoOutlined, SparklesOutlined, TrashOutlined, XMarkOutlined } from "tera-dls";

interface FrontImageEditorProps {
  emoji: string;
  gradient: string;
  imageUrl: string;
  onUpload: (file?: File) => void;
  onRemove: () => void;
  onOpenLibrary: () => void;
  onAiGenerate: () => void;
}

const FrontImageEditor = ({
  emoji,
  gradient,
  imageUrl,
  onUpload,
  onRemove,
  onOpenLibrary,
  onAiGenerate,
}: FrontImageEditorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="mb-2 flex items-center gap-1 text-sm font-medium text-slate-700">
        Mặt trước (Front)
        <span title="Ảnh minh họa hiển thị ở mặt trước thẻ">
          <InformationCircleOutlined className="h-3.5 w-3.5 text-slate-300" />
        </span>
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 px-3 text-center hover:border-brand"
        >
          <PhotoOutlined className="h-8 w-8 text-slate-300" />
          <p className="text-xs text-slate-500">Tải ảnh lên hoặc kéo thả vào đây</p>
          <p className="text-[11px] text-slate-400">
            Định dạng: JPG, PNG, WEBP
            <br />
            Kích thước đề xuất: 800x800px
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => onUpload(e.target.files?.[0])}
          />
        </div>

        <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-6xl ${gradient}`}>
          {imageUrl ? (
            <img src={imageUrl} alt="Mặt trước" className="h-full w-full object-cover" />
          ) : (
            <span>{emoji}</span>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-slate-500 hover:bg-white"
          >
            <XMarkOutlined className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={onOpenLibrary}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-1.5 text-xs text-slate-600 hover:border-brand hover:text-brand"
        >
          <PhotoOutlined className="h-3.5 w-3.5" /> Thư viện ảnh
        </button>
        <button
          type="button"
          onClick={onAiGenerate}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand/40 bg-sky-50 py-1.5 text-xs text-brand hover:border-brand"
        >
          <SparklesOutlined className="h-3.5 w-3.5" /> AI tạo ảnh
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-1.5 text-xs text-slate-600 hover:border-rose-300 hover:text-rose-500"
        >
          <TrashOutlined className="h-3.5 w-3.5" /> Xóa ảnh
        </button>
      </div>
    </div>
  );
};

export default FrontImageEditor;
