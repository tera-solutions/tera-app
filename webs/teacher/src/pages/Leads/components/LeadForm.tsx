import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { notification, Select } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import Input from "@tera/components/dof/Control/Input";
import TextArea from "@tera/components/dof/Control/TextArea";
import { LeadService } from "@tera/modules/crm";
import { useStores } from "@tera/stores/useStores";

import BranchSelect from "_common/components/BranchSelect";

import type { LeadFormValues, LeadRow } from "../_interface";
import { DEFAULT_FORM_VALUES, SOURCE_OPTIONS } from "../constants";

interface LeadFormProps {
  open: boolean;
  onClose: () => void;
  /** When set, the modal edits this lead instead of creating a new one. */
  lead?: LeadRow | null;
}

const LeadForm = ({ open, onClose, lead }: LeadFormProps) => {
  const isEdit = !!lead;
  const { globalStore } = useStores();
  const form = useForm<LeadFormValues>({
    mode: "onChange",
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { mutate: createLead, isPending: isCreating } = LeadService.useLeadCreate();
  const { mutate: updateLead, isPending: isUpdating } = LeadService.useLeadUpdate();
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;
    if (lead) {
      form.reset({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        source: lead.source || "facebook",
        note: "",
      });
    } else {
      form.reset(DEFAULT_FORM_VALUES);
    }
  }, [open, lead, form]);

  const handleClose = () => {
    form.reset(DEFAULT_FORM_VALUES);
    onClose();
  };

  const handleSubmit = (values: LeadFormValues) => {
    if (isEdit && lead) {
      updateLead(
        {
          id: lead.id,
          params: {
            name: values.name,
            phone: values.phone,
            email: values.email || undefined,
            source: values.source,
            note: values.note || undefined,
          },
        },
        {
          onSuccess: () => {
            notification.success({ message: "Cập nhật lead thành công" });
            handleClose();
          },
          onError: (error: any) => {
            notification.error({ message: error?.data?.msg ?? error?.message ?? "Không thể cập nhật lead" });
          },
        },
      );
      return;
    }

    const businessId = Number(globalStore.user?.business_id ?? globalStore.business_id);
    createLead(
      {
        params: {
          name: values.name,
          phone: values.phone,
          email: values.email || undefined,
          source: values.source,
          note: values.note || undefined,
          business_id: businessId,
          branch_id: values.branch_id,
          // Single-operator centers: the creating teacher owns the lead they add.
          owner_id: globalStore.user?.id,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Thêm lead thành công" });
          handleClose();
        },
        onError: (error: any) => {
          notification.error({ message: error?.data?.msg ?? error?.message ?? "Không thể thêm lead" });
        },
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={handleClose}
      isEdit={isEdit}
      titleCreate="Thêm lead"
      titleEdit="Sửa lead"
      className="!w-[95%] xmd:!w-[480px]"
      okText="Lưu"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isSubmitting}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem label="Họ tên" name="name" rules={[{ required: "Vui lòng nhập họ tên" }]}>
          <Input placeholder="VD: Nguyễn Thị Lan" />
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

        <FormTeraItem label="Nguồn" name="source" rules={[{ required: "Vui lòng chọn nguồn lead" }]}>
          <Controller
            control={form.control}
            name="source"
            render={({ field }) => <Select value={field.value} options={SOURCE_OPTIONS} onChange={field.onChange} />}
          />
        </FormTeraItem>

        {!isEdit && (
          <FormTeraItem label="Chi nhánh" name="branch_id" rules={[{ required: "Vui lòng chọn chi nhánh" }]}>
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
        )}

        <FormTeraItem label="Ghi chú" name="note">
          <TextArea placeholder="Quan tâm khóa học nào, đã liên hệ ra sao..." rows={3} />
        </FormTeraItem>
      </FormTera>
    </FormScaff>
  );
};

export default LeadForm;
