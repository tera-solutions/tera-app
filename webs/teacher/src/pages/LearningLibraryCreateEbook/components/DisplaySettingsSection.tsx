import { Toggle } from "tera-dls";

import Card from "_common/components/Card";

import type { DisplaySettings } from "../_interface";

interface DisplaySettingsSectionProps {
  value: DisplaySettings;
  onChange: (patch: Partial<DisplaySettings>) => void;
}

const ROWS: { key: keyof DisplaySettings; label: string }[] = [
  { key: "allowDownload", label: "Cho phép tải xuống" },
  { key: "showTableOfContents", label: "Hiển thị mục lục" },
  { key: "allowPrint", label: "Cho phép in" },
];

const DisplaySettingsSection = ({ value, onChange }: DisplaySettingsSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">5. Thiết lập hiển thị</p>
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

export default DisplaySettingsSection;
