import { useMutationLegacy } from "@tera/commons/hooks/tanstack";

import ErrorToast from "@tera/components/web/ToastCustom/ErrorsToast";
import { REGEX } from "@tera/commons/constants/common";
import {
  messageValidate,
  messageWarning,
} from "@tera/commons/constants/message";
import InputPassword from "@tera/components/dof/Control/InputPassword";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import useConfirm from "@tera/game/_common/hooks/useConfirm";
import { useForm } from "react-hook-form";
import { Modal, notification, Spin } from "tera-dls";
import { UserApi } from "./api";
import { tw } from "tailwind-merge.config";

interface ModalResetPasswordProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

function ModalResetPassword({
  open,
  onCancel,
  onSuccess,
}: ModalResetPasswordProps) {
  const form = useForm({ mode: "onChange" });
  const confirm = useConfirm();
  const isDirty = form?.formState?.isDirty;

  const { mutate: mutateUpdate, isLoading } = useMutationLegacy({
    mutationFn: (variables: any) => UserApi.changePassword(variables),

    onSuccess: (res) => {
      if (res?.code === 200) {
        notification.success({
          message: res?.msg,
        });
        onCancel();
        onSuccess && onSuccess();
      }
    },
  });

  const handleSubmitForm = (value) => {
    mutateUpdate(value);
  };

  const handleCancel = () => {
    if (isDirty)
      confirm.warning({
        title: "Thoát bản ghi",
        onOk: () => {
          onCancel();
        },
        content: (
          <>
            <p>{messageWarning.WARNING_EXIT_1}</p>
            <p>{messageWarning.WARNING_EXIT_2}</p>
          </>
        ),
      });
    else onCancel();
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      open={open}
      className={tw("!w-3/4 xmd:!w-[500px]")}
      okText="Đồng ý"
      cancelText="Hủy"
      onCancel={handleCancel}
      onOk={() => form.handleSubmit(handleSubmitForm)()}
      destroyOnClose
      confirmLoading={isLoading}
    >
      <Spin spinning={isLoading}>
        <FormTera form={form} onSubmit={form.handleSubmit(handleSubmitForm)}>
          <FormTeraItem
            label="Mật khẩu hiện tại"
            name="old_password"
            rules={[
              {
                required: messageValidate.emptyText,
                pattern: {
                  value: new RegExp(REGEX.PASSWORD),
                  message: messageValidate.password,
                },
                minLength: {
                  value: 8,
                  message: "Mật khẩu tối thiểu 8 ký tự",
                },
                maxLength: {
                  value: 16,
                  message: "Mật khẩu không vượt quá 16 ký tự",
                },
              },
            ]}
          >
            <InputPassword placeholder="Vui lòng nhập mật khẩu" />
          </FormTeraItem>
          <FormTeraItem
            label="Mật khẩu mới"
            name="new_password"
            rules={[
              {
                required: messageValidate.emptyText,
                pattern: {
                  value: new RegExp(REGEX.PASSWORD),
                  message: messageValidate.password,
                },
                minLength: {
                  value: 8,
                  message: "Mật khẩu tối thiểu 8 ký tự",
                },
                maxLength: {
                  value: 16,
                  message: "Mật khẩu không vượt quá 16 ký tự",
                },
              },
            ]}
          >
            <InputPassword placeholder="Vui lòng nhập mật khẩu" />
          </FormTeraItem>
          <FormTeraItem
            label="Nhập lại mật khẩu mới"
            name="confirm_password"
            rules={[
              {
                required: messageValidate.emptyText,
                pattern: {
                  value: new RegExp(REGEX.PASSWORD),
                  message: messageValidate.password,
                },
                minLength: {
                  value: 8,
                  message: "Mật khẩu tối thiểu 8 ký tự",
                },
                maxLength: {
                  value: 16,
                  message: "Mật khẩu không vượt quá 16 ký tự",
                },
              },
            ]}
          >
            <InputPassword placeholder="Vui lòng nhập mật khẩu" />
          </FormTeraItem>
        </FormTera>
      </Spin>
    </Modal>
  );
}

export default ModalResetPassword;
