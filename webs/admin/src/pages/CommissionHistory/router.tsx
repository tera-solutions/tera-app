import { IRouteProps } from "@tera/commons/interfaces/router";
import CommissionHistoryPage from ".";
import { COMMISSION_HISTORY_URL } from "./url";

export const CommissionHistoryRouter: IRouteProps[] = [
  {
    key: COMMISSION_HISTORY_URL.list.key,
    path: COMMISSION_HISTORY_URL.list.shortenUrl,
    component: <CommissionHistoryPage />,
  },
];
