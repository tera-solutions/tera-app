import { BTN_PRIMARY } from "@tera/commons/constants/common";
import Input from "@tera/components/dof/Control/Input";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { Button } from "tera-dls";

const Social = () => {
  const form = useForm();

  const handleSubmitForm = (values) => {
    console.log(values);
  };

  return (
    <div className="border rounded-md shadow">
      <h2 className="py-3 px-6 text-base border-b">
        Liên kết truyền thông xã hội
      </h2>
      <FormTera
        form={form}
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="py-4 px-8"
      >
        <FormTeraItem
          label="Facebook"
          name="facebook"
          layout="inline"
          labelClassName="min-w-[200px]"
        >
          <Input placeholder="Facebook" />
        </FormTeraItem>
        <FormTeraItem
          label="Instagram"
          name="instagram"
          layout="inline"
          labelClassName="min-w-[200px]"
        >
          <Input placeholder="Instagram" />
        </FormTeraItem>
        <FormTeraItem
          label="Twitter"
          name="twitter"
          layout="inline"
          labelClassName="min-w-[200px]"
        >
          <Input placeholder="Twitter" />
        </FormTeraItem>
        <FormTeraItem
          label="Google"
          name="google"
          layout="inline"
          labelClassName="min-w-[200px]"
        >
          <Input placeholder="Google" />
        </FormTeraItem>
        <FormTeraItem
          label="Youtube"
          name="youtube"
          layout="inline"
          labelClassName="min-w-[200px]"
        >
          <Input placeholder="Youtube" />
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

export default Social;
