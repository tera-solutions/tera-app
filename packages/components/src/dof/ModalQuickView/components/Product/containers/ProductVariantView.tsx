import { useQuery } from "@tanstack/react-query";
import {
  MAXIMUM_CURRENCY,
  MAXIMUM_QUANTITY,
} from "@tera/commons/constants/common";
import { messageValidate } from "@tera/commons/constants/message";
import CategoryApi from "@tera/components/dof/ModalQuickView/api/category";
import TableTera from "@tera/components/dof/TableTera";
import { useEffect } from "react";
import customTwMerge from "tailwind-merge.config";
import {
  CheckOutlined,
  formatCurrency,
  formatNumber,
  Image,
  XMarkOutlined,
} from "tera-dls";

const ProductVariantView = ({ dataSource, value = {}, categoryId }) => {
  const {
    variantTitleFirst,
    variantAttributeFirst,
    variantTitleSecond,
    variantAttributeSecond,
  } = value as any;

  const { data: dataDetail, refetch } = useQuery({
    queryKey: ["get-detail-category", categoryId],
    queryFn: () => CategoryApi.getDetail(categoryId),
    enabled: !!categoryId,
    staleTime: 300000,
    gcTime: 300000,
  });

  useEffect(() => {
    categoryId && refetch();
  }, [categoryId]);

  const variantObject = dataDetail?.variants?.reduce((prev, cur) => {
    prev[cur?.id] = cur;
    return prev;
  }, {});

  const columns: any = [
    ...(variantTitleFirst && variantAttributeFirst?.length > 0
      ? [
          {
            title: variantObject?.[variantTitleFirst]?.title,
            dataIndex: variantTitleFirst,
            width: 100,
            onCell: (record) => {
              const data = dataSource.filter(
                (item) =>
                  item?.[variantTitleFirst] === record?.[variantTitleFirst],
              );
              return {
                rowSpan: data?.[0]?.id === record?.id ? data?.length : 0,
                className: "!align-middle border !bg-inherit",
              };
            },
            render: (val) => {
              const data = variantObject?.[variantTitleFirst]?.attributes?.find(
                (item) => item.id === val,
              );

              return data?.title;
            },
          },
        ]
      : []),
    ...(variantTitleSecond && variantAttributeSecond?.length > 0
      ? [
          {
            title: variantObject?.[variantTitleSecond]?.title,
            dataIndex: variantTitleSecond,
            width: 100,
            render: (val) => {
              const data = variantObject?.[
                variantTitleSecond
              ]?.attributes?.find((item) => item.id === val);
              return data?.title;
            },
          },
        ]
      : []),
    {
      title: "Hình ảnh",
      dataIndex: "image_url",
      width: 80,
      type: "select",
      render: (value, record) => (
        <Image
          src={value}
          imageClassName="object-cover"
          containerClassName={customTwMerge(
            "w-[30px] h-[30px] rounded overflow-hidden",
            !!record?.attribute_first_id && "ml-5",
          )}
        />
      ),
    },
    {
      title: "Chi nhánh (Kho)",
      dataIndex: "stock",
      width: 150,
      rules: [
        {
          required: messageValidate.emptySelect,
        },
      ],
      render: (val) => val?.stock_name,
    },
    {
      title: "Tồn kho ban đầu",
      dataIndex: "quantity",
      width: 150,
      editable: true,
      type: "int",
      inputProps: {
        min: 0,
        max: MAXIMUM_QUANTITY,
      },
      render: (quantity) => formatNumber(quantity),
    },
    {
      title: "Giá mua",
      dataIndex: "purchase_price",
      width: 150,
      editable: true,
      type: "int",
      inputProps: {
        min: 0,
        max: MAXIMUM_CURRENCY,
        formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
      },
      render: (unit_price) => formatCurrency(unit_price ?? 0),
    },
    {
      title: "Giá bán",
      dataIndex: "unit_price",
      width: 150,
      editable: true,
      type: "int",
      inputProps: {
        min: 0,
        max: MAXIMUM_CURRENCY,
        formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
      },
      render: (unit_price) => formatCurrency(unit_price ?? 0),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      width: 150,
      editable: true,
      type: "int",
      inputProps: {
        min: 0,
        max: 100,
      },
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      width: 150,
    },
    {
      title: "Mở bán",
      dataIndex: "is_sale",
      width: 80,
      render: (val) =>
        val ? (
          <CheckOutlined className="w-5 text-green-500" />
        ) : (
          <XMarkOutlined className="w-5 text-red-500" />
        ),
    },
  ];

  return (
    <>
      <TableTera
        key={columns}
        data={dataSource}
        rowKey={"id"}
        zebra={false}
        columns={columns}
        scroll={{ y: 300 }}
      />
    </>
  );
};

export default ProductVariantView;
