import CardForm from "@tera/components/web/CardForm";
import {
  BTN_PRIMARY,
  BTN_PRIMARY_LIGHT,
  HEADING_CLASS_NAME,
  labelClassName,
} from "@tera/commons/constants/common";
import { messageValidate } from "@tera/commons/constants/message";
import Image from "@tera/components/dof/Control/Image";
import Input from "@tera/components/dof/Control/Input";
import InputPassword from "@tera/components/dof/Control/InputPassword";
import Toggle from "@tera/components/dof/Control/Switch";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import TableTera from "@tera/components/dof/TableTera";
import classNames from "classnames";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Row } from "tera-dls";
import ModalAddress from "./ModalAddress";

const MyInfo = () => {
  const form = useForm();
  const [openForm, setOpenForm] = useState({ open: false, id: null });

  const columns: any = [
    {
      title: "Quốc gia",
      dataIndex: "country",
    },
    {
      title: "Tiểu bang",
      dataIndex: "district",
    },
    {
      title: "Thành phố",
      dataIndex: "city",
    },
    {
      title: "Mã bưu điện",
      dataIndex: "code",
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ cụ thể",
      dataIndex: "address",
    },
  ];

  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Thông tin của tôi</h1>
      <Row className="gap-8 w-[90%] m-auto">
        <FormTera form={form} className="grid gap-8">
          <CardForm title="Thông tin cơ bản">
            <FormTeraItem
              name="name"
              label="Tên của bạn"
              layout="inline"
              rules={[
                {
                  required: messageValidate.emptyText,
                },
              ]}
              labelClassName={labelClassName}
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="phone"
              label="Điện thoại của bạn"
              layout="inline"
              labelClassName={labelClassName}
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="avatar"
              label="Ảnh đại diện"
              layout="inline"
              labelClassName={labelClassName}
              className="items-start"
            >
              <Image folder="" object_key="" />
            </FormTeraItem>
            <FormTeraItem
              name="password"
              label="Mật khẩu của bạn"
              layout="inline"
              labelClassName={labelClassName}
            >
              <InputPassword />
            </FormTeraItem>
            <FormTeraItem
              name="confirm-password"
              label="Xác nhận mật khẩu"
              layout="inline"
              labelClassName={labelClassName}
            >
              <InputPassword />
            </FormTeraItem>
          </CardForm>
          <CardForm title="Cài đặt thanh toán">
            <FormTeraItem
              name="cash"
              label="Thanh toán bằng tiền mặt"
              layout="inline"
              labelClassName={labelClassName}
            >
              <Toggle />
            </FormTeraItem>
            <FormTeraItem
              name="bank"
              label="Thanh toán qua ngân hàng"
              layout="inline"
              labelClassName={labelClassName}
            >
              <Toggle />
            </FormTeraItem>
            <FormTeraItem
              name="bank_name"
              label="Tên ngân hàng"
              layout="inline"
              labelClassName={labelClassName}
              className="items-start"
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="bank_number"
              label="Số tài khoản ngân hàng"
              layout="inline"
              labelClassName={labelClassName}
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="bank_"
              label="Số định tuyến ngân hàng"
              layout="inline"
              labelClassName={labelClassName}
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="usdt"
              label="USDT Payment"
              layout="inline"
              labelClassName={labelClassName}
            >
              <Toggle />
            </FormTeraItem>
            <FormTeraItem
              name="usdt_link"
              label="USDT Link"
              layout="inline"
              labelClassName={labelClassName}
            >
              <Input />
            </FormTeraItem>
            <FormTeraItem
              name="usdt"
              label="USDT Address"
              layout="inline"
              labelClassName={labelClassName}
            >
              <Input />
            </FormTeraItem>
          </CardForm>
          <Button className={classNames(BTN_PRIMARY, "ml-auto")}>Lưu</Button>
        </FormTera>
        <CardForm
          title="Địa chỉ nhà"
          rightContent={
            <Button
              className={BTN_PRIMARY_LIGHT}
              onClick={() => setOpenForm({ open: true, id: null })}
            >
              Thêm địa chỉ
            </Button>
          }
        >
          <TableTera data={[]} columns={columns} />
        </CardForm>
        <CardForm title="Thay đổi email của bạn">
          <FormTera form={form}>
            <FormTeraItem
              name="email"
              label="Email của bạn"
              layout="inline"
              labelClassName={labelClassName}
            >
              <div className="flex items-center gap-2.5">
                <Input />
                <Button
                  htmlType="button"
                  className={classNames(BTN_PRIMARY_LIGHT, "shrink-0")}
                >
                  Kiểm chứng
                </Button>
              </div>
            </FormTeraItem>
            <Button
              htmlType="button"
              className={classNames(BTN_PRIMARY, "ml-auto")}
            >
              Cập nhật email
            </Button>
          </FormTera>
        </CardForm>
      </Row>
      {openForm.open && (
        <ModalAddress
          open={openForm.open}
          id={openForm.id}
          onClose={() => setOpenForm({ open: false, id: null })}
        />
      )}
    </div>
  );
};

export default MyInfo;
