import { useRef, useState } from "react";
import { CloudArrowUpOutlined, PauseOutlined, PhotoOutlined, PlayOutlined, SpeakerWaveOutlined, TrashOutlined } from "tera-dls";

import Card from "_common/components/Card";

const WAVEFORM_HEIGHTS = [
  30, 55, 40, 70, 90, 60, 45, 75, 100, 65, 50, 80, 35, 60, 90, 55, 40, 70, 85, 50, 30, 60, 95, 45, 55, 75, 40, 65, 85, 50,
  35, 60, 90, 55, 45, 70, 80, 50, 30, 65,
];

const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

interface AudioUploadSectionProps {
  file: File | null;
  onUpload: (file?: File) => void;
  onRemove: () => void;
}

const AudioUploadSection = ({ file, onUpload, onRemove }: AudioUploadSectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState("--:--");
  const audioUrl = file ? URL.createObjectURL(file) : "";

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying((p) => !p);
  };

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-800">2. Nội dung audio</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Tệp audio</label>
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 px-3 text-center hover:border-brand"
          >
            <CloudArrowUpOutlined className="h-9 w-9 text-slate-300" />
            <p className="text-sm text-slate-500">
              Kéo &amp; thả file audio vào đây
              <br />
              hoặc <span className="font-medium text-brand">Browse</span>
            </p>
            <p className="text-xs text-slate-400">Hỗ trợ: MP3, WAV, M4A | Tối đa 100MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="audio/mpeg,audio/wav,audio/x-m4a,audio/mp4"
              className="hidden"
              onChange={(e) => onUpload(e.target.files?.[0])}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Trình phát &amp; Kiểm tra</label>
          <div className="rounded-xl border border-slate-100 p-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!file}
                onClick={togglePlay}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white disabled:opacity-40 [&_svg]:h-4 [&_svg]:w-4"
              >
                {playing ? <PauseOutlined /> : <PlayOutlined />}
              </button>
              <span className="w-10 shrink-0 text-xs text-slate-400">00:00</span>
              <div className="flex h-8 flex-1 items-center gap-[2px] overflow-hidden">
                {WAVEFORM_HEIGHTS.map((h, i) => (
                  <span
                    key={i}
                    className="w-[3px] shrink-0 rounded-full bg-sky-300"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <span className="w-10 shrink-0 text-right text-xs text-slate-400">{duration}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <SpeakerWaveOutlined className="h-4 w-4 shrink-0 text-slate-400" />
              <input type="range" min={0} max={100} defaultValue={80} className="flex-1 accent-brand" />
            </div>

            {file ? (
              <audio
                ref={audioRef}
                src={audioUrl}
                onLoadedMetadata={(e) => setDuration(formatDuration(e.currentTarget.duration))}
                onEnded={() => setPlaying(false)}
                className="hidden"
              />
            ) : null}
          </div>

          {file ? (
            <>
              <p className="mt-2 text-sm text-slate-600">Tên file: {file.name}</p>
              <p className="text-xs text-slate-400">Dung lượng: {formatSize(file.size)}</p>

              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-brand hover:text-brand"
                >
                  <PhotoOutlined className="h-4 w-4" /> Thay file
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-sm text-rose-500 hover:border-rose-400"
                >
                  <TrashOutlined className="h-4 w-4" /> Xóa file
                </button>
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-400">Chưa có tệp audio nào được tải lên</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AudioUploadSection;
