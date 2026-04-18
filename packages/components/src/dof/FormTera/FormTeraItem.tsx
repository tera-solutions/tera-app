import { useMemo } from "react";
import { FormItem, FormFieldProps } from "tera-dls";
import { useFormContext } from "react-hook-form";

import TeraItemContext from "./TeraItemContext";
import { useTeraForm } from "./TeraFormContext";
import { IRuleValidation, IValidateReturn } from "./_interfaces";
import { checkValidateForm } from "./_util";
import DynamicControl from "../Control/DynamicControl";

export const ConnectForm = ({ children }) => {
  const methods = useFormContext();
  return children({ ...methods });
};

export interface FormTeraItemProps extends FormFieldProps {
  object_type?: string;
  object_id?: string;
  isUpdate?: boolean;
  isCreate?: boolean;
  rules?: IRuleValidation[];
  displayLabel?: boolean;
}

const controlType = {
  1: "int",
  2: "varchar",
  3: "text",
  4: "date",
  5: "datetime",
  6: "float",
};

function FormTeraItem({
  name,
  object_type: item_object_type,
  object_id: item_object_id,
  isUpdate: isItemUpdate,
  isCreate: isItemCreate,
  children,
  displayLabel = true,
  rules = [],
  ...props
}: FormTeraItemProps) {
  const { form, fields, object_type, isCreate, isUpdate } = useTeraForm();

  const validations: IRuleValidation = useMemo(() => {
    let validate: IValidateReturn = {};

    const rule = rules.reduce((prev, element) => {
      const nextRule = {
        ...prev,
        ...element,
      };

      validate = checkValidateForm(element, validate);
      return nextRule;
    }, {});

    return { ...rule, validate: { ...validate, ...rule?.validate } };
  }, [rules]);

  const item_code = useMemo(
    () => `${object_type}_${name}` || item_object_type,
    [item_object_type],
  );
  const config = useMemo(() => {
    const itemConfig = fields?.find((obj: any) => obj?.code === item_code);
    if (!itemConfig)
      return {
        show: true,
        isRequired: !!validations?.required,
      };
    return {
      ...itemConfig,
      field: {
        placeholder: itemConfig?.place_holder ?? undefined,
        disabled:
          ((itemConfig?.disable_create === "active" && isCreate) ||
            (itemConfig?.disable_edit === "active" && isUpdate)) ??
          undefined,
      },
      show:
        (itemConfig?.is_create === "active" && (isCreate || isItemCreate)) ||
        (itemConfig?.is_edit === "active" && (isUpdate || isItemUpdate)),
      validations: {
        required:
          itemConfig?.is_required === "active" &&
          (itemConfig?.required_message || "Bắt buộc nhập"),
      },
      isRequired: itemConfig?.is_required === "active",
      control_type: controlType[itemConfig?.type_id],
    };
  }, [fields, item_code, isCreate, validations, isUpdate]);

  if (!config?.show) return <></>;
  return (
    <TeraItemContext
      name={name}
      object_type={item_code}
      object_id={item_object_id}
      rules={{ ...validations, ...config?.validations }}
      config={config}
    >
      <FormItem
        {...props}
        label={displayLabel ? config?.title || props?.label : ""}
        isRequired={config?.isRequired}
        data-object_type={item_code}
        data-object_id={item_object_id}
        isError={!!form?.formState?.errors?.[name]?.message}
        messages={form?.formState?.errors?.[name]?.message as string}
        style={{
          ...props?.style,
          order: config?.order,
        }}
      >
        {config?.control_type ? (
          <DynamicControl type={config?.control_type} />
        ) : (
          children
        )}
      </FormItem>
    </TeraItemContext>
  );
}

export default FormTeraItem;
