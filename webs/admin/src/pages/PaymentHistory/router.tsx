import { IRouteProps } from "@tera/commons/interfaces/router";
import PaymentHistoryPage from ".";
import { PAYMENT_HISTORY_URL } from "./url";

export const PaymentHistoryRouter: IRouteProps[] = [
  {
    key: PAYMENT_HISTORY_URL.list.key,
    path: PAYMENT_HISTORY_URL.list.shortenUrl,
    component: <PaymentHistoryPage />,
  },
];
