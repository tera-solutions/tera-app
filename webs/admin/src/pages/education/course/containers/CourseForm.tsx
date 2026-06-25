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
import { Col, Row, notification, BookOpenOutlined } from "tera-dls";
import debounce from "lodash/debounce";

/* Import: packages */
import { IFormProps, IFileUpload } from "@tera/commons/interfaces";
import Input from "@tera/components/dof/Control/Input";
import TextArea from "@tera/components/dof/Control/TextArea";
import UploadFiles from "@tera/components/dof/UploadFiles";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";

/* Import: services */
import { CourseService, BusinessService } from "@tera/modules";
import { CourseAPI } from "@tera/api";

/* Import: pages */
import { ICourseForm } from "pages/education/course/_interface";

const SELECT_CLASS =
  "w-full max-w-full min-w-0 h-9 border border-gray-300 bg-white px-3 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer box-border";

const defaultValues: ICourseForm = {
  code: "",
  name: "",
  thumbnail: "",
  duration_minutes: "",
  price_per_lesson: "",
  description: "",
  is_active: "",
  business_id: "",
};

const CourseForm = forwardRef<
  any,
  IFormProps & { onSuccess?: () => void; hasClasses?: boolean }
>(({ dataDetail, type = "create", onSuccess, hasClasses = false }, ref) => {
    const isView = type === "detail";
    const isUpdate = type === "update";
    // Mã khóa học chỉ bị khóa khi đang cập nhật VÀ đã phát sinh lớp học
    const codeLocked = isUpdate && hasClasses;
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState("basic");

    const { data: businessData } = BusinessService.useBusinessList({
      params: { page: 1, per_page: 100, status: "active" },
    });
    const businesses: any[] = useMemo(() => {
      const list = businessData?.data?.items ?? [];
      const selected = dataDetail?.business;
      // giữ option cho doanh nghiệp đang gán dù không nằm trong list active
      if (selected?.id && !list.some((b: any) => b.id === selected.id)) {
        return [...list, selected];
      }
      return list;
    }, [businessData, dataDetail]);

    const isUpdateRef = useRef(isUpdate);
    isUpdateRef.current = isUpdate;

    const codeLockedRef = useRef(codeLocked);
    codeLockedRef.current = codeLocked;

    const currentIdRef = useRef(dataDetail?.id);
    currentIdRef.current = dataDetail?.id;

    const checkCodeRef = useRef(
      debounce((code: string, resolve: (valid: boolean) => void) => {
        CourseAPI.getList({ params: { keyword: code, per_page: 5 } })
          .then((res) => {
            const items: any[] = res?.data?.items ?? [];
            resolve(
              !items.some(
                (item) =>
                  item.code === code && item.id !== currentIdRef.current,
              ),
            );
          })
          .catch(() => resolve(true));
      }, 500),
    );

    const schema = useMemo(
      () =>
        yup.object({
          code: yup
            .string()
            .required(t("validate.required"))
            .matches(/^[a-zA-Z0-9_-]+$/, t("validate.no_special_chars"))
            .test("unique-code", t("validate.code_exists"), (value) => {
              // bỏ qua check khi không có giá trị hoặc mã đang bị khóa (đã có lớp)
              if (!value || codeLockedRef.current) return true;
              return new Promise((resolve) =>
                checkCodeRef.current(value, resolve),
              );
            }),
          name: yup.string().required(t("validate.required")),
          business_id: yup.string().optional(),
          duration_minutes: yup.string().required(t("validate.required")),
          price_per_lesson: yup.string().required(t("validate.required")),
          is_active: yup
            .string()
            .test("status-required", t("validate.required"), (value) =>
              isUpdateRef.current ? true : !!value,
            ),
          description: yup.string().optional(),
        }),
      [t],
    );

    const form = useForm<ICourseForm>({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema) as any,
    });

    const { reset, formState, watch } = form;
    const errors = formState.errors as any;

    const businessIdValue = watch("business_id");
    const isActiveValue = watch("is_active");
    const thumbnailValue = watch("thumbnail" as any);

    const queryClient = useQueryClient();
    const { mutate: onSubmit, isPending } = CourseService.useUpsertCourse();

    useEffect(() => {
      if (dataDetail?.id) {
        reset({
          code: dataDetail.code ?? "",
          name: dataDetail.name ?? "",
          thumbnail: dataDetail.thumbnail ?? "",
          duration_minutes:
            dataDetail.duration_minutes != null
              ? String(dataDetail.duration_minutes)
              : "",
          price_per_lesson:
            dataDetail.price_per_lesson != null
              ? String(dataDetail.price_per_lesson)
              : "",
          description: dataDetail.description ?? "",
          is_active:
            dataDetail.is_active === false
              ? "0"
              : dataDetail.is_active === true
                ? "1"
                : "",
          business_id: dataDetail.business_id
            ? String(dataDetail.business_id)
            : "",
        });
      } else {
        reset(defaultValues);
      }
    }, [dataDetail, reset]);

    const handleSubmitForm = (values: ICourseForm) => {
      const params = {
        code: values.code?.trim() || undefined,
        name: values.name?.trim() || undefined,
        thumbnail: values.thumbnail?.trim() || undefined,
        duration_minutes: values.duration_minutes
          ? Number(values.duration_minutes)
          : undefined,
        price_per_lesson: values.price_per_lesson
          ? Number(values.price_per_lesson)
          : undefined,
        description: values.description?.trim() || undefined,
        business_id: values.business_id ? Number(values.business_id) : undefined,
        is_active: isUpdate ? undefined : values.is_active === "1",
      };
      onSubmit(
        { id: dataDetail?.id, params },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", "list"] });
            queryClient.invalidateQueries({ queryKey: ["course", "detail"] });
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
      basic: !!(errors.code || errors.name || errors.is_active),
      pricing: !!(errors.duration_minutes || errors.price_per_lesson),
    };

    const tabs = [
      { key: "basic", label: t("course.tab_basic") },
      { key: "pricing", label: t("course.tab_pricing") },
    ];

    return (
      <div>
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
            <Row className="grid grid-cols-1">
              {!isView && (
                <Col>
                  <label className="text-[13px] text-gray-600 font-medium mb-2 block text-center">
                    {t("course.thumbnail")}
                  </label>
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <div className="relative group w-24 h-24">
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                        {thumbnailValue ? (
                          <img
                            src={thumbnailValue}
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpenOutlined className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                      <UploadFiles
                        isSingle
                        maxSize={10}
                        accept="image/*"
                        onReceiveFiles={(file: IFileUpload) =>
                          form.setValue("thumbnail" as any, (file as any)?.url, {
                            shouldDirty: true,
                          })
                        }
                        onFailed={() =>
                          notification.error({
                            message: t("common.error_message"),
                          })
                        }
                      >
                        <div className="absolute inset-0 rounded-lg flex items-center justify-center text-center px-1 bg-black/45 text-white text-[11px] font-medium leading-tight opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          {t("course.upload_thumbnail")}
                        </div>
                      </UploadFiles>
                    </div>
                    {thumbnailValue && (
                      <button
                        type="button"
                        onClick={() =>
                          form.setValue("thumbnail" as any, "", {
                            shouldDirty: true,
                          })
                        }
                        className="text-[13px] text-red-500 hover:text-red-600 transition-colors"
                      >
                        {t("button.delete")}
                      </button>
                    )}
                  </div>
                </Col>
              )}
              <Col>
                <FormTeraItem
                  label={t("course.code")}
                  name="code"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={codeLocked ? "" : "VD: CRS001, CRS002..."}
                    disabled={isView || codeLocked}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("course.name")}
                  name="name"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("course.name") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("course.business")} name="business_id">
                  <div className="w-full overflow-hidden">
                    <select
                      className={SELECT_CLASS}
                      style={{
                        borderRadius: "3px",
                        color: businessIdValue ? "#111827" : "#9ca3af",
                      }}
                      disabled={isView}
                      {...form.register("business_id")}
                    >
                      <option value="" disabled hidden>
                        {t("form.enter_value", { key: t("course.business") })}
                      </option>
                      {businesses.map((b) => (
                        <option
                          key={b.id}
                          value={String(b.id)}
                          style={{ color: "#111827" }}
                        >
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </FormTeraItem>
              </Col>
              {!isUpdate && (
                <Col>
                  <FormTeraItem
                    label={t("course.status")}
                    name="is_active"
                    rules={[{ required: t("validate.required") }]}
                  >
                    <div className="w-full overflow-hidden">
                      <select
                        className={SELECT_CLASS}
                        style={{
                          borderRadius: "3px",
                          color: isActiveValue ? "#111827" : "#9ca3af",
                        }}
                        disabled={isView}
                        {...form.register("is_active")}
                      >
                        <option value="" disabled hidden>
                          {t("form.enter_value", { key: t("course.status") })}
                        </option>
                        <option value="1" style={{ color: "#111827" }}>
                          {t("course.status_active")}
                        </option>
                        <option value="0" style={{ color: "#111827" }}>
                          {t("course.status_inactive")}
                        </option>
                      </select>
                    </div>
                  </FormTeraItem>
                </Col>
              )}
              <Col>
                <FormTeraItem label={t("course.description")} name="description">
                  <TextArea
                    rows={3}
                    placeholder={t("form.enter_value", {
                      key: t("course.description"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 2: Học phí & thời lượng */}
          <div className={activeTab === "pricing" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1">
              <Col>
                <FormTeraItem
                  label={t("course.duration_minutes")}
                  name="duration_minutes"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    type="number"
                    placeholder={t("form.enter_value", {
                      key: t("course.duration_minutes"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("course.price_per_lesson")}
                  name="price_per_lesson"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    type="number"
                    placeholder={t("form.enter_value", {
                      key: t("course.price_per_lesson"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>
        </FormTera>
      </div>
    );
  },
);

export default CourseForm;
