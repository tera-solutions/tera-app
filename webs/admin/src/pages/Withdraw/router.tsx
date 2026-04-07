import { IRouteProps } from "@tera/commons/interfaces/router";
import WithdrawPage from ".";
import { WITHDRAW_URL } from "./url";

export const WithdrawRouter: IRouteProps[] = [
  {
    key: WITHDRAW_URL.list.key,
    path: WITHDRAW_URL.list.shortenUrl,
    component: <WithdrawPage />,
  },
];
