import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Controller } from "react-hook-form";
import customTwMerge from "tailwind-merge.config";
import { InputProps, Input as InputTera } from "tera-dls";

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const inputRef = useRef(null);
  const { form } = useTeraForm();
  const { item, config, rules } = useTeraFormItem();
  const { control } = form;

  useImperativeHandle(ref, () => inputRef.current);

  return (
    <Controller
      {...item}
      control={control}
      rules={rules}
      render={({ field }) => {
        return (
          <InputTera
            data-object_type={item?.object_type}
            data-object_id={item?.object_id}
            placeholder="Vui lòng nhập"
            {...props}
            {...config?.field}
            {...field}
            ref={(el) => {
              field.ref(el);
              inputRef.current = el;
            }}
            className={customTwMerge(
              "w-full",
              props?.className,
              config?.class_name,
            )}
          />
        );
      }}
    />
  );
});

export default Input;
