import ModalForm from "@tera/components/web/ModalForm";
import {
  messageValidate,
  messageWarning,
} from "@tera/commons/constants/message";
import Input from "@tera/components/dof/Control/Input";
import InputNumber from "@tera/components/dof/Control/InputNumber";
import Radio from "@tera/components/dof/Control/Radio";
import RangePicker from "@tera/components/dof/Control/RangePicker";
import Select from "@tera/components/dof/Control/Select";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import useConfirm from "@tera/states/hooks/useConfirm";
import { useForm } from "react-hook-form";
import { Spin } from "tera-dls";

interface ShoppingVoucherFormProps {
  id: number | string;
  open: boolean;
  onClose: () => void;
}

function ShoppingVoucherForm(props: ShoppingVoucherFormProps) {
  const { open, id, onClose } = props;
  const form = useForm();
  const confirm = useConfirm();

  const isDirty = form.formState.isDirty;

  const handleCloseConfirm = () => {
    if (isDirty) {
      confirm.warning({
        title: "Thoát bản ghi",
        content: (
          <>
            <p>{messageWarning.WARNING_EXIT_1}</p>
            <p>{messageWarning.WARNING_EXIT_2}</p>
          </>
        ),
        onOk: () => onClose(),
      });
    } else onClose();
  };

  const handleSubmitForm = (values) => {
    console.log(values);
  };

  return (
    <ModalForm
      open={open}
      title={id ? "Sửa mã ưu đãi" : "Thêm mã ưu đãi"}
      width={500}
      onOk={() => form.handleSubmit(handleSubmitForm)()}
      onCancel={handleCloseConfirm}
    >
      <Spin spinning={false}>
        <FormTera form={form} onSubmit={form.handleSubmit(handleSubmitForm)}>
          <FormTeraItem
            name="type"
            label="Loại đơn áp dụng"
            rules={[
              {
                required: messageValidate.emptySelect,
              },
            ]}
          >
            <Select />
          </FormTeraItem>
          <FormTeraItem
            name="code"
            label="Mã ưu đãi"
            rules={[
              {
                required: messageValidate.emptyText,
              },
            ]}
          >
            <Input />
          </FormTeraItem>
          <FormTeraItem
            name="product"
            label="Sản phẩm"
            rules={[
              {
                required: messageValidate.emptySelect,
              },
            ]}
          >
            <Select />
          </FormTeraItem>
          <FormTeraItem name="date" label="Thời gian">
            <RangePicker />
          </FormTeraItem>
          <FormTeraItem name="discount_type">
            <Radio
              listOption={[
                {
                  label: "Giảm giá theo tiền",
                  value: "value",
                },
                {
                  label: "Giảm giá theo %",
                  value: "percent",
                },
              ]}
            />
          </FormTeraItem>
          <FormTeraItem name="discount_value">
            <InputNumber />
          </FormTeraItem>
        </FormTera>
      </Spin>
    </ModalForm>
  );
}

export default ShoppingVoucherForm;
