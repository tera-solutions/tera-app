import { forwardRef } from "react";
import { Controller } from "react-hook-form";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";
import customTwMerge from "tailwind-merge.config";
import SelectField, { SelectOption } from "./SelectField";

export type { SelectOption };
export { default as SelectField } from "./SelectField";
export type { SelectFieldProps } from "./SelectField";

export interface SelectProps {
  options?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Field select wire sẵn vào FormTera/FormTeraItem (Controller) — dùng bên trong
 * <FormTeraItem name="..."> như Input/TextArea. Không có FormTera context thì dùng
 * `SelectField` (export cùng file) — bản thuần value/onChange, không phụ thuộc form cha.
 */
const Select = forwardRef<HTMLButtonElement, SelectProps>((props, ref) => {
  const { form } = useTeraForm();
  const { item, config, rules } = useTeraFormItem();
  const { control } = form;

  return (
    <Controller
      control={control}
      defaultValue={null}
      rules={rules}
      {...item}
      render={({ field }) => (
        <SelectField
          data-object_type={item?.object_type}
          data-object_id={item?.object_id}
          options={props.options ?? []}
          placeholder={config?.place_holder || props?.placeholder || "Vui lòng chọn"}
          disabled={props.disabled}
          className={customTwMerge("w-full", config?.class_name || props?.className)}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          triggerRef={(el) => {
            field.ref(el);
            if (typeof ref === "function") ref(el);
            else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
          }}
        />
      )}
    />
  );
});

export default Select;
