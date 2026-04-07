import {
  LIMIT_MAX_DATE_TIME,
  LIMIT_MIN_DATE_TIME,
} from "@tera/commons/constants/common";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";
import moment from "moment";
import React, { useMemo } from "react";
import { Controller } from "react-hook-form";
import { DatePickerProps, DatePicker as DatePickerTera } from "tera-dls";

const DatePicker = React.memo(
  ({ className, placeholder, onChange, ...props }: DatePickerProps) => {
    const { form } = useTeraForm();
    const { item, config, rules } = useTeraFormItem();
    const { control } = form;
    const inputProps = useMemo(
      () => ({
        placeholder: config?.place_holder || placeholder || "Vui lòng chọn",
        className: config?.class_name || className || "w-full",
      }),
      [config],
    );
    return (
      <Controller
        control={control}
        {...item}
        rules={rules}
        render={({ field }) => (
          <DatePickerTera
            data-object_type={item?.object_type}
            data-object_id={item?.object_id}
            maxDate={moment(LIMIT_MAX_DATE_TIME)}
            minDate={moment(LIMIT_MIN_DATE_TIME)}
            {...field}
            {...props}
            className={inputProps.className}
            placeholder={inputProps.placeholder}
            onChange={(date, dateString) => {
              field.onChange(date);
              onChange?.(date, dateString);
            }}
          />
        )}
      />
    );
  },
);
export default DatePicker;
