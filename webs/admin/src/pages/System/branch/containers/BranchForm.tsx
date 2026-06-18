/* Import: library */
import {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Col, Row, notification } from "tera-dls";
import debounce from "lodash/debounce";

/* Import: packages */
import { IFormProps } from "@tera/commons/interfaces";
import Input from "@tera/components/dof/Control/Input";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";

/* Import: services */
import { BranchService, BusinessService } from "@tera/modules";
import { BranchAPI } from "@tera/api";

/* Import: pages */
import UserSelect from "_common/components/UserSelect";
import { IBranchForm } from "pages/System/branch/_interface";

const SELECT_CLASS =
  "w-full max-w-full min-w-0 h-9 border border-gray-300 bg-white px-3 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer box-border";

const BUSINESS_ID = 1;

const defaultValues: IBranchForm = {
  business_id: "",
  code: "",
  name: "",
  short_name: "",
  status: "",
  phone: "",
  email: "",
  website: "",
  address: "",
  province: "",
  district: "",
  ward: "",
  postal_code: "",
  manager_id: "",
  capacity: "",
  opened_at: "",
};

const BranchForm = forwardRef<any, IFormProps & { onSuccess?: () => void }>(
  ({ dataDetail, type = "create", onSuccess }, ref) => {
    const isView = type === "detail";
    const isUpdate = type === "update";
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState("basic");

    const { data: businessData } = BusinessService.useBusinessList({
      params: { page: 1, per_page: 100, status: "active" },
    });
    const businesses: any[] = useMemo(() => {
      const list = businessData?.data?.items ?? [];
      const selected = dataDetail?.business;
      // giữ option cho doanh nghiệp đang gán dù đã inactive
      if (selected?.id && !list.some((b: any) => b.id === selected.id)) {
        return [...list, selected];
      }
      return list;
    }, [businessData, dataDetail]);


    const isUpdateRef = useRef(isUpdate);
    isUpdateRef.current = isUpdate;

    const currentIdRef = useRef(dataDetail?.id);
    currentIdRef.current = dataDetail?.id;

    const checkCodeRef = useRef(
      debounce((code: string, resolve: (valid: boolean) => void) => {
        BranchAPI.getList({ params: { keyword: code, per_page: 5 } })
          .then((res: any) => {
            const items: any[] = res?.data?.items ?? [];
            resolve(!items.some((item) => item.code === code));
          })
          .catch(() => resolve(true));
      }, 500),
    );

    const checkEmailRef = useRef(
      debounce((email: string, resolve: (valid: boolean) => void) => {
        BranchAPI.getList({ params: { keyword: email, per_page: 20 } })
          .then((res: any) => {
            const items: any[] = res?.data?.items ?? [];
            const dup = items.some(
              (item: any) =>
                (item.email ?? "").toLowerCase() === email.toLowerCase() &&
                item.id !== currentIdRef.current,
            );
            resolve(!dup);
          })
          .catch(() => resolve(true));
      }, 500),
    );

    const schema = useMemo(
      () =>
        yup.object({
          business_id: yup
            .string()
            .test("business-required", t("validate.required"), (value) =>
              isUpdateRef.current ? true : !!value,
            ),
          code: yup
            .string()
            .required(t("validate.required"))
            .matches(/^[a-zA-Z0-9_-]+$/, t("validate.no_special_chars"))
            .test("unique-code", t("validate.code_exists"), (value) => {
              if (!value || isUpdateRef.current) return true;
              return new Promise((resolve) =>
                checkCodeRef.current(value, resolve),
              );
            }),
          name: yup.string().required(t("validate.required")),
          short_name: yup.string().required(t("validate.required")),
          status: yup
            .string()
            .test("status-required", t("validate.required"), (value) =>
              isUpdateRef.current ? true : !!value,
            ),
          email: yup
            .string()
            .required(t("validate.required"))
            .email(t("validate.email_format"))
            .test("unique-email", t("validate.email_exists"), (value) => {
              if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                return true;
              return new Promise((resolve) =>
                checkEmailRef.current(value, resolve),
              );
            }),
          phone: yup
            .string()
            .required(t("validate.required"))
            .matches(/^(0|\+84)\d{9,10}$/, t("validate.phone_format")),
          address: yup.string().required(t("validate.required")),
          province: yup.string().required(t("validate.required")),
          district: yup.string().required(t("validate.required")),
          manager_id: yup.string().optional(),
        }),
      [t],
    );

    const form = useForm<IBranchForm>({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema) as any,
    });

    const { reset, formState, watch } = form;
    const errors = formState.errors as any;
    const statusValue = watch("status");
    const businessIdValue = watch("business_id");
    const managerIdValue = watch("manager_id");

    const queryClient = useQueryClient();
    const { mutate: onSubmit, isPending } = BranchService.useUpsertBranch();

    useEffect(() => {
      if (dataDetail?.id) {
        reset({
          business_id: dataDetail.business_id ? String(dataDetail.business_id) : "",
          code: dataDetail.code ?? "",
          name: dataDetail.name ?? "",
          short_name: dataDetail.short_name ?? "",
          status: dataDetail.status ?? "",
          phone: dataDetail.phone ?? "",
          email: dataDetail.email ?? "",
          website: dataDetail.website ?? "",
          address: dataDetail.address ?? "",
          province: dataDetail.province ?? "",
          district: dataDetail.district ?? "",
          ward: dataDetail.ward ?? "",
          postal_code: dataDetail.postal_code ?? "",
          manager_id: dataDetail.manager_id ? String(dataDetail.manager_id) : "",
          capacity: dataDetail.capacity != null ? String(dataDetail.capacity) : "",
          opened_at: dataDetail.opened_at
            ? String(dataDetail.opened_at).split("T")[0]
            : "",
        });
      } else {
        reset(defaultValues);
      }
    }, [dataDetail, reset]);

    const handleSubmitForm = (values: IBranchForm) => {
      const params = {
        business_id: values.business_id ? Number(values.business_id) : BUSINESS_ID,
        code: values.code?.trim() || undefined,
        name: values.name?.trim() || undefined,
        short_name: values.short_name?.trim() || undefined,
        status: values.status || undefined,
        phone: values.phone?.trim() || undefined,
        email: values.email?.trim() || undefined,
        website: values.website?.trim() || undefined,
        address: values.address?.trim() || undefined,
        province: values.province?.trim() || undefined,
        district: values.district?.trim() || undefined,
        ward: values.ward?.trim() || undefined,
        postal_code: values.postal_code?.trim() || undefined,
        manager_id: (() => {
          const id = parseInt(String(values.manager_id ?? "").trim(), 10);
          return Number.isInteger(id) && id > 0 ? id : undefined;
        })(),
        capacity: (() => {
          const c = parseInt(String(values.capacity ?? "").trim(), 10);
          return Number.isInteger(c) && c >= 0 ? c : undefined;
        })(),
        opened_at: values.opened_at || undefined,
      };
      onSubmit(
        { id: dataDetail?.id, params },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["branch", "list"] });
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
      basic: !!(
        errors.business_id ||
        errors.code ||
        errors.name ||
        errors.short_name ||
        errors.status
      ),
      contact: !!(
        errors.email ||
        errors.phone ||
        errors.address ||
        errors.province ||
        errors.district
      ),
      management: false,
    };

    const tabs = [
      { key: "basic", label: t("branch.tab_basic") },
      { key: "contact", label: t("branch.tab_contact") },
      { key: "management", label: t("branch.tab_management") },
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
            <Col>
              <FormTeraItem
                label={t("branch.business")}
                name="business_id"
                rules={[{ required: t("validate.required") }]}
              >
                <div className="w-full overflow-hidden">
                  <select
                    className={SELECT_CLASS}
                    style={{ borderRadius: "3px", color: businessIdValue ? "#111827" : "#9ca3af" }}
                    disabled={isView || isUpdate}
                    {...form.register("business_id")}
                  >
                    <option value="" disabled hidden>
                      {t("form.enter_value", { key: t("branch.business") })}
                    </option>
                    {businesses.map((b) => (
                      <option key={b.id} value={String(b.id)} style={{ color: "#111827" }}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem
                label={t("branch.code")}
                name="code"
                rules={[{ required: t("validate.required") }]}
              >
                <Input
                  placeholder={isUpdate ? "" : "VD: Q1, Q3..."}
                  disabled={isView || isUpdate}
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem
                label={t("branch.name")}
                name="name"
                rules={[{ required: t("validate.required") }]}
              >
                <Input
                  placeholder={t("form.enter_value", { key: t("branch.name") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem
                label={t("branch.short_name")}
                name="short_name"
                rules={[{ required: t("validate.required") }]}
              >
                <Input
                  placeholder={t("form.enter_value", { key: t("branch.short_name") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
            {!isUpdate && (
              <Col>
                <FormTeraItem
                  label={t("branch.status")}
                  name="status"
                  rules={[{ required: t("validate.required") }]}
                >
                  <div className="w-full overflow-hidden">
                    <select
                      className={SELECT_CLASS}
                      style={{ borderRadius: "3px", color: statusValue ? "#111827" : "#9ca3af" }}
                      disabled={isView}
                      {...form.register("status")}
                    >
                      <option value="" disabled hidden>
                        {t("form.enter_value", { key: t("branch.status") })}
                      </option>
                      <option value="active" style={{ color: "#111827" }}>
                        {t("branch.status_active")}
                      </option>
                      <option value="inactive" style={{ color: "#111827" }}>
                        {t("branch.status_inactive")}
                      </option>
                    </select>
                  </div>
                </FormTeraItem>
              </Col>
            )}
          </Row>
        </div>

        {/* Tab 2: Thông tin liên hệ */}
        <div className={activeTab === "contact" ? "block" : "hidden"}>
          <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Col>
              <FormTeraItem
                label={t("branch.phone")}
                name="phone"
                rules={[{ required: t("validate.required") }]}
              >
                <Input
                  placeholder={t("form.enter_value", { key: t("branch.phone") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem
                label={t("branch.email")}
                name="email"
                rules={[{ required: t("validate.required") }]}
              >
                <Input
                  placeholder={t("form.enter_value", { key: t("branch.email") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem label={t("branch.website")} name="website">
                <Input
                  placeholder={t("form.enter_value", { key: t("branch.website") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem
                label={t("branch.address")}
                name="address"
                rules={[{ required: t("validate.required") }]}
              >
                <Input
                  placeholder={t("form.enter_value", { key: t("branch.address") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem
                label={t("branch.province")}
                name="province"
                rules={[{ required: t("validate.required") }]}
              >
                <Input
                  placeholder={t("form.enter_value", { key: t("branch.province") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem
                label={t("branch.district")}
                name="district"
                rules={[{ required: t("validate.required") }]}
              >
                <Input
                  placeholder={t("form.enter_value", { key: t("branch.district") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem label={t("branch.ward")} name="ward">
                <Input
                  placeholder={t("form.enter_value", { key: t("branch.ward") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem label={t("branch.postal_code")} name="postal_code">
                <Input
                  placeholder={t("form.enter_value", { key: t("branch.postal_code") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
          </Row>
        </div>

        {/* Tab 3: Thông tin quản lý */}
        <div className={activeTab === "management" ? "block" : "hidden"}>
          <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Col>
              <FormTeraItem label={t("branch.manager")} name="manager_id">
                <UserSelect
                  value={managerIdValue}
                  selectedUser={dataDetail?.manager}
                  disabled={isView}
                  placeholder={t("form.enter_value", { key: t("branch.manager") })}
                  onChange={(id) =>
                    form.setValue("manager_id", id, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem label={t("branch.opened_at")} name="opened_at">
                <Input type="date" disabled={isView} />
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem label={t("branch.capacity")} name="capacity">
                <Input
                  type="number"
                  min={0}
                  step={1}
                  placeholder={t("form.enter_value", { key: t("branch.capacity") })}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
          </Row>
        </div>
      </FormTera>
    );
  },
);

export default BranchForm;
