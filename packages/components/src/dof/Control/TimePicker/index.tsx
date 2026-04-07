import React, { useMemo } from "react";
import { TimePickerProps, TimePicker as TimePickerTera } from "tera-dls";
import { Controller } from "react-hook-form";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";

const TimePicker = React.memo(({ ...props }: TimePickerProps) => {
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
      {...item}
      rules={rules}
      render={({ field }) => (
        <TimePickerTera
          data-object_type={item?.object_type}
          data-object_id={item?.object_id}
          placeholder="Vui lòng chọn"
          className="w-full"
          {...field}
          {...props}
          {...inputProps}
        />
      )}
    />
  );
});

export default TimePicker;
