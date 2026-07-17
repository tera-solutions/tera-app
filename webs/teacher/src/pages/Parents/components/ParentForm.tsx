import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, notification, Select } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import Input from "@tera/components/dof/Control/Input";
import { ParentService, ParentStudentService } from "@tera/modules/crm";

import type { ParentFormValues, ParentRow } from "../_interface";
import { DEFAULT_FORM_VALUES, RELATION_OPTIONS } from "../constants";

interface RosterOption {
  id: number;
  name: string;
  class_name: string;
}

interface ParentFormProps {
  open: boolean;
  onClose: () => void;
  rosterOptions: RosterOption[];
  /** When set, the modal edits this parent instead of creating a new one. */
  parent?: ParentRow | null;
}

const ParentForm = ({ open, onClose, rosterOptions, parent }: ParentFormProps) => {
  const isEdit = !!parent;
  const form = useForm<ParentFormValues>({
    mode: "onChange",
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { mutate: createParent, isPending: isCreatingParent } = ParentService.useParentCreate();
  const { mutate: updateParent, isPending: isUpdatingParent } = ParentService.useParentUpdate();
  const { mutate: linkStudent, isPending: isLinking } = ParentStudentService.useParentStudentCreate();
  const isSubmitting = isCreatingParent || isUpdatingParent || isLinking;

  useEffect(() => {
    if (!open) return;
    if (parent) {
      form.reset({
        name: parent.name,
        phone: parent.phone,
        email: parent.email,
        relation: parent.relation || "Mẹ",
        student_id: undefined,
      });
    } else {
      form.reset(DEFAULT_FORM_VALUES);
    }
  }, [open, parent, form]);

  const handleClose = () => {
    form.reset(DEFAULT_FORM_VALUES);
    onClose();
  };

  const handleSubmit = (values: ParentFormValues) => {
    if (isEdit && parent) {
      updateParent(
        { id: parent.id, params: { name: values.name, phone: values.phone, email: values.email } },
        {
          onSuccess: () => {
            notification.success({ message: "Cập nhật phụ huynh thành công" });
            handleClose();
          },
          onError: (error: any) => {
            notification.error({
              message: error?.data?.msg ?? error?.message ?? "Không thể cập nhật phụ huynh",
            });
          },
        },
      );
      return;
    }
    createParent(
      { params: { name: values.name, phone: values.phone, email: values.email } },
      {
        onSuccess: (res: any) => {
          const parentId = res?.data?.id;
          if (parentId && values.student_id) {
            linkStudent(
              {
                params: {
                  parent_id: parentId,
                  student_id: values.student_id,
                  relation: values.relation,
                },
              },
              {
                onError: (error: any) => {
                  notification.error({
                    message:
                      error?.data?.msg ?? error?.message ?? "Không thể liên kết học viên",
                  });
                },
              },
            );
          }
          notification.success({ message: "Thêm phụ huynh thành công" });
          handleClose();
        },
        onError: (error: any) => {
          notification.error({
            message: error?.data?.msg ?? error?.message ?? "Không thể thêm phụ huynh",
          });
        },
      },
    );
  };

  return (
    <Modal
      title={isEdit ? "Sửa phụ huynh" : "Thêm phụ huynh"}
      open={open}
      className="!w-[95%] xmd:!w-[520px]"
      okText="Lưu"
      cancelText="Hủy"
      onCancel={handleClose}
      onOk={() => form.handleSubmit(handleSubmit)()}
      destroyOnClose
      confirmLoading={isSubmitting}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem label="Họ tên" name="name" rules={[{ required: "Vui lòng nhập họ tên" }]}>
          <Input placeholder="VD: Trần Thị An" />
        </FormTeraItem>

        <FormTeraItem
          label="Số điện thoại"
          name="phone"
          rules={[{ required: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="09xxxxxxxx" />
        </FormTeraItem>

        <FormTeraItem label="Email" name="email">
          <Input placeholder="email@example.com" />
        </FormTeraItem>

        {!isEdit && (
          <>
            <FormTeraItem label="Vai trò" name="relation">
              <Controller
                control={form.control}
                name="relation"
                render={({ field }) => (
                  <Select value={field.value} options={RELATION_OPTIONS} onChange={field.onChange} />
                )}
              />
            </FormTeraItem>

            <FormTeraItem
              label="Con học viên"
              name="student_id"
              rules={[{ required: "Vui lòng chọn học viên" }]}
            >
              <Controller
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    placeholder="Chọn học viên"
                    onChange={field.onChange}
                    options={rosterOptions.map((s) => ({
                      value: s.id,
                      label: `${s.name}${s.class_name ? ` — ${s.class_name}` : ""}`,
                    }))}
                  />
                )}
              />
            </FormTeraItem>
          </>
        )}
      </FormTera>
    </Modal>
  );
};

export default ParentForm;
