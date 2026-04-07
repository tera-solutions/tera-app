import React from "react";
import { Description, Image, Row, Tag, formatNumber } from "tera-dls";
import { get } from "lodash";

import CardForm from "@tera/components/web/CardForm";
import {
  ProductStatus,
  statusProductColor,
} from "@tera/components/shared/Stock/Product/constants";

function Product({ dataDetail }) {
  const info = [
    {
      title: "Tên sản phẩm",
      value: dataDetail?.name,
    },
    {
      title: "Trạng thái",
      value: (
        <Tag
          color={
            statusProductColor[get(dataDetail, "stock_products[0].status")]
          }
        >
          {ProductStatus[get(dataDetail, "stock_products[0].status")]}
        </Tag>
      ),
    },
    {
      title: "SKU",
      value: dataDetail?.sku,
    },
    {
      title: "Sản phẩm có mã serial",
      value: dataDetail?.enable_sr_no ? (
        <Tag color="green06">Có</Tag>
      ) : (
        <Tag color="gray03">Không</Tag>
      ),
    },
    {
      title: "Mã vạch / Barcode",
      value: dataDetail?.barcode,
    },
  ];

  const type = [
    {
      title: "Đơn vị",
      value: dataDetail?.unit?.actual_name,
    },
    {
      title: "Danh mục",
      value: dataDetail?.category?.name,
    },
    {
      title: "Nhãn hiệu",
      value: dataDetail?.brand?.name,
    },
    {
      title: "Nhà cung cấp",
      value: dataDetail?.contact?.name,
    },
  ];

  const warehouse = (item) => {
    return [
      {
        title: "Chi nhánh (Kho)",
        value: item.stock.stock_name,
      },
      {
        title: "Giá mua (đ)",
        value: formatNumber(item.purchase_price),
      },
      {
        title: "% giảm tối đa",
        value: item.sale_price,
      },
      {
        title: "Giá bán (đ)",
        value: formatNumber(item.unit_price),
      },
      {
        title: "Số lượng tồn kho",
        value: Number(item.quantity),
      },
      {
        title: "Tính toán giá bán (%)",
        value: "",
      },
      {
        title: "% tăng tối đa",
        value: item.sale_price_max,
      },
    ];
  };

  return (
    <Row className="grid grid-cols-2 gap-x-8 h-full overflow-hidden">
      <div className="flex flex-col gap-y-10 h-full overflow-auto">
        <div className="my-0 mx-auto">
          <Image
            containerClassName="h-[100px] w-[100px] overflow-hidden rounded"
            src={dataDetail?.image_url}
            alt={dataDetail?.image_url}
          />
        </div>
        <CardForm title="THÔNG TIN SẢN PHẨM">
          <Row className="grid grid-cols-2 gap-0">
            {info.map((item, index) => (
              <Description key={index} label={item?.title}>
                {item?.value}
              </Description>
            ))}
          </Row>
        </CardForm>
        <CardForm title="BẢO HÀNH">
          <Description label="Hình thức bảo hành">
            {dataDetail?.warranty?.name}
          </Description>
        </CardForm>
        <CardForm title="PHÂN LOẠI">
          <Row className="grid grid-cols-2 gap-0">
            {type.map((item, index) => (
              <Description key={index} label={item?.title}>
                {item?.value}
              </Description>
            ))}
          </Row>
        </CardForm>
        <CardForm title="KHO HÀNG" className="flex flex-col gap-y-2.5">
          {dataDetail?.stock_products?.map((item) => (
            <Row className="grid grid-cols-2 gap-0 p-5 border border-gray-200 rounded-lg">
              {warehouse(item).map((item, index) => (
                <Description key={index} label={item?.title}>
                  {item?.value}
                </Description>
              ))}
            </Row>
          ))}
        </CardForm>
      </div>
      <CardForm
        title="MÔ TẢ SẢN PHẨM"
        className="flex flex-col h-full overflow-hidden"
      >
        <div
          className="h-full overflow-auto px-10"
          dangerouslySetInnerHTML={{
            __html: dataDetail?.product_description,
          }}
        />
      </CardForm>
    </Row>
  );
}

export default Product;
