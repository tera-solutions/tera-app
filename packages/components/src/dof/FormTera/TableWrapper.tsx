import { forwardRef, useImperativeHandle, useMemo } from "react";
import { Spin } from "tera-dls";
import { UseFormReturn } from "react-hook-form";

import { useTeraForm } from "./TeraFormContext";
import classNames from "classnames";

interface FormWrapperProps {
  children?: React.ReactNode;
  className?: string;
  style?: any;
  onSubmit?: (values) => void;
}

export interface FormWrapperRefProps extends UseFormReturn {
  submit: () => void;
}

function TableWrapper({ children, ...restFormProps }: FormWrapperProps, ref) {
  const { form, object_type, object_id, layout } = useTeraForm();

  useImperativeHandle(
    ref,
    () => ({
      ...form,
    }),
    [ref],
  );

  const layoutClassName = useMemo(() => {
    if (!layout) return {};
    if (layout?.type === "grid_view") {
      return {
        grid: true,
        "gap-[5px]": !layout?.className,
        [`grid-cols-${layout?.column}`]: layout?.column > 0,
      };
    }
    return {};
  }, [layout]);

  if (!layout?.show) return <></>;

  return (
    <tr
      data-title={layout?.title}
      data-object_type={object_type}
      data-object_id={object_id}
      {...restFormProps}
      className={classNames(
        restFormProps?.className,
        {
          ...layoutClassName,
        },
        layout?.className,
      )}
      style={{
        ...restFormProps?.style,
        order: layout?.order,
      }}
    >
      <Spin spinning={false}>{children}</Spin>
    </tr>
  );
}

export default forwardRef<FormWrapperRefProps, FormWrapperProps>(TableWrapper);
