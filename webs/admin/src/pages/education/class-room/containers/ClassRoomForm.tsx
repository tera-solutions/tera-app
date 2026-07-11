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
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { Col, Row, notification, DatePicker as DatePickerTera } from "tera-dls";
import { PlusOutlined, TrashOutlined } from "tera-dls";
import debounce from "lodash/debounce";

/* Import: packages */
import { IFormProps } from "@tera/commons/interfaces";
import Input from "@tera/components/dof/Control/Input";
import Select, { SelectField } from "@tera/components/dof/Control/Select";
import TextArea from "@tera/components/dof/Control/TextArea";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import {
  ClassRoomService,
  CourseService,
  LessonPlanService,
  RoomService,
  TeacherService,
} from "@tera/modules";
import { ClassRoomAPI } from "@tera/api";

/* Import: pages */
import UserSelect from "_common/components/UserSelect";
import { IClassRoomForm } from "pages/education/class-room/_interface";


const TIME_CLASS =
  "w-full max-w-full min-w-0 h-9 border border-gray-300 bg-white px-2 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed box-border rounded-[3px]";

// Chặn nhập số âm / ký tự không hợp lệ cho ô sĩ số
const preventNegativeKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault();
};

// Chuẩn hóa giờ về đúng định dạng H:i (HH:MM, có số 0 đầu) — backend Laravel yêu cầu
const toHHMM = (v?: string) => {
  if (!v) return "";
  const m = String(v).match(/^(\d{1,2}):(\d{2})/);
  if (!m) return v;
  return `${m[1].padStart(2, "0")}:${m[2]}`;
};

const defaultValues: IClassRoomForm = {
  // Tab 1: Thông tin cơ bản
  code: "",
  name: "",
  course_id: "",
  lesson_plan_id: "",
  teacher_id: "",
  assignee_id: "",
  use_course_curriculum: false,
  description: "",
  // Tab 2: Cấu hình lớp học
  learning_type: "",
  start_date: "",
  end_date: "",
  room_id: "",
  min_warning_capacity: "",
  min_capacity: "",
  max_warning_capacity: "",
  max_capacity: "",
  // Tab 3: Lịch học
  schedules: [],
};

type ClassRoomFormProps = IFormProps & {
  onSuccess?: () => void;
  hasSessions?: boolean;
};

const ClassRoomForm = observer(
  forwardRef<any, ClassRoomFormProps>(
    ({ dataDetail, type = "create", onSuccess, hasSessions = false }, ref) => {
    const isView = type === "detail";
    const isUpdate = type === "update";
    // Sau khi đã phát sinh buổi học: không cho đổi khóa học + không clone lại chương trình
    const lockedBySessions = isUpdate && hasSessions;
    const { t } = useTranslation();
    const { globalStore } = useStores();

    const [activeTab, setActiveTab] = useState("basic");

    const learningTypeOptions =
      globalStore.getOptions("class_learning_type") ?? [];

    // ⚠️ weekday là SỐ (Thứ 2 = 2 ... Thứ 7 = 7, Chủ nhật = 1) — CẦN verify backend
    const weekdayOptions = useMemo(
      () => [
        { value: 2, label: t("classroom.weekday_mon") },
        { value: 3, label: t("classroom.weekday_tue") },
        { value: 4, label: t("classroom.weekday_wed") },
        { value: 5, label: t("classroom.weekday_thu") },
        { value: 6, label: t("classroom.weekday_fri") },
        { value: 7, label: t("classroom.weekday_sat") },
        { value: 1, label: t("classroom.weekday_sun") },
      ],
      [t],
    );

    const { data: courseData } = CourseService.useCourseList({
      params: { page: 1, per_page: 100 },
    });
    const courses: any[] = courseData?.data?.items ?? [];

    const { data: lessonPlanData } = LessonPlanService.useLessonPlanList({
      params: { page: 1, per_page: 100 },
    });
    const lessonPlans: any[] = lessonPlanData?.data?.items ?? [];

    const { data: teacherData } = TeacherService.useTeacherList({
      params: { page: 1, per_page: 100 },
    });
    const teachers: any[] = teacherData?.data?.items ?? [];

    // Phòng học lấy từ catalog edu/room (RoomService), chỉ phòng đang hoạt động
    const { data: roomData } = RoomService.useRoomList({
      params: { page: 1, per_page: 100, status: "active" },
    });
    const rooms: any[] = useMemo(() => {
      const map = new Map<number, any>();
      (roomData?.data?.items ?? []).forEach((r: any) => {
        if (r?.id) map.set(r.id, r);
      });
      // giữ phòng đang gán nếu không có trong catalog (vd đã ngừng hoạt động)
      const selected = dataDetail?.room;
      if (selected?.id && !map.has(selected.id)) map.set(selected.id, selected);
      return [...map.values()];
    }, [roomData, dataDetail]);

    const isUpdateRef = useRef(isUpdate);
    isUpdateRef.current = isUpdate;
    const currentIdRef = useRef(dataDetail?.id);
    currentIdRef.current = dataDetail?.id;

    const checkCodeRef = useRef(
      debounce((code: string, resolve: (valid: boolean) => void) => {
        ClassRoomAPI.getList({ params: { keyword: code, per_page: 5 } })
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
              if (!value || isUpdateRef.current) return true;
              return new Promise((resolve) =>
                checkCodeRef.current(value, resolve),
              );
            }),
          name: yup.string().required(t("validate.required")),
          course_id: yup.string().required(t("validate.required")),
          learning_type: yup.string().required(t("validate.required")),
          start_date: yup.string().required(t("validate.required")),
          schedules: yup
            .array()
            .test(
              "schedule-required",
              t("classroom.schedule_required"),
              function (value) {
                if (this.parent.learning_type !== "scheduled") return true;
                const valid = (value ?? []).filter(
                  (s: any) => s?.weekday && s?.start_time && s?.end_time,
                );
                return valid.length >= 1;
              },
            ),
        }),
        [t],
      );

      const form = useForm<IClassRoomForm>({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(schema) as any,
      });

      const { reset, formState, watch, register, control, setValue } = form;
      const errors = formState.errors as any;

      const {
        fields: scheduleFields,
        append: appendSchedule,
        remove: removeSchedule,
      } = useFieldArray({ control, name: "schedules" });

      const assigneeIdValue = watch("assignee_id");
      const learningTypeValue = watch("learning_type");
      const useCurriculumValue = watch("use_course_curriculum" as any);
      const schedulesValue = watch("schedules");
      const startDateValue = watch("start_date");

      const queryClient = useQueryClient();
      const { mutate: onSubmit, isPending } =
        ClassRoomService.useUpsertClassRoom();

      useEffect(() => {
        if (dataDetail?.id) {
          reset({
            code: dataDetail.code ?? "",
            name: dataDetail.name ?? "",
            course_id: dataDetail.course_id ? String(dataDetail.course_id) : "",
            lesson_plan_id: dataDetail.lesson_plan_id
              ? String(dataDetail.lesson_plan_id)
              : "",
            teacher_id: dataDetail.teacher_id
              ? String(dataDetail.teacher_id)
              : "",
            assignee_id: dataDetail.assignee_id
              ? String(dataDetail.assignee_id)
              : "",
            use_course_curriculum: !!dataDetail.use_course_curriculum,
            description: dataDetail.description ?? "",
            learning_type: dataDetail.learning_type ?? "",
            start_date: dataDetail.start_date
              ? String(dataDetail.start_date).slice(0, 10)
              : "",
            end_date: dataDetail.end_date
              ? String(dataDetail.end_date).slice(0, 10)
              : "",
            room_id: dataDetail.room_id ? String(dataDetail.room_id) : "",
            min_warning_capacity:
              dataDetail.min_warning_capacity != null
                ? String(dataDetail.min_warning_capacity)
                : "",
          min_capacity:
            dataDetail.min_capacity != null
              ? String(dataDetail.min_capacity)
              : "",
          max_warning_capacity:
            dataDetail.max_warning_capacity != null
              ? String(dataDetail.max_warning_capacity)
              : "",
          max_capacity:
            dataDetail.max_capacity != null
              ? String(dataDetail.max_capacity)
              : "",
          schedules: Array.isArray(dataDetail.schedules)
            ? dataDetail.schedules.map((s: any) => ({
                id: s.id,
                weekday: s.weekday != null ? String(s.weekday) : "",
                start_time: toHHMM(s.start_time),
                end_time: toHHMM(s.end_time),
              }))
            : [],
        });
      } else {
        reset(defaultValues);
      }
    }, [dataDetail, reset]);

    const handleSubmitForm = (values: IClassRoomForm) => {
      // Validate giờ lịch (kết thúc > bắt đầu)
      const scheduleRows = (values.schedules ?? []).filter(
        (s) => s.weekday || s.start_time || s.end_time,
      );
      const invalidTime = scheduleRows.some((s) => {
        const st = s.start_time ? toHHMM(s.start_time) : "";
        const et = s.end_time ? toHHMM(s.end_time) : "";
        return st && et && et <= st;
      });
      if (invalidTime) {
        setActiveTab("schedule");
        notification.error({ message: t("classroom.schedule_time_invalid") });
        return;
      }

      // Nhúng schedules vào payload class-room (backend tự lưu)
      const schedules = scheduleRows.map((s) => ({
        weekday: s.weekday ? Number(s.weekday) : undefined,
        start_time: s.start_time ? toHHMM(s.start_time) : undefined,
        end_time: s.end_time ? toHHMM(s.end_time) : undefined,
      }));

      const params = {
        code: isUpdate ? undefined : values.code?.trim() || undefined,
        name: values.name?.trim() || undefined,
        course_id: values.course_id ? Number(values.course_id) : undefined,
        lesson_plan_id: values.lesson_plan_id
          ? Number(values.lesson_plan_id)
          : undefined,
        teacher_id: values.teacher_id ? Number(values.teacher_id) : undefined,
        assignee_id: values.assignee_id
          ? Number(values.assignee_id)
          : undefined,
        use_course_curriculum: !!values.use_course_curriculum,
        description: values.description?.trim() || undefined,
        learning_type: values.learning_type || undefined,
        start_date: values.start_date || undefined,
        end_date: values.end_date || undefined,
        room_id: values.room_id ? Number(values.room_id) : undefined,
        min_warning_capacity: values.min_warning_capacity
          ? Number(values.min_warning_capacity)
          : undefined,
        min_capacity: values.min_capacity
          ? Number(values.min_capacity)
          : undefined,
        max_warning_capacity: values.max_warning_capacity
          ? Number(values.max_warning_capacity)
          : undefined,
        max_capacity: values.max_capacity
          ? Number(values.max_capacity)
          : undefined,
        schedules: schedules.length ? schedules : undefined,
      };

      onSubmit(
        { id: dataDetail?.id, params },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["class-room", "list"] });
            queryClient.invalidateQueries({
              queryKey: ["class-room", "detail"],
            });
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

    const handleInvalid = (errs: any) => {
      // Nhảy về tab có lỗi đầu tiên
      if (errs.code || errs.name || errs.course_id) setActiveTab("basic");
      else if (errs.learning_type || errs.start_date) setActiveTab("config");
      else if (errs.schedules) setActiveTab("schedule");
    };

    useImperativeHandle(ref, () => ({
      isValid: () => formState.isValid,
      submit: () => form.handleSubmit(handleSubmitForm, handleInvalid)(),
      isDirty: () => formState.isDirty,
    }));

    const scheduleRequired = learningTypeValue === "scheduled";

    const tabErrors: Record<string, boolean> = {
      basic: !!(errors.code || errors.name || errors.course_id),
      config: !!(errors.learning_type || errors.start_date),
      schedule: !!errors.schedules,
    };

    const tabs = [
      { key: "basic", label: t("classroom.tab_basic"), required: false },
      { key: "config", label: t("classroom.tab_config"), required: false },
      {
        key: "schedule",
        label: t("classroom.tab_schedule"),
        required: scheduleRequired,
      },
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
          <div className='flex border-b border-gray-200 mb-4 overflow-x-auto overflow-y-hidden scrollbar-none'>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type='button'
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.required && <span className='text-red-500'>*</span>}
                {tabErrors[tab.key] && (
                  <span className='w-1.5 h-1.5 rounded-full bg-red-500 shrink-0' />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Thông tin cơ bản */}
          <div className={activeTab === "basic" ? "block" : "hidden"}>
            <Row className='grid grid-cols-1'>
              <Col>
                <FormTeraItem
                  label={t("classroom.name")}
                  name='name'
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={t("form.enter_value", {
                      key: t("classroom.name"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("classroom.code")}
                  name='code'
                  rules={[{ required: t("validate.required") }]}
                >
                  <Input
                    placeholder={isUpdate ? "" : "VD: CLS001, CLS002..."}
                    disabled={isView || isUpdate}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("classroom.course")}
                  name='course_id'
                  rules={[{ required: t("validate.required") }]}
                >
                  <Select
                    options={courses.map((c) => ({
                      value: String(c.id),
                      label: c.code ? `${c.name} (${c.code})` : c.name,
                    }))}
                    placeholder={t("form.enter_value", { key: t("classroom.course") })}
                    disabled={isView || lockedBySessions}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("classroom.lesson_plan")}
                  name='lesson_plan_id'
                >
                  <Select
                    options={lessonPlans.map((lp) => ({
                      value: String(lp.id),
                      label: lp.plan_code
                        ? `${lp.plan_name ?? lp.name} (${lp.plan_code})`
                        : (lp.plan_name ?? lp.name),
                    }))}
                    placeholder={t("form.enter_value", { key: t("classroom.lesson_plan") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("classroom.teacher")} name='teacher_id'>
                  <Select
                    options={teachers.map((tc) => ({
                      value: String(tc.id),
                      label: tc.code ? `${tc.full_name} (${tc.code})` : tc.full_name,
                    }))}
                    placeholder={t("form.enter_value", { key: t("classroom.teacher") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 2: Cấu hình lớp học */}
          <div className={activeTab === "config" ? "block" : "hidden"}>
            <Row className='grid grid-cols-1'>
              <Col>
                <FormTeraItem
                  label={t("classroom.learning_type")}
                  name='learning_type'
                  rules={[{ required: t("validate.required") }]}
                >
                  <Select
                    options={learningTypeOptions}
                    placeholder={t("form.enter_value", { key: t("classroom.learning_type") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("classroom.open_date")}
                  name='start_date'
                  rules={[{ required: t("validate.required") }]}
                >
                  <Controller
                    control={control}
                    name='start_date'
                    render={({ field }) => (
                      <DatePickerTera
                        className='w-full'
                        format='DD/MM/YYYY'
                        placeholder='dd/mm/yyyy'
                        disabled={isView}
                        allowClear
                        value={
                          field.value
                            ? moment(String(field.value), "YYYY-MM-DD")
                            : undefined
                        }
                        onChange={(date: any) =>
                          field.onChange(
                            date ? moment(date).format("YYYY-MM-DD") : "",
                          )
                        }
                      />
                    )}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("classroom.end_date")} name='end_date'>
                  <Controller
                    control={control}
                    name='end_date'
                    render={({ field }) => (
                      <DatePickerTera
                        className='w-full'
                        format='DD/MM/YYYY'
                        placeholder='dd/mm/yyyy'
                        disabled={isView}
                        allowClear
                        disabledDate={(d: any) =>
                          !!startDateValue &&
                          d &&
                          d.isBefore(
                            moment(String(startDateValue), "YYYY-MM-DD"),
                            "day",
                          )
                        }
                        value={
                          field.value
                            ? moment(String(field.value), "YYYY-MM-DD")
                            : undefined
                        }
                        onChange={(date: any) =>
                          field.onChange(
                            date ? moment(date).format("YYYY-MM-DD") : "",
                          )
                        }
                      />
                    )}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("classroom.room")} name='room_id'>
                  <Select
                    options={rooms.map((r) => ({
                      value: String(r.id),
                      label: [
                        r.room_name ?? r.name ?? `#${r.id}`,
                        r.room_code ? ` (${r.room_code})` : "",
                        r.capacity != null ? ` · ${r.capacity} ${t("classroom.seats")}` : "",
                      ].join(""),
                    }))}
                    placeholder={t("form.enter_value", { key: t("classroom.room") })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("classroom.min_warning_capacity")}
                  name='min_warning_capacity'
                >
                  <Input
                    type='number'
                    min={0}
                    onKeyDown={preventNegativeKey}
                    placeholder={t("form.enter_value", {
                      key: t("classroom.min_warning_capacity"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("classroom.min_capacity")}
                  name='min_capacity'
                >
                  <Input
                    type='number'
                    min={0}
                    onKeyDown={preventNegativeKey}
                    placeholder={t("form.enter_value", {
                      key: t("classroom.min_capacity"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("classroom.max_warning_capacity")}
                  name='max_warning_capacity'
                >
                  <Input
                    type='number'
                    min={0}
                    onKeyDown={preventNegativeKey}
                    placeholder={t("form.enter_value", {
                      key: t("classroom.max_warning_capacity"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem
                  label={t("classroom.max_capacity")}
                  name='max_capacity'
                >
                  <Input
                    type='number'
                    min={0}
                    onKeyDown={preventNegativeKey}
                    placeholder={t("form.enter_value", {
                      key: t("classroom.max_capacity"),
                    })}
                    disabled={isView}
                  />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 3: Lịch học */}
          <div className={activeTab === "schedule" ? "block" : "hidden"}>
            {errors.schedules && (
              <p className='text-[13px] text-red-500 mb-3'>
                {errors.schedules.message}
              </p>
            )}
            {scheduleFields.length === 0 && !errors.schedules && (
              <p className='text-[13px] text-gray-400 italic mb-3'>
                {t("classroom.no_schedule")}
              </p>
            )}
            <div className='flex flex-col gap-2'>
              {scheduleFields.map((field, index) => (
                <div
                  key={field.id}
                  className='flex items-end gap-2 rounded-md border border-gray-200 p-2'
                >
                  <div className='flex-1 min-w-0'>
                    <label className='block text-[12px] text-gray-500 mb-1'>
                      {t("classroom.weekday")}
                    </label>
                    <SelectField
                      options={weekdayOptions.map((w) => ({
                        value: String(w.value),
                        label: w.label,
                      }))}
                      placeholder={t("classroom.select_weekday")}
                      disabled={isView}
                      value={String(schedulesValue?.[index]?.weekday ?? "")}
                      onChange={(val) =>
                        setValue(`schedules.${index}.weekday` as const, String(val ?? ""), {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <label className='block text-[12px] text-gray-500 mb-1'>
                      {t("classroom.start_time")}
                    </label>
                    <input
                      type='time'
                      className={TIME_CLASS}
                      disabled={isView}
                      {...register(`schedules.${index}.start_time` as const)}
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <label className='block text-[12px] text-gray-500 mb-1'>
                      {t("classroom.end_time")}
                    </label>
                    <input
                      type='time'
                      className={TIME_CLASS}
                      disabled={isView}
                      {...register(`schedules.${index}.end_time` as const)}
                    />
                  </div>
                  {!isView && (
                    <button
                      type='button'
                      onClick={() => removeSchedule(index)}
                      className='h-9 w-9 shrink-0 flex items-center justify-center rounded-[3px] border border-gray-300 text-red-500 hover:bg-red-50'
                      title={t("button.delete")}
                    >
                      <TrashOutlined className='w-4 h-4' />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {!isView && (
              <button
                type='button'
                onClick={() =>
                  appendSchedule({
                    weekday: "",
                    start_time: "",
                    end_time: "",
                  })
                }
                className='mt-3 inline-flex items-center gap-1.5 rounded-md border border-dashed border-blue-400 px-3 py-1.5 text-[13px] text-blue-600 hover:bg-blue-50'
              >
                <PlusOutlined className='w-4 h-4' />
                {t("classroom.add_schedule")}
              </button>
            )}
          </div>
        </FormTera>
      </div>
    );
  }),
);

export default ClassRoomForm;
