import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { AuthApi } from "@tera/api/auth/auth";
import { useStores } from "@tera/stores/useStores";
import { AcademicCapOutlined, Button, notification } from "tera-dls";

import { tokenStorage } from "_common/constants/auth";
import {
  LoginFieldErrors,
  validateLogin,
  validateLoginField,
} from "_common/validations/login";

import AuthScene from "../_shared/AuthScene";

import InputEmail from "./components/InputEmail";
import InputPassword from "./components/InputPassword";
import RememberMe from "./components/RememberMe";

const ERROR_MESSAGES = {
  invalidCredentials: "Email hoặc mật khẩu không đúng",
  locked: "Tài khoản đã bị khóa. Vui lòng liên hệ admin",
  connection: "Lỗi kết nối. Vui lòng thử lại",
  timeout: "Yêu cầu hết thời gian. Vui lòng thử lại",
};

const resolveErrorMessage = (error: any): string => {
  if (error?.code === "ECONNABORTED" || /timeout/i.test(error?.message ?? "")) {
    return ERROR_MESSAGES.timeout;
  }

  const status: number | undefined =
    error?.response?.status ?? error?.data?.code ?? error?.status;

  if (status === 401) return ERROR_MESSAGES.invalidCredentials;
  if (status === 403) return ERROR_MESSAGES.locked;
  if (typeof status === "number" && status >= 500) {
    return ERROR_MESSAGES.connection;
  }

  if (!error?.response && error?.data == null) return ERROR_MESSAGES.connection;

  const backendMsg =
    (typeof error?.data?.msg === "string" && error.data.msg) ||
    (typeof error?.data?.msg?.message === "string" && error.data.msg.message) ||
    (typeof error?.data?.message === "string" && error.data.message);
  return backendMsg || ERROR_MESSAGES.invalidCredentials;
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1 7.4 2.8l5.7-5.7C33.6 6.5 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.3-3.5z"
    />
    <path
      fill="#FF3D00"
      d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.4 1 7.4 2.8l5.7-5.7C33.6 6.5 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 43.5c5.2 0 9.6-2 13-5.2l-6-5.1C29 35 26.6 35.9 24 35.9c-5.3 0-9.7-3.6-11.3-8.4l-6.6 5.1C9.6 39 16.2 43.5 24 43.5z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6 5.1c-.4.4 6.3-4.6 6.3-14.5 0-1.2-.1-2.3-.3-3.5z"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden="true">
    <path fill="#F25022" d="M0 0h11v11H0z" />
    <path fill="#7FBA00" d="M12 0h11v11H12z" />
    <path fill="#00A4EF" d="M0 12h11v11H0z" />
    <path fill="#FFB900" d="M12 12h11v11H12z" />
  </svg>
);

const Content = observer(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    globalStore: { authenticated, updateUser, updateAccessId },
  } = useStores();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginFieldErrors>({});

  const { mutate, isPending: isLoading } = useMutationLegacy({
    mutationFn: (variables: { username: string; password: string }) =>
      AuthApi.login(variables),
    onSuccess: async (res: any) => {
      const data = res?.data ?? {};
      const accessToken = data.token ?? data.access_token ?? data.accessToken;
      const refreshToken = data.refresh_token ?? data.refreshToken;

      tokenStorage.saveTokens({
        accessToken,
        refreshToken,
        remember: rememberMe,
      });

      data.access_id && updateAccessId(data.access_id);
      updateUser(data);

      try {
        const profile = await AuthApi.getProfile();
        const user = profile?.data?.user ?? profile?.data ?? profile;
        updateUser({ user });
      } catch {
        // Profile is non-blocking for redirect; the store already holds the token.
      }

      const returnUrl = searchParams.get("returnUrl");
      navigate(returnUrl || "/dashboard", { replace: true });
    },
    onError: (error: any) => {
      notification.error({ message: resolveErrorMessage(error) });
    },
  });

  const handleBlur = async (field: "identifier" | "password") => {
    const message = await validateLoginField(field, { identifier, password });
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    const fieldErrors = await validateLogin({ identifier, password });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    mutate({ username: identifier.trim(), password });
  };

  if (authenticated) {
    return (
      <Navigate to={searchParams.get("returnUrl") || "/dashboard"} replace />
    );
  }

  return (
    <AuthScene>
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 xmd:justify-end xmd:pr-24!">
          <div className="w-full max-w-[min(660px,100%)] rounded-3xl bg-white p-8 shadow-[0_8px_40px_rgba(15,23,42,0.08)] sm:p-12 lg:p-14">
            <div className="mb-5 flex flex-col items-center text-center sm:mb-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white [&_svg]:h-7 [&_svg]:w-7">
                <AcademicCapOutlined />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Đăng nhập</h1>
              <p className="mt-1 text-sm text-slate-500">
                Chào mừng bạn trở lại với Hana Edu
              </p>
              <span className="mt-2 inline-block rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-brand">
                Dành cho Giáo viên
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex flex-col gap-4"
              noValidate
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email hoặc số điện thoại
                </label>
                <InputEmail
                  value={identifier}
                  onChange={(v) => setIdentifier(v)}
                  onBlur={() => handleBlur("identifier")}
                  error={errors.identifier}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Mật khẩu
                </label>
                <InputPassword
                  value={password}
                  onChange={(v) => setPassword(v)}
                  onBlur={() => handleBlur("password")}
                  onEnter={handleSubmit}
                  error={errors.password}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <RememberMe
                  checked={rememberMe}
                  onChange={setRememberMe}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => navigate("/auth/forgot-password")}
                  className="text-sm font-medium text-brand hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <Button
                htmlType="submit"
                loading={isLoading}
                disabled={isLoading}
                className="h-11 w-full justify-center rounded-xl bg-brand text-base font-medium text-white hover:bg-brand-dark"
              >
                Đăng nhập
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-slate-400 sm:my-6">
              <span className="h-px flex-1 bg-slate-200" />
              hoặc đăng nhập bằng
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* TODO(OAuth): wire to Google OAuth route when implemented. */}
              <button
                type="button"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <GoogleIcon />
                Google
              </button>
              {/* TODO(OAuth): wire to Microsoft OAuth route when implemented. */}
              <button
                type="button"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <MicrosoftIcon />
                Microsoft
              </button>
            </div>

            <p className="mt-5 text-center text-sm text-slate-500 sm:mt-6">
              Chưa có tài khoản?{" "}
              <Link
                to="/auth/register"
                className="font-medium text-brand hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
    </AuthScene>
  );
});

export default Content;
