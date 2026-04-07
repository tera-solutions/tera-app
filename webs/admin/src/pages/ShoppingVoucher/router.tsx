import { IRouteProps } from "@tera/commons/interfaces/router";
import ShoppingVoucherPage from ".";
import { SHOPPING_VOUCHER_URL } from "./url";

export const ShoppingVoucherRouter: IRouteProps[] = [
  {
    key: SHOPPING_VOUCHER_URL.list.key,
    path: SHOPPING_VOUCHER_URL.list.shortenUrl,
    component: <ShoppingVoucherPage />,
  },
];
