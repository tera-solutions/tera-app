import * as yup from "yup";

import type { RegisterErrors, RegisterFormData } from "pages/Auth/Register/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{9}$/;

const isFuture = (value?: string): boolean => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date.getTime() > today.getTime();
};

export const personalSchema = yup.object().shape({
  fullname: yup
    .string()
    .trim()
    .required("Vui lòng nhập họ và tên")
    .min(2, "Họ và tên tối thiểu 2 ký tự"),
  gender: yup
    .string()
    .oneOf(["male", "female", "other"], "Vui lòng chọn giới tính")
    .required("Vui lòng chọn giới tính"),
  email: yup
    .string()
    .trim()
    .required("Vui lòng nhập email")
    .matches(EMAIL_REGEX, "Email không hợp lệ"),
  phone: yup
    .string()
    .trim()
    .required("Vui lòng nhập số điện thoại")
    .matches(PHONE_REGEX, "Số điện thoại không hợp lệ"),
  dob: yup
    .string()
    .required("Vui lòng chọn ngày sinh")
    .test("not-future", "Ngày sinh không hợp lệ", (value) => !isFuture(value)),
  password: yup
    .string()
    .required("Mật khẩu không được để trống")
    .min(8, "Mật khẩu tối thiểu 8 ký tự"),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp"),
  terms: yup
    .boolean()
    .oneOf([true], "Vui lòng đồng ý với điều khoản"),
});

export const schoolSchema = yup.object().shape({
  school: yup.string().trim().required("Vui lòng nhập tên trường / trung tâm"),
  position: yup.string().trim(),
  experience: yup
    .string()
    .trim()
    .test(
      "positive-integer",
      "Kinh nghiệm phải là số nguyên dương",
      (value) => !value || /^\d+$/.test(value),
    ),
  subject: yup.string().trim(),
});

export const profileSchema = yup.object().shape({
  bio: yup.string().max(500, "Giới thiệu tối đa 500 ký tự"),
});

const STEP_SCHEMAS: Record<number, yup.AnyObjectSchema> = {
  1: personalSchema,
  2: schoolSchema,
  3: profileSchema,
};

/** Validate a single step; returns a map of field -> first error message. */
export const validateRegisterStep = async (
  step: number,
  values: RegisterFormData,
): Promise<RegisterErrors> => {
  const schema = STEP_SCHEMAS[step];
  if (!schema) return {};

  try {
    await schema.validate(values, { abortEarly: false });
    return {};
  } catch (err) {
    const errors: RegisterErrors = {};
    (err as yup.ValidationError).inner.forEach((e) => {
      const path = e.path as keyof RegisterFormData | undefined;
      if (path && !errors[path]) errors[path] = e.message;
    });
    return errors;
  }
};
