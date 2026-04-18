import { useQuery } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import FormTeraItem from "./FormTeraItem";
import FormWrapper from "./FormWrapper";
import TableWrapper from "./TableWrapper";
import TeraFormContext from "./TeraFormContext";
import { FormTeraRefProps } from "./_interfaces";
import useFormTera from "./useFormTera";

interface FormTeraProps {
  children?: React.ReactNode;
  object_type?: string;
  object_id?: string;
  isUpdate?: boolean;
  isCreate?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  onSubmit?: (value: any) => void;
  schemaCustom?: yup.ObjectShape;
  wrapper_type?: "form" | "table";
  form?: any;
  defaultValues?: any;
  className?: string;
}

const FormTera = forwardRef<FormTeraRefProps, FormTeraProps>(
  (
    {
      object_type,
      object_id,
      isCreate,
      isUpdate,
      isLoading,
      wrapper_type = "form",
      onSubmit,
      children,
      form: formProp,
      defaultValues,
      className,
    },
    ref,
  ) => {
    const defaultForm = useForm({
      defaultValues,
      mode: "onChange",
    });

    const form = formProp ?? defaultForm;

    const onChangeCustomTera = (value: any) => {
      console.log("value$$$$$", value);
      return value;
    };
    useImperativeHandle(
      ref,
      () => ({
        ...form,
        formState: form?.formState,
        isDirty: form?.formState?.isDirty,
        errors: form?.formState?.errors,
        submit: form.handleSubmit(onSubmit),
      }),
      [form, form.formState, ref],
    );

    const Wrapper = wrapper_type === "form" ? FormWrapper : TableWrapper;
    return (
      <TeraFormContext
        form={{
          ...form,
          submit: form.handleSubmit(onSubmit),
        }}
        onChangeCustomTera={onChangeCustomTera}
        isCreate={isCreate}
        isUpdate={isUpdate}
        object_type={object_type}
        object_id={object_id}
        layout={{
          show: true,
        }}
        isLoading={isLoading}
      >
        <Wrapper onSubmit={form.handleSubmit(onSubmit)} className={className}>
          {children}
        </Wrapper>
      </TeraFormContext>
    );
  },
);

export { FormTeraItem, useFormTera };
export default FormTera;
