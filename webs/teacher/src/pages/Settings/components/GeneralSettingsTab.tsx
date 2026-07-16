import { Toggle } from "tera-dls";

import Card from "_common/components/Card";
import CompactSelect from "_common/components/CompactSelect";
import FilterField from "_common/components/FilterField";

import { DATE_FORMAT_OPTIONS, PAGE_SIZE_SETTING_OPTIONS, TIME_FORMAT_OPTIONS, TIMEZONE_OPTIONS } from "../constants";
import useSettingsMap from "../useSettingsMap";

const GeneralSettingsTab = () => {
  const { getValue, getBool, setValue, isLoading } = useSettingsMap();

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-700">Tùy chọn chung</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FilterField label="Múi giờ">
          <CompactSelect
            disabled={isLoading}
            value={getValue("general.timezone", "Asia/Bangkok")}
            options={TIMEZONE_OPTIONS}
            onChange={(v) => setValue("general.timezone", v)}
          />
        </FilterField>
        <FilterField label="Định dạng ngày">
          <CompactSelect
            disabled={isLoading}
            value={getValue("general.date_format", "DD/MM/YYYY")}
            options={DATE_FORMAT_OPTIONS}
            onChange={(v) => setValue("general.date_format", v)}
          />
        </FilterField>
        <FilterField label="Định dạng giờ">
          <CompactSelect
            disabled={isLoading}
            value={getValue("general.time_format", "24h")}
            options={TIME_FORMAT_OPTIONS}
            onChange={(v) => setValue("general.time_format", v)}
          />
        </FilterField>
        <FilterField label="Số lượng hiển thị mỗi trang">
          <CompactSelect
            disabled={isLoading}
            value={getValue("general.page_size", "20")}
            options={PAGE_SIZE_SETTING_OPTIONS}
            onChange={(v) => setValue("general.page_size", v)}
          />
        </FilterField>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div>
          <p className="text-sm font-medium text-slate-700">Tự động lưu bản nháp</p>
          <p className="text-xs text-slate-400">Tự động lưu khi soạn thảo</p>
        </div>
        <Toggle
          disabled={isLoading}
          checked={getBool("general.autosave", true)}
          onChange={(e) => setValue("general.autosave", String(e.target.checked), "boolean")}
        />
      </div>
    </Card>
  );
};

export default GeneralSettingsTab;
