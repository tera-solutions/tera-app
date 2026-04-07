import React, { useMemo } from "react";
import { SelectProps, Select as SelectTera } from "tera-dls";
import { Controller } from "react-hook-form";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";
import customTwMerge from "tailwind-merge.config";

const Select = React.memo(({ ...props }: SelectProps) => {
  const { form } = useTeraForm();
  const { item, config, rules } = useTeraFormItem();
  const { control } = form;

  const inputProps = useMemo(
    () => ({
      placeholder:
        config?.place_holder || props?.placeholder || "Vui lòng chọn",
      className: config?.class_name || props?.className,
    }),
    [config],
  );

  return (
    <Controller
      control={control}
      defaultValue={null}
      rules={rules}
      {...item}
      render={({ field }) => (
        <SelectTera
          data-object_type={item?.object_type}
          data-object_id={item?.object_id}
          placeholder="Vui lòng chọn"
          {...field}
          {...props}
          {...inputProps}
          className={customTwMerge("w-full", inputProps.className)}
        />
      )}
    />
  );
});

export default Select;
