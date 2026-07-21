import { useState } from "react";
import { ArrowsPointingOuOutlined, Button, ForwardOutlined, PauseOutlined, PlayOutlined, SpeakerWaveOutlined } from "tera-dls";

import Card from "_common/components/Card";

interface VideoPreviewSectionProps {
  gradient: string;
  previewLine: string;
  onFullscreenPreview: () => void;
}

const VideoPreviewSection = ({ gradient, previewLine, onFullscreenPreview }: VideoPreviewSectionProps) => {
  const [playing, setPlaying] = useState(false);

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-800">4. Xem trước video</p>

      <div className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-5xl ${gradient}`}>
        <span>🧒</span>
        <span className="ml-6">👩</span>

        {previewLine && (
          <div className="absolute left-1/2 top-4 max-w-[80%] -translate-x-1/2 rounded-2xl rounded-bl-none bg-white px-3 py-2 text-center text-sm font-medium text-slate-700 shadow">
            {previewLine}
          </div>
        )}

        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-white/85 text-brand shadow [&_svg]:h-7 [&_svg]:w-7"
        >
          {playing ? <PauseOutlined /> : <PlayOutlined />}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-slate-400">00:12</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/6 rounded-full bg-brand" />
        </div>
        <span className="text-xs text-slate-400">02:30</span>
      </div>

      <div className="mt-2 flex items-center gap-3 text-slate-500">
        <button type="button" onClick={() => setPlaying((p) => !p)} className="[&_svg]:h-4.5 [&_svg]:w-4.5">
          {playing ? <PauseOutlined /> : <PlayOutlined />}
        </button>
        <button type="button" className="[&_svg]:h-4.5 [&_svg]:w-4.5">
          <ForwardOutlined />
        </button>
        <div className="flex-1" />
        <button type="button" className="[&_svg]:h-4.5 [&_svg]:w-4.5">
          <SpeakerWaveOutlined />
        </button>
        <button type="button" className="[&_svg]:h-4.5 [&_svg]:w-4.5">
          <ArrowsPointingOuOutlined />
        </button>
      </div>

      <Button
        outlined
        className="mt-3 w-full border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
        onClick={onFullscreenPreview}
      >
        Xem trước toàn màn hình
      </Button>
    </Card>
  );
};

export default VideoPreviewSection;
