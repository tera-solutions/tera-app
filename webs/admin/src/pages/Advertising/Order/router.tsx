import { IRouteProps } from "@tera/commons/interfaces/router";
import PackageOrderPage from ".";
import { PACKAGE_ORDER_URL } from "./url";

export const AdvertisingPackageOrderRouter: IRouteProps[] = [
  {
    key: PACKAGE_ORDER_URL.list.key,
    path: PACKAGE_ORDER_URL.list.shortenUrl,
    component: <PackageOrderPage />,
  },
];
