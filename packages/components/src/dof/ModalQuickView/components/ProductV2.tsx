import CardDetailProduct from "@tera/components/web/CardDetail";
import ViewListImage from "@tera/components/web/ViewListImage";
import {
  ProductStatus,
  statusProductColor,
} from "@tera/components/shared/Stock/Product/constants";
import { get } from "lodash";
import { Description, Tag } from "tera-dls";

const cardClasses = "shadow-none p-0";
const DetailProduct = ({ dataDetail }) => {
  const general = [
    {
      title: "Tên sản phẩm",
      value: dataDetail?.name,
    },
    {
      title: "SKU",
      value: dataDetail?.sku,
    },
    {
      title: "Mã vạch / Barcode",
      value: dataDetail?.barcode,
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
      title: "Sản phẩm có mã serial",
      value: dataDetail?.enable_sr_no ? (
        <Tag color="green06">Có</Tag>
      ) : (
        <Tag color="gray03">Không</Tag>
      ),
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
      value: dataDetail?.contact?.business_name,
    },
  ];

  const mapProductImages =
    dataDetail?.product_images?.map((item) => ({
      src: item?.image_url,
      alt: `image-${item?.id}`,
    })) || [];

  const listImage = [{ src: dataDetail?.image_url }, ...mapProductImages];

  return (
    <div className="flex">
      <ViewListImage listImage={listImage} />
      <div className="space-y-4">
        <CardDetailProduct title="Thông tin sản phẩm" className={cardClasses}>
          {general.map((item, index) => (
            <Description key={index} label={item?.title} className="gap-10">
              {item?.value}
            </Description>
          ))}
        </CardDetailProduct>

        <CardDetailProduct title="Bảo hành" className={cardClasses}>
          <Description label="Hình thức bảo hành" className="gap-10">
            {dataDetail?.warranty?.name}
          </Description>
        </CardDetailProduct>

        <CardDetailProduct title="Phân loại" className={cardClasses}>
          {type.map((item, index) => (
            <Description key={index} label={item?.title} className="gap-10">
              {item?.value}
            </Description>
          ))}
        </CardDetailProduct>
      </div>
    </div>
  );
};

export default DetailProduct;
