import { useRef } from "react";
import { CloudArrowUpOutlined, XMarkOutlined } from "tera-dls";

import Card from "_common/components/Card";

interface ThumbnailSectionProps {
  title: string;
  gradient: string;
  customImageUrl: string;
  onUpload: (file?: File) => void;
  onRemove: () => void;
}

const ThumbnailSection = ({ title, gradient, customImageUrl, onUpload, onRemove }: ThumbnailSectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-800">6. Ảnh đại diện (Thumbnail)</p>

      <div className="grid grid-cols-2 gap-3">
        <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${gradient}`}>
          {customImageUrl ? (
            <img src={customImageUrl} alt="Ảnh đại diện" className="h-full w-full object-cover" />
          ) : (
            <p className="px-3 text-center text-lg font-extrabold leading-tight text-white drop-shadow">
              {title || "Tiêu đề audio"}
            </p>
          )}
          {customImageUrl && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <XMarkOutlined className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 px-3 text-center hover:border-brand"
        >
          <CloudArrowUpOutlined className="h-7 w-7 text-slate-300" />
          <p className="text-xs text-slate-500">Tải ảnh lên hoặc kéo thả vào đây</p>
          <p className="text-[11px] text-slate-400">Định dạng: JPG, PNG | Kích thước tối đa: 2MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(e) => onUpload(e.target.files?.[0])}
          />
        </div>
      </div>
    </Card>
  );
};

export default ThumbnailSection;
