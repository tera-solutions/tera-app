import ModalForm from "@tera/components/web/ModalForm";
import {
  messageValidate,
  messageWarning,
} from "@tera/commons/constants/message";
import Image from "@tera/components/dof/Control/Image";
import Input from "@tera/components/dof/Control/Input";
import TextArea from "@tera/components/dof/Control/TextArea";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import useConfirm from "@tera/states/hooks/useConfirm";
import { useForm } from "react-hook-form";
import { Spin } from "tera-dls";

interface SupportTicketFormProps {
  id: number | string;
  open: boolean;
  onClose: () => void;
}

function SupportTicketForm(props: SupportTicketFormProps) {
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
      title={id ? "Sửa vé ủng hộ" : "Thêm vé ủng hộ"}
      width={500}
      onOk={() => form.handleSubmit(handleSubmitForm)()}
      onCancel={handleCloseConfirm}
    >
      <Spin spinning={false}>
        <FormTera form={form} onSubmit={form.handleSubmit(handleSubmitForm)}>
          <FormTeraItem
            name="avatar"
            label="Ảnh đại diện"
            rules={[
              {
                required: messageValidate.emptySelect,
              },
            ]}
          >
            <Image folder="" object_key="" />
          </FormTeraItem>
          <FormTeraItem
            name="type"
            label="Loại đơn áp dụng"
            rules={[
              {
                required: messageValidate.emptySelect,
              },
            ]}
          >
            <Input />
          </FormTeraItem>
          <FormTeraItem
            name="description"
            label="Mô tả"
            rules={[
              {
                required: messageValidate.emptySelect,
              },
            ]}
          >
            <TextArea rows={5} />
          </FormTeraItem>
        </FormTera>
      </Spin>
    </ModalForm>
  );
}

export default SupportTicketForm;
