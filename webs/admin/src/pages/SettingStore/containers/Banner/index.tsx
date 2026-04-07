import { BTN_PRIMARY } from "@tera/commons/constants/common";
import Image from "@tera/components/dof/Control/Image";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { Button } from "tera-dls";

const Banner = () => {
  const form = useForm();

  const handleSubmitForm = (values) => {
    console.log(values);
  };

  return (
    <div className="border rounded-md shadow">
      <h2 className="py-3 px-6 text-base border-b">Cài đặt biểu ngữ</h2>
      <FormTera
        form={form}
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="py-4 px-8"
      >
        <FormTeraItem
          label="Băng rôn (1500x450)"
          name="banner"
          layout="inline"
          labelClassName="min-w-[200px]"
          className="items-start"
        >
          <Image folder="information-store" object_key="information-store" />
          <p className="text-gray-500 text-xs mt-1">
            Chúng tôi đã phải giới hạn chiều cao để duy trì nhất quán. Trong một
            số thiết bị, cả hai mặt của biểu ngữ có thể bị cắt để giới hạn chiều
            cao.
          </p>
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

export default Banner;
