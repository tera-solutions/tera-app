import * as yup from "yup";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{9}$/;

export const loginSchema = yup.object().shape({
  identifier: yup
    .string()
    .trim()
    .required("Vui lòng nhập email hoặc số điện thoại")
    .test(
      "is-email-or-phone",
      "Email hoặc số điện thoại không hợp lệ",
      (value) => !value || EMAIL_REGEX.test(value) || PHONE_REGEX.test(value),
    ),
  password: yup
    .string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export interface LoginFieldErrors {
  identifier?: string;
  password?: string;
}

export const validateLoginField = async (
  field: keyof LoginFormValues,
  values: LoginFormValues,
): Promise<string | undefined> => {
  try {
    await loginSchema.validateAt(field, values);
    return undefined;
  } catch (err) {
    return (err as yup.ValidationError).message;
  }
};

export const validateLogin = async (
  values: LoginFormValues,
): Promise<LoginFieldErrors> => {
  try {
    await loginSchema.validate(values, { abortEarly: false });
    return {};
  } catch (err) {
    const errors: LoginFieldErrors = {};
    (err as yup.ValidationError).inner.forEach((e) => {
      const path = e.path as keyof LoginFieldErrors | undefined;
      if (path && !errors[path]) errors[path] = e.message;
    });
    return errors;
  }
};
