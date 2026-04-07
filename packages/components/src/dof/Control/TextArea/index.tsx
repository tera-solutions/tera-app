import React from "react";
import { TextArea as TextAreaTera, TextAreaProps } from "tera-dls";
import { Controller } from "react-hook-form";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";
import classNames from "classnames";

const TextArea = React.memo(({ ...props }: TextAreaProps) => {
  const { form } = useTeraForm();
  const { item, config, rules } = useTeraFormItem();
  const { control } = form;

  return (
    <Controller
      control={control}
      {...item}
      rules={rules}
      render={({ field }) => (
        <TextAreaTera
          data-object_type={item?.object_type}
          data-object_id={item?.object_id}
          placeholder="Vui lòng nhập"
          {...field}
          {...props}
          {...config?.field}
          className={classNames("w-full", {
            [props?.className]: true,
            [config?.class_name]: true,
          })}
          style={{ resize: "none" }}
        />
      )}
    />
  );
});

export default TextArea;
