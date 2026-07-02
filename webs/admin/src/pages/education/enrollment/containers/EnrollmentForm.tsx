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
import moment from "moment";
import { Col, Row, notification, DatePicker } from "tera-dls";

/* Import: packages */
import { IFormProps } from "@tera/commons/interfaces";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { useStores } from "@tera/stores/useStores";
import Input from "@tera/components/dof/Control/Input";
import TextArea from "@tera/components/dof/Control/TextArea";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";

/* Import: services */
import {
  EnrollmentService,
  StudentService,
  CourseService,
  ClassRoomService,
} from "@tera/modules";

/* Import: pages */
import UserSelect from "_common/components/UserSelect";
import ClassCapacity from "./ClassCapacity";
import { IEnrollmentForm } from "pages/education/enrollment/_interface";

const SELECT_CLASS =
  "w-full max-w-full min-w-0 h-9 border border-gray-300 bg-white px-3 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer box-border";

const defaultValues: IEnrollmentForm = {
  student_id: "",
  course_id: "",
  class_id: "",
  sales_id: "",
  enrolled_at: "",
  total_lessons: "",
  price_per_lesson: "",
  discount_percent: "",
  discount_amount: "",
  bonus_lessons: "",
  paid_amount: "",
  payment_method: "",
  note: "",
};

const toNum = (v: any) => {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) && String(v ?? "").trim() !== "" ? n : undefined;
};

const EnrollmentForm = observer(
  forwardRef<any, IFormProps & { onSuccess?: () => void }>(
    ({ dataDetail, type = "create", onSuccess }, ref) => {
      const isView = type === "detail";
      const isUpdate = type === "update";
      const { t } = useTranslation();
      const { globalStore } = useStores();
      const isMobile = useIsMobile();

      const [activeTab, setActiveTab] = useState("student");

      const isUpdateRef = useRef(isUpdate);
      isUpdateRef.current = isUpdate;

      // chỉ cho phép cash/transfer (theo API)
      const paymentOptions = (
        globalStore.getOptions("payment_method") ?? []
      ).filter((o: any) => ["cash", "transfer"].includes(o.value));

      const { data: studentData } = StudentService.useStudentList({
        params: { page: 1, per_page: 100 },
      });
      const students: any[] = useMemo(() => {
        const list = studentData?.data?.items ?? [];
        const sel = dataDetail?.student;
        if (sel?.id && !list.some((s: any) => s.id === sel.id))
          return [...list, sel];
        return list;
      }, [studentData, dataDetail]);

      const { data: courseData } = CourseService.useCourseList({
        params: { page: 1, per_page: 100 },
      });
      const courses: any[] = useMemo(() => {
        const list = courseData?.data?.items ?? [];
        const sel = dataDetail?.course;
        if (sel?.id && !list.some((c: any) => c.id === sel.id))
          return [...list, sel];
        return list;
      }, [courseData, dataDetail]);

      const { data: classData } = ClassRoomService.useClassRoomList({
        params: { page: 1, per_page: 100 },
      });
      const classes: any[] = useMemo(() => {
        const list = classData?.data?.items ?? [];
        const sel = dataDetail?.class;
        if (sel?.id && !list.some((c: any) => c.id === sel.id))
          return [...list, sel];
        return list;
      }, [classData, dataDetail]);

      const schema = useMemo(
        () =>
          yup.object({
            student_id: yup
              .string()
              .test("student-required", t("validate.required"), (v) =>
                isUpdateRef.current ? true : !!v,
              ),
            class_id: yup
              .string()
              .test("class-required", t("validate.required"), (v) =>
                isUpdateRef.current ? true : !!v,
              ),
            course_id: yup
              .string()
              .test("course-required", t("validate.required"), (v) =>
                isUpdateRef.current ? true : !!v,
              ),
            total_lessons: yup
              .string()
              .test("total-required", t("validate.required"), (v) =>
                isUpdateRef.current ? true : !!v,
              ),
            price_per_lesson: yup
              .string()
              .test("price-required", t("validate.required"), (v) =>
                isUpdateRef.current ? true : !!v,
              ),
          }),
        [t],
      );

      const form = useForm<IEnrollmentForm>({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(schema) as any,
      });

      const { reset, formState, watch } = form;
      const errors = formState.errors as any;
      const studentValue = watch("student_id");
      const courseValue = watch("course_id");
      const classValue = watch("class_id");
      const salesValue = watch("sales_id");
      const paymentValue = watch("payment_method");
      const enrolledAtValue = watch("enrolled_at");
      const totalLessonsValue = watch("total_lessons");
      const priceValue = watch("price_per_lesson");
      // Thành tiền = số buổi × đơn giá/buổi (hiển thị, không gửi — backend tự tính)
      const totalAmount =
        (Number(totalLessonsValue) || 0) * (Number(priceValue) || 0);

      // Lớp đang chọn → khóa học của lớp đó (khóa học phụ thuộc lớp)
      const selectedClass = useMemo(
        () => classes.find((c: any) => String(c.id) === String(classValue)),
        [classes, classValue],
      );
      const classCourseId =
        selectedClass?.course_id ?? selectedClass?.course?.id;
      // Đã chọn lớp + lớp có khóa học → select khóa học CHỈ hiện khóa của lớp đó
      const courseOptions: any[] = useMemo(() => {
        if (classValue && classCourseId != null) {
          const found =
            courses.find((c: any) => String(c.id) === String(classCourseId)) ??
            selectedClass?.course;
          return found ? [found] : [];
        }
        return courses;
      }, [courses, classValue, classCourseId, selectedClass]);

      const queryClient = useQueryClient();
      const { mutate: onSubmit, isPending } =
        EnrollmentService.useUpsertEnrollment();

      // Chọn lớp → tự set khóa học theo lớp
      useEffect(() => {
        if (classValue && classCourseId != null) {
          const cur = form.getValues("course_id");
          if (String(cur ?? "") !== String(classCourseId)) {
            form.setValue("course_id", String(classCourseId), {
              shouldValidate: true,
            });
          }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [classValue, classCourseId]);

      useEffect(() => {
        if (dataDetail?.id) {
          reset({
            student_id: dataDetail.student_id ? String(dataDetail.student_id) : "",
            course_id: dataDetail.course_id ? String(dataDetail.course_id) : "",
            class_id: dataDetail.class_id ? String(dataDetail.class_id) : "",
            sales_id: dataDetail.sales_id ? String(dataDetail.sales_id) : "",
            enrolled_at: dataDetail.enrolled_at
              ? String(dataDetail.enrolled_at).split("T")[0]
              : "",
            total_lessons:
              dataDetail.total_lessons != null
                ? String(dataDetail.total_lessons)
                : "",
            price_per_lesson:
              dataDetail.price_per_lesson != null
                ? String(dataDetail.price_per_lesson)
                : "",
            discount_percent: "",
            discount_amount:
              dataDetail.discount_amount != null
                ? String(dataDetail.discount_amount)
                : "",
            bonus_lessons: "",
            paid_amount:
              dataDetail.paid_amount != null ? String(dataDetail.paid_amount) : "",
            payment_method: "",
            note: dataDetail.note ?? "",
          });
        } else {
          reset(defaultValues);
        }
      }, [dataDetail, reset]);

      const handleSubmitForm = (values: IEnrollmentForm) => {
        // Update: chỉ gửi sales_id + note (theo API). Create: gửi đầy đủ.
        const params = isUpdate
          ? {
              sales_id: toNum(values.sales_id),
              note: values.note?.trim() || undefined,
            }
          : {
              student_id: toNum(values.student_id),
              course_id: toNum(values.course_id),
              class_id: toNum(values.class_id),
              sales_id: toNum(values.sales_id),
              enrolled_at: values.enrolled_at || undefined,
              total_lessons: toNum(values.total_lessons),
              price_per_lesson: toNum(values.price_per_lesson),
              discount_percent: toNum(values.discount_percent),
              discount_amount: toNum(values.discount_amount),
              bonus_lessons: toNum(values.bonus_lessons),
              paid_amount: toNum(values.paid_amount),
              payment_method: values.payment_method || undefined,
              note: values.note?.trim() || undefined,
            };
        onSubmit(
          { id: dataDetail?.id, params },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
              queryClient.invalidateQueries({ queryKey: ["enrollment", "detail"] });
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

      // Update: chỉ sales_id + note sửa được → các field khác disabled
      const lockBasic = isView || isUpdate;

      const tabErrors: Record<string, boolean> = {
        student: !!errors.student_id,
        course: !!(errors.class_id || errors.course_id),
        package: !!(errors.total_lessons || errors.price_per_lesson),
        promotion: false,
        payment: false,
      };

      const tabs = [
        { key: "student", label: t("enrollment.tab_student_info") },
        { key: "course", label: t("enrollment.tab_course_info") },
        { key: "package", label: t("enrollment.tab_package") },
        { key: "promotion", label: t("enrollment.tab_promotion") },
        { key: "payment", label: t("enrollment.tab_payment_info") },
      ];

      return (
        <FormTera
          form={form}
          onSubmit={handleSubmitForm}
          isLoading={isPending}
          isDisabled={isView}
        >
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

          {/* Tab 1: Học viên */}
          <div className={activeTab === "student" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Col>
                <FormTeraItem
                  label={t("enrollment.student")}
                  name="student_id"
                  rules={[{ required: t("validate.required") }]}
                >
                  <div className="w-full overflow-hidden">
                    <select
                      className={SELECT_CLASS}
                      style={{ borderRadius: "3px", color: studentValue ? "#111827" : "#9ca3af" }}
                      disabled={lockBasic}
                      {...form.register("student_id")}
                    >
                      <option value="" disabled hidden>
                        {t("form.enter_value", { key: t("enrollment.student") })}
                      </option>
                      {students.map((s) => (
                        <option key={s.id} value={String(s.id)} style={{ color: "#111827" }}>
                          {s.code ? `${s.code} - ${s.name}` : s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("enrollment.registrant")} name="sales_id">
                  <UserSelect
                    value={salesValue}
                    selectedUser={dataDetail?.sales}
                    disabled={isView}
                    placeholder={t("form.enter_value", { key: t("enrollment.registrant") })}
                    onChange={(id) =>
                      form.setValue("sales_id", id, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </FormTeraItem>
              </Col>
              <Col className="sm:col-span-2">
                <FormTeraItem label={t("enrollment.note")} name="note">
                  <TextArea rows={3} disabled={isView} />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 2: Khóa học */}
          <div className={activeTab === "course" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Col>
                <FormTeraItem
                  label={t("enrollment.class")}
                  name="class_id"
                  rules={[{ required: t("validate.required") }]}
                >
                  <div className="w-full overflow-hidden">
                    <select
                      className={SELECT_CLASS}
                      style={{ borderRadius: "3px", color: classValue ? "#111827" : "#9ca3af" }}
                      disabled={lockBasic}
                      {...form.register("class_id")}
                    >
                      <option value="" disabled hidden>
                        {t("form.enter_value", { key: t("enrollment.class") })}
                      </option>
                      {classes.map((c) => (
                        <option key={c.id} value={String(c.id)} style={{ color: "#111827" }}>
                          {c.code ? `${c.code} - ${c.name}` : c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("enrollment.course")}
                  name="course_id"
                  rules={[{ required: t("validate.required") }]}
                >
                  <div className="w-full overflow-hidden">
                    <select
                      className={SELECT_CLASS}
                      style={{ borderRadius: "3px", color: courseValue ? "#111827" : "#9ca3af" }}
                      disabled={lockBasic || (!!classValue && classCourseId != null)}
                      {...form.register("course_id")}
                    >
                      <option value="" style={{ color: "#9ca3af" }}>
                        {t("enrollment.all_courses")}
                      </option>
                      {courseOptions.map((c) => (
                        <option key={c.id} value={String(c.id)} style={{ color: "#111827" }}>
                          {c.code ? `${c.code} - ${c.name}` : c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </FormTeraItem>
              </Col>
              <Col className="sm:col-span-2">
                {classValue ? <ClassCapacity classId={classValue} /> : null}
              </Col>
            </Row>
          </div>

          {/* Tab 3: Gói học tập */}
          <div className={activeTab === "package" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Col>
                <FormTeraItem
                  label={t("enrollment.total_lessons")}
                  name="total_lessons"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input type="number" min={0} disabled={lockBasic} />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("enrollment.price_per_lesson")}
                  name="price_per_lesson"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input type="number" min={0} disabled={lockBasic} />
                </FormTeraItem>
              </Col>
              <Col className="sm:col-span-2">
                <label className="text-[13px] text-gray-600 font-medium mb-1 block">
                  {t("enrollment.total_amount")}
                </label>
                <div className="w-full h-9 flex items-center px-3 rounded-[3px] border border-gray-200 bg-gray-50 text-[13px] font-semibold text-blue-600">
                  {totalAmount.toLocaleString("vi-VN")} ₫
                </div>
              </Col>
            </Row>
          </div>

          {/* Tab 4: Khuyến mãi */}
          <div className={activeTab === "promotion" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Col>
                <FormTeraItem
                  label={t("enrollment.discount_percent")}
                  name="discount_percent"
                >
                  <Input type="number" min={0} max={100} disabled={lockBasic} />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("enrollment.discount_amount")}
                  name="discount_amount"
                >
                  <Input type="number" min={0} disabled={lockBasic} />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("enrollment.bonus_lessons")}
                  name="bonus_lessons"
                >
                  <Input type="number" min={0} disabled={lockBasic} />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 5: Thanh toán */}
          <div className={activeTab === "payment" ? "block" : "hidden"}>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Col>
                <FormTeraItem label={t("enrollment.enrolled_at")} name="enrolled_at">
                  {isMobile ? (
                    <Input type="date" disabled={lockBasic} />
                  ) : (
                    <DatePicker
                      className="w-full"
                      value={
                        enrolledAtValue
                          ? moment(String(enrolledAtValue), "YYYY-MM-DD")
                          : undefined
                      }
                      format="DD/MM/YYYY"
                      placeholder="DD/MM/YYYY"
                      disabled={lockBasic}
                      allowClear
                      onChange={(date: any) =>
                        form.setValue(
                          "enrolled_at",
                          date ? moment(date).format("YYYY-MM-DD") : "",
                          { shouldDirty: true, shouldValidate: true },
                        )
                      }
                    />
                  )}
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("enrollment.payment_method")}
                  name="payment_method"
                >
                  <div className="w-full overflow-hidden">
                    <select
                      className={SELECT_CLASS}
                      style={{ borderRadius: "3px", color: paymentValue ? "#111827" : "#9ca3af" }}
                      disabled={lockBasic}
                      {...form.register("payment_method")}
                    >
                      <option value="" disabled hidden>
                        {t("form.enter_value", { key: t("enrollment.payment_method") })}
                      </option>
                      {paymentOptions.map((o: any) => (
                        <option key={o.value} value={o.value} style={{ color: "#111827" }}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("enrollment.paid_amount")} name="paid_amount">
                  <Input type="number" min={0} disabled={lockBasic} />
                </FormTeraItem>
              </Col>
            </Row>
          </div>
        </FormTera>
      );
    },
  ),
);

export default EnrollmentForm;
