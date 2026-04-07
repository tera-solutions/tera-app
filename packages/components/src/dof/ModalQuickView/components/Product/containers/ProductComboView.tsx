import TableTera from "@tera/components/dof/TableTera";
import useQuickView from "@tera/states/hooks/useQuickView";
import {
  ProductType,
  ProductTypeColor,
} from "@tera/components/shared/Stock/constants/product";

import { useEffect, useMemo, useState } from "react";
import customTwMerge from "tailwind-merge.config";
import { formatCurrency, formatNumber, Image, Tag } from "tera-dls";

const ProductComboView = ({ value }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const { quickView, redirectDetails } = useQuickView();

  const data = useMemo(() => {
    const list = value ?? [];
    return list
      ? list?.map((item) => {
          if (item?.type === "variable") {
            return {
              ...item,
              key: `product_${item?.id}`,
              variants: item?.variants?.map((i) => ({
                ...(i ?? {}),
                key: `variant_${i?.id}`,
              })),
            };
          }
          return { ...item, key: `product_${item?.id}` };
        })
      : [];
  }, [value]);

  useEffect(() => {
    data && setExpandedRowKeys(data?.map((item) => item.key));
  }, [data]);

  const columns: any = [
    {
      title: "Hình ảnh",
      dataIndex: "image_url",
      width: 100,
      render: (value, record) => {
        return (
          <Image
            src={value}
            imageClassName="object-cover"
            containerClassName={customTwMerge(
              "w-[30px] h-[30px] rounded overflow-hidden",
              !!record?.attribute_first_id && "ml-5",
            )}
          />
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      width: 200,
      render: (product, record) => {
        if (!!record?.attribute_first_id) {
          return (
            <div>
              {record?.variant_first?.title}
              {record?.variant_second?.title && " / "}
              {record?.variant_second?.title}
            </div>
          );
        }
        return (
          <p
            className="line-clamp-2 text-blue-600 cursor-pointer inline-block"
            onClick={(e) => {
              e.stopPropagation();
              quickView({
                detail_id: record?.id,
                detail_type: "product",
                onView: () => redirectDetails("product", record?.id),
              });
            }}
          >
            {product}
          </p>
        );
      },
    },
    {
      title: "Loại SP",
      dataIndex: "type",
      width: 100,
      render: (val) =>
        val && <Tag color={ProductTypeColor[val]}>{ProductType[val]}</Tag>,
    },
    {
      title: "Chi nhánh (Kho)",
      dataIndex: "stock_id",
      width: 180,
      render: (_, record) => record?.stock?.stock_name,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      width: 80,
    },
    {
      title: "Số lượng",
      dataIndex: "number_quantity",
      width: 150,
      render: (quantity, record) => {
        if (record.type === "variable") {
          return "";
        }
        return formatNumber(quantity);
      },
    },
    {
      title: "Tồn kho",
      dataIndex: "quantity",
      width: 80,
      render: (val, record) => {
        if (record.type === "variable") {
          return "";
        }
        return formatNumber(val ?? 0);
      },
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      width: 100,
    },
    {
      title: "Giá bán lẻ",
      dataIndex: "unit_price",
      width: 100,
      render: (val, record) => {
        if (record?.type === "variable") {
          return "";
        }
        return formatCurrency(val ?? 0);
      },
    },
    {
      title: "Giá mua",
      dataIndex: "purchase_price",
      width: 100,
      render: (val, record) => {
        if (record?.type === "variable") {
          return "";
        }
        return formatCurrency(val ?? 0);
      },
    },
    {
      title: "Giá bán combo",
      dataIndex: "price_sale_combo",
      width: 150,
      render: (quantity, record) => {
        if (record.type === "variable") {
          return "";
        }
        return formatCurrency(quantity);
      },
    },
  ];
  return (
    <>
      <TableTera
        rowKey={"key"}
        columns={columns}
        zebra={false}
        data={data}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: setExpandedRowKeys,
          childrenColumnName: "variants",
        }}
        className="center-table"
        pagination={{}}
      />
    </>
  );
};

export default ProductComboView;
