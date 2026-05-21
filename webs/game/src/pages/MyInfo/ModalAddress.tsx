import ModalForm from "@tera/components/web/ModalForm";
import {
  messageValidate,
  messageWarning,
} from "@tera/commons/constants/message";
import Input from "@tera/components/dof/Control/Input";
import Select from "@tera/components/dof/Control/Select";
import TextArea from "@tera/components/dof/Control/TextArea";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import useConfirm from "@tera/game/_common/hooks/useConfirm";
import { useForm } from "react-hook-form";
import { Spin } from "tera-dls";

interface ModalAddressProps {
  id: number | string;
  open: boolean;
  onClose: () => void;
}

function ModalAddress(props: ModalAddressProps) {
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
      title={id ? "Sửa địa chỉ" : "Thêm địa chỉ"}
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
            name="district"
            label="Tiểu bang"
            rules={[
              {
                required: messageValidate.emptySelect,
              },
            ]}
          >
            <Select />
          </FormTeraItem>
          <FormTeraItem
            name="city"
            label="Thành phố"
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
            label="Mã bưu điện"
            rules={[
              {
                required: messageValidate.emptySelect,
              },
            ]}
          >
            <Select />
          </FormTeraItem>
          <FormTeraItem name="phone" label="Điện thoại">
            <Input />
          </FormTeraItem>
          <FormTeraItem name="address" label="Địa chỉ cụ thể">
            <TextArea />
          </FormTeraItem>
        </FormTera>
      </Spin>
    </ModalForm>
  );
}

export default ModalAddress;
