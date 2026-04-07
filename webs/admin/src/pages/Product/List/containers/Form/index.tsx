import CardForm from "@tera/components/web/CardForm";
import PageForm from "@tera/components/web/PageForm";
import { BTN_PRIMARY, labelClassName } from "@tera/commons/constants/common";
import DatePicker from "@tera/components/dof/Control/DatePicker";
import Image from "@tera/components/dof/Control/Image";
import Input from "@tera/components/dof/Control/Input";
import InputNumber from "@tera/components/dof/Control/InputNumber";
import Select from "@tera/components/dof/Control/Select";
import Toggle from "@tera/components/dof/Control/Switch";
import TextArea from "@tera/components/dof/Control/TextArea";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button, ItemType, Row } from "tera-dls";
import { PRODUCT_LIST_URL } from "../../url";

const ProductFormPage = () => {
  const form = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const breadcrumb: ItemType[] = [
    {
      title: <a className="cursor-pointer">Danh sách sản phẩm</a>,
      onClick: () => navigate(PRODUCT_LIST_URL.list.path),
    },
    {
      title: id ? "Sửa sản phẩm" : "Thêm sản phẩm",
    },
  ];

  return (
    <PageForm
      breadcrumb={breadcrumb}
      rightHeader={<Button className={BTN_PRIMARY}>Lưu</Button>}
    >
      <FormTera form={form} className="grid grid-cols-4 gap-8">
        <div className="col-span-3 flex flex-col gap-5">
          <CardForm title="Thông tin sản phẩm">
            <FormTeraItem
              name="1"
              label="Tên sản phẩm"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="2"
              label="Danh mục"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="3"
              label="Thương hiệu"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="4"
              label="Đơn vị"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="5"
              label="Số lượng mua tối thiểu"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="6"
              label="Thẻ"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="7"
              label="Mã vạch"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="8"
              label="Có thể hoàn trả"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Toggle />
            </FormTeraItem>
          </CardForm>
          <CardForm title="Hình ảnh sản phẩm">
            <FormTeraItem
              name="9"
              label="Tên sản phẩm"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Image folder="" object_key="" multiple />
            </FormTeraItem>
            <FormTeraItem
              name="10"
              label="Danh mục"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Image folder="" object_key="" multiple />
            </FormTeraItem>
          </CardForm>
          <CardForm title="Video sản phẩm">
            <FormTeraItem
              name="11"
              label="Nhà cung cấp video"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Select />
            </FormTeraItem>
            <FormTeraItem
              name="12"
              label="Liên kêt video"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Input />
            </FormTeraItem>
          </CardForm>
          <CardForm title="Giá sản phẩm + cổ phiếu">
            <FormTeraItem
              name="13"
              label="Đơn giá"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="14"
              label="Ngày khuyến mãi"
              labelClassName={labelClassName}
              layout="inline"
            >
              <DatePicker />
            </FormTeraItem>
            <Row className="grid-cols-4 items-center gap-4">
              <FormTeraItem
                name="15"
                label="Miễn giảm"
                labelClassName={labelClassName}
                layout="inline"
                className="col-span-3"
              >
                <Input />
              </FormTeraItem>
              <FormTeraItem name="16">
                <Select />
              </FormTeraItem>
            </Row>
            <FormTeraItem
              name="17"
              label="SKU"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="18"
              label="Liên kết bên ngoài"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Input />
              <p className="text-[10px] text-gray-500 mt-1">
                Để trống nếu bạn không sử dụng liên kết trang web bên ngoài
              </p>
            </FormTeraItem>
            <FormTeraItem
              name="19"
              label="Văn bản nút liên kết bên ngoài"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Input />
              <p className="text-[10px] text-gray-500 mt-1">
                Để trống nếu bạn không sử dụng liên kết trang web bên ngoài
              </p>
            </FormTeraItem>
          </CardForm>
          <CardForm title="Mô tả">
            <FormTeraItem name="20">
              <TextArea rows={10} />
            </FormTeraItem>
          </CardForm>
          <CardForm title="Đặc tả PDF">
            <FormTeraItem name="21">
              <Image object_key="" folder="" multiple />
            </FormTeraItem>
          </CardForm>
          <CardForm title="Thẻ meta SEO">
            <FormTeraItem
              name="22"
              label="Tiêu đề meta"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="23"
              label="Sự mô tả"
              labelClassName={labelClassName}
              layout="inline"
            >
              <TextArea rows={10} />
            </FormTeraItem>
            <FormTeraItem
              name="24"
              label="Hình ảnh meta"
              labelClassName={labelClassName}
              layout="inline"
            >
              <Image object_key="" folder="" multiple />
            </FormTeraItem>
          </CardForm>
        </div>
        <div className="flex flex-col gap-5">
          <CardForm title="Cấu hình vận chuyển">
            <FormTeraItem
              name="25"
              label="Miễn phí vận chuyển"
              labelClassName={labelClassName}
              layout="inline"
              className="items-start"
            >
              <div className="flex justify-end">
                <Toggle />
              </div>
            </FormTeraItem>
            <FormTeraItem
              name="26"
              label="Tỷ lệ cố định"
              labelClassName={labelClassName}
              layout="inline"
              className="items-start"
            >
              <div className="flex justify-end">
                <Toggle />
              </div>
            </FormTeraItem>
            <FormTeraItem
              name="40"
              label="Giá vận chuyển"
              labelClassName={labelClassName}
              layout="inline"
              className="items-start"
            >
              <Input />
            </FormTeraItem>
          </CardForm>
          <CardForm title="Cảnh báo số lượng hàng tồn kho thấp">
            <FormTeraItem name="27" label="Số lượng">
              <Input />
            </FormTeraItem>
          </CardForm>
          <CardForm title="Trạng thái hiển thị trong kho">
            <FormTeraItem
              name="28"
              label="Hiển thị số lượng hàng tồn kho"
              labelClassName={labelClassName}
              layout="inline"
              className="items-start"
            >
              <div className="flex justify-end">
                <Toggle />
              </div>
            </FormTeraItem>
            <FormTeraItem
              name="29"
              label="Chỉ Hiển thị Kho Bằng Văn bản"
              labelClassName={labelClassName}
              layout="inline"
              className="items-start"
            >
              <div className="flex justify-end">
                <Toggle />
              </div>
            </FormTeraItem>
            <FormTeraItem
              name="30"
              label="Ẩn hàng"
              labelClassName={labelClassName}
              layout="inline"
              className="items-start"
            >
              <div className="flex justify-end">
                <Toggle />
              </div>
            </FormTeraItem>
          </CardForm>
          <CardForm title="Thanh toán khi giao hàng">
            <FormTeraItem
              name="31"
              label="Trạng thái"
              labelClassName={labelClassName}
              layout="inline"
              className="items-start"
            >
              <div className="flex justify-end">
                <Toggle />
              </div>
            </FormTeraItem>
          </CardForm>
          <CardForm title="Ước tính thời gian vận chuyển">
            <FormTeraItem name="32" label="Ngày vận chuyển">
              <DatePicker />
            </FormTeraItem>
          </CardForm>
          <CardForm title="Thuế VAT">
            <p className="mb-1">Tax</p>
            <Row className="grid-cols-2">
              <FormTeraItem name="33">
                <InputNumber />
              </FormTeraItem>
              <FormTeraItem name="34">
                <Select />
              </FormTeraItem>
            </Row>
          </CardForm>
        </div>
      </FormTera>
    </PageForm>
  );
};

export default ProductFormPage;
