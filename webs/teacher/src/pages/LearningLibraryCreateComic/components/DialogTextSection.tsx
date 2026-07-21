import { Checkbox, ChevronDownOutlined, Dropdown, Select } from "tera-dls";

import Card from "_common/components/Card";

import type { DialogTextSettings } from "../_interface";
import { BUBBLE_STYLE_OPTIONS, FONT_OPTIONS, FONT_SIZE_OPTIONS } from "../constants";

const TEXT_COLOR_OPTIONS = ["#0f172a", "#ffffff", "#2563eb", "#dc2626", "#16a34a", "#f59e0b"];

interface DialogTextSectionProps {
  value: DialogTextSettings;
  onChange: (patch: Partial<DialogTextSettings>) => void;
}

const DialogTextSection = ({ value, onChange }: DialogTextSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">3. Tùy chỉnh hội thoại &amp; văn bản</p>

    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Font chữ</label>
        <Select value={value.font} options={FONT_OPTIONS} onChange={(v) => onChange({ font: v as string })} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Kích thước chữ</label>
        <Select
          value={value.fontSize}
          options={FONT_SIZE_OPTIONS}
          onChange={(v) => onChange({ fontSize: v as string })}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Màu chữ</label>
        <Dropdown
          trigger="click"
          menu={{
            items: TEXT_COLOR_OPTIONS.map((hex) => ({
              key: hex,
              label: (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-slate-200" style={{ backgroundColor: hex }} />
                  {hex}
                </span>
              ),
              onClick: () => onChange({ textColor: hex }),
            })),
          }}
        >
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-brand"
          >
            <span className="h-4 w-4 rounded border border-slate-200" style={{ backgroundColor: value.textColor }} />
            <ChevronDownOutlined className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </Dropdown>
      </div>
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-5">
      <Checkbox
        checked={value.uppercaseTitle}
        onChange={(e: any) => onChange({ uppercaseTitle: e.target.checked })}
      >
        <span className="text-sm text-slate-600">In hoa tiêu đề</span>
      </Checkbox>
      <Checkbox
        checked={value.boldKeyVocabulary}
        onChange={(e: any) => onChange({ boldKeyVocabulary: e.target.checked })}
      >
        <span className="text-sm text-slate-600">Bôi đậm từ vựng chính</span>
      </Checkbox>
    </div>

    <div className="mt-4 max-w-xs">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Hiệu ứng hội thoại</label>
      <Select
        value={value.bubbleStyle}
        options={BUBBLE_STYLE_OPTIONS}
        onChange={(v) => onChange({ bubbleStyle: v as string })}
      />
    </div>
  </Card>
);

export default DialogTextSection;
