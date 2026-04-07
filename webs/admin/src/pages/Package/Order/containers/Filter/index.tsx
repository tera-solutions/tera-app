import Filter from "@tera/components/web/Filter";
import Select from "@tera/components/dof/Control/Select";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import _ from "lodash";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface PackageOrderFilterProps {
  open: boolean;
  onClose: () => void;
  onFilter?: (value) => void;
  initialValue?: any;
}

function PackageOrderFilter({
  open,
  onClose,
  onFilter,
  initialValue,
}: PackageOrderFilterProps) {
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
        <FormTeraItem label="Hình thức thanh toán" name="method">
          <Select
            options={[
              {
                label: "Ví",
                value: "wallet",
              },
              {
                label: "Chuyển khoản",
                value: "transfer",
              },
            ]}
          />
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

export default PackageOrderFilter;
