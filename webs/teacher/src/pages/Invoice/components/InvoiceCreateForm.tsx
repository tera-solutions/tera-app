import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { notification } from "tera-dls";

import { useStores } from "@tera/stores/useStores";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import Input from "@tera/components/dof/Control/Input";
import InputNumber from "@tera/components/dof/Control/InputNumber";
import TextArea from "@tera/components/dof/Control/TextArea";
import DatePicker from "@tera/components/dof/Control/DatePicker";
import { InvoiceService } from "@tera/modules/finance";
import StudentSelect from "_common/components/StudentSelect";

interface InvoiceCreateFormValues {
  student_id: number | string | undefined;
  item_name: string;
  quantity: number;
  unit_price: number;
  due_date?: string;
  note?: string;
}

const DEFAULT_VALUES: InvoiceCreateFormValues = {
  student_id: undefined,
  item_name: "Học phí",
  quantity: 1,
  unit_price: 0,
  due_date: undefined,
  note: "",
};

interface InvoiceCreateFormProps {
  open: boolean;
  onClose: () => void;
}

/** Hóa đơn khoản phải thu (học phí) cho học viên — hóa đơn chi (payable, cần duyệt)
 * là nghiệp vụ kế toán/nhà cung cấp, ngoài phạm vi tự phục vụ của giáo viên. */
const InvoiceCreateForm = ({ open, onClose }: InvoiceCreateFormProps) => {
  const { globalStore } = useStores();
  const form = useForm<InvoiceCreateFormValues>({ mode: "onChange", defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    if (open) form.reset(DEFAULT_VALUES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const { mutate: createInvoice, isPending } = InvoiceService.useInvoiceCreate();

  const handleClose = () => {
    form.reset(DEFAULT_VALUES);
    onClose();
  };

  const handleSubmit = (values: InvoiceCreateFormValues) => {
    if (!values.student_id) return;
    const businessId = Number(globalStore.user?.business_id ?? globalStore.business_id);

    createInvoice(
      {
        params: {
          invoice_type: "receivable",
          business_id: businessId,
          partner_type: "student",
          partner_id: values.student_id,
          student_id: values.student_id,
          due_date: values.due_date || undefined,
          note: values.note || undefined,
          items: [
            {
              name: values.item_name,
              quantity: values.quantity,
              unit_price: values.unit_price,
            },
          ],
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Tạo hóa đơn thành công" });
          handleClose();
        },
        onError: (error: any) =>
          notification.error({ message: error?.data?.msg ?? "Không thể tạo hóa đơn" }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={handleClose}
      isEdit={false}
      titleCreate="Tạo hóa đơn học phí"
      titleEdit="Tạo hóa đơn học phí"
      className="!w-[95%] xmd:!w-[480px]"
      okText="Tạo hóa đơn"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem label="Học viên" name="student_id" rules={[{ required: "Vui lòng chọn học viên" }]}>
          <Controller
            control={form.control}
            name="student_id"
            render={({ field }) => <StudentSelect value={field.value} onChange={field.onChange} />}
          />
        </FormTeraItem>

        <FormTeraItem label="Khoản mục" name="item_name" rules={[{ required: "Vui lòng nhập tên khoản mục" }]}>
          <Input placeholder="VD: Học phí khóa IELTS" />
        </FormTeraItem>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <FormTeraItem label="Số lượng" name="quantity">
            <InputNumber min={1} className="w-full" />
          </FormTeraItem>
          <FormTeraItem
            label="Đơn giá"
            name="unit_price"
            rules={[{ required: "Vui lòng nhập đơn giá" }]}
          >
            <InputNumber min={0} className="w-full" />
          </FormTeraItem>
        </div>

        <FormTeraItem label="Hạn thanh toán" name="due_date">
          <Controller
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <DatePicker
                className="w-full"
                format="DD/MM/YYYY"
                value={field.value ? moment(field.value) : undefined}
                onChange={(value: any) => field.onChange(value ? moment(value).format("YYYY-MM-DD") : undefined)}
              />
            )}
          />
        </FormTeraItem>

        <FormTeraItem label="Ghi chú" name="note">
          <TextArea placeholder="Ghi chú thêm (tùy chọn)..." rows={2} />
        </FormTeraItem>
      </FormTera>
    </FormScaff>
  );
};

export default InvoiceCreateForm;
