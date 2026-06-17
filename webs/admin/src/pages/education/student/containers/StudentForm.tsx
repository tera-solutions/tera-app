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
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Col, Row, notification, PlusCircleOutlined, UserOutlined } from "tera-dls";

/* Import: packages */
import { IFormProps, IFileUpload } from "@tera/commons/interfaces";
import Input from "@tera/components/dof/Control/Input";
import TextArea from "@tera/components/dof/Control/TextArea";
import UploadFiles from "@tera/components/dof/UploadFiles";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { StudentService, BranchService, BusinessService } from "@tera/modules";

/* Import: pages */
import { IStudentForm } from "pages/education/student/_interface";

const SELECT_CLASS =
  "w-full max-w-full min-w-0 h-9 border border-gray-300 bg-white px-3 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer box-border";

const LEVELS = ["beginner", "intermediate", "advanced", "expert"];

const defaultValues: IStudentForm = {
  code: "",
  name: "",
  avatar: "",
  business_id: "",
  branch_id: "",
  gender: "",
  dob: "",
  email: "",
  phone: "",
  level: "",
  status: "",
  enrollment_date: "",
  admission_source: "",
  nationality: "",
  language: "",
  address: "",
  province: "",
  district: "",
  note: "",
  parents: [],
};

const StudentForm = observer(
  forwardRef<any, IFormProps & { onSuccess?: () => void }>(
    ({ dataDetail, type = "create", onSuccess }, ref) => {
      const isView = type === "detail";
      const isUpdate = type === "update";
      const { t } = useTranslation();
      const { globalStore } = useStores();
      const queryClient = useQueryClient();

      const [activeTab, setActiveTab] = useState("general");

      const isUpdateRef = useRef(isUpdate);
      isUpdateRef.current = isUpdate;

      const { data: branchData } = BranchService.useBranchList({
        params: { page: 1, per_page: 100, status: "active" },
      });
      const branches: any[] = useMemo(() => {
        const list = branchData?.data?.items ?? [];
        const selected = dataDetail?.branch;
        // giữ option cho chi nhánh đang gán dù đã inactive
        if (selected?.id && !list.some((b: any) => b.id === selected.id)) {
          return [...list, selected];
        }
        return list;
      }, [branchData, dataDetail]);

      const { data: businessData } = BusinessService.useBusinessList({
        params: { page: 1, per_page: 100 },
      });
      const businesses: any[] = businessData?.data?.items ?? [];

      const genderOptions = globalStore.getOptions("gender") ?? [];
      const statusOptions = globalStore.getOptions("student_status") ?? [];
      const relationOptions = globalStore.getOptions("guardian_relation") ?? [];

      const schema = useMemo(
        () =>
          yup.object({
            // Tạo mới: backend tự sinh mã HV → KHÔNG nhập, không required.
            // Cập nhật: mã đã có sẵn (disabled) nên chỉ cần kiểm tra tồn tại.
            code: yup
              .string()
              .matches(/^[a-zA-Z0-9_-]+$/, {
                message: t("validate.no_special_chars"),
                excludeEmptyString: true,
              })
              .test("code-required", t("validate.required"), (value) =>
                isUpdateRef.current ? !!value : true,
              ),
            name: yup.string().required(t("validate.required")),
            business_id: yup
              .string()
              .test("business-required", t("validate.required"), (value) =>
                isUpdateRef.current ? true : !!value,
              ),
            branch_id: yup
              .string()
              .test("branch-required", t("validate.required"), (value) =>
                isUpdateRef.current ? true : !!value,
              ),
            gender: yup.string().required(t("validate.required")),
            dob: yup
              .string()
              .test("dob-required", t("validate.required"), (value) =>
                isUpdateRef.current ? true : !!value,
              ),
            enrollment_date: yup.string().required(t("validate.required")),
            email: yup.string().email(t("validate.email_format")).optional(),
            phone: yup
              .string()
              .matches(/^(0|\+84)\d{9,10}$/, {
                message: t("validate.phone_format"),
                excludeEmptyString: true,
              })
              .optional(),
            status: yup
              .string()
              .test("status-required", t("validate.required"), (value) =>
                isUpdateRef.current ? true : !!value,
              ),
          }),
        [t],
      );

      const form = useForm<IStudentForm>({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(schema) as any,
      });

      const { reset, formState, watch } = form;
      const errors = formState.errors as any;
      const businessIdValue = watch("business_id");
      const branchIdValue = watch("branch_id");
      const genderValue = watch("gender");
      const levelValue = watch("level");
      const statusValue = watch("status");
      const avatarValue = watch("avatar" as any);

      const {
        fields: parentFields,
        append: appendParent,
        remove: removeParent,
      } = useFieldArray({ control: form.control, name: "parents" as any });

      const { mutate: onSubmit, isPending } = StudentService.useUpsertStudent();

      useEffect(() => {
        if (dataDetail?.id) {
          reset({
            code: dataDetail.code ?? "",
            name: dataDetail.name ?? "",
            avatar: dataDetail.avatar ?? "",
            business_id: dataDetail.business_id ? String(dataDetail.business_id) : "",
            branch_id: dataDetail.branch_id ? String(dataDetail.branch_id) : "",
            gender: dataDetail.gender ?? "",
            dob: dataDetail.dob ? String(dataDetail.dob).split("T")[0] : "",
            email: dataDetail.email ?? "",
            phone: dataDetail.phone ?? "",
            level: dataDetail.level ?? "",
            status: dataDetail.status ?? "",
            enrollment_date: dataDetail.enrollment_date
              ? String(dataDetail.enrollment_date).split("T")[0]
              : "",
            admission_source: dataDetail.admission_source ?? "",
            nationality: dataDetail.nationality ?? "",
            language: dataDetail.language ?? "",
            address: dataDetail.address ?? "",
            province: dataDetail.province ?? "",
            district: dataDetail.district ?? "",
            note: dataDetail.note ?? "",
            parents:
              dataDetail.parents?.map((p: any) => ({
                name: p.name ?? "",
                relation: p.relation ?? "",
                phone: p.phone ?? "",
                email: p.email ?? "",
              })) ?? [],
          });
        } else {
          reset(defaultValues);
        }
      }, [dataDetail, reset]);

      const handleSubmitForm = (values: IStudentForm) => {
        const parents = (values.parents ?? [])
          .filter((p) => p?.name?.trim())
          .map((p) => ({
            name: p.name?.trim(),
            relation: p.relation || undefined,
            phone: p.phone?.trim() || undefined,
            email: p.email?.trim() || undefined,
          }));
        const params = {
          code: values.code?.trim() || undefined,
          name: values.name?.trim() || undefined,
          avatar: values.avatar?.trim() || undefined,
          business_id: isUpdate
            ? undefined
            : values.business_id
              ? Number(values.business_id)
              : undefined,
          branch_id: isUpdate
            ? undefined
            : values.branch_id
              ? Number(values.branch_id)
              : undefined,
          gender: values.gender || undefined,
          dob: values.dob || undefined,
          email: values.email?.trim() || undefined,
          phone: values.phone?.trim() || undefined,
          level: values.level || undefined,
          status: isUpdate ? undefined : values.status || undefined,
          enrollment_date: values.enrollment_date || undefined,
          admission_source: values.admission_source?.trim() || undefined,
          nationality: values.nationality?.trim() || undefined,
          language: values.language?.trim() || undefined,
          address: values.address?.trim() || undefined,
          province: values.province?.trim() || undefined,
          district: values.district?.trim() || undefined,
          note: values.note?.trim() || undefined,
          parents: parents.length ? parents : undefined,
        };
        onSubmit(
          { id: dataDetail?.id, params },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["student", "list"] });
              queryClient.invalidateQueries({ queryKey: ["student", "detail"] });
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
        general: !!(errors.code || errors.name || errors.gender || errors.status),
        contact: !!errors.email,
        study: !!(errors.business_id || errors.branch_id || errors.enrollment_date),
      };

      const tabs = [
        { key: "general", label: t("common.detail_info") },
        { key: "contact", label: t("student.contact_info") },
        { key: "study", label: t("student.study_info") },
        { key: "parents", label: t("student.parents") },
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

          {/* Tab 1: Thông tin chi tiết */}
          <div className={activeTab === "general" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              {!isView && (
                <Col className="sm:col-span-2">
                  <label className="text-[13px] text-gray-600 font-medium mb-2 block text-center">
                    {t("student.avatar")}
                  </label>
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <div className="relative group w-20 h-20">
                      <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                        {avatarValue ? (
                          <img src={avatarValue} alt="avatar" className="w-full h-full object-cover" />
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
                          {t("student.upload_avatar")}
                        </div>
                      </UploadFiles>
                    </div>
                    {avatarValue && (
                      <button
                        type="button"
                        onClick={() =>
                          form.setValue("avatar" as any, "", { shouldDirty: true })
                        }
                        className="text-[13px] text-red-500 hover:text-red-600 transition-colors"
                      >
                        {t("button.delete")}
                      </button>
                    )}
                  </div>
                </Col>
              )}
              {(isUpdate || isView) && (
                <Col>
                  <FormTeraItem
                    label={t("student.code")}
                    name="code"
                    rules={[{ required: t("validate.required") }]}
                  >
                    <Input placeholder="" disabled />
                  </FormTeraItem>
                </Col>
              )}
              <Col>
                <FormTeraItem
                  label={t("student.name")}
                  name="name"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("student.name") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("student.gender")}
                  name="gender"
                  rules={[{ required: t("validate.required") }]}
                >
                  <div className="w-full overflow-hidden">
                    <select
                      className={SELECT_CLASS}
                      style={{ borderRadius: "3px", color: genderValue ? "#111827" : "#9ca3af" }}
                      disabled={isView}
                      {...form.register("gender")}
                    >
                      <option value="" disabled hidden>
                        {t("form.enter_value", { key: t("student.gender") })}
                      </option>
                      {genderOptions.map((opt: any) => (
                        <option key={opt.value} value={opt.value} style={{ color: "#111827" }}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("student.dob")}
                  name="dob"
                  rules={!isUpdate ? [{ required: t("validate.required") }] : undefined}
                >
                  <Input type="date" disabled={isView} />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("student.nationality")} name="nationality">
                  <Input
                    placeholder={t("form.enter_value", { key: t("student.nationality") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("student.language")} name="language">
                  <Input
                    placeholder={t("form.enter_value", { key: t("student.language") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              {!isUpdate && (
                <Col>
                  <FormTeraItem
                    label={t("student.status")}
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
                          {t("form.enter_value", { key: t("student.status") })}
                        </option>
                        {statusOptions.map((opt: any) => (
                          <option key={opt.value} value={opt.value} style={{ color: "#111827" }}>
                            {opt.label}
                          </option>
                        ))}
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
                <FormTeraItem label={t("student.phone")} name="phone">
                  <Input
                    placeholder={t("form.enter_value", { key: t("student.phone") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("student.email")} name="email">
                  <Input
                    placeholder={t("form.enter_value", { key: t("student.email") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("student.province")} name="province">
                  <Input
                    placeholder={t("form.enter_value", { key: t("student.province") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("student.district")} name="district">
                  <Input
                    placeholder={t("form.enter_value", { key: t("student.district") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col className="sm:col-span-2">
                <FormTeraItem label={t("student.address")} name="address">
                  <Input
                    placeholder={t("form.enter_value", { key: t("student.address") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 3: Thông tin học tập */}
          <div className={activeTab === "study" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Col>
                <FormTeraItem
                  label={t("student.business")}
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
                        {t("form.enter_value", { key: t("student.business") })}
                      </option>
                      {businesses.map((business) => (
                        <option key={business.id} value={String(business.id)} style={{ color: "#111827" }}>
                          {business.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("student.branch")}
                  name="branch_id"
                  rules={[{ required: t("validate.required") }]}
                >
                  <div className="w-full overflow-hidden">
                    <select
                      className={SELECT_CLASS}
                      style={{ borderRadius: "3px", color: branchIdValue ? "#111827" : "#9ca3af" }}
                      disabled={isView || isUpdate}
                      {...form.register("branch_id")}
                    >
                      <option value="" disabled hidden>
                        {t("form.enter_value", { key: t("student.branch") })}
                      </option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={String(branch.id)} style={{ color: "#111827" }}>
                          {branch.name}
                          {branch.code ? ` (${branch.code})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("student.level")} name="level">
                  <div className="w-full overflow-hidden">
                    <select
                      className={SELECT_CLASS}
                      style={{ borderRadius: "3px", color: levelValue ? "#111827" : "#9ca3af" }}
                      disabled={isView}
                      {...form.register("level")}
                    >
                      <option value="" disabled hidden>
                        {t("form.enter_value", { key: t("student.level") })}
                      </option>
                      {LEVELS.map((lv) => (
                        <option key={lv} value={lv} style={{ color: "#111827" }}>
                          {t(`student.level_${lv}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("student.enrollment_date")}
                  name="enrollment_date"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input type="date" disabled={isView} />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("student.admission_source")} name="admission_source">
                  <Input
                    placeholder={t("form.enter_value", { key: t("student.admission_source") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col className="sm:col-span-2">
                <FormTeraItem label={t("student.note")} name="note">
                  <TextArea
                    rows={3}
                    placeholder={t("student.note_placeholder")}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 4: Phụ huynh */}
          <div className={activeTab === "parents" ? "block" : "hidden"}>
            <div className="flex flex-col gap-3">
              {parentFields.map((field, index) => {
                const relationValue = watch(`parents.${index}.relation` as any);
                return (
                  <div
                    key={field.id}
                    className="relative rounded-lg border border-gray-200 p-3 bg-gray-50"
                  >
                    {!isView && (
                      <button
                        type="button"
                        onClick={() => removeParent(index)}
                        className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded text-red-500 hover:bg-red-50 transition-colors text-lg leading-none"
                      >
                        ×
                      </button>
                    )}
                    <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <Col>
                        <FormTeraItem
                          label={t("student.parent_name")}
                          name={`parents.${index}.name`}
                        >
                          <Input
                            placeholder={t("form.enter_value", {
                              key: t("student.parent_name"),
                            })}
                            disabled={isView}
                          />
                        </FormTeraItem>
                      </Col>
                      <Col>
                        <FormTeraItem
                          label={t("student.parent_relation")}
                          name={`parents.${index}.relation`}
                        >
                          <div className="w-full overflow-hidden">
                            <select
                              className={SELECT_CLASS}
                              style={{ borderRadius: "3px", color: relationValue ? "#111827" : "#9ca3af" }}
                              disabled={isView}
                              {...form.register(`parents.${index}.relation` as any)}
                            >
                              <option value="" disabled hidden>
                                {t("form.enter_value", {
                                  key: t("student.parent_relation"),
                                })}
                              </option>
                              {relationOptions.map((opt: any) => (
                                <option key={opt.value} value={opt.value} style={{ color: "#111827" }}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </FormTeraItem>
                      </Col>
                      <Col>
                        <FormTeraItem
                          label={t("student.phone")}
                          name={`parents.${index}.phone`}
                        >
                          <Input
                            placeholder={t("form.enter_value", { key: t("student.phone") })}
                            disabled={isView}
                          />
                        </FormTeraItem>
                      </Col>
                      <Col>
                        <FormTeraItem
                          label={t("student.email")}
                          name={`parents.${index}.email`}
                        >
                          <Input
                            placeholder={t("form.enter_value", { key: t("student.email") })}
                            disabled={isView}
                          />
                        </FormTeraItem>
                      </Col>
                    </Row>
                  </div>
                );
              })}

              {parentFields.length === 0 && (
                <p className="text-[13px] text-gray-400 py-2">
                  {t("student.no_parent")}
                </p>
              )}

              {!isView && (
                <button
                  type="button"
                  onClick={() =>
                    appendParent({ name: "", relation: "", phone: "", email: "" })
                  }
                  className="flex items-center gap-1.5 text-[13px] text-blue-500 hover:text-blue-600 w-fit transition-colors"
                >
                  <PlusCircleOutlined className="w-4 h-4" />
                  <span>{t("student.add_parent")}</span>
                </button>
              )}
            </div>
          </div>
        </FormTera>
      );
    },
  ),
);

export default StudentForm;
