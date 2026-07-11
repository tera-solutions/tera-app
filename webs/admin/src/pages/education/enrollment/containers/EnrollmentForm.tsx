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

/* Import: packages */
import { IFormProps } from "@tera/commons/interfaces";
import { useStores } from "@tera/stores/useStores";
import Input from "@tera/components/dof/Control/Input";
import Select from "@tera/components/dof/Control/Select";
import TextArea from "@tera/components/dof/Control/TextArea";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";

/* Import: services */
import {
  EnrollmentService,
  StudentService,
  CourseService,
  ClassRoomService,
  ClassSessionService,
} from "@tera/modules";

/* Import: pages */
import DateField from "_common/components/DateField";
import UserSelect from "_common/components/UserSelect";
import ClassCapacity from "./ClassCapacity";
import { IEnrollmentForm } from "pages/education/enrollment/_interface";


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

// "200000.00" → "200000" (bỏ đuôi thập phân thừa để input number không hiện .00)
const cleanNum = (v: any): string => {
  if (v == null || v === "") return "";
  const n = Number(v);
  return Number.isFinite(n) ? String(n) : String(v);
};

const EnrollmentForm = observer(
  forwardRef<any, IFormProps & { onSuccess?: () => void }>(
    ({ dataDetail, type = "create", onSuccess }, ref) => {
      const isView = type === "detail";
      const isUpdate = type === "update";
      const { t } = useTranslation();
      const { globalStore } = useStores();

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
      const classValue = watch("class_id");
      const salesValue = watch("sales_id");
      const totalLessonsValue = watch("total_lessons");
      const priceValue = watch("price_per_lesson");
      // Thành tiền = số buổi × đơn giá/buổi (hiển thị, không gửi — backend tự tính)
      const totalAmount =
        (Number(totalLessonsValue) || 0) * (Number(priceValue) || 0);

      const courseValue = watch("course_id");

      // Lớp học phụ thuộc khóa học: chọn khóa → chỉ hiện lớp thuộc khóa đó.
      const courseIdOfClass = (cls: any) => cls?.course_id ?? cls?.course?.id;
      const classOptions: any[] = useMemo(() => {
        if (!courseValue) return classes;
        return classes.filter(
          (c: any) => String(courseIdOfClass(c)) === String(courseValue),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [classes, courseValue]);

      const queryClient = useQueryClient();
      const { mutate: onSubmit, isPending } =
        EnrollmentService.useUpsertEnrollment();

      // Số buổi của lớp = tổng session của lớp (chỉ fetch khi tạo mới + đã chọn lớp)
      const { data: sessionCountData } = ClassSessionService.useClassSessionList(
        { params: { class_id: classValue, page: 1, per_page: 1 } },
        { enabled: type === "create" && !!classValue },
      );
      const classSessionTotal: number | undefined =
        sessionCountData?.data?.pagination?.total;

      // Đổi khóa học → (1) nếu lớp đang chọn không thuộc khóa mới thì xóa lớp;
      // (2) tự điền giá/buổi theo khóa. (2) CHỈ khi tạo mới — sửa thì giữ giá đã lưu.
      useEffect(() => {
        const cur = form.getValues("class_id");
        if (cur) {
          const cls = classes.find((c: any) => String(c.id) === String(cur));
          if (cls && String(courseIdOfClass(cls)) !== String(courseValue)) {
            form.setValue("class_id", "", { shouldValidate: true });
          }
        }
        if (type === "create" && courseValue) {
          const course = courses.find(
            (c: any) => String(c.id) === String(courseValue),
          );
          if (course?.price_per_lesson != null) {
            form.setValue("price_per_lesson", cleanNum(course.price_per_lesson), {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [courseValue]);

      // Chọn lớp → tự điền Tổng số buổi = số buổi của lớp. CHỈ khi tạo mới.
      useEffect(() => {
        if (type === "create" && classValue && classSessionTotal != null) {
          form.setValue("total_lessons", String(classSessionTotal), {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [classValue, classSessionTotal]);

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
            total_lessons: cleanNum(dataDetail.total_lessons),
            price_per_lesson: cleanNum(dataDetail.price_per_lesson),
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
                  <Select
                    options={students.map((s) => ({
                      value: String(s.id),
                      label: s.code ? `${s.code} - ${s.name}` : s.name,
                    }))}
                    placeholder={t("form.enter_value", { key: t("enrollment.student") })}
                    disabled={lockBasic}
                  />
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
                  label={t("enrollment.course")}
                  name="course_id"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Select
                    options={courses.map((c) => ({
                      value: String(c.id),
                      label: c.code ? `${c.code} - ${c.name}` : c.name,
                    }))}
                    placeholder={t("form.enter_value", { key: t("enrollment.course") })}
                    disabled={lockBasic}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("enrollment.class")}
                  name="class_id"
                  rules={[{ required: t("validate.required") }]}
                >
                  {/* Lớp phụ thuộc khóa: disable đến khi chọn khóa; options lọc theo khóa */}
                  <Select
                    options={classOptions.map((c) => ({
                      value: String(c.id),
                      label: c.code ? `${c.code} - ${c.name}` : c.name,
                    }))}
                    placeholder={t("form.enter_value", { key: t("enrollment.class") })}
                    disabled={lockBasic || !courseValue}
                  />
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
                  label={t("enrollment.price_per_lesson")}
                  name="price_per_lesson"
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input type="number" min={0} disabled={lockBasic} />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("enrollment.total_lessons")}
                  name="total_lessons"
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
                  <DateField disabled={lockBasic} disableFuture={false} />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("enrollment.payment_method")}
                  name="payment_method"
                >
                  <Select
                    options={paymentOptions}
                    placeholder={t("form.enter_value", { key: t("enrollment.payment_method") })}
                    disabled={lockBasic}
                  />
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
