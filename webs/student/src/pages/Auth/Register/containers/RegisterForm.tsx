import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import viVN from "rc-picker/lib/locale/vi_VN";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDaysOutlined,
  DatePicker,
  EnvelopeOutlined,
  EyeOutlined,
  EyeSlashOutlined,
  LockClosedOutlined,
  UserOutlined,
  notification,
} from "tera-dls";
import * as yup from "yup";

import { AuthApi } from "@tera/api/auth/auth";
import { useMutationLegacy } from "@tera/commons/hooks/tanstack";

import HanaLogo from "_common/components/Layout/StudentLayout/HanaLogo";

import { GoogleIcon, MicrosoftIcon } from "../../Login/containers/BrandIcons";

interface IRegisterForm {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  dob: string;
  gender: string;
  agree: boolean;
}

/** Ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt */
const STRONG_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const inputClass =
  "h-14 w-full rounded-2xl border border-[#e3ecf9] bg-white pl-12 pr-12 text-[15px] text-hana-navy outline-none transition placeholder:text-hana-muted/70 focus:border-hana-blue focus:ring-4 focus:ring-hana-blue/10";

/* tera-dls DatePicker mặc định cao 26px, bo góc nhỏ → ép về cùng dáng với các ô input khác */
const datePickerClass =
  // `border!` bắt buộc: tera-dls để border-width 0 nên chỉ đặt màu là không thấy viền.
  // `[&_input]:border-0!` để giết viền mặc định mà style global vẽ lên chính thẻ input.
  "w-full h-14! rounded-2xl! border! border-[#e3ecf9]! pl-12! pr-4! " +
  "[&_.tera-picker-input]:h-full! [&_.tera-picker-input]:items-center! " +
  // KHÔNG ép input cao 100%: caret sẽ bị kéo cao bằng cả ô, trông như một
  // vạch xanh dọc bên trong. Để chiều cao tự nhiên + line-height rõ ràng.
  // tera-dls vẽ vòng xanh 1px lên chính <input> bằng rule `.tera-picker-date
  // input:focus { box-shadow: ...ring... }`. Phải ghi đè box-shadow THẲNG bằng
  // `none` — class `shadow-none` của Tailwind KHÔNG dập được vì nó vẫn giữ
  // biến --tw-ring-shadow trong chuỗi box-shadow.
  "[&_input]:h-auto! [&_input]:leading-6! [&_input]:border-0! [&_input]:p-0! [&_input]:[box-shadow:none]! " +
  "[&_input]:bg-transparent! [&_input]:text-[15px]! [&_input]:text-hana-navy! " +
  "[&_input]:placeholder:text-hana-muted/70! " +
  "focus-within:border-hana-blue! focus-within:ring-4 focus-within:ring-hana-blue/10";

/* Popup lịch: chặn tràn mép trên màn hẹp (cùng nhóm lỗi đã ghi trong CLAUDE.md) */
const datePickerPopupClass =
  "max-w-[min(320px,calc(100vw-2rem))] [&_.tera-picker-panel-container]:overflow-x-auto!";

const iconClass =
  "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-hana-muted";

const GENDERS = [
  { value: "male", labelKey: "register.gender_male", color: "text-hana-blue" },
  {
    value: "female",
    labelKey: "register.gender_female",
    color: "text-pink-500",
  },
  {
    value: "other",
    labelKey: "register.gender_other",
    color: "text-purple-500",
  },
];

/** Thẻ đăng ký — mockup screen/{desktop,mobile}/dang ky.png */
const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);

  const schema = useMemo(
    () =>
      yup.object({
        full_name: yup
          .string()
          .trim()
          .required(t("register.required_full_name")),
        email: yup
          .string()
          .trim()
          .required(t("register.required_email"))
          .email(t("register.invalid_email")),
        password: yup
          .string()
          .required(t("register.required_password"))
          .matches(STRONG_PASSWORD, t("register.weak_password")),
        password_confirmation: yup
          .string()
          .required(t("register.required_confirm"))
          .oneOf([yup.ref("password")], t("register.mismatch_confirm")),
        dob: yup
          .string()
          .test("dob-past", t("register.invalid_dob"), (value) => {
            if (!value) return true; // ngày sinh không bắt buộc
            const date = new Date(value);
            return !Number.isNaN(date.getTime()) && date <= new Date();
          }),
        gender: yup.string(),
        agree: yup.boolean().oneOf([true], t("register.required_agree")),
      }),
    [t],
  );

  const {
    control,
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IRegisterForm>({
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      dob: "",
      gender: "",
      agree: false,
    },
    resolver: yupResolver(schema) as any,
  });

  const gender = watch("gender");

  const { mutate, isLoading } = useMutationLegacy({
    mutationFn: (variables: any) => AuthApi.register(variables),
    onSuccess: () => {
      notification.success({ message: t("register.success") });
      navigate("/auth/login");
    },
    onError: (error: any) => {
      const msg = error?.data?.msg;

      // Lỗi theo field chỉ gắn được khi field đó có trên form, còn lại đẩy ra notification
      if (msg && typeof msg === "object" && msg.field && msg.message) {
        if (msg.field in (errors as any) || msg.field in watch()) {
          setError(msg.field, { type: "error", message: msg.message });
          return;
        }
        notification.error({ message: msg.message });
        return;
      }

      notification.error({
        message: typeof msg === "string" ? msg : t("common.error"),
      });
    },
  });

  const onSubmit = (values: IRegisterForm) => {
    if (isLoading) return;
    const { agree: _agree, ...rest } = values;
    // ⚠️ `username` bắt buộc ở phía DB (backend KHÔNG validate, insert thẳng),
    // form lại không có ô riêng nên tạm lấy email làm tên đăng nhập.
    mutate({ ...rest, username: values.email, type: "user" });
  };

  return (
    <div className="relative z-10 mt-auto w-full rounded-t-[32px] bg-white p-6 pb-9 shadow-[0_-8px_30px_rgba(23,92,211,0.08)] xl:mt-0 xl:max-w-[620px] xl:shrink-0 xl:rounded-[32px] xl:p-10 xl:shadow-hana">
      <div className="hidden justify-center xl:flex">
        <HanaLogo />
      </div>

      <h2 className="mt-2 text-center text-[30px] font-extrabold text-hana-navy xl:mt-6">
        {t("register.title")}
      </h2>
      <p className="mt-1.5 text-center text-sm text-hana-muted">
        {t("register.subtitle")}
      </p>

      <form className="mt-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="mb-2 block text-sm font-semibold text-hana-navy">
          {t("register.full_name_label")}
        </label>
        <div className="relative">
          <UserOutlined className={iconClass} />
          <input
            {...register("full_name")}
            autoComplete="name"
            maxLength={120}
            placeholder={t("register.full_name_placeholder")}
            className={inputClass}
          />
        </div>
        {errors.full_name && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {errors.full_name.message}
          </p>
        )}

        <label className="mb-2 mt-4 block text-sm font-semibold text-hana-navy">
          {t("register.email_label")}
        </label>
        <div className="relative">
          <EnvelopeOutlined className={iconClass} />
          <input
            {...register("email")}
            autoComplete="email"
            maxLength={320}
            placeholder={t("register.email_placeholder")}
            className={inputClass}
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {errors.email.message}
          </p>
        )}

        <label className="mb-2 mt-4 block text-sm font-semibold text-hana-navy">
          {t("register.password_label")}
        </label>
        <div className="relative">
          <LockClosedOutlined className={iconClass} />
          <input
            {...register("password")}
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            maxLength={64}
            placeholder={t("register.password_placeholder")}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-hana-muted transition hover:text-hana-navy"
          >
            {visible ? (
              <EyeSlashOutlined className="h-5 w-5" />
            ) : (
              <EyeOutlined className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password ? (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {errors.password.message}
          </p>
        ) : (
          <p className="mt-1.5 text-xs leading-relaxed text-hana-muted">
            {t("register.password_hint")}
          </p>
        )}

        <label className="mb-2 mt-4 block text-sm font-semibold text-hana-navy">
          {t("register.confirm_label")}
        </label>
        <div className="relative">
          <LockClosedOutlined className={iconClass} />
          <input
            {...register("password_confirmation")}
            type={visibleConfirm ? "text" : "password"}
            autoComplete="new-password"
            maxLength={64}
            placeholder={t("register.confirm_placeholder")}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setVisibleConfirm((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-hana-muted transition hover:text-hana-navy"
          >
            {visibleConfirm ? (
              <EyeSlashOutlined className="h-5 w-5" />
            ) : (
              <EyeOutlined className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password_confirmation && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {errors.password_confirmation.message}
          </p>
        )}

        <label className="mb-2 mt-4 block text-sm font-semibold text-hana-navy">
          {t("register.dob_label")}
        </label>
        <Controller
          control={control}
          name="dob"
          render={({ field }) => (
            /* Bản tera-dls này KHÔNG render `prefixIcon` (chỉ có input + suffix)
               nên icon lịch bên trái phải tự đặt cho đồng bộ với các ô còn lại. */
            <div className="relative">
              <CalendarDaysOutlined className={`${iconClass} z-10`} />
              <DatePicker
                className={datePickerClass}
                // Nhập tay theo mặt nạ: sẵn dấu "/" ở ô, người dùng chỉ gõ số
                // (rc-picker v4 hỗ trợ `format` dạng object type "mask").
                format={{ type: "mask", format: "DD/MM/YYYY" } as any}
                // tera-dls mặc định hiện tháng bằng tiếng Anh ("Jul 2026")
                locale={viVN}
                placeholder={t("register.dob_placeholder")}
                allowClear
                // không cho chọn ngày trong tương lai
                disabledDate={(date: any) =>
                  date && date.isAfter(moment(), "day")
                }
                value={
                  field.value ? moment(field.value, "YYYY-MM-DD") : undefined
                }
                onChange={(date: any) =>
                  field.onChange(date ? moment(date).format("YYYY-MM-DD") : "")
                }
                classNames={{ popup: datePickerPopupClass }}
              />
            </div>
          )}
        />
        {errors.dob && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {errors.dob.message}
          </p>
        )}

        <label className="mb-2 mt-4 block text-sm font-semibold text-hana-navy">
          {t("register.gender_label")}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {GENDERS.map((item) => {
            const active = gender === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setValue("gender", item.value, { shouldDirty: true })
                }
                className={`flex h-13 cursor-pointer items-center justify-center gap-2 rounded-2xl border py-3.5 text-sm font-semibold transition ${
                  active
                    ? "border-hana-blue bg-hana-blue-soft text-hana-navy"
                    : "border-[#e3ecf9] text-hana-navy hover:bg-hana-sky-soft"
                }`}
              >
                <UserOutlined className={`h-5 w-5 ${item.color}`} />
                {t(item.labelKey)}
              </button>
            );
          })}
        </div>

        <Controller
          control={control}
          name="agree"
          render={({ field }) => (
            <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-hana-navy">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-hana-blue"
              />
              <span>
                {t("register.agree_prefix")}{" "}
                <span className="font-semibold text-hana-blue">
                  {t("register.terms")}
                </span>{" "}
                {t("register.agree_and")}{" "}
                <span className="font-semibold text-hana-blue">
                  {t("register.privacy")}
                </span>{" "}
                {t("register.agree_suffix")}
              </span>
            </label>
          )}
        />
        {errors.agree && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {errors.agree.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-5 h-14 w-full cursor-pointer rounded-2xl bg-hana-blue text-lg font-bold text-white transition hover:bg-hana-blue-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? `${t("register.submit")}...` : t("register.submit")}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#e9eff8]" />
        <span className="text-sm text-hana-muted">
          {t("register.or_register_with")}
        </span>
        <span className="h-px flex-1 bg-[#e9eff8]" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => notification.info({ message: t("auth.social_todo") })}
          className="flex h-13 cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-[#e3ecf9] py-3.5 font-semibold text-hana-navy transition hover:bg-hana-sky-soft"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          onClick={() => notification.info({ message: t("auth.social_todo") })}
          className="flex h-13 cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-[#e3ecf9] py-3.5 font-semibold text-hana-navy transition hover:bg-hana-sky-soft"
        >
          <MicrosoftIcon />
          Microsoft
        </button>
      </div>

      {/* Desktop có dòng này ở cột trái, mobile đặt ngay dưới form */}
      <p className="mt-6 text-center text-sm text-hana-navy xl:hidden">
        {t("register.have_account")}{" "}
        <Link
          to="/auth/login"
          className="font-bold text-hana-blue hover:underline"
        >
          {t("register.login_now")}
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
