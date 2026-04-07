import { IRouteProps } from "@tera/commons/interfaces/router";
import SupportTicketPage from ".";
import { SUPPORT_TICKET_URL } from "./url";

export const SupportTicketRouter: IRouteProps[] = [
  {
    key: SUPPORT_TICKET_URL.list.key,
    path: SUPPORT_TICKET_URL.list.shortenUrl,
    component: <SupportTicketPage />,
  },
];
