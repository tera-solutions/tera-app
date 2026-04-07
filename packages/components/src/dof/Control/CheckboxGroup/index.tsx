import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";
import React, { useMemo } from "react";
import { Controller } from "react-hook-form";
import { Checkbox as CheckBoxTera, CheckboxGroupProps } from "tera-dls";

const CheckBoxGroup = React.memo(
  ({ children, ...props }: CheckboxGroupProps) => {
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
          <CheckBoxTera.Group
            data-object_type={item?.object_type}
            data-object_id={item?.object_id}
            {...field}
            {...props}
            {...inputProps}
          >
            {children}
          </CheckBoxTera.Group>
        )}
      />
    );
  },
);

export default CheckBoxGroup;
