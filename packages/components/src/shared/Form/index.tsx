import React, { JSX } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";
import { StyleSheet } from "react-native";
import { FormDateTime, FormDateTimeProps } from "./FormDateTime";
import { FormInput, FormInputProps } from "./FormInput";
import { FormInputPassword, FormInputPasswordProps } from "./FormInputPassword";
import { FormSwitch, FormSwitchProps } from "./FormSwitch";

interface IFormProps<T extends FieldValues> {
  children: React.ReactNode;
  methods: UseFormReturn<T>;
}

type FormType = {
  <T extends FieldValues>(props: IFormProps<T>): JSX.Element;
  Input: React.FC<FormInputProps & { name: string }>;
  InputPassword: React.FC<FormInputPasswordProps & { name: string }>;
  DateTime: React.FC<FormDateTimeProps & { name: string }>;
  Switch: React.FC<FormSwitchProps & { name: string }>;
};

const FormNamespace: any = ({ methods, children }: IFormProps<any>) => {
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const Form = FormNamespace as FormType;
Form.Input = FormInput;
Form.InputPassword = FormInputPassword;
Form.DateTime = FormDateTime;
Form.Switch = FormSwitch;

export default Form;

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
});
