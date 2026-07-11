/* Import: library */
import {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useState,
} from "react";
import { observer } from "mobx-react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Col, Row, notification, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import { IFormProps } from "@tera/commons/interfaces";
import { useStores } from "@tera/stores/useStores";
import Input from "@tera/components/dof/Control/Input";
import Select, { SelectField } from "@tera/components/dof/Control/Select";
import TextArea from "@tera/components/dof/Control/TextArea";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";

/* Import: services */
import {
  LeadService,
  StudentService,
  ParentService,
  CourseService,
  BranchService,
  BusinessService,
} from "@tera/modules";

/* Import: pages */
import DateField from "_common/components/DateField";
import UserSelect from "_common/components/UserSelect";
import MultiSelect from "_common/components/MultiSelect";
import { ILeadForm } from "pages/CRM/lead/_interface";

const INPUT_CLASS =
  "w-full h-9 border border-gray-300 rounded px-3 text-[13px] bg-white focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 disabled:bg-gray-100";

const defaultValues: ILeadForm = {
  name: "",
  gender: "",
  dob: "",
  email: "",
  phone: "",
  source: "",
  status: "",
  business_id: "",
  branch_id: "",
  owner_id: "",
  note: "",
  tag_ids: [],
  course_ids: [],
  guardians: [],
  students: [],
};

const toNum = (v: any) => {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) && String(v ?? "").trim() !== "" ? n : undefined;
};

const LeadForm = observer(
  forwardRef<any, IFormProps & { onSuccess?: () => void }>(
    ({ dataDetail, type = "create", onSuccess }, ref) => {
      const isView = type === "detail";
      const isUpdate = type === "update";
      const isCreate = type === "create";
      const { t } = useTranslation();
      const { globalStore } = useStores();
      const queryClient = useQueryClient();

      const [activeTab, setActiveTab] = useState("basic");

      const genderOptions = globalStore.getOptions("gender") ?? [];
      const statusOptions = globalStore.getOptions("lead_status") ?? [];
      const relationOptions = globalStore.getOptions("guardian_relation") ?? [];
      // ⚠️ TODO: NGUỒN TAG CHƯA XÁC ĐỊNH — metadata KHÔNG có `lead_tag` (đã check /auth/metadata
      // 2026-07-02) nên options hiện RỖNG. Tag của lead cần catalog/endpoint riêng (chưa biết).
      // Khi có nguồn tag thì thay `getOptions("lead_tag")` bằng nguồn đó. Xem memory `lead-tag-source-unknown`.
      const tagOptions = (globalStore.getOptions("lead_tag") ?? []).map(
        (o: any) => ({ value: String(o.value), label: o.label }),
      );

      const { data: courseData } = CourseService.useCourseList({
        params: { page: 1, per_page: 100 },
      });
      const courseOptions = useMemo(
        () =>
          (courseData?.data?.items ?? []).map((c: any) => ({
            value: String(c.id),
            label: c.code ? `${c.code} - ${c.name}` : c.name,
          })),
        [courseData],
      );

      const { data: studentData } = StudentService.useStudentList({
        params: { page: 1, per_page: 100 },
      });
      // Người giám hộ chọn từ DS Phụ huynh (chọn → auto-fill họ tên/sđt/email)
      const { data: parentData } = ParentService.useParentList({
        params: { page: 1, per_page: 100, status: "active" },
      });
      const parents: any[] = parentData?.data?.items ?? [];
      // Options học viên = 100 dòng đầu + merge các HV đã liên kết (giữ tên khi
      // xem/sửa dù HV nằm ngoài 100 dòng đầu). dataDetail.students có thể là
      // Student model (s.id) hoặc { student_id, student:{...} }.
      const students: any[] = useMemo(() => {
        const list = studentData?.data?.items ?? [];
        const merged = [...list];
        (dataDetail?.students ?? []).forEach((s: any) => {
          const stu = s?.student ?? s;
          const sid = stu?.id ?? s?.student_id ?? s?.id;
          if (sid != null && !merged.some((m: any) => Number(m.id) === Number(sid))) {
            merged.push({
              id: sid,
              name: stu?.name ?? stu?.full_name,
              code: stu?.code,
            });
          }
        });
        return merged;
      }, [studentData, dataDetail]);

      const { data: businessData } = BusinessService.useBusinessList({
        params: { page: 1, per_page: 100, status: "active" },
      });
      const businesses: any[] = useMemo(() => {
        const list = businessData?.data?.items ?? [];
        const sel = dataDetail?.business;
        if (sel?.id && !list.some((b: any) => b.id === sel.id))
          return [...list, sel];
        return list;
      }, [businessData, dataDetail]);

      const { data: branchData } = BranchService.useBranchList({
        params: { page: 1, per_page: 100, status: "active" },
      });
      const branches: any[] = useMemo(() => {
        const list = branchData?.data?.items ?? [];
        const sel = dataDetail?.branch;
        if (sel?.id && !list.some((b: any) => b.id === sel.id))
          return [...list, sel];
        return list;
      }, [branchData, dataDetail]);

      const schema = useMemo(
        () =>
          yup.object({
            name: yup.string().required(t("validate.required")),
            phone: yup.string().required(t("validate.required")),
            source: yup.string().required(t("validate.required")),
            owner_id: yup
              .mixed()
              .test(
                "owner-required",
                t("validate.required"),
                (v) => v != null && String(v).trim() !== "",
              ),
            email: yup
              .string()
              .email(t("validate.email_format"))
              .nullable()
              .transform((v) => (v === "" ? null : v)),
            // Khi TẠO MỚI: không yêu cầu người giám hộ / học viên liên kết
            // (chỉ nhập khi khách hàng đã chắc chắn — lúc cập nhật).
            guardians: isCreate
              ? yup.array()
              : yup
                  .array()
                  .of(
                    yup.object({
                      full_name: yup.string().required(t("validate.required")),
                      relationship: yup
                        .string()
                        .required(t("validate.required")),
                      phone: yup.string().required(t("validate.required")),
                    }),
                  )
                  .min(1, t("validate.required")),
            students: isCreate
              ? yup.array()
              : yup
                  .array()
                  .of(
                    yup.object({
                      student_id: yup.string().required(t("validate.required")),
                    }),
                  )
                  .min(1, t("validate.required")),
          }),
        [t, isCreate],
      );

      const form = useForm<ILeadForm>({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(schema) as any,
      });

      const { reset, watch, control } = form;
      const errors = form.formState.errors as any;
      const ownerValue = watch("owner_id");
      const tagValue = watch("tag_ids") ?? [];
      const courseValue = watch("course_ids") ?? [];
      const studentsWatch = watch("students") ?? [];

      const {
        fields: guardianFields,
        append: appendGuardian,
        remove: removeGuardian,
      } = useFieldArray({ control, name: "guardians" });
      const {
        fields: studentFields,
        append: appendStudent,
        remove: removeStudent,
      } = useFieldArray({ control, name: "students" });

      const { mutate: onSubmit, isPending } = LeadService.useUpsertLead();

      useEffect(() => {
        if (dataDetail?.id) {
          reset({
            name: dataDetail.name ?? "",
            gender: dataDetail.gender ?? "",
            dob: dataDetail.dob ? String(dataDetail.dob).split("T")[0] : "",
            email: dataDetail.email ?? "",
            phone: dataDetail.phone ?? "",
            source: dataDetail.source ?? "",
            status: dataDetail.status ?? "",
            business_id: dataDetail.business_id
              ? String(dataDetail.business_id)
              : "",
            branch_id: dataDetail.branch_id ? String(dataDetail.branch_id) : "",
            owner_id: dataDetail.owner_id ? String(dataDetail.owner_id) : "",
            note: dataDetail.note ?? "",
            tag_ids: (dataDetail.tags ?? []).map((tg: any) =>
              String(tg?.id ?? tg),
            ),
            course_ids: (dataDetail.courses ?? []).map((c: any) =>
              String(c?.id ?? c),
            ),
            guardians: (dataDetail.guardians ?? []).map((g: any) => ({
              parent_id: g?.parent_id ? String(g.parent_id) : "",
              full_name: g?.full_name ?? g?.name ?? "",
              relationship: g?.relationship ?? g?.relation ?? "",
              phone: g?.phone ?? "",
              email: g?.email ?? "",
            })),
            students: (dataDetail.students ?? []).map((s: any) => ({
              student_id: String(s?.student_id ?? s?.student?.id ?? s?.id ?? ""),
              relationship: s?.relationship ?? s?.relation ?? "",
            })),
          });
        } else {
          reset(defaultValues);
        }
      }, [dataDetail, reset]);

      const handleSubmitForm = (values: ILeadForm) => {
        // Nhúng guardians[]/students[] thẳng vào body create/update lead.
        const guardians = (values.guardians ?? [])
          .filter((g) => g.full_name?.trim())
          .map((g) => ({
            full_name: g.full_name?.trim(),
            relationship: g.relationship || undefined,
            phone: g.phone?.trim() || undefined,
            email: g.email?.trim() || undefined,
          }));
        const studentsPayload = (values.students ?? [])
          .filter((s) => s.student_id)
          .map((s) => ({
            student_id: toNum(s.student_id),
            relationship: s.relationship || undefined,
          }));

        const params: any = {
          name: values.name?.trim(),
          gender: values.gender || undefined,
          dob: values.dob || undefined,
          email: values.email?.trim() || undefined,
          phone: values.phone?.trim() || undefined,
          source: values.source?.trim() || undefined,
          branch_id: toNum(values.branch_id),
          owner_id: toNum(values.owner_id),
          note: values.note?.trim() || undefined,
          tag_ids: (values.tag_ids ?? []).map(Number),
          course_ids: (values.course_ids ?? []).map(Number),
        };
        // Chỉ gửi người giám hộ / học viên liên kết khi cập nhật (không tạo mới)
        if (!isCreate) {
          params.guardians = guardians;
          params.students = studentsPayload;
        }
        // business_id gửi cả khi create lẫn update (cho phép đổi doanh nghiệp)
        params.business_id = toNum(values.business_id);

        onSubmit(
          { id: dataDetail?.id, params },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["lead", "list"] });
              queryClient.invalidateQueries({ queryKey: ["lead", "detail"] });
              notification.success({
                message: isUpdate
                  ? t("common.update_success")
                  : t("common.create_success"),
              });
              onSuccess?.();
            },
            onError: (error: any) =>
              notification.error({
                message: error?.message || t("common.error_message"),
              }),
          },
        );
      };

      useImperativeHandle(ref, () => ({
        isValid: () => form.formState.isValid,
        submit: () => form.handleSubmit(handleSubmitForm)(),
        isDirty: () => form.formState.isDirty,
      }));

      const tabErrors: Record<string, boolean> = {
        basic:
          !!errors.name ||
          !!errors.email ||
          !!errors.phone ||
          !!errors.source ||
          !!errors.owner_id,
        guardians: !!errors.guardians,
        students: !!errors.students,
      };

      const tabs = [
        { key: "basic", label: t("lead.tab_basic") },
        // Người giám hộ + Học viên liên kết chỉ hiện khi cập nhật (không tạo mới)
        ...(isCreate
          ? []
          : [
              { key: "guardians", label: t("lead.guardians") },
              { key: "students", label: t("lead.students") },
            ]),
      ];

      return (
        <FormTera
          form={form}
          onSubmit={handleSubmitForm}
          isLoading={isPending}
          isDisabled={isView}
        >
          {/* Tab bar */}
          <div className="flex border-b border-gray-200 mb-4 overflow-x-auto scrollbar-none">
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
              <Col className="sm:col-span-2">
                <FormTeraItem
                  label={t("lead.customer")}
                  name="name"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("lead.customer") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("lead.gender")} name="gender">
                  <Select
                    options={genderOptions}
                    placeholder={t("form.enter_value", { key: t("lead.gender") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("lead.dob")} name="dob">
                  <DateField disabled={isView} />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("lead.email")} name="email">
                  <Input
                    placeholder={t("form.enter_value", { key: t("lead.email") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("lead.phone")}
                  name="phone"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("lead.phone") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("lead.source")}
                  name="source"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", { key: t("lead.source") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("lead.owner")}
                  name="owner_id"
                  rules={[{ required: t("validate.required") }]}
                >
                  <UserSelect
                    value={ownerValue}
                    selectedUser={
                      dataDetail?.owner
                        ? {
                            id: dataDetail.owner.id,
                            full_name:
                              dataDetail.owner.full_name ??
                              dataDetail.owner.name,
                          }
                        : undefined
                    }
                    disabled={isView}
                    placeholder={t("form.enter_value", { key: t("lead.owner") })}
                    onChange={(id) =>
                      form.setValue("owner_id", id, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("lead.business")} name="business_id">
                  <Select
                    options={businesses.map((b: any) => ({ value: String(b.id), label: b.name }))}
                    placeholder={t("form.enter_value", { key: t("lead.business") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("lead.branch")} name="branch_id">
                  <Select
                    options={branches.map((b: any) => ({ value: String(b.id), label: b.name }))}
                    placeholder={t("form.enter_value", { key: t("lead.branch") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("lead.tags")} name="tag_ids">
                  <MultiSelect
                    options={tagOptions}
                    value={tagValue}
                    disabled={isView}
                    placeholder={t("form.enter_value", { key: t("lead.tags") })}
                    onChange={(vals) =>
                      form.setValue("tag_ids", vals, { shouldDirty: true })
                    }
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("lead.courses")} name="course_ids">
                  <MultiSelect
                    options={courseOptions}
                    value={courseValue}
                    disabled={isView}
                    placeholder={t("form.enter_value", { key: t("lead.courses") })}
                    onChange={(vals) =>
                      form.setValue("course_ids", vals, { shouldDirty: true })
                    }
                  />
                </FormTeraItem>
              </Col>
              {/* Trạng thái CHỈ hiển thị read-only ở chi tiết (đổi status qua Tạm ngưng/Kích hoạt ở list) */}
              {isView && (
                <Col>
                  <FormTeraItem label={t("lead.status")} name="status">
                    <Select
                      options={statusOptions}
                      placeholder={t("form.enter_value", { key: t("lead.status") })}
                      disabled={isView}
                    />
                  </FormTeraItem>
                </Col>
              )}
              <Col className={isView ? undefined : "sm:col-span-2"}>
                <FormTeraItem label={t("lead.note")} name="note">
                  <TextArea rows={3} disabled={isView} />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 2: Người giám hộ */}
          <div className={activeTab === "guardians" ? "block" : "hidden"}>
            <div className="flex flex-col gap-3">
              {guardianFields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative rounded-lg border border-gray-200 p-3 pr-10 bg-gray-50"
                >
                  {!isView && (
                    <button
                      type="button"
                      onClick={() => removeGuardian(index)}
                      className="absolute top-2 right-2 z-10 h-6 w-6 flex items-center justify-center rounded text-red-500 hover:bg-red-50 transition-colors text-lg leading-none"
                    >
                      ×
                    </button>
                  )}
                  <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <Col>
                      <label className="text-[13px] text-gray-600 font-medium mb-1 block">
                        {t("lead.guardian_parent")} <span className="text-red-500">*</span>
                      </label>
                      <SelectField
                        options={parents.map((p: any) => ({
                          value: String(p.id),
                          label: p.code ? `${p.code} - ${p.name}` : p.name,
                        }))}
                        placeholder={t("lead.guardian_parent")}
                        disabled={isView}
                        value={String(form.watch(`guardians.${index}.parent_id`) ?? "")}
                        onChange={(val) => {
                          const pid = String(val ?? "");
                          form.setValue(`guardians.${index}.parent_id` as const, pid, {
                            shouldDirty: true,
                          });
                          const p = parents.find((x: any) => String(x.id) === pid);
                          form.setValue(
                            `guardians.${index}.full_name` as const,
                            p?.name ?? "",
                            { shouldDirty: true, shouldValidate: true },
                          );
                          form.setValue(
                            `guardians.${index}.phone` as const,
                            p?.phone ?? "",
                            { shouldDirty: true, shouldValidate: true },
                          );
                          form.setValue(
                            `guardians.${index}.email` as const,
                            p?.email ?? "",
                            { shouldDirty: true },
                          );
                        }}
                      />
                      {errors?.guardians?.[index]?.full_name?.message && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.guardians[index].full_name.message}
                        </p>
                      )}
                    </Col>
                    <Col>
                      <label className="text-[13px] text-gray-600 font-medium mb-1 block">
                        {t("lead.relationship")} <span className="text-red-500">*</span>
                      </label>
                      <SelectField
                        options={relationOptions}
                        placeholder={t("lead.relationship")}
                        disabled={isView}
                        value={String(form.watch(`guardians.${index}.relationship`) ?? "")}
                        onChange={(val) =>
                          form.setValue(
                            `guardians.${index}.relationship` as const,
                            String(val ?? ""),
                            { shouldDirty: true, shouldValidate: true },
                          )
                        }
                      />
                      {errors?.guardians?.[index]?.relationship?.message && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.guardians[index].relationship.message}
                        </p>
                      )}
                    </Col>
                    {/* Thông tin phụ huynh đã chọn (auto-fill, chỉ đọc) */}
                    {(form.watch(`guardians.${index}.full_name`) ||
                      form.watch(`guardians.${index}.phone`) ||
                      form.watch(`guardians.${index}.email`)) && (
                      <Col className="sm:col-span-2">
                        <p className="text-[12px] text-gray-500">
                          {[
                            form.watch(`guardians.${index}.full_name`),
                            form.watch(`guardians.${index}.phone`),
                            form.watch(`guardians.${index}.email`),
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </Col>
                    )}
                  </Row>
                </div>
              ))}
              {typeof errors?.guardians?.message === "string" && (
                <p className="text-red-500 text-xs">{errors.guardians.message}</p>
              )}
              {!isView && (
                <button
                  type="button"
                  onClick={() =>
                    appendGuardian({
                      parent_id: "",
                      full_name: "",
                      relationship: "",
                      phone: "",
                      email: "",
                    })
                  }
                  className="flex items-center gap-1.5 text-[13px] text-blue-600 hover:text-blue-700 w-fit"
                >
                  <PlusCircleOutlined className="w-4 h-4" />
                  {t("lead.add_guardian")}
                </button>
              )}
            </div>
          </div>

          {/* Tab 3: Học viên liên kết */}
          <div className={activeTab === "students" ? "block" : "hidden"}>
            <div className="flex flex-col gap-3">
              {studentFields.map((field, index) => (
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
                  <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <Col>
                      <label className="text-[13px] text-gray-600 font-medium mb-1 block">
                        {t("lead.student")} <span className="text-red-500">*</span>
                      </label>
                      <SelectField
                        options={students
                          .filter((s) => {
                            const sid = String(s.id);
                            // ẩn HV đã chọn ở dòng khác (giữ HV của chính dòng này)
                            return !studentsWatch.some(
                              (row: any, i: number) =>
                                i !== index && String(row?.student_id ?? "") === sid,
                            );
                          })
                          .map((s) => ({
                            value: String(s.id),
                            label: s.code ? `${s.code} - ${s.name}` : s.name,
                          }))}
                        placeholder={t("lead.student")}
                        disabled={isView}
                        value={String(form.watch(`students.${index}.student_id`) ?? "")}
                        onChange={(val) =>
                          form.setValue(
                            `students.${index}.student_id` as const,
                            String(val ?? ""),
                            { shouldDirty: true, shouldValidate: true },
                          )
                        }
                      />
                      {errors?.students?.[index]?.student_id?.message && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.students[index].student_id.message}
                        </p>
                      )}
                    </Col>
                    <Col>
                      <label className="text-[13px] text-gray-600 font-medium mb-1 block">
                        {t("lead.relationship")}
                      </label>
                      <SelectField
                        options={relationOptions}
                        placeholder={t("lead.relationship")}
                        disabled={isView}
                        value={String(form.watch(`students.${index}.relationship`) ?? "")}
                        onChange={(val) =>
                          form.setValue(
                            `students.${index}.relationship` as const,
                            String(val ?? ""),
                            { shouldDirty: true },
                          )
                        }
                      />
                    </Col>
                  </Row>
                </div>
              ))}
              {typeof errors?.students?.message === "string" && (
                <p className="text-red-500 text-xs">{errors.students.message}</p>
              )}
              {!isView && (
                <button
                  type="button"
                  onClick={() => appendStudent({ student_id: "", relationship: "" })}
                  className="flex items-center gap-1.5 text-[13px] text-blue-600 hover:text-blue-700 w-fit"
                >
                  <PlusCircleOutlined className="w-4 h-4" />
                  {t("lead.add_student")}
                </button>
              )}
            </div>
          </div>
        </FormTera>
      );
    },
  ),
);

export default LeadForm;
