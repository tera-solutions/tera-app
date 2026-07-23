import { Toggle } from "tera-dls";

import Card from "_common/components/Card";

import type { LearningSettings } from "../_interface";

interface LearningSettingsSectionProps {
  value: LearningSettings;
  onChange: (patch: Partial<LearningSettings>) => void;
}

const ROWS: { key: keyof LearningSettings; label: string }[] = [
  { key: "autoPronounce", label: "Phát âm tự động khi lật thẻ" },
  { key: "showPhonetic", label: "Hiển thị phiên âm" },
  { key: "showMeaning", label: "Hiển thị nghĩa" },
  { key: "shuffleOnReview", label: "Trộn ngẫu nhiên thẻ khi ôn tập" },
];

const LearningSettingsSection = ({ value, onChange }: LearningSettingsSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">4. Cài đặt học liệu</p>
    <div className="flex flex-col divide-y divide-slate-100">
      {ROWS.map((row) => (
        <div key={row.key} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
          <span className="text-sm text-slate-600">{row.label}</span>
          <Toggle checked={value[row.key]} onChange={(e) => onChange({ [row.key]: e.target.checked })} />
        </div>
      ))}
    </div>
  </Card>
);

export default LearningSettingsSection;
