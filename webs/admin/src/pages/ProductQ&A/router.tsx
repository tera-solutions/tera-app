import { IRouteProps } from "@tera/commons/interfaces/router";
import ProductQAPage from ".";
import { PRODUCT_QA_URL } from "./url";

export const ProductQARouter: IRouteProps[] = [
  {
    key: PRODUCT_QA_URL.list.key,
    path: PRODUCT_QA_URL.list.shortenUrl,
    component: <ProductQAPage />,
  },
];
