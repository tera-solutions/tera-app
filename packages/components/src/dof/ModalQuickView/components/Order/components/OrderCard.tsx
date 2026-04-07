import useQuickView from "@tera/states/hooks/useQuickView";
import { ReactNode } from "react";
import customTwMerge from "tailwind-merge.config";
import { Description, Row } from "tera-dls";

type ProductType = {
  sku: string;
  name: string;
  quantity: number;
  id: number;
};
type OrderCardProps = {
  product: ProductType;
  children: ReactNode;
  containerClassName?: string;
};
const OrderCard = ({
  product,
  children,
  containerClassName,
}: OrderCardProps) => {
  const { quickView, redirectDetails } = useQuickView();
  return (
    <div className={customTwMerge("p-2.5", containerClassName)}>
      <Description
        className="grid-cols-12 mb-1"
        labelClassName="col-span-11"
        label={
          <p>
            <span className="text-gray-500 italic text-xss">
              {product?.sku}
            </span>{" "}
            -{" "}
            <span
              className="text-blue-600 cursor-pointer font-medium"
              onClick={() =>
                quickView({
                  detail_id: product?.id,
                  detail_type: "product",
                  onView: () => redirectDetails("product", product?.id),
                })
              }
            >
              {product?.name}
            </span>
          </p>
        }
        childrenClassName="text-gray-500 font-medium text-right"
      >
        <span className="text-[13px] leading-[16px] text-[#7B7B7B]">
          x{product?.quantity}
        </span>
      </Description>
      <Row className="grid-cols-2 font-medium gap-y-[5px] gap-x-4">
        {children}
      </Row>
    </div>
  );
};
export default OrderCard;
