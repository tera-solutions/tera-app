import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { notification } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import Input from "@tera/components/dof/Control/Input";

import { BankAccountService } from "@tera/modules/wallet";

export interface BankAccountFormValues {
  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;
  bank_branch?: string;
}

interface BankAccountModalProps {
  open: boolean;
  account: BankAccountFormValues | null;
  onClose: () => void;
}

const EMPTY_VALUES: BankAccountFormValues = {
  bank_name: "",
  bank_account_number: "",
  bank_account_holder: "",
  bank_branch: "",
};

/** Thiết lập/cập nhật tài khoản ngân hàng nhận tiền — 1 tài khoản/giáo viên (`fin/bank-account/me`). */
const BankAccountModal = ({ open, account, onClose }: BankAccountModalProps) => {
  const form = useForm<BankAccountFormValues>({
    mode: "onChange",
    defaultValues: EMPTY_VALUES,
  });
  const updateMutation = BankAccountService.useUpdateMyBankAccount();

  useEffect(() => {
    if (open) form.reset(account ?? EMPTY_VALUES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, account]);

  const handleSubmit = (values: BankAccountFormValues) => {
    updateMutation.mutate(
      { params: values },
      {
        onSuccess: () => {
          notification.success({ message: "Cập nhật tài khoản ngân hàng thành công" });
          onClose();
        },
        onError: (error: any) =>
          notification.error({
            message: error?.data?.msg ?? "Cập nhật thất bại. Vui lòng thử lại.",
          }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={!!account}
      titleCreate="Tài khoản ngân hàng nhận tiền"
      titleEdit="Tài khoản ngân hàng nhận tiền"
      className="!w-[95%] xmd:!w-[440px]"
      okText="Lưu"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={updateMutation.isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem
          label="Ngân hàng"
          name="bank_name"
          rules={[{ required: "Vui lòng nhập tên ngân hàng" }]}
        >
          <Input placeholder="VD: Vietcombank" maxLength={255} />
        </FormTeraItem>
        <FormTeraItem
          label="Số tài khoản"
          name="bank_account_number"
          rules={[{ required: "Vui lòng nhập số tài khoản" }]}
        >
          <Input placeholder="Nhập số tài khoản nhận tiền" maxLength={255} />
        </FormTeraItem>
        <FormTeraItem
          label="Chủ tài khoản"
          name="bank_account_holder"
          rules={[{ required: "Vui lòng nhập tên chủ tài khoản" }]}
        >
          <Input placeholder="Tên chủ tài khoản" maxLength={255} />
        </FormTeraItem>
        <FormTeraItem label="Chi nhánh (không bắt buộc)" name="bank_branch">
          <Input placeholder="VD: Chi nhánh Hà Nội" maxLength={255} />
        </FormTeraItem>
      </FormTera>
    </FormScaff>
  );
};

export default BankAccountModal;
