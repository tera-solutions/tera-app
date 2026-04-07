import { IRouteProps } from "@tera/commons/interfaces/router";
import OrderPage from ".";
import { ORDER_URL } from "./url";

export const OrderRouter: IRouteProps[] = [
  {
    key: ORDER_URL.list.key,
    path: ORDER_URL.list.shortenUrl,
    component: <OrderPage />,
  },
];
