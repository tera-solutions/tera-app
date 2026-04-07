import { IRouteProps } from "@tera/commons/interfaces/router";
import PackageListPage from ".";
import { PACKAGE_LIST_URL } from "./url";

export const PackageListRouter: IRouteProps[] = [
  {
    key: PACKAGE_LIST_URL.list.key,
    path: PACKAGE_LIST_URL.list.shortenUrl,
    component: <PackageListPage />,
  },
];
