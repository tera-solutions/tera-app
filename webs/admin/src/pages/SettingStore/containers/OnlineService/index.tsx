import { BTN_PRIMARY } from "@tera/commons/constants/common";
import Input from "@tera/components/dof/Control/Input";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { Button } from "tera-dls";

const OnlineService = () => {
  const form = useForm();

  const handleSubmitForm = (values) => {
    console.log(values);
  };

  return (
    <div className="border rounded-md shadow">
      <h2 className="py-3 px-6 text-base border-b">Change Online Service</h2>
      <FormTera
        form={form}
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="py-4 px-8"
      >
        <FormTeraItem
          label="Liên kết dịch vụ khách hàng"
          name="service"
          layout="inline"
          labelClassName="min-w-[200px]"
        >
          <Input placeholder="Online Service" />
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

export default OnlineService;
