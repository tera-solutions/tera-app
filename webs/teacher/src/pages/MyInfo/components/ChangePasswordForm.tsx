import { useForm } from "react-hook-form";
import { notification } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import InputPassword from "@tera/components/dof/Control/InputPassword";

import { ProfileService } from "@tera/modules/system";

import type { ChangePasswordFormValues } from "../_interface";

interface ChangePasswordFormProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordForm = ({ open, onClose }: ChangePasswordFormProps) => {
  const form = useForm<ChangePasswordFormValues>({
    mode: "onChange",
    defaultValues: { current_password: "", new_password: "", confirm_password: "" },
  });

  const { mutate: changePassword, isPending } = ProfileService.useChangePassword();

  const handleClose = () => {
    form.reset({ current_password: "", new_password: "", confirm_password: "" });
    onClose();
  };

  const handleSubmit = (values: ChangePasswordFormValues) => {
    if (values.new_password !== values.confirm_password) {
      form.setError("confirm_password", { message: "Mật khẩu xác nhận không khớp" });
      return;
    }
    changePassword(
      { current_password: values.current_password, new_password: values.new_password },
      {
        onSuccess: () => {
          notification.success({ message: "Đổi mật khẩu thành công" });
          handleClose();
        },
        onError: (error: any) => {
          notification.error({
            message: error?.data?.msg ?? error?.message ?? "Không thể đổi mật khẩu",
          });
        },
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={handleClose}
      isEdit
      titleCreate="Đổi mật khẩu"
      titleEdit="Đổi mật khẩu"
      className="!w-[95%] xmd:!w-[420px]"
      okText="Lưu"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem
          label="Mật khẩu hiện tại"
          name="current_password"
          rules={[{ required: "Vui lòng nhập mật khẩu hiện tại" }]}
        >
          <InputPassword />
        </FormTeraItem>
        <FormTeraItem
          label="Mật khẩu mới"
          name="new_password"
          rules={[
            {
              required: "Vui lòng nhập mật khẩu mới",
              minLength: { value: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
            },
          ]}
        >
          <InputPassword />
        </FormTeraItem>
        <FormTeraItem
          label="Xác nhận mật khẩu mới"
          name="confirm_password"
          rules={[{ required: "Vui lòng xác nhận mật khẩu mới" }]}
        >
          <InputPassword />
        </FormTeraItem>
      </FormTera>
    </FormScaff>
  );
};

export default ChangePasswordForm;
