import Filter from "@tera/components/web/Filter";
import RangePicker from "@tera/components/dof/Control/RangePicker";
import Select from "@tera/components/dof/Control/Select";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import _ from "lodash";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface PaymentHistoryFilterProps {
  open: boolean;
  onClose: () => void;
  onFilter?: (value) => void;
  initialValue?: any;
}

function PaymentHistoryFilter({
  open,
  onClose,
  onFilter,
  initialValue,
}: PaymentHistoryFilterProps) {
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
        <FormTeraItem label="Phương thức thanh toán" name="method">
          <Select />
        </FormTeraItem>
        <FormTeraItem label="Thời gian" name="time">
          <RangePicker />
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

export default PaymentHistoryFilter;
