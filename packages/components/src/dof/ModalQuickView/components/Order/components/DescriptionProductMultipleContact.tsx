import { ReactNode, useCallback, useState } from "react";
import { Collapse, Row } from "tera-dls";
import { DisplayCombo, DisplayVariable } from "./DescriptionProduct";

type DescriptionGeneralProps = {
  data?: { title: ReactNode; value: ReactNode }[];
  disableQuantitySold?: boolean;
  isImport?: boolean;
  isPurchase?: boolean;
};

const DropdownChildren = ({
  data,
  disableQuantitySold = false,
  isImport = true,
  isPurchase = false,
}) => {
  const [activeChildKeys, setActiveChildKeys] = useState<any>([]);
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
    (data) =>
      getStock(data)?.map((item: any) => {
        const childrenData = data?.filter((j: any) => j.stock?.id === item?.id);

        return {
          key: item.id,
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
    [getStock],
  );
  return (
    <Collapse
      activeKey={activeChildKeys}
      containerClassName="flex flex-col gap-1 w-full "
      headingClassName={
        "p-1 bg-transparent !rounded-e-full focus:ring-0 flex flex-row-reverse gap-2.5 border-none border-b-[1px] border-gray-500"
      }
      contentClassName={"border-none p-0 !text-red-500"}
      onChange={(key: any) => setActiveChildKeys(key)}
      items={listCollapse(data)}
    />
  );
};
const DescriptionProductMultipleContact = ({
  data,
  disableQuantitySold = false,
  isImport = true,
  isPurchase = false,
}: DescriptionGeneralProps) => {
  const [activeKeys, setActiveKeys] = useState<any>([]);

  const getSupplier = (data) => {
    const object = {};
    data?.forEach((i: any) => {
      if (!!object[i?.product?.contact?.id]) {
        const newNumber = object[i?.product?.contact?.id]?.number;
        object[i?.product?.contact?.id] = {
          ...(i?.product?.contact ?? {}),
          number: newNumber + 1,
        };
        return;
      }
      object[i?.product?.contact?.id] = {
        ...(i?.product?.contact ?? {}),
        number: 1,
      };
    });
    return Object.values(object);
  };

  const listCollapseSupplier = useCallback(
    () =>
      getSupplier(data)?.map((item: any) => {
        const childrenData = data?.filter(
          (j: any) => j.product?.contact?.id === item?.id,
        );

        return {
          key: item.id,
          label: (
            <div className="text-gray-800 font-medium text-[13px] leading-[15px]">
              <span className="text-gray-500 font-normal"> Nhà cung cấp -</span>{" "}
              <span className="text-blue-500">{item?.business_name}</span>
            </div>
          ),
          children: (
            <div className="ml-2.5">
              <DropdownChildren
                data={childrenData}
                disableQuantitySold={disableQuantitySold}
                isImport={isImport}
                isPurchase={isPurchase}
              />
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
          "p-1 bg-transparent !rounded-e-full focus:ring-0 border-none border-b-[1px] "
        }
        contentClassName={"border-none p-0 !text-red-500"}
        onChange={(key: any) => setActiveKeys(key)}
        items={listCollapseSupplier()}
      />
    </Row>
  );
};

export default DescriptionProductMultipleContact;
