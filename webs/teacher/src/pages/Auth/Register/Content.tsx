import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { AuthApi } from "@tera/api/auth/auth";
import { FileAPI } from "@tera/api/common/FileAPI";
import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { useStores } from "@tera/stores/useStores";
import { Button, notification } from "tera-dls";

import { validateRegisterStep } from "_common/validations/register";

import AuthScene from "../_shared/AuthScene";

import {
  REGISTER_APP_ID,
  STEP_FIELDS,
  STEP_LABELS,
  initialRegisterForm,
} from "./constants";
import StepIndicator from "./components/StepIndicator";
import PersonalForm from "./containers/PersonalForm";
import ProfileForm from "./containers/ProfileForm";
import SchoolForm from "./containers/SchoolForm";
import type {
  RegisterErrors,
  RegisterFormData,
  RegisterStep,
} from "./types";

const FIELD_ALIAS: Record<string, keyof RegisterFormData> = {
  full_name: "fullname",
  email: "email",
  phone: "phone",
  gender: "gender",
  dob: "dob",
  password: "password",
  password_confirmation: "confirmPassword",
  school: "school",
  position: "position",
  experience: "experience",
  subject: "subject",
  bio: "bio",
};

const resolveRegisterError = (
  error: any,
): { fields: RegisterErrors; message?: string } => {
  const fields: RegisterErrors = {};
  const data = error?.response?.data ?? error?.data ?? {};

  const errorsObj = data?.errors;
  if (errorsObj && typeof errorsObj === "object") {
    Object.entries(errorsObj).forEach(([key, val]) => {
      const mapped = FIELD_ALIAS[key];
      const msg = Array.isArray(val)
        ? val[0]
        : typeof val === "string"
          ? val
          : undefined;
      if (mapped && msg && !fields[mapped]) fields[mapped] = msg;
    });
  }

  const msgObj = error?.data?.msg ?? data?.msg;
  if (msgObj && typeof msgObj === "object" && msgObj.field && msgObj.message) {
    const mapped = FIELD_ALIAS[msgObj.field];
    if (mapped && !fields[mapped]) fields[mapped] = msgObj.message;
  }

  if (Object.keys(fields).length > 0) return { fields };

  const status = error?.response?.status ?? error?.data?.code ?? error?.status;
  if (typeof status === "number" && status >= 500) {
    return { fields, message: "Lỗi kết nối. Vui lòng thử lại" };
  }

  const message =
    (typeof error?.message === "string" && error.message) ||
    (typeof data?.message === "string" && data.message) ||
    "Đăng ký thất bại. Vui lòng thử lại";
  return { fields, message };
};

const stepOfField = (field: keyof RegisterFormData): RegisterStep => {
  const entry = Object.entries(STEP_FIELDS).find(([, fields]) =>
    fields.includes(field),
  );
  return (entry ? Number(entry[0]) : 1) as RegisterStep;
};

const Content = observer(() => {
  const navigate = useNavigate();
  const {
    globalStore,
    globalStore: { authenticated },
  } = useStores();

  const [currentStep, setCurrentStep] = useState<RegisterStep>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<RegisterFormData>(initialRegisterForm);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const ensureDeviceCode = async () => {
    if (globalStore.device) return;
    try {
      const res: any = await AuthApi.getDeviceCode();
      const code =
        res?.device_code ??
        res?.data?.device_code ??
        (typeof res === "string" ? res : undefined);
      if (code) runInAction(() => (globalStore.device = code));
    } catch {
      notification.error({ message: "Không thể kết nối. Vui lòng thử lại" });
      throw new Error("device_init_failed");
    }
  };

  const { mutate, isLoading } = useMutationLegacy({
    mutationFn: async (data: RegisterFormData) => {
      await ensureDeviceCode();

      let avatarUrl = data.avatarUrl;
      if (data.avatar) {
        try {
          const uploaded = await FileAPI.upload(data.avatar, { title: "avatar" });
          avatarUrl = uploaded.url;
        } catch {
          notification.warning({
            message: "Không thể tải ảnh, bỏ qua bước này",
          });
        }
      }

      const payload = {
        full_name: data.fullname.trim(),
        gender: data.gender,
        email: data.email.trim(),
        phone: data.phone.trim(),
        dob: data.dob,
        password: data.password,
        password_confirmation: data.confirmPassword,
        school: data.school.trim(),
        position: data.position.trim() || undefined,
        experience: data.experience === "" ? undefined : Number(data.experience),
        subject: data.subject.trim() || undefined,
        bio: data.bio.trim() || undefined,
        avatar: avatarUrl || undefined,
        app_id: REGISTER_APP_ID,
      };

      return AuthApi.register(payload);
    },
    onSuccess: (res: any) => {
      notification.success({
        message: res?.msg || "Đăng ký thành công. Vui lòng đăng nhập.",
      });
      navigate("/auth/login", { replace: true });
    },
    onError: (error: any) => {
      if (error?.message === "device_init_failed") return;
      const { fields, message } = resolveRegisterError(error);
      if (Object.keys(fields).length > 0) {
        setErrors((prev) => ({ ...prev, ...fields }));
        const firstField = Object.keys(fields)[0] as keyof RegisterFormData;
        setCurrentStep(stepOfField(firstField));
        return;
      }
      if (message) notification.error({ message });
    },
  });

  const updateField = <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const setFieldError = (field: keyof RegisterFormData, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const goToStep = (step: number) => {
    if (isLoading) return;
    if (step === currentStep) return;
    if (step < currentStep || completedSteps.includes(step)) {
      setCurrentStep(step as RegisterStep);
    }
  };

  const handleNext = async () => {
    const stepErrors = await validateRegisterStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }
    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep],
    );
    setCurrentStep((prev) => (prev + 1) as RegisterStep);
  };

  const handleFinish = async () => {
    if (isLoading) return;
    const stepErrors = await validateRegisterStep(3, formData);
    if (Object.keys(stepErrors).length > 0 || errors.avatar || errors.certificate) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }
    setCompletedSteps((prev) => (prev.includes(3) ? prev : [...prev, 3]));
    mutate(formData);
  };

  const handlePrimaryAction = () => {
    if (currentStep < 3) {
      handleNext();
      return;
    }
    handleFinish();
  };

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthScene>
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 xmd:justify-end xmd:pr-24!">
        <div className="w-full max-w-[min(660px,100%)] rounded-3xl bg-white p-8 shadow-[0_8px_40px_rgba(15,23,42,0.08)] sm:p-12 lg:p-14">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-800">Đăng ký</h1>
            <p className="mt-1 text-sm text-slate-500">
              Tạo tài khoản Hana Edu, dành cho Giáo viên
            </p>
          </div>

          <StepIndicator
            currentStep={currentStep}
            steps={STEP_LABELS}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePrimaryAction();
            }}
            noValidate
          >
            {currentStep === 1 && (
              <PersonalForm
                values={formData}
                errors={errors}
                disabled={isLoading}
                onChange={updateField}
                onEnter={handlePrimaryAction}
              />
            )}
            {currentStep === 2 && (
              <SchoolForm
                values={formData}
                errors={errors}
                disabled={isLoading}
                onChange={updateField}
              />
            )}
            {currentStep === 3 && (
              <ProfileForm
                values={formData}
                errors={errors}
                disabled={isLoading}
                onChange={updateField}
                onFieldError={setFieldError}
              />
            )}

            <div className="mt-6 flex gap-3">
              {currentStep > 1 && (
                <Button
                  htmlType="button"
                  onClick={() => setCurrentStep((prev) => (prev - 1) as RegisterStep)}
                  disabled={isLoading}
                  className="h-11 flex-1 justify-center rounded-xl border border-slate-200 bg-white text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Quay lại
                </Button>
              )}
              <Button
                htmlType="submit"
                loading={isLoading}
                disabled={isLoading}
                className="h-11 flex-1 justify-center rounded-xl bg-brand text-base font-medium text-white hover:bg-brand-dark"
              >
                {currentStep < 3 ? "Tiếp tục" : "Hoàn tất"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Đã có tài khoản?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-brand hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </AuthScene>
  );
});

export default Content;
