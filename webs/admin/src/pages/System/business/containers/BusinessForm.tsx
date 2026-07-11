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
import { Col, Row, notification } from "tera-dls";
import debounce from "lodash/debounce";

/* Import: packages */
import { IFormProps } from "@tera/commons/interfaces";
import Input from "@tera/components/dof/Control/Input";
import Select from "@tera/components/dof/Control/Select";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { BusinessService } from "@tera/modules";

/* Import: components */
import UserSelect from "_common/components/UserSelect";
import { BusinessAPI } from "@tera/api";

/* Import: pages */
import { IBusinessForm } from "pages/System/business/_interface";


const defaultValues: IBusinessForm = {
  business_code: "",
  name: "",
  short_name: "",
  prefix: "",
  tax_code: "",
  website: "",
  status: "",
  phone: "",
  email: "",
  address: "",
  province: "",
  district: "",
  ward: "",
  zip_code: "",
  manager_id: "",
};

const BusinessForm = observer(
  forwardRef<any, IFormProps & { onSuccess?: () => void }>(
    ({ dataDetail, type = "create", onSuccess }, ref) => {
      const isView = type === "detail";
      const isUpdate = type === "update";
      const { t } = useTranslation();
      const { globalStore } = useStores();

      const [activeTab, setActiveTab] = useState("basic");

      const statusOptions = (
        globalStore.getOptions("business_status") ?? []
      ).filter((opt: any) => opt.value !== "suspended");

      const isUpdateRef = useRef(isUpdate);
      isUpdateRef.current = isUpdate;

      const currentIdRef = useRef(dataDetail?.id);
      currentIdRef.current = dataDetail?.id;

      const checkCodeRef = useRef(
        debounce((code: string, resolve: (valid: boolean) => void) => {
          BusinessAPI.getList({ params: { keyword: code, per_page: 20 } })
            .then((res: any) => {
              const items: any[] = res?.data?.items ?? [];
              resolve(!items.some((item) => item.business_code === code));
            })
            .catch(() => resolve(true));
        }, 500),
      );

      const checkEmailRef = useRef(
        debounce((email: string, resolve: (valid: boolean) => void) => {
          BusinessAPI.getList({ params: { keyword: email, per_page: 20 } })
            .then((res: any) => {
              const items: any[] = res?.data?.items ?? [];
              const dup = items.some(
                (item) =>
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
            business_code: yup
              .string()
              .test("code-required", t("validate.required"), (value) =>
                isUpdateRef.current ? true : !!value,
              )
              .test("unique-code", t("validate.code_exists"), (value) => {
                if (!value || isUpdateRef.current) return true;
                return new Promise((resolve) =>
                  checkCodeRef.current(value, resolve),
                );
              }),
            name: yup.string().required(t("validate.required")),
            short_name: yup.string().optional(),
            prefix: yup
              .string()
              .required(t("validate.required"))
              .matches(/^[A-Z]+$/, t("validate.uppercase_only")),
            tax_code: yup.string().optional(),
            website: yup.string().optional(),
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

      const form = useForm<IBusinessForm>({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(schema) as any,
      });

      const { reset, formState, watch } = form;
      const errors = formState.errors as any;
      const managerIdValue = watch("manager_id");
      const prefixValue = watch("prefix");

      // prefix tự động viết hoa khi gõ
      useEffect(() => {
        const upper = (prefixValue ?? "").toUpperCase();
        if (prefixValue && prefixValue !== upper) {
          form.setValue("prefix", upper, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }, [prefixValue]);

      const queryClient = useQueryClient();
      const { mutate: onSubmit, isPending } = BusinessService.useUpsertBusiness();

      useEffect(() => {
        if (dataDetail?.id) {
          reset({
            business_code: dataDetail.business_code ?? "",
            name: dataDetail.name ?? "",
            short_name: dataDetail.short_name ?? "",
            prefix: dataDetail.prefix ?? "",
            tax_code: dataDetail.tax_code ?? "",
            website: dataDetail.website ?? "",
            status: dataDetail.status ?? "",
            phone: dataDetail.phone ?? "",
            email: dataDetail.email ?? "",
            address: dataDetail.address ?? "",
            province: dataDetail.province ?? "",
            district: dataDetail.district ?? "",
            ward: dataDetail.ward ?? "",
            zip_code: dataDetail.zip_code ?? "",
            manager_id: dataDetail.manager_id ? String(dataDetail.manager_id) : "",
          });
        } else {
          reset(defaultValues);
        }
      }, [dataDetail, reset]);

      const handleSubmitForm = (values: IBusinessForm) => {
        const params = {
          business_code: values.business_code?.trim() || undefined,
          name: values.name?.trim() || undefined,
          short_name: values.short_name?.trim() || undefined,
          prefix: values.prefix?.trim() || undefined,
          tax_code: values.tax_code?.trim() || undefined,
          website: values.website?.trim() || undefined,
          status: values.status || undefined,
          phone: values.phone?.trim() || undefined,
          email: values.email?.trim() || undefined,
          address: values.address?.trim() || undefined,
          province: values.province?.trim() || undefined,
          district: values.district?.trim() || undefined,
          ward: values.ward?.trim() || undefined,
          zip_code: values.zip_code?.trim() || undefined,
          manager_id: (() => {
            const id = parseInt(String(values.manager_id ?? "").trim(), 10);
            return Number.isInteger(id) && id > 0 ? id : undefined;
          })(),
        };
        onSubmit(
          { id: dataDetail?.id, params },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["business", "list"] });
              queryClient.invalidateQueries({ queryKey: ["business", "detail"] });
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
        basic: !!(errors.business_code || errors.name || errors.prefix),
        contact: !!(
          errors.phone ||
          errors.email ||
          errors.address ||
          errors.province ||
          errors.district
        ),
        management: !!errors.status,
      };

      const tabs = [
        { key: "basic", label: t("business.tab_basic") },
        { key: "contact", label: t("business.tab_contact") },
        { key: "management", label: t("business.tab_management") },
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
                  label={t("business.code")}
                  name="business_code"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("business.code") })}
                    disabled={isView || isUpdate}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("business.name")}
                  name="name"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("business.name") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("business.short_name")} name="short_name">
                  <Input
                    placeholder={t("form.enter_value", { key: t("business.short_name") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("business.prefix")}
                  name="prefix"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("business.prefix") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("business.tax_code")} name="tax_code">
                  <Input
                    placeholder={t("form.enter_value", { key: t("business.tax_code") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col className="sm:col-span-2">
                <FormTeraItem label={t("business.website")} name="website">
                  <Input
                    placeholder={t("form.enter_value", { key: t("business.website") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 2: Thông tin liên hệ */}
          <div className={activeTab === "contact" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Col>
                <FormTeraItem
                  label={t("business.phone")}
                  name="phone"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("business.phone") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("business.email")}
                  name="email"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("business.email") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("business.province")}
                  name="province"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("business.province") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("business.district")}
                  name="district"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("business.district") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("business.ward")} name="ward">
                  <Input
                    placeholder={t("form.enter_value", { key: t("business.ward") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("business.zip_code")} name="zip_code">
                  <Input
                    placeholder={t("form.enter_value", { key: t("business.zip_code") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col className="sm:col-span-2">
                <FormTeraItem
                  label={t("business.address")}
                  name="address"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("business.address") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 3: Thông tin quản lý */}
          <div className={activeTab === "management" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              {!isUpdate && (
                <Col>
                  <FormTeraItem
                    label={t("business.status")}
                    name='status'
                    rules={[{ required: t("validate.required") }]}
                  >
                    <Select
                      options={statusOptions}
                      placeholder={t("form.enter_value", { key: t("business.status") })}
                      disabled={isView}
                    />
                  </FormTeraItem>
                </Col>
              )}
              <Col>
                <FormTeraItem label={t("business.manager")} name="manager_id">
                  <UserSelect
                    value={managerIdValue}
                    selectedUser={dataDetail?.manager}
                    disabled={isView}
                    placeholder={t("form.enter_value", { key: t("business.manager") })}
                    onChange={(id) =>
                      form.setValue("manager_id", id, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>
        </FormTera>
      );
    },
  ),
);

export default BusinessForm;
