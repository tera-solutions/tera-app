/* Import: library */
import {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useState,
} from "react";
import { observer } from "mobx-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Col, Row, notification } from "tera-dls";

/* Import: packages */
import { IFormProps } from "@tera/commons/interfaces";
import TextArea from "@tera/components/dof/Control/TextArea";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import {
  ParentService,
  StudentService,
  ParentStudentService,
} from "@tera/modules";

/* Import: pages */
import { IParentStudentLinkForm } from "pages/CRM/parent-student/_interface";

const SELECT_CLASS =
  "w-full max-w-full min-w-0 h-9 border border-gray-300 bg-white px-3 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer box-border";

const defaultValues: IParentStudentLinkForm = {
  parent_id: "",
  student_id: "",
  relation: "",
  is_primary_contact: false,
  is_billing_contact: false,
  is_pickup_authorized: false,
  note: "",
};

const ParentStudentForm = observer(
  forwardRef<any, IFormProps & { onSuccess?: () => void }>(
    ({ dataDetail, type = "create", onSuccess }, ref) => {
      const isView = type === "detail";
      const isUpdate = type === "update";
      const { t } = useTranslation();
      const { globalStore } = useStores();
      const queryClient = useQueryClient();

      // Chỉ cho chọn phụ huynh đang Active (theo docs validation)
      const { data: parentData } = ParentService.useParentList({
        params: { page: 1, per_page: 100, status: "active" },
      });
      const parents: any[] = useMemo(() => {
        const list = (parentData?.data?.items ?? []).filter(
          (p: any) => p.status === "active",
        );
        const selected = dataDetail?.parent;
        if (selected?.id && !list.some((p: any) => p.id === selected.id)) {
          return [...list, selected];
        }
        return list;
      }, [parentData, dataDetail]);

      // Chỉ cho chọn học viên đang Active (theo docs validation)
      const { data: studentData } = StudentService.useStudentList({
        params: { page: 1, per_page: 100, status: "active" },
      });
      const students: any[] = useMemo(() => {
        const list = (studentData?.data?.items ?? []).filter(
          (s: any) => s.status === "active",
        );
        const selected = dataDetail?.student;
        if (selected?.id && !list.some((s: any) => s.id === selected.id)) {
          return [...list, selected];
        }
        return list;
      }, [studentData, dataDetail]);

      const relationOptions = globalStore.getOptions("guardian_relation") ?? [];

      const schema = useMemo(
        () =>
          yup.object({
            parent_id: yup.string().required(t("validate.required")),
            student_id: yup.string().required(t("validate.required")),
            relation: yup.string().required(t("validate.required")),
          }),
        [t],
      );

      const form = useForm<IParentStudentLinkForm>({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(schema) as any,
      });

      const { reset, formState, watch } = form;
      const parentIdValue = watch("parent_id");
      const studentIdValue = watch("student_id");
      const relationValue = watch("relation");

      const { mutate: onCreate, isPending: isCreating } =
        ParentStudentService.useParentStudentCreate();
      const { mutate: onUpdate, isPending: isUpdating } =
        ParentStudentService.useParentStudentUpdate();
      const isPending = isCreating || isUpdating;

      useEffect(() => {
        if (dataDetail?.id) {
          reset({
            parent_id: dataDetail.parent_id
              ? String(dataDetail.parent_id)
              : dataDetail.parent?.id
                ? String(dataDetail.parent.id)
                : "",
            student_id: dataDetail.student_id
              ? String(dataDetail.student_id)
              : dataDetail.student?.id
                ? String(dataDetail.student.id)
                : "",
            relation: dataDetail.relation ?? "",
            is_primary_contact: !!dataDetail.is_primary_contact,
            is_billing_contact: !!dataDetail.is_billing_contact,
            is_pickup_authorized: !!dataDetail.is_pickup_authorized,
            note: dataDetail.note ?? "",
          });
        } else {
          reset(defaultValues);
        }
      }, [dataDetail, reset]);

      const handleSubmitForm = (values: IParentStudentLinkForm) => {
        const params: any = {
          relation: values.relation || undefined,
          is_primary_contact: !!values.is_primary_contact,
          is_billing_contact: !!values.is_billing_contact,
          is_pickup_authorized: !!values.is_pickup_authorized,
          note: values.note?.trim() || undefined,
        };
        // Phụ huynh & Học viên chỉ chọn khi tạo mới; update không cho đổi
        if (!dataDetail?.id) {
          params.parent_id = values.parent_id
            ? Number(values.parent_id)
            : undefined;
          params.student_id = values.student_id
            ? Number(values.student_id)
            : undefined;
        }

        const handlers = {
          onSuccess: () => {
            // Invalidate ngay trong per-call onSuccess (chạy chắc chắn trước khi
            // modal đóng/unmount) — KHÔNG dựa vào hook-level onSuccess của
            // useMutationAdapter (bridge qua useEffect, bị bỏ qua nếu component
            // unmount do onClose) → nếu không list sẽ không refetch.
            queryClient.invalidateQueries({
              queryKey: ["parent-student", "list"],
            });
            queryClient.invalidateQueries({
              queryKey: ["parent-student", "detail"],
            });
            notification.success({
              message: isUpdate
                ? t("common.update_success")
                : t("parent_student.create_success"),
            });
            onSuccess?.();
          },
          onError: (error: any) => {
            notification.error({
              message: error?.message || t("common.error_message"),
            });
          },
        };

        if (dataDetail?.id) {
          onUpdate({ id: dataDetail.id, params }, handlers);
        } else {
          onCreate({ params }, handlers);
        }
      };

      useImperativeHandle(ref, () => ({
        isValid: () => formState.isValid,
        submit: () => form.handleSubmit(handleSubmitForm)(),
        isDirty: () => formState.isDirty,
      }));

      return (
        <FormTera
          form={form}
          onSubmit={handleSubmitForm}
          isLoading={isPending}
          isDisabled={isView}
        >
          <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Col>
              <FormTeraItem
                label={t("parent_student.parent")}
                name="parent_id"
                rules={[{ required: t("validate.required") }]}
              >
                <div className="w-full overflow-hidden">
                  <select
                    className={SELECT_CLASS}
                    style={{
                      borderRadius: "3px",
                      color: parentIdValue ? "#111827" : "#9ca3af",
                    }}
                    disabled={isView || isUpdate}
                    {...form.register("parent_id")}
                  >
                    <option value="" disabled hidden>
                      {t("parent_student.select_parent")}
                    </option>
                    {parents.map((parent: any) => (
                      <option
                        key={parent.id}
                        value={String(parent.id)}
                        style={{ color: "#111827" }}
                      >
                        {parent.name}
                        {parent.code ? ` (${parent.code})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </FormTeraItem>
            </Col>
            <Col>
              <FormTeraItem
                label={t("parent_student.student")}
                name="student_id"
                rules={[{ required: t("validate.required") }]}
              >
                <div className="w-full overflow-hidden">
                  <select
                    className={SELECT_CLASS}
                    style={{
                      borderRadius: "3px",
                      color: studentIdValue ? "#111827" : "#9ca3af",
                    }}
                    disabled={isView || isUpdate}
                    {...form.register("student_id")}
                  >
                    <option value="" disabled hidden>
                      {t("parent_student.select_student")}
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
                label={t("parent_student.relation")}
                name="relation"
                rules={[{ required: t("validate.required") }]}
              >
                <div className="w-full overflow-hidden">
                  <select
                    className={SELECT_CLASS}
                    style={{
                      borderRadius: "3px",
                      color: relationValue ? "#111827" : "#9ca3af",
                    }}
                    disabled={isView}
                    {...form.register("relation")}
                  >
                    <option value="" disabled hidden>
                      {t("form.enter_value", {
                        key: t("parent_student.relation"),
                      })}
                    </option>
                    {relationOptions.map((opt: any) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        style={{ color: "#111827" }}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </FormTeraItem>
            </Col>

            {/* Vai trò liên hệ */}
            <Col className="sm:col-span-2">
              <div className="flex flex-col gap-2 mt-1 mb-3">
                <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-500 cursor-pointer disabled:cursor-not-allowed"
                    disabled={isView}
                    {...form.register("is_primary_contact")}
                  />
                  {t("parent_student.is_primary_contact")}
                </label>
                <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-500 cursor-pointer disabled:cursor-not-allowed"
                    disabled={isView}
                    {...form.register("is_billing_contact")}
                  />
                  {t("parent_student.is_billing_contact")}
                </label>
                <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-500 cursor-pointer disabled:cursor-not-allowed"
                    disabled={isView}
                    {...form.register("is_pickup_authorized")}
                  />
                  {t("parent_student.is_pickup_authorized")}
                </label>
              </div>
            </Col>

            {/* Ghi chú */}
            <Col className="sm:col-span-2">
              <FormTeraItem label={t("parent_student.note")} name="note">
                <TextArea
                  rows={3}
                  placeholder={t("parent_student.note_placeholder")}
                  disabled={isView}
                />
              </FormTeraItem>
            </Col>
          </Row>
        </FormTera>
      );
    },
  ),
);

export default ParentStudentForm;
