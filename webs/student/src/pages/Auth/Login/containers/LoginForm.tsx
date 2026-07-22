import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  EyeOutlined,
  EyeSlashOutlined,
  LockClosedOutlined,
  UserOutlined,
  notification,
} from "tera-dls";
import * as yup from "yup";

import { AuthApi } from "@tera/api/auth/auth";
import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { useStores } from "@tera/stores/useStores";

import HanaLogo from "_common/components/Layout/StudentLayout/HanaLogo";

import { GoogleIcon, MicrosoftIcon } from "./BrandIcons";

interface ILoginForm {
  username: string;
  password: string;
}

const inputClass =
  "h-14 w-full rounded-2xl border border-[#e3ecf9] bg-white pl-12 pr-12 text-[15px] text-hana-navy outline-none transition placeholder:text-hana-muted/70 focus:border-hana-blue focus:ring-4 focus:ring-hana-blue/10";

/** Thẻ đăng nhập bên phải — mockup screen/desktop/dang nhap.png */
const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    globalStore: { updateUser, updateAccessId },
  } = useStores();

  const [visible, setVisible] = useState(false);
  const [remember, setRemember] = useState(true);

  const schema = useMemo(
    () =>
      yup.object({
        username: yup.string().trim().required(t("auth.required_username")),
        password: yup.string().trim().required(t("auth.required_password")),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ILoginForm>({
    mode: "onChange",
    defaultValues: { username: "", password: "" },
    resolver: yupResolver(schema) as any,
  });

  const { mutate, isLoading } = useMutationLegacy({
    mutationFn: (variables: ILoginForm) => AuthApi.login(variables),
    onSuccess: (res: any) => {
      res?.data?.access_id && updateAccessId(res.data.access_id);

      // Tài khoản bật xác thực 2 lớp.
      // ⚠️ Route /auth/otp/:id CHƯA được khai trong routers của web học viên —
      // khi nào có màn OTP thì khai thêm, hiện tại sẽ rơi vào trang 404.
      if (res?.data?.verify_auth) {
        navigate(`/auth/otp/${res?.data?.user?.id}`);
        return;
      }

      updateUser(res?.data);
      setTimeout(() => navigate("/"), 200);
    },
    onError: (error: any) => {
      const msg = error?.data?.msg;

      // Backend trả lỗi theo field ({field, message}) hoặc chỉ 1 chuỗi
      if (msg && typeof msg === "object" && msg.field && msg.message) {
        setError(msg.field, { type: "error", message: msg.message });
        return;
      }

      notification.error({
        message: typeof msg === "string" ? msg : t("common.error"),
      });
    },
  });

  const onSubmit = (values: ILoginForm) => {
    if (isLoading) return;
    mutate(values);
  };

  const socialTodo = () =>
    notification.info({ message: t("auth.social_todo") });

  return (
    <div className="relative z-10 mt-auto w-full rounded-t-[32px] bg-white p-6 pb-9 shadow-[0_-8px_30px_rgba(23,92,211,0.08)] xl:mt-0 xl:max-w-[600px] xl:shrink-0 xl:rounded-[32px] xl:p-10 xl:shadow-hana">
      {/* Mobile đã có logo trên hero nên chỉ hiện logo trong thẻ ở desktop */}
      <div className="hidden justify-center xl:flex">
        <HanaLogo />
      </div>

      <h2 className="mt-2 xl:mt-6 text-center text-[32px] font-extrabold text-hana-navy">
        {t("auth.login_title")}
      </h2>
      <p className="mt-1.5 text-center text-sm text-hana-muted">
        {t("auth.login_subtitle")}
      </p>

      <form className="mt-7" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="mb-2 block text-sm font-semibold text-hana-navy">
          {t("auth.username_label")}
        </label>
        <div className="relative">
          <UserOutlined className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-hana-muted" />
          <input
            {...register("username")}
            autoFocus
            autoComplete="username"
            maxLength={320}
            placeholder={t("auth.username_placeholder")}
            className={inputClass}
          />
        </div>
        {errors.username && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {errors.username.message}
          </p>
        )}

        <label className="mb-2 mt-5 block text-sm font-semibold text-hana-navy">
          {t("auth.password_label")}
        </label>
        <div className="relative">
          <LockClosedOutlined className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-hana-muted" />
          <input
            {...register("password")}
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            maxLength={64}
            placeholder={t("auth.password_placeholder")}
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
        {errors.password && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {errors.password.message}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-hana-navy">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-hana-blue"
            />
            {t("auth.remember")}
          </label>
          <Link
            to="/auth/forgot-password"
            className="text-sm font-semibold text-hana-blue hover:underline"
          >
            {t("auth.forgot")}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-5 h-14 w-full cursor-pointer rounded-2xl bg-hana-blue text-lg font-bold text-white transition hover:bg-hana-blue-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? `${t("auth.submit")}...` : t("auth.submit")}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#e9eff8]" />
        <span className="text-sm text-hana-muted">
          {t("auth.or_login_with")}
        </span>
        <span className="h-px flex-1 bg-[#e9eff8]" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={socialTodo}
          className="flex h-13 cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-[#e3ecf9] py-3.5 font-semibold text-hana-navy transition hover:bg-hana-sky-soft"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          onClick={socialTodo}
          className="flex h-13 cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-[#e3ecf9] py-3.5 font-semibold text-hana-navy transition hover:bg-hana-sky-soft"
        >
          <MicrosoftIcon />
          Microsoft
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-hana-navy">
        {t("auth.no_account")}{" "}
        <Link
          to="/auth/register"
          className="font-bold text-hana-blue hover:underline"
        >
          {t("auth.register_now")}
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
