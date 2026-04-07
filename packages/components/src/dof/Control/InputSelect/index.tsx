import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Controller } from "react-hook-form";
import {
  ChevronDownOutlined,
  InputProps,
  Input as InputTera,
  XCircleSolid,
  useHover,
} from "tera-dls";

type InputSelectProps = InputProps & {
  onClear?: () => void;
};
const InputSelect = forwardRef<HTMLInputElement, InputSelectProps>(
  ({ disabled, onClear, ...props }, ref) => {
    const containerInputRef = useRef(null);
    const inputRef = useRef(null);
    const { isHover } = useHover(containerInputRef);
    const { form } = useTeraForm();
    const { item, config, rules } = useTeraFormItem();
    const { control } = form;

    useImperativeHandle(ref, () => inputRef.current);

    return (
      <div ref={containerInputRef}>
        <Controller
          {...item}
          control={control}
          rules={rules}
          render={({ field }) => (
            <InputTera
              placeholder="Vui lòng chọn"
              readOnly
              className="w-full cursor-pointer"
              suffixProps={{ className: "cursor-pointer" }}
              suffix={
                !isHover || !field.value || disabled ? (
                  <ChevronDownOutlined className="stroke-2 w-4" />
                ) : (
                  <XCircleSolid
                    onClick={onClear}
                    className="text-gray-400 hover:text-gray-500 shrink-0 w-4"
                  />
                )
              }
              disabled={disabled}
              {...field}
              ref={(el) => {
                field.ref(el);
                inputRef.current = el;
              }}
              {...props}
              {...config?.field}
            />
          )}
        />
      </div>
    );
  },
);

export default InputSelect;
