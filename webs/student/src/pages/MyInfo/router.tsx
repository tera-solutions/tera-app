import { IRouteProps } from "@tera/commons/interfaces/router";
import MyInfoPage from ".";
import { MY_INFO_URL } from "./url";

export const MyInfoRouter: IRouteProps[] = [
  {
    key: MY_INFO_URL.info.key,
    path: MY_INFO_URL.info.shortenUrl,
    component: <MyInfoPage />,
  },
];
