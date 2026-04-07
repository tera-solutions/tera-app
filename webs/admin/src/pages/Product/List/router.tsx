import { IRouteProps } from "@tera/commons/interfaces/router";
import ProductListPage from ".";
import { PRODUCT_LIST_URL } from "./url";
import ProductFormPage from "./containers/Form";

export const ProductListRouter: IRouteProps[] = [
  {
    key: PRODUCT_LIST_URL.list.key,
    path: PRODUCT_LIST_URL.list.shortenUrl,
    component: <ProductListPage />,
  },
  {
    key: PRODUCT_LIST_URL.create.key,
    path: PRODUCT_LIST_URL.create.shortenUrl,
    component: <ProductFormPage />,
  },
  {
    key: PRODUCT_LIST_URL.update.key,
    path: PRODUCT_LIST_URL.update.shortenUrl,
    component: <ProductFormPage />,
  },
];
