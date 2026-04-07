import { ReactNode, useCallback, useState } from "react";
import {
  Col,
  Collapse,
  formatCurrency,
  formatNumber,
  Row,
  Tag,
} from "tera-dls";
import OrderCard from "./OrderCard";
import { get } from "lodash";

type DescriptionGeneralProps = {
  data?: { title: ReactNode; value: ReactNode }[];
  disableQuantitySold?: boolean;
  isImport?: boolean;
  isPurchase?: boolean;
};
export const DisplayVariable = ({
  data,
  disableQuantitySold,
  isImport,
  isPurchase,
}) => {
  return (
    <div className="grid gap-[2px] ml-2.5 text-gray-800">
      <span className="font-light italic text-[#6B7280] text-[10px] leading-[12px]">
        {data?.children_type === "variable" ? "SP biến thể" : "SP thường"}
      </span>
      <div className="bg-[#F3F4F6] rounded-[3px]">
        <OrderCard
          product={{
            id: data?.product_id,
            name: data?.product?.name,
            sku:
              data?.children?.product_type === "variable"
                ? data?.variant?.sku
                : data?.product?.sku,
            quantity: data?.quantity,
          }}
        >
          {data?.children?.attribute_first?.title && (
            <Col className="col-span-2 py-1">
              <span className="bg-gray-200 px-[6px] rounded-[4px] py-[4px] text-[12px] w-fit text-[#6B7280] font-['Lato']">
                {data?.children?.attribute_first?.title}
              </span>
            </Col>
          )}

          <Col>
            Đơn giá -{" "}
            <span className="text-red-400">
              {isPurchase
                ? formatCurrency(data?.purchase_price ?? 0)
                : formatCurrency(data?.unit_price ?? 0)}
            </span>
          </Col>
          <Col className="flex justify-end gap-1">
            Thành tiền -{" "}
            <span className="text-green-500">
              {formatCurrency(data?.total ?? 0)}
            </span>
          </Col>
          {data?.product?.unit ? (
            <Col>
              Đơn vị -{" "}
              <span className="text-gray-500">
                {data?.product?.unit?.actual_name}
              </span>
            </Col>
          ) : (
            <div />
          )}
          {!disableQuantitySold && (
            <Col className="flex justify-end ">
              <Tag
                className="py-0.5 px-1"
                color={
                  data?.quantity_sold < get(data, "quantity", 0)
                    ? "red06"
                    : "green06"
                }
              >
                {isImport ? "Thực nhập" : "Thực xuất"}:{" "}
                {formatNumber(data?.quantity_sold)}
              </Tag>
            </Col>
          )}
        </OrderCard>
      </div>
    </div>
  );
};

export const DisplayCombo = ({
  data,
  disableQuantitySold,
  isImport,
  isPurchase,
}) => {
  return (
    <div className="grid gap-[2px] ml-2.5 text-gray-800">
      <span className="font-light italic text-[#6B7280] text-[10px] leading-[12px]">
        SP combo
      </span>
      <div className="bg-[#F3F4F6] rounded-[3px]">
        <OrderCard
          containerClassName={"border-b border-gray-200 pb-1"}
          product={{
            id: data?.product_id,
            name: data?.product?.name,
            sku: data?.product?.sku,
            quantity: data?.quantity,
          }}
        >
          <Col>
            Đơn giá -{" "}
            <span className="text-red-400">
              {isPurchase
                ? formatCurrency(data?.purchase_price ?? 0)
                : formatCurrency(data?.unit_price ?? 0)}
            </span>
          </Col>
          <Col className="flex justify-end gap-1">
            Thành tiền -{" "}
            <span className="text-green-500">
              {formatCurrency(data?.total ?? 0)}
            </span>
          </Col>
          {data?.product?.unit ? (
            <Col>
              Đơn vị -{" "}
              <span className="text-gray-500">
                {data?.product?.unit?.actual_name}
              </span>
            </Col>
          ) : (
            <div />
          )}
          {!disableQuantitySold && (
            <Col className="flex justify-end">
              <Tag
                className="py-0.5 px-1"
                color={
                  data?.quantity_sold < get(data, "quantity", 0)
                    ? "red06"
                    : "green06"
                }
              >
                {isImport ? "Thực nhập" : "Thực xuất"} :{" "}
                {formatNumber(data?.quantity_sold)}
              </Tag>
            </Col>
          )}
        </OrderCard>
        <div>
          <span className="font-light italic text-[#6B7280] text-[10px] leading-[12px]">
            {data?.combo?.length} sản phẩm kèm theo
          </span>
          <div className="flex flex-col pl-2.5">
            {data?.combo?.map((item, index) => (
              <div className="flex gap-[14px] px-2.5 py-[5px]">
                <span className="pt-[1px] text-xs italic">{index + 1}</span>
                <OrderCard
                  product={{
                    id: item?.product_id,
                    name: item?.product?.name,
                    sku:
                      item?.children?.product_type === "variable"
                        ? item?.variant?.sku
                        : item?.product?.sku,
                    quantity: item?.quantity,
                  }}
                  containerClassName={"py-0 px-0 flex-1"}
                >
                  {item?.variant_first?.title && (
                    <span className="bg-gray-200 px-[6px] rounded-[4px] py-[4px] text-[12px] w-fit text-[#6B7280] font-['Lato']">
                      {item?.variant_first?.title}
                    </span>
                  )}
                </OrderCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const DescriptionProduct = ({
  data,
  disableQuantitySold = false,
  isImport = true,
  isPurchase = false,
}: DescriptionGeneralProps) => {
  const [activeKeys, setActiveKeys] = useState<any>([]);

  const getStock = (data) => {
    const object = {};
    data?.forEach((i: any) => {
      if (!!object[i?.stock?.id]) {
        const newNumber = object[i?.stock?.id]?.number;
        object[i?.stock?.id] = {
          ...(i?.stock ?? {}),
          number: newNumber + 1,
        };
        return;
      }
      object[i?.stock?.id] = { ...(i?.stock ?? {}), number: 1 };
    });
    return Object.values(object);
  };

  const listCollapse = useCallback(
    () =>
      getStock(data)?.map((item: any) => {
        const childrenData = data?.filter((j: any) => j.stock?.id === item?.id);

        return {
          key: item.id,
          onClick: () => 1,
          label: (
            <div className="text-gray-800 font-medium text-[13px] leading-[15px]">
              <span className="text-gray-500"> Kho -</span>{" "}
              <span className="text-blue-500">{item?.stock_name}</span> (
              {item?.number} sản phẩm)
            </div>
          ),
          children: (
            <div className="flex flex-col gap-[5px]">
              {childrenData?.map((item: any) => {
                if (item?.children_type === "combo")
                  return (
                    <DisplayCombo
                      data={item}
                      disableQuantitySold={disableQuantitySold}
                      isImport={isImport}
                      isPurchase={isPurchase}
                    />
                  );
                return (
                  <DisplayVariable
                    data={item}
                    disableQuantitySold={disableQuantitySold}
                    isImport={isImport}
                    isPurchase={isPurchase}
                  />
                );
              })}
            </div>
          ),
        };
      }),
    [data],
  );
  return (
    <Row className="">
      <Collapse
        activeKey={activeKeys}
        containerClassName="flex flex-col gap-1 w-full"
        headingClassName={
          "p-1 bg-transparent !rounded-e-full focus:ring-0 flex flex-row-reverse gap-2.5 border-none border-b-[1px] border-gray-500"
        }
        contentClassName={"border-none p-0 !text-red-500"}
        onChange={(key: any) => setActiveKeys(key)}
        items={listCollapse()}
      />
    </Row>
  );
};

export default DescriptionProduct;
