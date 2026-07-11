/* Import: library */
import {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";
import { observer } from "mobx-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Col, Row, Modal, notification, UserOutlined } from "tera-dls";

/* Import: packages */
import { IFormProps, IFileUpload } from "@tera/commons/interfaces";
import { useStores } from "@tera/stores/useStores";
import Input from "@tera/components/dof/Control/Input";
import Select from "@tera/components/dof/Control/Select";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import UploadFiles from "@tera/components/dof/UploadFiles";

/* Import: services */
import { UserService, RoleService, BranchService, BusinessService } from "@tera/modules";

/* Import: pages */
import DateField from "_common/components/DateField";
import { IUserForm } from "pages/System/user/_interface";



const defaultValues: IUserForm = {
  full_name: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  password_confirmation: "",
  business_id: "",
  branch_id: "",
  role_id: "",
  department: "",
  gender: "",
  dob: "",
  avatar: "",
  is_admin: false,
  status: "",
};

const UserForm = observer(
  forwardRef<any, IFormProps & { onSuccess?: () => void }>(
    ({ dataDetail, type = "create", onSuccess }, ref) => {
      const isView = type === "detail";
      const isUpdate = type === "update";
      const { t } = useTranslation();
      const { globalStore } = useStores();

      const [activeTab, setActiveTab] = useState("basic");
      const [showAvatarPreview, setShowAvatarPreview] = useState(false);

      const isUpdateRef = useRef(isUpdate);
      isUpdateRef.current = isUpdate;

      // options
      const genderOptions = globalStore.getOptions("gender") ?? [];
      const statusOptions = globalStore.getOptions("user_status") ?? [];

      const { data: roleData } = RoleService.useRoleList({
        params: { page: 1, per_page: 100 },
      });
      const roles: any[] = useMemo(() => {
        const list = roleData?.data?.items ?? [];
        const selected = dataDetail?.role;
        if (selected?.id && !list.some((r: any) => r.id === selected.id)) {
          return [...list, selected];
        }
        return list;
      }, [roleData, dataDetail]);

      const { data: businessData } = BusinessService.useBusinessList({
        params: { page: 1, per_page: 100, status: "active" },
      });
      const businesses: any[] = useMemo(() => {
        const list = businessData?.data?.items ?? [];
        const selected = dataDetail?.business;
        if (selected?.id && !list.some((b: any) => b.id === selected.id)) {
          return [...list, selected];
        }
        return list;
      }, [businessData, dataDetail]);

      const { data: branchData } = BranchService.useBranchList({
        params: { page: 1, per_page: 100, status: "active" },
      });
      const branches: any[] = useMemo(() => {
        const list = branchData?.data?.items ?? [];
        const selected = dataDetail?.branch;
        if (selected?.id && !list.some((b: any) => b.id === selected.id)) {
          return [...list, selected];
        }
        return list;
      }, [branchData, dataDetail]);

      const schema = useMemo(
        () =>
          yup.object({
            full_name: yup.string().required(t("validate.required")),
            email: yup
              .string()
              .required(t("validate.required"))
              .email(t("validate.email_format")),
            phone: yup
              .string()
              .required(t("validate.required"))
              .matches(/^(0|\+84)\d{9,10}$/, t("validate.phone_format")),
            username: yup
              .string()
              .test("username-required", t("validate.required"), (value) =>
                isUpdateRef.current ? true : !!value,
              ),
            password: yup
              .string()
              .test("password-required", t("validate.required"), (value) =>
                isUpdateRef.current ? true : !!value,
              )
              .test("password-min", t("validate.min_password"), (value) => {
                if (isUpdateRef.current || !value) return true;
                return value.length >= 6;
              }),
            password_confirmation: yup
              .string()
              .test("confirm-required", t("validate.required"), (value) =>
                isUpdateRef.current ? true : !!value,
              )
              .test(
                "confirm-match",
                t("validate.password_mismatch"),
                function (value) {
                  if (isUpdateRef.current) return true;
                  return value === this.parent.password;
                },
              ),
            role_id: yup.string().required(t("validate.required")),
            business_id: yup.string().required(t("validate.required")),
            branch_id: yup.string().optional(),
            status: yup
              .string()
              .test("status-required", t("validate.required"), (value) =>
                isUpdateRef.current ? true : !!value,
              ),
          }),
        [t],
      );

      const form = useForm<IUserForm>({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(schema) as any,
      });

      const { reset, formState, watch } = form;
      const errors = formState.errors as any;
      const avatarValue = watch("avatar" as any);
      const isAdminValue = watch("is_admin" as any);

      const queryClient = useQueryClient();
      const { mutate: onSubmit, isPending } = UserService.useUpsertUser();

      useEffect(() => {
        if (dataDetail?.id) {
          reset({
            full_name: dataDetail.full_name ?? "",
            email: dataDetail.email ?? "",
            phone: dataDetail.phone ?? "",
            username: dataDetail.username ?? "",
            password: "",
            password_confirmation: "",
            business_id: dataDetail.business_id ? String(dataDetail.business_id) : "",
            branch_id: dataDetail.branch_id ? String(dataDetail.branch_id) : "",
            role_id: dataDetail.role_id ? String(dataDetail.role_id) : "",
            department: dataDetail.department ?? "",
            gender: dataDetail.gender ?? "",
            dob: dataDetail.dob ? String(dataDetail.dob).split("T")[0] : "",
            avatar: dataDetail.avatar ?? "",
            is_admin: !!dataDetail.is_admin,
            status: dataDetail.status ?? "",
          });
        } else {
          reset(defaultValues);
        }
      }, [dataDetail, reset]);

      const handleSubmitForm = (values: IUserForm) => {
        const base = {
          full_name: values.full_name?.trim() || undefined,
          email: values.email?.trim() || undefined,
          phone: values.phone?.trim() || undefined,
          business_id: values.business_id ? Number(values.business_id) : undefined,
          branch_id: values.branch_id ? Number(values.branch_id) : undefined,
          role_id: values.role_id ? Number(values.role_id) : undefined,
          department: values.department?.trim() || undefined,
          gender: values.gender || undefined,
          dob: values.dob || undefined,
          avatar: values.avatar?.trim() || undefined,
        };
        // Create có thêm username/password/is_admin/status; update bỏ 3 field đầu
        const params = isUpdate
          ? { ...base, status: values.status || undefined }
          : {
              ...base,
              username: values.username?.trim() || undefined,
              password: values.password || undefined,
              password_confirmation: values.password_confirmation || undefined,
              is_admin: !!values.is_admin,
              status: values.status || undefined,
            };
        onSubmit(
          { id: dataDetail?.id, params },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["user", "list"] });
              queryClient.invalidateQueries({ queryKey: ["user", "detail"] });
              notification.success({
                message: isUpdate
                  ? t("common.update_success")
                  : t("common.create_success"),
              });
              onSuccess?.();
            },
            onError: (error: any) => {
              notification.error({
                message: error?.message || t("common.error_message"),
              });
            },
          },
        );
      };

      useImperativeHandle(ref, () => ({
        isValid: () => formState.isValid,
        submit: () => form.handleSubmit(handleSubmitForm)(),
        isDirty: () => formState.isDirty,
      }));

      const tabErrors: Record<string, boolean> = {
        basic: !!(errors.full_name || errors.email || errors.phone),
        account: !!(
          errors.username ||
          errors.password ||
          errors.password_confirmation ||
          errors.role_id ||
          errors.status
        ),
        work: !!errors.business_id,
      };

      const tabs = [
        { key: "basic", label: t("user.tab_basic") },
        { key: "account", label: t("user.tab_account") },
        { key: "work", label: t("user.tab_work") },
      ];

      return (
        <FormTera
          form={form}
          onSubmit={handleSubmitForm}
          isLoading={isPending}
          isDisabled={isView}
        >
          {/* Tab bar */}
          <div className="flex border-b border-gray-200 mb-4 overflow-x-auto overflow-y-hidden scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tabErrors[tab.key] && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Thông tin cơ bản */}
          <div className={activeTab === "basic" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              {!isView && (
                <Col className="sm:col-span-2">
                  <label className="text-[13px] text-gray-600 font-medium mb-2 block text-center">
                    {t("user.avatar")}
                  </label>
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <div className="relative group w-20 h-20">
                      <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                        {avatarValue ? (
                          <img
                            src={avatarValue}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserOutlined className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                      <UploadFiles
                        isSingle
                        maxSize={10}
                        accept="image/*"
                        onReceiveFiles={(file: IFileUpload) =>
                          form.setValue("avatar" as any, (file as any)?.url, {
                            shouldDirty: true,
                          })
                        }
                        onFailed={() =>
                          notification.error({ message: t("common.error_message") })
                        }
                      >
                        <div className="absolute inset-0 rounded-full flex items-center justify-center text-center px-1 bg-black/45 text-white text-[11px] font-medium leading-tight opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          {t("user.upload_avatar")}
                        </div>
                      </UploadFiles>
                    </div>
                    {avatarValue && (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowAvatarPreview(true)}
                          className="text-[13px] text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {t("button.detail")}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            form.setValue("avatar" as any, "", { shouldDirty: true })
                          }
                          className="text-[13px] text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          {t("button.delete")}
                        </button>
                      </div>
                    )}
                  </div>
                </Col>
              )}
              <Col>
                <FormTeraItem
                  label={t("user.full_name")}
                  name="full_name"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("user.full_name") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("user.email")}
                  name="email"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input placeholder="email@hana.edu.vn" disabled={isView} />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("user.phone")}
                  name="phone"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    type="tel"
                    autoComplete="off"
                    placeholder={t("form.enter_value", { key: t("user.phone") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("user.gender")} name="gender">
                    <Select
                      options={genderOptions}
                      placeholder={t("form.enter_value", { key: t("user.gender") })}
                      disabled={isView}
                    />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("user.dob")} name="dob">
                  <DateField disabled={isView} />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 2: Tài khoản & phân quyền */}
          <div className={activeTab === "account" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Col>
                <FormTeraItem
                  label={t("user.username")}
                  name="username"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    autoComplete="off"
                    placeholder="VD: teacher01"
                    disabled={isView || isUpdate}
                  />
                </FormTeraItem>
              </Col>
              {!isUpdate && (
                <Col>
                  <FormTeraItem
                    label={t("user.password")}
                    name="password"
                    rules={[{ required: t("validate.required") }]}
                  >
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder={t("form.enter_value", { key: t("user.password") })}
                      disabled={isView}
                    />
                  </FormTeraItem>
                </Col>
              )}
              {!isUpdate && (
                <Col>
                  <FormTeraItem
                    label={t("user.password_confirmation")}
                    name="password_confirmation"
                    rules={[{ required: t("validate.required") }]}
                  >
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder={t("form.enter_value", {
                        key: t("user.password_confirmation"),
                      })}
                      disabled={isView}
                    />
                  </FormTeraItem>
                </Col>
              )}
              <Col>
                <FormTeraItem
                  label={t("user.role")}
                  name="role_id"
                  rules={[{ required: t("validate.required") }]}
                >
                    <Select
                      options={roles.map((r: any) => ({
                      value: String(r.id),
                      label: r.title ?? r.name ?? r.role_name ?? `#${r.id}`,
                    }))}
                      placeholder={t("form.enter_value", { key: t("user.role") })}
                      disabled={isView}
                    />
                </FormTeraItem>
              </Col>
              {!isUpdate && (
                <Col>
                  <FormTeraItem
                    label={t("user.status")}
                    name="status"
                    rules={[{ required: t("validate.required") }]}
                  >
                      <Select
                        options={statusOptions}
                        placeholder={t("form.enter_value", { key: t("user.status") })}
                        disabled={isView}
                      />
                  </FormTeraItem>
                </Col>
              )}
              {!isUpdate && (
                <Col className="flex items-end pb-4">
                  <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      disabled={isView}
                      checked={!!isAdminValue}
                      onChange={(e) =>
                        form.setValue("is_admin" as any, e.target.checked, {
                          shouldDirty: true,
                        })
                      }
                    />
                    {t("user.is_admin")}
                  </label>
                </Col>
              )}
            </Row>
          </div>

          {/* Tab 3: Công việc */}
          <div className={activeTab === "work" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Col>
                <FormTeraItem
                  label={t("user.business")}
                  name="business_id"
                  rules={[{ required: t("validate.required") }]}
                >
                    <Select
                      options={businesses.map((b: any) => ({ value: String(b.id), label: b.name }))}
                      placeholder={t("form.enter_value", { key: t("user.business") })}
                      disabled={isView}
                    />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("user.branch")} name="branch_id">
                    <Select
                      options={branches.map((b: any) => ({ value: String(b.id), label: b.name }))}
                      placeholder={t("form.enter_value", { key: t("user.branch") })}
                      disabled={isView}
                    />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("user.department")} name="department">
                  <Input
                    placeholder={t("form.enter_value", { key: t("user.department") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>
          {showAvatarPreview && (
            <Modal
              title={t("user.avatar")}
              open={showAvatarPreview}
              cancelText={t("button.close")}
              okButtonProps={{ className: "hidden" }}
              onCancel={() => setShowAvatarPreview(false)}
            >
              <img
                src={avatarValue}
                alt="avatar"
                className="max-h-[70vh] max-w-full mx-auto rounded"
              />
            </Modal>
          )}
        </FormTera>
      );
    },
  ),
);

export default UserForm;
