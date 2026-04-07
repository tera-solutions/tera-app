/* eslint-disable @typescript-eslint/no-empty-function */
import { UseFormReturn } from "react-hook-form";

export interface IRuleValidation {
  required?:
    | string
    | {
        value: boolean;
        message: string;
      };
  maxLength?: {
    value: number;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  max?: {
    value: number;
    message: string;
  };
  min?: {
    value: number;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
  minDate?: {
    key: string;
    message: string;
    callback?: () => void;
    error?: any;
  };
  maxDate?: {
    key: string;
    message: string;
    callback?: () => void;
  };

  valueAsNumber?: boolean;
  valueAsDate?: boolean;
  validate?: any;
}

export interface FormTeraRefProps extends UseFormReturn {
  submit?: () => void;
  isDirty?: boolean;
  errors?: any;
}
export interface IValidateReturn {
  [rule: string]: (value?: any, state?: any) => string | boolean;
}

export interface ILayoutForm {
  type?: "grid_view" | "table";
  title?: string;
  column?: number;
  order?: number;
  className?: string;
  show?: boolean;
}

export const defaultRef = {
  watch: () => {},
  getValues: () => {},
  getFieldState: () => {},
  setError: () => {},
  clearErrors: () => {},
  setValue: () => {},
  trigger: () => {},
  formState: {
    isDirty: false,
    isLoading: false,
    isSubmitted: false,
    isSubmitSuccessful: false,
    isSubmitting: false,
    isValidating: false,
    isValid: false,
    submitCount: 0,
    defaultValues: {},
    dirtyFields: {},
    touchedFields: {},
    errors: {},
  },
  resetField: () => {},
  reset: () => {},
  handleSubmit: () => {},
  unregister: () => {},
  control: () => {},
  register: () => {},
  setFocus: () => {},
};
