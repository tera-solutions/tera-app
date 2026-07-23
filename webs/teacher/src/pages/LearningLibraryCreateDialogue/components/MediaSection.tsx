import { useRef } from "react";
import {
  Checkbox,
  CloudArrowUpOutlined,
  PhotoOutlined,
  Select,
  SparklesOutlined,
  SpeakerWaveOutlined,
  XMarkOutlined,
} from "tera-dls";

import Card from "_common/components/Card";

import { MUSIC_OPTIONS, SUBTITLE_LANGUAGE_OPTIONS } from "../constants";

interface MediaSectionProps {
  onUploadVideo: (file?: File) => void;
  coverTitle: string;
  coverGradient: string;
  customCoverUrl: string;
  onUploadCover: (file?: File) => void;
  onAiGenerateCover: () => void;
  music: string;
  onMusicChange: (value: string) => void;
  musicVolume: number;
  onMusicVolumeChange: (value: number) => void;
  autoSubtitle: boolean;
  onAutoSubtitleChange: (value: boolean) => void;
  subtitleLanguage: string;
  onSubtitleLanguageChange: (value: string) => void;
}

const MediaSection = ({
  onUploadVideo,
  coverTitle,
  coverGradient,
  customCoverUrl,
  onUploadCover,
  onAiGenerateCover,
  music,
  onMusicChange,
  musicVolume,
  onMusicVolumeChange,
  autoSubtitle,
  onAutoSubtitleChange,
  subtitleLanguage,
  onSubtitleLanguageChange,
}: MediaSectionProps) => {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-800">3. Media &amp; Tệp tin</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Tải lên video</label>
          <div
            role="button"
            tabIndex={0}
            onClick={() => videoInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 px-3 text-center hover:border-brand"
          >
            <CloudArrowUpOutlined className="h-8 w-8 text-slate-300" />
            <p className="text-xs text-slate-500">
              Kéo &amp; thả file video vào đây
              <br />
              hoặc <span className="font-medium text-brand">Browse</span>
            </p>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo"
              className="hidden"
              onChange={(e) => onUploadVideo(e.target.files?.[0])}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Hỗ trợ: MP4, MOV, AVI | Tối đa 500MB
            <br />
            Độ phân giải khuyến nghị: 1280x720
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Ảnh bìa (Thumbnail)</label>
          <div
            className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${coverGradient}`}
          >
            {customCoverUrl ? (
              <img src={customCoverUrl} alt="Ảnh bìa" className="h-full w-full object-cover" />
            ) : (
              <p className="px-3 text-center text-lg font-extrabold uppercase leading-tight text-white drop-shadow">
                {coverTitle || "Tiêu đề video"}
              </p>
            )}
            {customCoverUrl && (
              <button
                type="button"
                onClick={() => onUploadCover(undefined)}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <XMarkOutlined className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-1.5 text-xs text-slate-600 hover:border-brand hover:text-brand"
            >
              <PhotoOutlined className="h-3.5 w-3.5" /> Thay ảnh
            </button>
            <button
              type="button"
              onClick={onAiGenerateCover}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-1.5 text-xs text-slate-600 hover:border-brand hover:text-brand"
            >
              <SparklesOutlined className="h-3.5 w-3.5" /> AI tạo ảnh
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => onUploadCover(e.target.files?.[0])}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Nhạc nền</label>
            <Select value={music} options={MUSIC_OPTIONS} onChange={(v) => onMusicChange(v as string)} />
            <div className="mt-2 flex items-center gap-2">
              <SpeakerWaveOutlined className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="range"
                min={0}
                max={100}
                value={musicVolume}
                onChange={(e) => onMusicVolumeChange(Number(e.target.value))}
                className="flex-1 accent-brand"
              />
              <span className="w-9 shrink-0 text-right text-xs text-slate-400">{musicVolume}%</span>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">Phụ đề</p>
            <Checkbox checked={autoSubtitle} onChange={(e: any) => onAutoSubtitleChange(e.target.checked)}>
              <span className="text-sm text-slate-600">Tự động tạo phụ đề (AI)</span>
            </Checkbox>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Ngôn ngữ phụ đề</label>
            <Select
              value={subtitleLanguage}
              options={SUBTITLE_LANGUAGE_OPTIONS}
              onChange={(v) => onSubtitleLanguageChange(v as string)}
              disabled={!autoSubtitle}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MediaSection;
