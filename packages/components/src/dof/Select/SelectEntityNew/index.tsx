import Select from "@tera/components/dof/Control/Select";
import React, { forwardRef } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";

interface SelectEntityProps extends SelectProps {
  isCheckAll?: boolean;
}

const optionsCustom: OptionProps = {
  label: "Tất cả",
  value: "all",
};

const SelectEntity = forwardRef(
  ({ isCheckAll = false, ...props }: SelectEntityProps) => {
    const handleSelect = (value, selected) => {
      const isSelectFunction = typeof props?.onSelect === "function";
      if (isCheckAll && props?.mode === "multiple" && props?.labelInValue) {
        if (selected?.value === "all") {
          const listSelected = props?.selectedValue as OptionProps[];
          const index = listSelected?.findIndex((i) => i?.value === "all");
          if (index === -1)
            isSelectFunction && props?.onSelect([selected], selected);
          else isSelectFunction && props?.onSelect([], selected);
        } else {
          const valueFilter = value?.filter((item) => item?.value !== "all");
          isSelectFunction && props?.onSelect(valueFilter, selected);
        }
      } else {
        isSelectFunction && props?.onSelect(value, selected);
      }
    };

    const options =
      isCheckAll && props?.options?.length > 0
        ? [optionsCustom, ...props.options]
        : props.options;

    return <Select {...props} onSelect={handleSelect} options={options} />;
  },
);

export default SelectEntity;
