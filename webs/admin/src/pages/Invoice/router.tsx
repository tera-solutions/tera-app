import { IRouteProps } from "@tera/commons/interfaces/router";
import InvoicePage from ".";
import { INVOICE_URL } from "./url";

export const InvoiceRouter: IRouteProps[] = [
  {
    key: INVOICE_URL.list.key,
    path: INVOICE_URL.list.shortenUrl,
    component: <InvoicePage />,
  },
];
