import { IRouteProps } from "@tera/commons/interfaces/router";
import ChangePasswordPage from ".";
import { CHANGE_PASSWORD_URL } from "./url";

export const ChangePasswordRouter: IRouteProps[] = [
  {
    key: CHANGE_PASSWORD_URL.list.key,
    path: CHANGE_PASSWORD_URL.list.shortenUrl,
    component: <ChangePasswordPage />,
  },
];
