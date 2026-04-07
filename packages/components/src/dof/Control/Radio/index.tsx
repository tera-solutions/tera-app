import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";
import React from "react";
import { RadioProps, Radio as RadioTera } from "tera-dls";

interface IProps extends RadioProps {
  listOption: any[];
  handleChange?: (valueChecked: any) => void;
  inline?: boolean;
}

const Radio = React.memo(({ listOption, ...props }: IProps) => {
  const { form } = useTeraForm();
  const { register } = form;
  const { item, rules } = useTeraFormItem();
  form.watch();
  return (
    <RadioTera.Group
      {...props}
      {...register(item?.name ?? "shipping_type", (rules as any) ?? {})}
      inline={props?.inline}
    >
      {listOption?.map((child) => (
        <RadioTera key={child?.value} value={child?.value}>
          {child?.label}
        </RadioTera>
      ))}
    </RadioTera.Group>
  );
});

export default Radio;
