import { IRouteProps } from "@tera/commons/interfaces/router";
import WarehousePage from ".";
import { WAREHOUSE_URL } from "./url";

export const WarehouseRouter: IRouteProps[] = [
  {
    key: WAREHOUSE_URL.list.key,
    path: WAREHOUSE_URL.list.shortenUrl,
    component: <WarehousePage />,
  },
];
