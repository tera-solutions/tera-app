import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { AuthApi } from "@tera/api/auth/auth";
import { useStores } from "@tera/stores/useStores";
import { Button, notification } from "tera-dls";

import logo from "@/assets/logo.webp";
import {
  LoginFieldErrors,
  validateLogin,
  validateLoginField,
} from "_common/validations/login";

import AuthScene from "../_shared/AuthScene";

import GoogleLoginButton from "./components/GoogleLoginButton";
import InputEmail from "./components/InputEmail";
import InputPassword from "./components/InputPassword";
import MicrosoftLoginButton from "./components/MicrosoftLoginButton";
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

  // The API always answers with HTTP 200 and embeds its own business status in
  // `data.code` (e.g. 500 for "account not found"/"wrong password"), so that
  // field must never be read as a transport status — doing so misclassified
  // every login failure as a 5xx "connection error" and hid the real message.
  const backendMsg =
    (typeof error?.data?.msg === "string" && error.data.msg) ||
    (typeof error?.data?.msg?.message === "string" && error.data.msg.message) ||
    (typeof error?.data?.message === "string" && error.data.message);
  if (backendMsg) return backendMsg;

  const status: number | undefined = error?.response?.status ?? error?.status;

  if (status === 401) return ERROR_MESSAGES.invalidCredentials;
  if (status === 403) return ERROR_MESSAGES.locked;
  if (typeof status === "number" && status >= 500) {
    return ERROR_MESSAGES.connection;
  }

  if (!error?.response && error?.data == null) return ERROR_MESSAGES.connection;

  return ERROR_MESSAGES.invalidCredentials;
};

const Content = observer(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    globalStore: {
      authenticated,
      updateUser,
      updateAccessId,
      setRememberMe: persistRememberMe,
    },
  } = useStores();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginFieldErrors>({});

  const handleAuthSuccess = async (data: any, remember: boolean) => {
    persistRememberMe(remember);

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
  };

  const { mutate, isPending: isLoading } = useMutationLegacy({
    mutationFn: (variables: { username: string; password: string }) =>
      AuthApi.login(variables),
    onSuccess: (res: any) => handleAuthSuccess(res?.data ?? {}, rememberMe),
    onError: (error: any) => {
      notification.error({ message: resolveErrorMessage(error) });
    },
  });

  const { mutate: socialLogin, isPending: isSocialLoading } = useMutationLegacy({
    mutationFn: (variables: { provider: "google" | "microsoft"; id_token: string }) =>
      AuthApi.socialLogin(variables),
    onSuccess: (res: any) => handleAuthSuccess(res?.data ?? {}, true),
    onError: (error: any) => {
      notification.error({ message: resolveErrorMessage(error) });
    },
  });

  const handleSocialSuccess = (provider: "google" | "microsoft") => (idToken: string) =>
    socialLogin({ provider, id_token: idToken });

  const handleSocialError = (message: string) => notification.error({ message });

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
              <img src={logo} alt="Hana Edu" className="mb-4 h-16 w-auto object-contain" />
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
              <GoogleLoginButton
                onSuccess={handleSocialSuccess("google")}
                onError={handleSocialError}
                disabled={isSocialLoading}
              />
              <MicrosoftLoginButton
                onSuccess={handleSocialSuccess("microsoft")}
                onError={handleSocialError}
                disabled={isSocialLoading}
              />
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
