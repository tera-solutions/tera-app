import { useQueryLegacy, useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { useQueryClient } from "@tanstack/react-query";
import { REGEX } from "@tera/commons/constants/common";
import Input from "@tera/components/dof/Control/Input";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, notification, Spin } from "tera-dls";
import { UserApi } from "./api";
import useConfirm from "_common/hooks/useConfirm";
import { messageWarning } from "@tera/commons/constants/message";
import { tw } from "tailwind-merge.config";

interface ModalUpdateInformationProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

function ModalUpdateInformation({
  open,
  onCancel,
  onSuccess,
}: ModalUpdateInformationProps) {
  const form = useForm({ mode: "onChange" });
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const isDirty = form?.formState?.isDirty;

  const {
    data: detail,
    isLoading,
    refetch,
  } = useQueryLegacy({
    queryKey: ["get-user-profile"],
    queryFn: () => UserApi.getProfile(),
    staleTime: 300000,
    gcTime: 300000,
  });

  const { mutate: mutateUpdate, isLoading: isLoadingUpdate } =
    useMutationLegacy({
      mutationFn: (variables: any) => UserApi.update(variables),

      onSuccess: (res) => {
        if (res?.code === 200) {
          refetch();
          queryClient.invalidateQueries({
            queryKey: ["get_profile"],
          });
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

  useEffect(() => {
    if (!detail) return;

    form.reset({
      full_name: detail.full_name,
      phone: detail.phone,
      job_title: detail.job_title,
      department: detail.department,
    });
  }, [detail]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Modal
      title="Chỉnh sửa thông tin"
      open={open}
      okText="Đồng ý"
      cancelText="Hủy"
      className={tw("!w-3/4 xmd:!w-[700px]")}
      onCancel={handleCancel}
      onOk={() => form.handleSubmit(handleSubmitForm)()}
      destroyOnClose
      confirmLoading={isLoading || isLoadingUpdate}
    >
      <Spin spinning={isLoading || isLoadingUpdate}>
        <FormTera form={form} onSubmit={form.handleSubmit(handleSubmitForm)}>
          <FormTeraItem
            label="Họ và tên"
            rules={[{ required: "Vui lòng nhập dữ liệu" }]}
            name="full_name"
          >
            <Input placeholder="Vui lòng nhập" maxLength={100} />
          </FormTeraItem>
          <FormTeraItem
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                pattern: {
                  value: REGEX.PHONE_NUMBER,
                  message: "Số điện thoại không hợp lệ",
                },
              },
              {
                minLength: {
                  value: 8,
                  message: "Nhập tối thiểu 8 kí tự",
                },
              },
              { required: "Vui lòng nhập dữ liệu" },
            ]}
          >
            <Input maxLength={20} />
          </FormTeraItem>
        </FormTera>
      </Spin>
    </Modal>
  );
}

export default ModalUpdateInformation;
