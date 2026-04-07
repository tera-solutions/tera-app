import { IRouteProps } from "@tera/commons/interfaces/router";
import AdvertisingPackageOrderPage from ".";
import { ADVERTISING_PACKAGE_ORDER_URL } from "./url";

export const PackageOrderRouter: IRouteProps[] = [
  {
    key: ADVERTISING_PACKAGE_ORDER_URL.list.key,
    path: ADVERTISING_PACKAGE_ORDER_URL.list.shortenUrl,
    component: <AdvertisingPackageOrderPage />,
  },
];
