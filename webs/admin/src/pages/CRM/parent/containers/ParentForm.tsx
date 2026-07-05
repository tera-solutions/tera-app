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
import {
  Col,
  Row,
  Modal,
  notification,
  PlusCircleOutlined,
  UserOutlined,
} from "tera-dls";

/* Import: packages */
import { IFormProps, IFileUpload } from "@tera/commons/interfaces";
import Input from "@tera/components/dof/Control/Input";
import TextArea from "@tera/components/dof/Control/TextArea";
import UploadFiles from "@tera/components/dof/UploadFiles";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import {
  ParentService,
  BranchService,
  BusinessService,
  StudentService,
  ParentStudentService,
} from "@tera/modules";

/* Import: pages */
import { IParentForm } from "pages/CRM/parent/_interface";
import { syncParentStudentLinks } from "_common/utils/parentStudentLinks";

const SELECT_CLASS =
  "w-full max-w-full min-w-0 h-9 border border-gray-300 bg-white px-3 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer box-border";

const TODAY = new Date().toISOString().split("T")[0];

const defaultValues: IParentForm = {
  name: "",
  avatar: "",
  gender: "",
  dob: "",
  email: "",
  phone: "",
  address: "",
  province: "",
  district: "",
  business_id: "",
  branch_id: "",
  occupation: "",
  company: "",
  note: "",
  students: [],
};

const ParentForm = observer(
  forwardRef<any, IFormProps & { onSuccess?: () => void }>(
    ({ dataDetail, type = "create", onSuccess }, ref) => {
      const isView = type === "detail";
      const isUpdate = type === "update";
      const { t } = useTranslation();
      const { globalStore } = useStores();
      const queryClient = useQueryClient();

      const [activeTab, setActiveTab] = useState("personal");
      const [showAvatarPreview, setShowAvatarPreview] = useState(false);

      const isUpdateRef = useRef(isUpdate);
      isUpdateRef.current = isUpdate;

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

      const { data: businessData } = BusinessService.useBusinessList({
        params: { page: 1, per_page: 100 },
      });
      const businesses: any[] = businessData?.data?.items ?? [];

      // Nguồn dữ liệu liên kết PH↔HV (chỉ fetch khi đã có phụ huynh)
      const { data: linkData } = ParentStudentService.useParentStudentList(
        { params: { parent_id: dataDetail?.id, per_page: 100 } },
        { enabled: !!dataDetail?.id },
      );
      const linkItems: any[] = useMemo(() => {
        if (!dataDetail?.id) return [];
        // Lọc client-side phòng backend KHÔNG lọc theo parent_id (trả về tất cả link)
        return (linkData?.data?.items ?? []).filter(
          (l: any) =>
            Number(l.parent_id ?? l.parent?.id) === Number(dataDetail.id),
        );
      }, [linkData, dataDetail]);

      const { data: studentData } = StudentService.useStudentList({
        params: { page: 1, per_page: 100 },
      });
      const students: any[] = useMemo(() => {
        const list = studentData?.data?.items ?? [];
        // giữ option cho học viên đã link dù không nằm trong 100 dòng đầu
        const merged = [...list];
        linkItems.forEach((l: any) => {
          const s = l?.student;
          const sid = s?.id ?? l?.student_id;
          if (sid && !merged.some((m: any) => m.id === sid)) {
            merged.push(s ?? { id: sid, name: `#${sid}` });
          }
        });
        return merged;
      }, [studentData, linkItems]);

      const genderOptions = globalStore.getOptions("gender") ?? [];
      const relationOptions = globalStore.getOptions("guardian_relation") ?? [];

      const schema = useMemo(
        () =>
          yup.object({
            name: yup
              .string()
              .required(t("validate.required"))
              .max(255, t("validate.maxLength", { maxLength: 255 })),
            phone: yup
              .string()
              .required(t("validate.required"))
              .matches(/^[0-9+\-\s().]{6,20}$/, t("validate.phone_format")),
            email: yup
              .string()
              .email(t("validate.email_format"))
              .max(255, t("validate.maxLength", { maxLength: 255 }))
              .optional(),
            business_id: yup.string().required(t("validate.required")),
            branch_id: yup.string().required(t("validate.required")),
          }),
        [t],
      );

      const form = useForm<IParentForm>({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(schema) as any,
      });

      const { reset, formState, watch } = form;
      const errors = formState.errors as any;
      const avatarValue = watch("avatar" as any);
      const genderValue = watch("gender");
      const businessIdValue = watch("business_id");
      const branchIdValue = watch("branch_id");

      const {
        fields: studentFields,
        append: appendStudent,
        remove: removeStudent,
      } = useFieldArray({ control: form.control, name: "students" as any });

      const { mutate: onSubmit, isPending } = ParentService.useUpsertParent();

      useEffect(() => {
        if (!dataDetail?.id) {
          reset(defaultValues);
          return;
        }
        // Đợi danh sách link tải xong rồi mới reset
        if (!linkData) return;
        reset({
          name: dataDetail.name ?? "",
          avatar: dataDetail.avatar ?? "",
          gender: dataDetail.gender ?? "",
          dob: dataDetail.dob ? String(dataDetail.dob).split("T")[0] : "",
          email: dataDetail.email ?? "",
          phone: dataDetail.phone ?? "",
          address: dataDetail.address ?? "",
          province: dataDetail.province ?? "",
          district: dataDetail.district ?? "",
          business_id: dataDetail.business_id
            ? String(dataDetail.business_id)
            : "",
          branch_id: dataDetail.branch_id ? String(dataDetail.branch_id) : "",
          occupation: dataDetail.occupation ?? "",
          company: dataDetail.company ?? "",
          note: dataDetail.note ?? "",
          // Rows lấy từ link list (mang theo link_id + contacts để không mất khi lưu)
          students: linkItems.map((l: any) => ({
            link_id: l.id,
            student_id: l.student_id
              ? String(l.student_id)
              : l.student?.id
                ? String(l.student.id)
                : "",
            relation: l.relation ?? "",
            is_primary_contact: !!l.is_primary_contact,
            is_billing_contact: !!l.is_billing_contact,
            is_pickup_authorized: !!l.is_pickup_authorized,
            note: l.note ?? "",
          })),
        });
      }, [dataDetail, linkData, linkItems, reset]);

      const handleSubmitForm = (values: IParentForm) => {
        // Quan hệ PH↔HV đồng bộ riêng qua crm/parent-student/* sau khi lưu phụ huynh.
        const linkRows = (values.students ?? [])
          .filter((s) => !!s?.student_id)
          .map((s) => ({
            link_id: s.link_id ? Number(s.link_id) : undefined,
            counterpart_id: Number(s.student_id),
            relation: s.relation || undefined,
            is_primary_contact: !!s.is_primary_contact,
            is_billing_contact: !!s.is_billing_contact,
            is_pickup_authorized: !!s.is_pickup_authorized,
            note: s.note,
          }));
        const originalLinkIds = linkItems
          .map((l: any) => l.id)
          .filter(Boolean);

        const params = {
          name: values.name?.trim() || undefined,
          avatar: values.avatar?.trim() || undefined,
          gender: values.gender || undefined,
          dob: values.dob || undefined,
          email: values.email?.trim() || undefined,
          phone: values.phone?.trim() || undefined,
          address: values.address?.trim() || undefined,
          province: values.province?.trim() || undefined,
          district: values.district?.trim() || undefined,
          business_id: values.business_id ? Number(values.business_id) : undefined,
          branch_id: values.branch_id ? Number(values.branch_id) : undefined,
          occupation: values.occupation?.trim() || undefined,
          company: values.company?.trim() || undefined,
          note: values.note?.trim() || undefined,
        };
        onSubmit(
          { id: dataDetail?.id, params },
          {
            onSuccess: async (res: any) => {
              const parentId =
                dataDetail?.id ?? res?.data?.id ?? res?.data?.parent?.id;
              try {
                if (parentId) {
                  await syncParentStudentLinks({
                    anchor: "parent",
                    anchorId: Number(parentId),
                    rows: linkRows,
                    originalLinkIds,
                  });
                }
                queryClient.invalidateQueries({ queryKey: ["parent", "list"] });
                queryClient.invalidateQueries({ queryKey: ["parent", "detail"] });
                queryClient.invalidateQueries({
                  queryKey: ["parent-student", "list"],
                });
                queryClient.invalidateQueries({ queryKey: ["student", "list"] });
                notification.success({
                  message: isUpdate
                    ? t("common.update_success")
                    : t("common.create_success"),
                });
                onSuccess?.();
              } catch (error: any) {
                // Link lỗi giữa chừng: làm mới để retry thấy đúng link đã tạo,
                // tránh tạo trùng.
                queryClient.invalidateQueries({
                  queryKey: ["parent-student", "list"],
                });
                queryClient.invalidateQueries({ queryKey: ["parent", "detail"] });
                notification.error({
                  message: error?.message || t("common.error_message"),
                });
              }
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
        personal: !!errors.name,
        contact: !!(errors.email || errors.phone),
        parent: !!(errors.business_id || errors.branch_id),
        students: false,
      };

      const tabs = [
        { key: "personal", label: t("parent.personal_info") },
        { key: "contact", label: t("parent.contact_info") },
        { key: "parent", label: t("parent.parent_info") },
        { key: "students", label: t("parent.student_info") },
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

          {/* Tab 1: Thông tin cá nhân */}
          <div className={activeTab === "personal" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              {!isView && (
                <Col className="sm:col-span-2">
                  <label className="text-[13px] text-gray-600 font-medium mb-2 block text-center">
                    {t("parent.avatar")}
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
                          {t("parent.upload_avatar")}
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
                  label={t("parent.name")}
                  name="name"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("parent.name") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("parent.gender")} name="gender">
                  <div className="w-full overflow-hidden">
                    <select
                      className={SELECT_CLASS}
                      style={{
                        borderRadius: "3px",
                        color: genderValue ? "#111827" : "#9ca3af",
                      }}
                      disabled={isView}
                      {...form.register("gender")}
                    >
                      <option value="" disabled hidden>
                        {t("form.enter_value", { key: t("parent.gender") })}
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
                <FormTeraItem label={t("parent.dob")} name="dob">
                  <Input type="date" max={TODAY} disabled={isView} />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 2: Thông tin liên hệ */}
          <div className={activeTab === "contact" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Col>
                <FormTeraItem
                  label={t("parent.phone")}
                  name="phone"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("parent.phone") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("parent.email")} name="email">
                  <Input
                    placeholder={t("form.enter_value", { key: t("parent.email") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("parent.province")} name="province">
                  <Input
                    placeholder={t("form.enter_value", { key: t("parent.province") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("parent.district")} name="district">
                  <Input
                    placeholder={t("form.enter_value", { key: t("parent.district") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col className="sm:col-span-2">
                <FormTeraItem label={t("parent.address")} name="address">
                  <Input
                    placeholder={t("form.enter_value", { key: t("parent.address") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 3: Thông tin phụ huynh */}
          <div className={activeTab === "parent" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Col>
                <FormTeraItem
                  label={t("parent.business")}
                  name="business_id"
                  rules={[{ required: t("validate.required") }]}
                >
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
                        {t("form.enter_value", { key: t("parent.business") })}
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
                  label={t("parent.branch")}
                  name="branch_id"
                  rules={[{ required: t("validate.required") }]}
                >
                  <div className="w-full overflow-hidden">
                    <select
                      className={SELECT_CLASS}
                      style={{
                        borderRadius: "3px",
                        color: branchIdValue ? "#111827" : "#9ca3af",
                      }}
                      disabled={isView}
                      {...form.register("branch_id")}
                    >
                      <option value="" disabled hidden>
                        {t("form.enter_value", { key: t("parent.branch") })}
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
                <FormTeraItem label={t("parent.occupation")} name="occupation">
                  <Input
                    placeholder={t("form.enter_value", { key: t("parent.occupation") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("parent.company")} name="company">
                  <Input
                    placeholder={t("form.enter_value", { key: t("parent.company") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col className="sm:col-span-2">
                <FormTeraItem label={t("parent.note")} name="note">
                  <TextArea
                    rows={3}
                    placeholder={t("parent.note_placeholder")}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 4: Thông tin học viên */}
          <div className={activeTab === "students" ? "block" : "hidden"}>
            <div className="flex flex-col gap-3">
              {studentFields.map((field, index) => {
                const studentRelationValue = watch(
                  `students.${index}.relation` as any,
                );
                const studentIdValue = watch(`students.${index}.student_id` as any);
                return (
                  <div
                    key={field.id}
                    className="relative rounded-lg border border-gray-200 p-3 pr-10 bg-gray-50"
                  >
                    {!isView && (
                      <button
                        type="button"
                        onClick={() => removeStudent(index)}
                        className="absolute top-2 right-2 z-10 h-6 w-6 flex items-center justify-center rounded text-red-500 hover:bg-red-50 transition-colors text-lg leading-none"
                      >
                        ×
                      </button>
                    )}
                    <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <Col>
                        <FormTeraItem
                          label={t("parent.student")}
                          name={`students.${index}.student_id`}
                        >
                          <div className="w-full overflow-hidden">
                            <select
                              className={SELECT_CLASS}
                              style={{
                                borderRadius: "3px",
                                color: studentIdValue ? "#111827" : "#9ca3af",
                              }}
                              disabled={isView}
                              {...form.register(
                                `students.${index}.student_id` as any,
                              )}
                            >
                              <option value="" disabled hidden>
                                {t("parent.select_student")}
                              </option>
                              {students.map((student: any) => (
                                <option
                                  key={student.id}
                                  value={String(student.id)}
                                  style={{ color: "#111827" }}
                                >
                                  {student.name}
                                  {student.code ? ` (${student.code})` : ""}
                                </option>
                              ))}
                            </select>
                          </div>
                        </FormTeraItem>
                      </Col>
                      <Col>
                        <FormTeraItem
                          label={t("parent.relation")}
                          name={`students.${index}.relation`}
                        >
                          <div className="w-full overflow-hidden">
                            <select
                              className={SELECT_CLASS}
                              style={{
                                borderRadius: "3px",
                                color: studentRelationValue ? "#111827" : "#9ca3af",
                              }}
                              disabled={isView}
                              {...form.register(
                                `students.${index}.relation` as any,
                              )}
                            >
                              <option value="" disabled hidden>
                                {t("form.enter_value", {
                                  key: t("parent.relation"),
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
                    </Row>
                  </div>
                );
              })}

              {studentFields.length === 0 && (
                <p className="text-[13px] text-gray-400 py-2">
                  {t("parent.no_student")}
                </p>
              )}

              {!isView && (
                <button
                  type="button"
                  onClick={() =>
                    appendStudent({ student_id: "", relation: "" })
                  }
                  className="flex items-center gap-1.5 text-[13px] text-blue-500 hover:text-blue-600 w-fit transition-colors"
                >
                  <PlusCircleOutlined className="w-4 h-4" />
                  <span>{t("parent.add_student")}</span>
                </button>
              )}
            </div>
          </div>
          {showAvatarPreview && (
            <Modal
              title={t("parent.avatar")}
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

export default ParentForm;
