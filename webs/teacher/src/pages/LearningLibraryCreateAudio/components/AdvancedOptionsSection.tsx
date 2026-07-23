import { Toggle } from "tera-dls";

import Card from "_common/components/Card";

import type { AdvancedOptions } from "../_interface";

interface AdvancedOptionsSectionProps {
  value: AdvancedOptions;
  onChange: (patch: Partial<AdvancedOptions>) => void;
}

const ROWS: { key: keyof AdvancedOptions; label: string }[] = [
  { key: "showSubtitle", label: "Hiển thị lời (subtitle)" },
  { key: "showPhonetic", label: "Hiển thị phiên âm" },
  { key: "pauseBetweenItems", label: "Tạm dừng giữa các mục" },
  { key: "allowDownload", label: "Cho phép tải xuống" },
];

const AdvancedOptionsSection = ({ value, onChange }: AdvancedOptionsSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">5. Tùy chọn nâng cao</p>
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

export default AdvancedOptionsSection;
