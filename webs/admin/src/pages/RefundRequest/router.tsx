import { IRouteProps } from "@tera/commons/interfaces/router";
import RefundRequestPage from ".";
import { REFUND_REQUEST_URL } from "./url";

export const RefundRequestRouter: IRouteProps[] = [
  {
    key: REFUND_REQUEST_URL.list.key,
    path: REFUND_REQUEST_URL.list.shortenUrl,
    component: <RefundRequestPage />,
  },
];
