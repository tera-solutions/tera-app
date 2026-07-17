import type { SettingRow, SettingValueMap } from "./_interface";

export const toSettingMap = (raw: any): SettingValueMap => {
  const items: SettingRow[] = (raw?.data?.items ?? []).map((item: any) => ({
    id: item.id,
    key: item.key,
    value: item.value,
    type: item.type,
    group: item.group,
  }));
  const map: SettingValueMap = {};
  items.forEach((item) => {
    map[item.key] = item;
  });
  return map;
};
