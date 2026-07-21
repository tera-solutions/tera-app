import { Button, PlayOutlined, Select, SpeakerWaveOutlined, Toggle, notification } from "tera-dls";

import Card from "_common/components/Card";

import type { VoiceAudioSettings } from "../_interface";
import { MUSIC_OPTIONS, VOICE_OPTIONS } from "../constants";

interface VoiceAudioSectionProps {
  value: VoiceAudioSettings;
  onChange: (patch: Partial<VoiceAudioSettings>) => void;
}

const VoiceAudioSection = ({ value, onChange }: VoiceAudioSectionProps) => (
  <Card>
    <div className="mb-3 flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-800">5. Âm thanh &amp; Lồng tiếng (Tùy chọn)</p>
    </div>

    <div className="mb-4 flex items-center justify-between">
      <span className="text-sm text-slate-600">Thêm giọng kể cho truyện tranh</span>
      <Toggle checked={value.enabled} onChange={(e) => onChange({ enabled: e.target.checked })} />
    </div>

    {value.enabled && (
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Giọng đọc <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <Select
              value={value.voice}
              options={VOICE_OPTIONS}
              onChange={(v) => onChange({ voice: v as string })}
              className="flex-1"
            />
            <Button
              outlined
              icon={<PlayOutlined className="h-3.5 w-3.5" />}
              className="whitespace-nowrap border-slate-200 text-brand hover:border-brand"
              onClick={() => notification.success({ message: "Đang phát thử giọng đọc..." })}
            >
              Nghe thử
            </Button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Nhạc nền <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <Select
              value={value.music}
              options={MUSIC_OPTIONS}
              onChange={(v) => onChange({ music: v as string })}
              className="flex-1"
            />
            <SpeakerWaveOutlined className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="range"
              min={0}
              max={100}
              value={value.musicVolume}
              onChange={(e) => onChange({ musicVolume: Number(e.target.value) })}
              className="w-24 accent-brand"
            />
          </div>
        </div>
      </div>
    )}
  </Card>
);

export default VoiceAudioSection;
