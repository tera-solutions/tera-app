import { IRouteProps } from "@tera/commons/interfaces/router";
import LinkSystemPage from ".";
import { LINK_SYSTEM_URL } from "./url";

export const LinkSystemRouter: IRouteProps[] = [
  {
    key: LINK_SYSTEM_URL.list.key,
    path: LINK_SYSTEM_URL.list.shortenUrl,
    component: <LinkSystemPage />,
  },
];
