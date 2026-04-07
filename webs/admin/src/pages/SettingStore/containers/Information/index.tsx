import { BTN_PRIMARY } from "@tera/commons/constants/common";
import { messageValidate } from "@tera/commons/constants/message";
import Image from "@tera/components/dof/Control/Image";
import Input from "@tera/components/dof/Control/Input";
import TextArea from "@tera/components/dof/Control/TextArea";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import classNames from "classnames";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "tera-dls";

const Information = () => {
  const form = useForm();

  const handleSubmitForm = (values) => {
    console.log(values);
  };

  return (
    <div className="border rounded-md shadow">
      <h2 className="py-3 px-6 text-base border-b">Thông tin cơ bản</h2>
      <FormTera
        form={form}
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="py-4 px-8"
      >
        <FormTeraItem
          label="Tên cửa hàng"
          name="name"
          layout="inline"
          labelClassName="min-w-[200px]"
          rules={[
            {
              required: messageValidate.emptyText,
            },
          ]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </FormTeraItem>
        <FormTeraItem
          label="Biểu ngữ cửa hàng"
          name="banner"
          layout="inline"
          labelClassName="min-w-[200px]"
          className="items-start"
        >
          <Image folder="information-store" object_key="information-store" />
        </FormTeraItem>
        <FormTeraItem
          label="Điện thoại"
          name="phone"
          layout="inline"
          labelClassName="min-w-[200px]"
          rules={[
            {
              required: messageValidate.emptyText,
            },
          ]}
        >
          <Input placeholder="Điện thoại" />
        </FormTeraItem>
        <FormTeraItem
          label="Tiêu đề meta"
          name="title"
          layout="inline"
          labelClassName="min-w-[200px]"
          rules={[
            {
              required: messageValidate.emptyText,
            },
          ]}
        >
          <Input placeholder="Tiêu đề meta" />
        </FormTeraItem>
        <FormTeraItem
          label="Mô tả meta"
          name="description"
          layout="inline"
          labelClassName="min-w-[200px]"
          className="items-start"
          rules={[
            {
              required: messageValidate.emptyText,
            },
          ]}
        >
          <TextArea rows={3} />
        </FormTeraItem>
        <Button
          htmlType="submit"
          className={classNames(BTN_PRIMARY, "ml-auto")}
        >
          Cập nhật
        </Button>
      </FormTera>
    </div>
  );
};

export default Information;
