import { useRef, useState } from "react";
import { CheckCircleSolid, CloudArrowUpOutlined, XMarkOutlined } from "tera-dls";

import Card from "_common/components/Card";

const ACCEPT = "video/mp4,video/quicktime,audio/mpeg,audio/wav";
const MAX_SIZE_MB = 500;

const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const ResourceUploadSection = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [duration, setDuration] = useState("--:--");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = (picked?: File | null) => {
    if (!picked) return;
    if (picked.size > MAX_SIZE_MB * 1024 * 1024) return;
    setFile(picked);
    setPreviewUrl(URL.createObjectURL(picked));
    setDuration("--:--");
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-800">2. Tài nguyên học liệu</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex min-h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
            isDragOver ? "border-brand bg-sky-50" : "border-slate-200 hover:border-brand"
          }`}
        >
          <CloudArrowUpOutlined className="h-9 w-9 text-slate-300" />
          <p className="text-sm text-slate-500">
            Kéo &amp; thả file video/audio vào đây
            <br />
            hoặc <span className="font-medium text-brand">Browse</span>
          </p>
          <p className="text-xs text-slate-400">Hỗ trợ: MP4, MOV, MP3, WAV | Tối đa {MAX_SIZE_MB}MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {file && (
          <div className="relative overflow-hidden rounded-xl border border-slate-100">
            <div className="relative aspect-video bg-black">
              <video
                src={previewUrl}
                muted
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => setDuration(formatDuration(e.currentTarget.duration))}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[11px] text-white">
                {duration}
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <XMarkOutlined className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-700">{file.name}</p>
                <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
              </div>
              <CheckCircleSolid className="h-5 w-5 shrink-0 text-emerald-500" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResourceUploadSection;
