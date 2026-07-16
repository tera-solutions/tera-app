import { Toggle } from "tera-dls";

import Card from "_common/components/Card";

import { NOTIFICATION_SETTINGS } from "../constants";
import useSettingsMap from "../useSettingsMap";

const NotificationSettingsTab = () => {
  const { getBool, setValue, isLoading } = useSettingsMap();

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-700">Tùy chọn thông báo</p>
      <div className="flex flex-col divide-y divide-slate-100">
        {NOTIFICATION_SETTINGS.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-700">{setting.label}</p>
              <p className="text-xs text-slate-400">{setting.description}</p>
            </div>
            <Toggle
              disabled={isLoading}
              checked={getBool(setting.key, true)}
              onChange={(e) => setValue(setting.key, String(e.target.checked), "boolean")}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NotificationSettingsTab;
