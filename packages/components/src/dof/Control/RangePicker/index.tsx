import {
  LIMIT_MAX_DATE_TIME,
  LIMIT_MIN_DATE_TIME,
} from "@tera/commons/constants/common";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";
import moment from "moment";
import React from "react";
import { Controller } from "react-hook-form";
import customTwMerge from "tailwind-merge.config";
import { RangePickerProps, RangePicker as RangePickerTera } from "tera-dls";

const RangePicker = React.memo(({ ...props }: RangePickerProps) => {
  const { form } = useTeraForm();
  const { item, config, rules } = useTeraFormItem();
  const { control } = form;

  return (
    <Controller
      control={control}
      defaultValue={null}
      {...item}
      rules={rules}
      render={({ field }) => (
        <RangePickerTera
          data-object_type={item?.object_type}
          data-object_id={item?.object_id}
          maxDate={moment(LIMIT_MAX_DATE_TIME)}
          minDate={moment(LIMIT_MIN_DATE_TIME)}
          {...field}
          {...props}
          className={customTwMerge(
            "w-full",
            props?.className,
            config?.class_name,
          )}
        />
      )}
    />
  );
});

export default RangePicker;
