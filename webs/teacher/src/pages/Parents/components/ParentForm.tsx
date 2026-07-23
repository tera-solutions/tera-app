import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { notification, Select } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import Input from "@tera/components/dof/Control/Input";
import { ParentService } from "@tera/modules/crm";
import { useStores } from "@tera/stores/useStores";

import AvatarUpload from "_common/components/AvatarUpload";
import BranchSelect from "_common/components/BranchSelect";

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
  const { globalStore } = useStores();
  const form = useForm<ParentFormValues>({
    mode: "onChange",
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { mutate: createParent, isPending: isCreatingParent } = ParentService.useParentCreate();
  const { mutate: updateParent, isPending: isUpdatingParent } = ParentService.useParentUpdate();
  const isSubmitting = isCreatingParent || isUpdatingParent;

  useEffect(() => {
    if (!open) return;
    if (parent) {
      form.reset({
        name: parent.name,
        phone: parent.phone,
        email: parent.email,
        avatar: parent.avatar,
        branch_id: undefined,
        relation: parent.relation || "mother",
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
        {
          id: parent.id,
          params: {
            name: values.name,
            phone: values.phone,
            email: values.email,
            avatar: values.avatar || undefined,
          },
        },
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
    const businessId = Number(globalStore.user?.business_id ?? globalStore.business_id);
    createParent(
      {
        params: {
          name: values.name,
          phone: values.phone,
          email: values.email,
          avatar: values.avatar || undefined,
          business_id: businessId,
          branch_id: values.branch_id != null ? Number(values.branch_id) : undefined,
          students: values.student_id
            ? [{ student_id: values.student_id, relation: values.relation }]
            : undefined,
        },
      },
      {
        onSuccess: () => {
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
    <FormScaff
      open={open}
      onClose={handleClose}
      isEdit={isEdit}
      titleCreate="Thêm phụ huynh"
      titleEdit="Sửa phụ huynh"
      className="!w-[95%] xmd:!w-[520px]"
      okText="Lưu"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isSubmitting}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <Controller
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <div className="mb-3 flex justify-center">
              <AvatarUpload
                src={field.value}
                alt={form.watch("name")}
                onUploaded={(url) => field.onChange(url)}
              />
            </div>
          )}
        />

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
            <FormTeraItem label="Chi nhánh" name="branch_id">
              <Controller
                control={form.control}
                name="branch_id"
                render={({ field }) => (
                  <BranchSelect
                    value={field.value}
                    onChange={(v) => field.onChange(v != null ? Number(v) : undefined)}
                  />
                )}
              />
            </FormTeraItem>

            <FormTeraItem label="Con học viên (không bắt buộc)" name="student_id">
              <Controller
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    placeholder="Chọn học viên, hoặc bỏ trống và liên kết sau"
                    allowClear
                    onChange={field.onChange}
                    options={rosterOptions.map((s) => ({
                      value: s.id,
                      label: `${s.name}${s.class_name ? ` — ${s.class_name}` : ""}`,
                    }))}
                  />
                )}
              />
            </FormTeraItem>

            {form.watch("student_id") != null && (
              <FormTeraItem label="Vai trò" name="relation" rules={[{ required: "Vui lòng chọn vai trò" }]}>
                <Controller
                  control={form.control}
                  name="relation"
                  render={({ field }) => (
                    <Select value={field.value} options={RELATION_OPTIONS} onChange={field.onChange} />
                  )}
                />
              </FormTeraItem>
            )}
          </>
        )}
      </FormTera>
    </FormScaff>
  );
};

export default ParentForm;
