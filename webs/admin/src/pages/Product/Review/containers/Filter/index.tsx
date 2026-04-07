import Filter from "@tera/components/web/Filter";
import Select from "@tera/components/dof/Control/Select";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import _ from "lodash";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ProductReviewFilterProps {
  open: boolean;
  onClose: () => void;
  onFilter?: (value) => void;
  initialValue?: any;
}

function ProductReviewFilter({
  open,
  onClose,
  onFilter,
  initialValue,
}: ProductReviewFilterProps) {
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
        <FormTeraItem label="Đánh giá" name="review">
          <Select
            options={[
              {
                label: "5 sao",
                value: 5,
              },
              {
                label: "4 sao",
                value: 4,
              },
              {
                label: "3 sao",
                value: 3,
              },
              {
                label: "2 sao",
                value: 2,
              },
              {
                label: "1 sao",
                value: 1,
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

export default ProductReviewFilter;
