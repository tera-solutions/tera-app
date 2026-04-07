import { IRouteProps } from "@tera/commons/interfaces/router";
import ProductReviewPage from ".";
import { PRODUCT_REVIEW_URL } from "./url";

export const ProductReviewRouter: IRouteProps[] = [
  {
    key: PRODUCT_REVIEW_URL.list.key,
    path: PRODUCT_REVIEW_URL.list.shortenUrl,
    component: <ProductReviewPage />,
  },
];
