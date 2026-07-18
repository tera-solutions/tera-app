import classNames from "classnames";
import { CheckOutlined } from "tera-dls";

import Card from "_common/components/Card";
import CompactSelect from "_common/components/CompactSelect";

import { FONT_OPTIONS, THEME_COLOR_OPTIONS, THEME_MODE_OPTIONS } from "../constants";
import useSettingsMap from "../useSettingsMap";

const AppearanceCard = () => {
  const { getValue, setValue, isLoading } = useSettingsMap();
  const themeMode = getValue("appearance.theme_mode", "light");
  const themeColor = getValue("appearance.color", "sky");
  const font = getValue("appearance.font", "Inter");

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-700">Giao diện</p>

      <p className="mb-1.5 text-sm font-semibold text-slate-700">Chế độ giao diện</p>
      <div className="mb-4 flex gap-2">
        {THEME_MODE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={isLoading}
            onClick={() => setValue("appearance.theme_mode", option.value)}
            className={classNames(
              "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              themeMode === option.value
                ? "border-brand bg-sky-50 text-brand"
                : "border-slate-200 text-slate-500 hover:border-slate-300",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="-mt-3 mb-4 text-xs text-slate-400">
        Chế độ tối đang được phát triển, lựa chọn hiện chỉ được lưu lại.
      </p>

      <p className="mb-1.5 text-sm font-semibold text-slate-700">Màu chủ đạo</p>
      <div className="mb-4 flex gap-2">
        {THEME_COLOR_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            title={option.value}
            disabled={isLoading}
            onClick={() => setValue("appearance.color", option.value)}
            style={{ backgroundColor: option.hex }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm"
          >
            {themeColor === option.value && <CheckOutlined className="h-4 w-4" />}
          </button>
        ))}
      </div>

      <p className="mb-1.5 text-sm font-semibold text-slate-700">Font chữ</p>
      <CompactSelect
        disabled={isLoading}
        value={font}
        options={FONT_OPTIONS}
        onChange={(v) => setValue("appearance.font", v)}
      />
    </Card>
  );
};

export default AppearanceCard;
