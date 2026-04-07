import Filter from "@tera/components/web/Filter";
import DatePicker from "@tera/components/dof/Control/DatePicker";
import Select from "@tera/components/dof/Control/Select";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import _ from "lodash";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface InvoiceFilterProps {
  open: boolean;
  onClose: () => void;
  onFilter?: (value) => void;
  initialValue?: any;
}

function InvoiceFilter({
  open,
  onClose,
  onFilter,
  initialValue,
}: InvoiceFilterProps) {
  const form = useForm({ mode: "onChange" });

  const handleSubmitForm = (values) => {
    onFilter(values);
    onClose();
  };

  const handleReset = () => {
    const values = {
      review: null,
    };
    onFilter(values);
    onClose();
  };

  useEffect(() => {
    const values = _.pick(initialValue, ["review"]);

    form.reset({
      ...values,
    });
  }, [initialValue]);

  return (
    <Filter
      open={open}
      onCancel={onClose}
      onClose={onClose}
      onFilter={() => form.handleSubmit(handleSubmitForm)()}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmitForm)}>
        <FormTeraItem label="Trạng thái" name="status">
          <Select options={[]} />
        </FormTeraItem>
        <FormTeraItem label="Loại giao dịch" name="type">
          <Select options={[]} />
        </FormTeraItem>
        <FormTeraItem label="Phương thức thanh toán" name="method">
          <Select options={[]} />
        </FormTeraItem>
        <FormTeraItem label="Ngày tạo" name="created">
          <DatePicker />
        </FormTeraItem>

        <a
          className="text-red-500 text-sm font-normal cursor-pointer"
          onClick={() => handleReset()}
        >
          Hủy bộ lọc
        </a>
      </FormTera>
    </Filter>
  );
}

export default InvoiceFilter;
