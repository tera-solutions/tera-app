import React, { useMemo } from "react";
import { Checkbox as CheckBoxTera, CheckboxProps } from "tera-dls";
import { Controller } from "react-hook-form";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";

const CheckBox = React.memo(({ ...props }: CheckboxProps) => {
  const { form } = useTeraForm();
  const { item, config, rules } = useTeraFormItem();
  const { control } = form;

  const inputProps = useMemo(
    () => ({
      className: config?.class_name || props?.className,
    }),
    [config],
  );

  return (
    <Controller
      control={control}
      {...item}
      rules={rules}
      render={({ field }) => (
        <CheckBoxTera
          data-object_type={item?.object_type}
          data-object_id={item?.object_id}
          checked={field?.value}
          {...field}
          {...props}
          {...inputProps}
        />
      )}
    />
  );
});

export default CheckBox;
