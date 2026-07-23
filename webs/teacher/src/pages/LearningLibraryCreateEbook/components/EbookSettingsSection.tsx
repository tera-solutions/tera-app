import classNames from "classnames";
import { InformationCircleOutlined, Select } from "tera-dls";

import Card from "_common/components/Card";

import { COLOR_MODE_OPTIONS, FONT_OPTIONS, ORIENTATION_OPTIONS, PAGE_SIZE_OPTIONS } from "../constants";

interface EbookSettingsSectionProps {
  pageSize: string;
  onPageSizeChange: (value: string) => void;
  orientation: string;
  onOrientationChange: (value: string) => void;
  font: string;
  onFontChange: (value: string) => void;
  colorMode: string;
  onColorModeChange: (value: string) => void;
}

const EbookSettingsSection = ({
  pageSize,
  onPageSizeChange,
  orientation,
  onOrientationChange,
  font,
  onFontChange,
  colorMode,
  onColorModeChange,
}: EbookSettingsSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">3. Cài đặt ebook</p>

    <div className="mb-4">
      <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
        Kích thước trang
        <span title="Kích thước khổ trang khi xuất bản hoặc in ebook">
          <InformationCircleOutlined className="h-3.5 w-3.5 text-slate-300" />
        </span>
      </label>
      <Select value={pageSize} options={PAGE_SIZE_OPTIONS} onChange={(v) => onPageSizeChange(v as string)} />
    </div>

    <div className="mb-4">
      <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
        Hướng trang
        <span title="Bố cục trang dọc hay ngang">
          <InformationCircleOutlined className="h-3.5 w-3.5 text-slate-300" />
        </span>
      </label>
      <div className="grid grid-cols-2 gap-2">
        {ORIENTATION_OPTIONS.map((option) => {
          const active = orientation === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onOrientationChange(option.value)}
              className={classNames(
                "flex items-center justify-center gap-2 rounded-lg border-2 py-2.5 text-sm",
                active ? "border-brand text-brand" : "border-slate-200 text-slate-500 hover:border-slate-300",
              )}
            >
              <span
                className={classNames(
                  "rounded-[2px] border-2 border-current",
                  option.value === "portrait" ? "h-4 w-3" : "h-3 w-4",
                )}
              />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>

    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Phông chữ mặc định</label>
      <Select value={font} options={FONT_OPTIONS} onChange={(v) => onFontChange(v as string)} />
    </div>

    <div>
      <label className="mb-2 flex items-center gap-1 text-sm font-medium text-slate-700">
        Chế độ màu
        <span title="Bảng màu nền và màu chữ áp dụng cho toàn bộ ebook">
          <InformationCircleOutlined className="h-3.5 w-3.5 text-slate-300" />
        </span>
      </label>
      <div className="flex flex-wrap gap-2">
        {COLOR_MODE_OPTIONS.map((option) => {
          const active = colorMode === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onColorModeChange(option.value)}
              style={{ backgroundColor: option.bg, color: option.text }}
              className={classNames(
                "flex h-10 w-12 items-center justify-center rounded-lg border-2 text-sm font-semibold",
                active ? "border-brand" : "border-slate-200",
              )}
            >
              Aa
            </button>
          );
        })}
      </div>
    </div>
  </Card>
);

export default EbookSettingsSection;
