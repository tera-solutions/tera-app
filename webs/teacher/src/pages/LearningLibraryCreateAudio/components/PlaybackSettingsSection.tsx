import { InformationCircleOutlined, Select, SpeakerWaveOutlined, Toggle } from "tera-dls";

import Card from "_common/components/Card";

import { MUSIC_OPTIONS, PLAYBACK_SPEED_OPTIONS } from "../constants";

interface PlaybackSettingsSectionProps {
  music: string;
  onMusicChange: (value: string) => void;
  musicVolume: number;
  onMusicVolumeChange: (value: number) => void;
  playbackSpeed: string;
  onPlaybackSpeedChange: (value: string) => void;
  autoPlay: boolean;
  onAutoPlayChange: (value: boolean) => void;
}

const PlaybackSettingsSection = ({
  music,
  onMusicChange,
  musicVolume,
  onMusicVolumeChange,
  playbackSpeed,
  onPlaybackSpeedChange,
  autoPlay,
  onAutoPlayChange,
}: PlaybackSettingsSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">4. Cài đặt phát audio</p>

    <div className="mb-4">
      <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
        Nhạc nền
        <span title="Nhạc nền phát nhẹ phía sau nội dung audio chính">
          <InformationCircleOutlined className="h-3.5 w-3.5 text-slate-300" />
        </span>
      </label>
      <div className="flex items-center gap-2">
        <Select value={music} options={MUSIC_OPTIONS} onChange={(v) => onMusicChange(v as string)} className="flex-1" />
        <SpeakerWaveOutlined className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="range"
          min={0}
          max={100}
          value={musicVolume}
          onChange={(e) => onMusicVolumeChange(Number(e.target.value))}
          className="w-24 accent-brand"
        />
        <span className="w-9 shrink-0 text-right text-xs text-slate-400">{musicVolume}%</span>
      </div>
    </div>

    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Tốc độ phát</label>
      <Select
        value={playbackSpeed}
        options={PLAYBACK_SPEED_OPTIONS}
        onChange={(v) => onPlaybackSpeedChange(v as string)}
      />
    </div>

    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600">Tự động phát</span>
      <Toggle checked={autoPlay} onChange={(e) => onAutoPlayChange(e.target.checked)} />
    </div>
  </Card>
);

export default PlaybackSettingsSection;
