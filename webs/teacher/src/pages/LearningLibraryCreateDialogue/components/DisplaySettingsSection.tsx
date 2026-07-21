import { Select, Toggle } from "tera-dls";

import Card from "_common/components/Card";

import type { DisplaySettings } from "../_interface";
import { SUBTITLE_POSITION_OPTIONS, SUBTITLE_SPEED_OPTIONS } from "../constants";

interface DisplaySettingsSectionProps {
  value: DisplaySettings;
  onChange: (patch: Partial<DisplaySettings>) => void;
}

const DisplaySettingsSection = ({ value, onChange }: DisplaySettingsSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">5. Cài đặt hiển thị</p>

    <div className="flex flex-col divide-y divide-slate-100">
      <div className="flex items-center justify-between py-2.5 first:pt-0">
        <span className="text-sm text-slate-600">Hiển thị phụ đề</span>
        <Toggle checked={value.showSubtitle} onChange={(e) => onChange({ showSubtitle: e.target.checked })} />
      </div>
      <div className="flex items-center justify-between py-2.5">
        <span className="text-sm text-slate-600">Hiển thị từ vựng nổi bật</span>
        <Toggle
          checked={value.showHighlightVocabulary}
          onChange={(e) => onChange({ showHighlightVocabulary: e.target.checked })}
        />
      </div>
      <div className="flex items-center justify-between py-2.5 last:pb-0">
        <span className="text-sm text-slate-600">Hiển thị bản dịch</span>
        <Toggle checked={value.showTranslation} onChange={(e) => onChange({ showTranslation: e.target.checked })} />
      </div>
    </div>

    <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Tốc độ phụ đề</label>
        <Select
          value={value.subtitleSpeed}
          options={SUBTITLE_SPEED_OPTIONS}
          onChange={(v) => onChange({ subtitleSpeed: v as string })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Vị trí hiển thị</label>
        <Select
          value={value.subtitlePosition}
          options={SUBTITLE_POSITION_OPTIONS}
          onChange={(v) => onChange({ subtitlePosition: v as string })}
        />
      </div>
    </div>
  </Card>
);

export default DisplaySettingsSection;
