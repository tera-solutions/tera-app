import { IRouteProps } from "@tera/commons/interfaces/router";
import AdvertisingPackagePage from ".";
import { ADVERTISING_PACKAGE_LIST_URL } from "./url";

export const AdvertisingPackageListRouter: IRouteProps[] = [
  {
    key: ADVERTISING_PACKAGE_LIST_URL.list.key,
    path: ADVERTISING_PACKAGE_LIST_URL.list.shortenUrl,
    component: <AdvertisingPackagePage />,
  },
];
