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
import {
  StudentService,
  BranchService,
  BusinessService,
  ParentService,
  ParentStudentService,
  LevelService,
} from "@tera/modules";

/* Import: pages */
import { IStudentForm } from "pages/education/student/_interface";
import { syncParentStudentLinks } from "_common/utils/parentStudentLinks";

const SELECT_CLASS =
  "w-full max-w-full min-w-0 h-9 border border-gray-300 bg-white px-3 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer box-border";

const defaultValues: IStudentForm = {
  code: "",
  name: "",
  avatar: "",
  business_id: "",
  branch_id: "",
  gender: "",
  level_id: "",
  dob: "",
  email: "",
  phone: "",
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

      // Nguồn dữ liệu liên kết PH↔HV (chỉ fetch khi đã có học viên)
      const { data: linkData } = ParentStudentService.useParentStudentList(
        { params: { student_id: dataDetail?.id, per_page: 100 } },
        { enabled: !!dataDetail?.id },
      );
      const linkItems: any[] = useMemo(() => {
        if (!dataDetail?.id) return [];
        // Lọc client-side phòng backend KHÔNG lọc theo student_id (trả về tất cả link)
        return (linkData?.data?.items ?? []).filter(
          (l: any) =>
            Number(l.student_id ?? l.student?.id) === Number(dataDetail.id),
        );
      }, [linkData, dataDetail]);

      const { data: parentData } = ParentService.useParentList({
        params: { page: 1, per_page: 100, status: "active" },
      });
      const parentOptions: any[] = useMemo(() => {
        // chỉ cho chọn phụ huynh đang hoạt động (lọc cả client phòng backend bỏ qua param)
        const list = (parentData?.data?.items ?? []).filter(
          (p: any) => !p.status || p.status === "active",
        );
        // giữ option cho phụ huynh đã link dù không nằm trong list active / 100 dòng đầu
        const merged = [...list];
        linkItems.forEach((l: any) => {
          const p = l?.parent;
          const pid = p?.id ?? l?.parent_id;
          if (pid && !merged.some((m: any) => m.id === pid)) {
            merged.push(p ?? { id: pid, name: `#${pid}` });
          }
        });
        return merged;
      }, [parentData, linkItems]);

      // Trình độ là FK level_id → catalog edu/level/list
      const { data: levelData } = LevelService.useLevelList({
        params: { page: 1, per_page: 100 },
      });
      const levels: any[] = levelData?.data?.items ?? [];

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
            // Phụ huynh: khi "tạo mới" yêu cầu họ tên, quan hệ, SĐT
            parents: yup.array().of(
              yup.object({
                name: yup.string().when("mode", {
                  is: "new",
                  then: (s) => s.required(t("validate.required")),
                  otherwise: (s) => s.optional(),
                }),
                relation: yup.string().when("mode", {
                  is: "new",
                  then: (s) => s.required(t("validate.required")),
                  otherwise: (s) => s.optional(),
                }),
                phone: yup.string().when("mode", {
                  is: "new",
                  then: (s) => s.required(t("validate.required")),
                  otherwise: (s) => s.optional(),
                }),
              }),
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
      const statusValue = watch("status");
      const levelValue = watch("level_id");
      const avatarValue = watch("avatar" as any);

      const {
        fields: parentFields,
        append: appendParent,
        remove: removeParent,
      } = useFieldArray({ control: form.control, name: "parents" as any });

      const { mutate: onSubmit, isPending } = StudentService.useUpsertStudent();

      useEffect(() => {
        if (!dataDetail?.id) {
          reset(defaultValues);
          return;
        }
        // Đợi danh sách link tải xong rồi mới reset (tránh reset 2 lần / mất rows)
        if (!linkData) return;
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
          level_id: dataDetail.level_id
            ? String(dataDetail.level_id)
            : dataDetail.level?.id
              ? String(dataDetail.level.id)
              : "",
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
          // Rows lấy từ link list (mang theo link_id + contacts để không mất khi lưu)
          parents: linkItems.map((l: any) => ({
            link_id: l.id,
            mode: "existing",
            parent_id: l.parent_id
              ? String(l.parent_id)
              : l.parent?.id
                ? String(l.parent.id)
                : "",
            name: l.parent?.name ?? "",
            relation: l.relation ?? "",
            phone: l.parent?.phone ?? "",
            email: l.parent?.email ?? "",
            is_primary_contact: !!l.is_primary_contact,
            is_billing_contact: !!l.is_billing_contact,
            is_pickup_authorized: !!l.is_pickup_authorized,
            note: l.note ?? "",
          })),
        });
      }, [dataDetail, linkData, linkItems, reset]);

      const handleSubmitForm = (values: IStudentForm) => {
        // Quan hệ PH↔HV KHÔNG còn nhúng trong payload student → đồng bộ riêng
        // qua crm/parent-student/* sau khi lưu học viên (xem parentStudentLinks).
        const newParentBusinessId = values.business_id
          ? Number(values.business_id)
          : dataDetail?.business_id;
        const newParentBranchId = values.branch_id
          ? Number(values.branch_id)
          : dataDetail?.branch_id;

        const linkRows = (values.parents ?? [])
          .filter((p) =>
            p?.mode === "new" ? !!p?.name?.trim() : !!p?.parent_id,
          )
          .map((p) => ({
            link_id: p.link_id ? Number(p.link_id) : undefined,
            mode: p.mode,
            counterpart_id:
              p.mode === "new" ? undefined : Number(p.parent_id),
            new_parent:
              p.mode === "new"
                ? {
                    name: p.name,
                    phone: p.phone,
                    email: p.email,
                    business_id: newParentBusinessId,
                    branch_id: newParentBranchId,
                  }
                : undefined,
            relation: p.relation || undefined,
            is_primary_contact: !!p.is_primary_contact,
            is_billing_contact: !!p.is_billing_contact,
            is_pickup_authorized: !!p.is_pickup_authorized,
            note: p.note,
          }));
        const originalLinkIds = linkItems
          .map((l: any) => l.id)
          .filter(Boolean);

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
          level_id: values.level_id ? Number(values.level_id) : undefined,
          status: isUpdate ? undefined : values.status || undefined,
          enrollment_date: values.enrollment_date || undefined,
          admission_source: values.admission_source?.trim() || undefined,
          nationality: values.nationality?.trim() || undefined,
          language: values.language?.trim() || undefined,
          address: values.address?.trim() || undefined,
          province: values.province?.trim() || undefined,
          district: values.district?.trim() || undefined,
          note: values.note?.trim() || undefined,
        };
        onSubmit(
          { id: dataDetail?.id, params },
          {
            onSuccess: async (res: any) => {
              const studentId =
                dataDetail?.id ??
                res?.data?.id ??
                res?.data?.student?.id;
              try {
                if (studentId) {
                  await syncParentStudentLinks({
                    anchor: "student",
                    anchorId: Number(studentId),
                    rows: linkRows,
                    originalLinkIds,
                  });
                }
                queryClient.invalidateQueries({ queryKey: ["student", "list"] });
                queryClient.invalidateQueries({ queryKey: ["student", "detail"] });
                queryClient.invalidateQueries({
                  queryKey: ["parent-student", "list"],
                });
                queryClient.invalidateQueries({ queryKey: ["parent", "list"] });
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
                queryClient.invalidateQueries({ queryKey: ["student", "detail"] });
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
        general: !!(errors.code || errors.name || errors.gender || errors.status),
        contact: !!errors.email,
        study: !!(errors.business_id || errors.branch_id || errors.enrollment_date),
        parents: !!errors.parents,
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
                <FormTeraItem label={t("student.level")} name="level_id">
                  <div className="w-full overflow-hidden">
                    {/* Xem chi tiết: lấy trình độ từ chính record student (level_id),
                        KHÔNG gọi student-level/detail (backend chưa có bảng) */}
                    <select
                      className={SELECT_CLASS}
                      style={{ borderRadius: "3px", color: levelValue ? "#111827" : "#9ca3af" }}
                      disabled={isView}
                      {...form.register("level_id")}
                    >
                      <option value="" disabled hidden>
                        {t("form.enter_value", { key: t("student.level") })}
                      </option>
                      {levels.map((lv: any) => (
                        <option key={lv.id} value={String(lv.id)} style={{ color: "#111827" }}>
                          {lv.level_code
                            ? `${lv.level_name} (${lv.level_code})`
                            : lv.level_name}
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
                const modeValue =
                  watch(`parents.${index}.mode` as any) || "new";
                const parentIdValue = watch(`parents.${index}.parent_id` as any);
                const isExisting = modeValue === "existing";
                return (
                  <div
                    key={field.id}
                    className="relative rounded-lg border border-gray-200 p-3 pr-10 bg-gray-50"
                  >
                    {!isView && (
                      <button
                        type="button"
                        onClick={() => removeParent(index)}
                        className="absolute top-2 right-2 z-10 h-6 w-6 flex items-center justify-center rounded text-red-500 hover:bg-red-50 transition-colors text-lg leading-none"
                      >
                        ×
                      </button>
                    )}

                    {/* Mode toggle: chọn phụ huynh có sẵn / tạo mới */}
                    {!isView && (
                      <div className="inline-flex rounded-md border border-gray-200 bg-white p-0.5 mb-3">
                        {[
                          { key: "existing", label: t("student.parent_existing") },
                          { key: "new", label: t("student.parent_new") },
                        ].map((m) => (
                          <button
                            key={m.key}
                            type="button"
                            onClick={() =>
                              form.setValue(
                                `parents.${index}.mode` as any,
                                m.key,
                                { shouldDirty: true },
                              )
                            }
                            className={`px-3 py-1 text-[12px] rounded font-medium transition-colors ${
                              modeValue === m.key
                                ? "bg-blue-500 text-white"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      {isExisting ? (
                        <Col>
                          <FormTeraItem
                            label={t("student.parents")}
                            name={`parents.${index}.parent_id`}
                          >
                            <div className="w-full overflow-hidden">
                              <select
                                className={SELECT_CLASS}
                                style={{ borderRadius: "3px", color: parentIdValue ? "#111827" : "#9ca3af" }}
                                disabled={isView}
                                {...form.register(`parents.${index}.parent_id` as any)}
                              >
                                <option value="" disabled hidden>
                                  {t("student.select_parent")}
                                </option>
                                {parentOptions.map((p: any) => (
                                  <option key={p.id} value={String(p.id)} style={{ color: "#111827" }}>
                                    {p.name}
                                    {p.phone ? ` - ${p.phone}` : ""}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </FormTeraItem>
                        </Col>
                      ) : (
                        <Col>
                          <FormTeraItem
                            label={t("student.parent_name")}
                            name={`parents.${index}.name`}
                            rules={[{ required: t("validate.required") }]}
                          >
                            <Input
                              placeholder={t("form.enter_value", {
                                key: t("student.parent_name"),
                              })}
                              disabled={isView}
                            />
                          </FormTeraItem>
                          {errors?.parents?.[index]?.name?.message && (
                            <p className="text-red-500 text-xs -mt-2 mb-2">
                              {errors.parents[index].name.message}
                            </p>
                          )}
                        </Col>
                      )}
                      {/* Quan hệ: luôn hiện (link parent-student yêu cầu relation) */}
                      <Col>
                        <FormTeraItem
                          label={t("student.parent_relation")}
                          name={`parents.${index}.relation`}
                          rules={
                            !isExisting
                              ? [{ required: t("validate.required") }]
                              : undefined
                          }
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
                        {errors?.parents?.[index]?.relation?.message && (
                          <p className="text-red-500 text-xs -mt-2 mb-2">
                            {errors.parents[index].relation.message}
                          </p>
                        )}
                      </Col>
                      {!isExisting && (
                        <Col>
                          <FormTeraItem
                            label={t("student.phone")}
                            name={`parents.${index}.phone`}
                            rules={[{ required: t("validate.required") }]}
                          >
                            <Input
                              placeholder={t("form.enter_value", { key: t("student.phone") })}
                              disabled={isView}
                            />
                          </FormTeraItem>
                          {errors?.parents?.[index]?.phone?.message && (
                            <p className="text-red-500 text-xs -mt-2 mb-2">
                              {errors.parents[index].phone.message}
                            </p>
                          )}
                        </Col>
                      )}
                      {!isExisting && (
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
                      )}
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
                    appendParent({
                      mode: "existing",
                      parent_id: "",
                      name: "",
                      relation: "",
                      phone: "",
                      email: "",
                    })
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
