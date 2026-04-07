import React from "react";
import {
  InputPasswordProps,
  InputPassword as InputPasswordTera,
} from "tera-dls";
import { Controller } from "react-hook-form";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";
import classNames from "classnames";

const InputPassword = React.memo(({ ...props }: InputPasswordProps) => {
  const { form } = useTeraForm();
  const { item, config, rules } = useTeraFormItem();
  const { control } = form;

  return (
    <Controller
      control={control}
      defaultValue=""
      {...item}
      rules={rules}
      render={({ field }) => (
        <InputPasswordTera
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
        />
      )}
    />
  );
});

export default InputPassword;
