import { IRouteProps } from "@tera/commons/interfaces/router";
import SettingStorePage from ".";
import { SETTING_STORE_URL } from "./url";

export const SettingStoreRouter: IRouteProps[] = [
  {
    key: SETTING_STORE_URL.list.key,
    path: SETTING_STORE_URL.list.shortenUrl,
    component: <SettingStorePage />,
  },
];
