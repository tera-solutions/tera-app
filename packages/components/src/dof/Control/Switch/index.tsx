import React from "react";
import { Toggle as ToggleTera, ToggleProps } from "tera-dls";
import { Controller } from "react-hook-form";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";

interface IProps extends ToggleProps {
  onCustomChange?: (data) => void;
}
const Toggle = React.memo(({ onCustomChange, ...props }: IProps) => {
  const { form } = useTeraForm();
  const { item } = useTeraFormItem();
  const { control } = form;

  return (
    <Controller
      control={control}
      {...item}
      render={({ field }) => {
        return (
          <ToggleTera
            {...props}
            {...field}
            onChange={(e) => {
              onCustomChange && onCustomChange(e.target.checked);
              props.onChange && props.onChange(e);
              field.onChange && field.onChange(e);
            }}
            checked={field.value}
          />
        );
      }}
    />
  );
});

export default Toggle;
