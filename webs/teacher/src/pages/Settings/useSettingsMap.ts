import { useMemo } from "react";

import { SettingService } from "@tera/modules/system";

import { toSettingMap } from "./_utils";

/** All of the current business's settings, keyed by `key` — cheap enough to
 * fetch in one page-wide call since there is no per-group list endpoint. */
export const useSettingsMap = () => {
  const query = SettingService.useSettingList({ params: { page: 1, per_page: 100 } });
  const map = useMemo(() => toSettingMap(query.data), [query.data]);
  const { mutate: upsertSetting, isPending: isSaving } = SettingService.useUpsertSetting();

  const setValue = (key: string, value: string, type: "string" | "boolean" | "number" = "string") => {
    upsertSetting({ params: { key, value, type } });
  };

  const getValue = (key: string, fallback = "") => map[key]?.value ?? fallback;
  const getBool = (key: string, fallback = false) => {
    const raw = map[key]?.value;
    return raw == null ? fallback : raw === "true";
  };

  return { map, getValue, getBool, setValue, isSaving, isLoading: query.isLoading };
};

export default useSettingsMap;
