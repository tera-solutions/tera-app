/* Import: library */
import {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useState,
} from "react";
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

/* Import: services */
import { LessonService, TeacherService } from "@tera/modules";

/* Import: pages */
import { ILessonForm } from "pages/education/lesson/_interface";
import LessonAttendanceTab from "./LessonAttendanceTab";
import LessonEvaluationTab from "./LessonEvaluationTab";

const SELECT_CLASS =
  "w-full max-w-full min-w-0 h-9 border border-gray-300 bg-white px-3 text-[13px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer box-border";

const fmtDate = (v?: string) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : "—";
const fmtTime = (v?: string) => (v ? String(v).slice(0, 5) : "—");

// Hàng chỉ-đọc (không qua FormTera) cho các field cố định: lớp/số buổi/ngày/giờ/phòng/trạng thái
const ReadRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="mb-3">
    <label className="block text-[13px] text-gray-600 mb-1">{label}</label>
    <div className="h-9 px-3 flex items-center text-[13px] text-gray-700 bg-gray-100 border border-gray-200 rounded-[3px]">
      {value || "—"}
    </div>
  </div>
);

const defaultValues: ILessonForm = {
  class_room_id: "",
  lesson_no: "",
  lesson_title: "",
  lesson_date: "",
  start_time: "",
  end_time: "",
  teacher_id: "",
  room_id: "",
  objective: "",
  vocabulary: "",
  grammar: "",
  activities: "",
  homework: "",
  lesson_note: "",
  status: "",
};

type LessonFormProps = IFormProps & { onSuccess?: () => void };

/**
 * Form cập nhật / xem chi tiết bài học (KHÔNG có create — bài học sinh qua Generate).
 * Update (partial) chỉ gửi: lesson_title, teacher_id, nội dung giảng dạy, ghi chú.
 * Ngày–giờ + phòng đổi qua "Đổi lịch"; trạng thái theo vòng đời (cancel/lock) → read-only.
 */
const LessonForm = forwardRef<any, LessonFormProps>(
  ({ dataDetail, type = "detail", onSuccess }, ref) => {
    const isView = type === "detail";
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState("basic");

    const { data: teacherData } = TeacherService.useTeacherList({
      params: { page: 1, per_page: 100 },
    });
    const teachers: any[] = useMemo(() => {
      const list = teacherData?.data?.items ?? [];
      const selected = dataDetail?.teacher;
      if (selected?.id && !list.some((tc: any) => tc.id === selected.id)) {
        return [...list, selected];
      }
      return list;
    }, [teacherData, dataDetail]);

    const schema = useMemo(
      // Admin chỉ sửa teacher_id + lesson_note — đều optional, không cần validate.
      () => yup.object({}),
      [t],
    );

    const form = useForm<ILessonForm>({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema) as any,
    });

    const { reset, formState, watch, register } = form;
    const teacherIdValue = watch("teacher_id");

    const { mutate: onUpdate, isPending } = LessonService.useLessonUpdate();

    useEffect(() => {
      if (dataDetail?.id) {
        reset({
          ...defaultValues,
          lesson_title: dataDetail.lesson_title ?? "",
          teacher_id: dataDetail.teacher_id
            ? String(dataDetail.teacher_id)
            : "",
          objective: dataDetail.objective ?? "",
          vocabulary: dataDetail.vocabulary ?? "",
          grammar: dataDetail.grammar ?? "",
          activities: dataDetail.activities ?? "",
          homework: dataDetail.homework ?? "",
          lesson_note: dataDetail.lesson_note ?? "",
        });
      } else {
        reset(defaultValues);
      }
    }, [dataDetail, reset]);

    const handleSubmitForm = (values: ILessonForm) => {
      // Spec VIII — admin CHỈ sửa: teacher_id + lesson_note.
      // (lesson_date/room_id đổi qua reschedule; lesson_title + nội dung giáo án read-only)
      const params = {
        teacher_id: values.teacher_id ? Number(values.teacher_id) : undefined,
        lesson_note: values.lesson_note?.trim() || undefined,
      };
      onUpdate(
        { id: dataDetail?.id, params },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lesson", "list"] });
            queryClient.invalidateQueries({ queryKey: ["lesson", "detail"] });
            notification.success({ message: t("common.update_success") });
            onSuccess?.();
          },
          onError: (error: any) =>
            notification.error({
              message: error?.message || t("common.error_message"),
            }),
        },
      );
    };

    const handleInvalid = () => setActiveTab("basic");

    useImperativeHandle(ref, () => ({
      isValid: () => formState.isValid,
      submit: () => form.handleSubmit(handleSubmitForm, handleInvalid)(),
      isDirty: () => formState.isDirty,
    }));

    const statusLabel = dataDetail?.status
      ? t(`lesson.status_${dataDetail.status}`)
      : "";
    const classLabel = dataDetail?.class?.name
      ? `${dataDetail.class.name}${
          dataDetail.class.code ? ` (${dataDetail.class.code})` : ""
        }`
      : "";
    const roomLabel =
      dataDetail?.room?.room_name ?? dataDetail?.room?.name ?? "";

    const histories: any[] = Array.isArray(dataDetail?.histories)
      ? dataDetail.histories
      : [];

    const hasLesson = !!dataDetail?.id;

    const tabErrors: Record<string, boolean> = {
      basic: false,
      content: false,
      history: false,
    };

    const tabs = [
      { key: "basic", label: t("lesson.tab_basic") },
      ...(hasLesson
        ? [{ key: "attendance", label: t("lesson.tab_attendance") }]
        : []),
      { key: "content", label: t("lesson.tab_content") },
      ...(hasLesson
        ? [{ key: "evaluation", label: t("lesson.tab_evaluation") }]
        : []),
      { key: "history", label: t("lesson.tab_history") },
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
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Col className="sm:col-span-2">
                <ReadRow label={t("lesson.class")} value={classLabel} />
              </Col>
              <Col className="sm:col-span-2">
                <ReadRow
                  label={t("lesson.lesson_title")}
                  value={dataDetail?.lesson_title ?? ""}
                />
              </Col>
              <Col>
                <ReadRow
                  label={t("lesson.lesson_no")}
                  value={
                    dataDetail?.lesson_no != null
                      ? String(dataDetail.lesson_no)
                      : ""
                  }
                />
              </Col>
              <Col>
                <ReadRow label={t("lesson.status")} value={statusLabel} />
              </Col>
              <Col>
                <ReadRow
                  label={t("lesson.lesson_date")}
                  value={fmtDate(dataDetail?.lesson_date)}
                />
              </Col>
              <Col>
                <ReadRow label={t("lesson.room")} value={roomLabel} />
              </Col>
              <Col>
                <ReadRow
                  label={t("lesson.start_time")}
                  value={fmtTime(dataDetail?.start_time)}
                />
              </Col>
              <Col>
                <ReadRow
                  label={t("lesson.end_time")}
                  value={fmtTime(dataDetail?.end_time)}
                />
              </Col>
              <Col className="sm:col-span-2">
                <FormTeraItem label={t("lesson.teacher")} name="teacher_id">
                  <div className="w-full overflow-hidden">
                    <select
                      className={SELECT_CLASS}
                      style={{
                        borderRadius: "3px",
                        color: teacherIdValue ? "#111827" : "#9ca3af",
                      }}
                      disabled={isView}
                      {...register("teacher_id")}
                    >
                      <option value="" disabled hidden>
                        {t("form.enter_value", { key: t("lesson.teacher") })}
                      </option>
                      {teachers.map((tc) => (
                        <option
                          key={tc.id}
                          value={String(tc.id)}
                          style={{ color: "#111827" }}
                        >
                          {tc.full_name ?? tc.name}
                          {tc.code ? ` (${tc.code})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab 2: Nội dung giảng dạy */}
          <div className={activeTab === "content" ? "block" : "hidden"}>
            {/* Nội dung giáo án = snapshot, CHỈ ĐỌC (spec V/VIII). Chỉ "Ghi chú" sửa được. */}
            <p className="text-[12px] text-gray-400 italic mb-3">
              {t("lesson.snapshot_readonly")}
            </p>
            <Row className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Col className="sm:col-span-2">
                <FormTeraItem label={t("lesson.objective")} name="objective">
                  <TextArea rows={2} disabled />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("lesson.vocabulary")} name="vocabulary">
                  <TextArea rows={2} disabled />
                </FormTeraItem>
              </Col>
              <Col>
                <FormTeraItem label={t("lesson.grammar")} name="grammar">
                  <TextArea rows={2} disabled />
                </FormTeraItem>
              </Col>
              <Col className="sm:col-span-2">
                <FormTeraItem label={t("lesson.activities")} name="activities">
                  <TextArea rows={2} disabled />
                </FormTeraItem>
              </Col>
              <Col className="sm:col-span-2">
                <FormTeraItem label={t("lesson.homework")} name="homework">
                  <TextArea rows={2} disabled />
                </FormTeraItem>
              </Col>
              <Col className="sm:col-span-2">
                <FormTeraItem label={t("lesson.note")} name="lesson_note">
                  <TextArea rows={2} disabled={isView} />
                </FormTeraItem>
              </Col>
            </Row>
          </div>

          {/* Tab Điểm danh — chỉ mount khi mở (gọi list attendance) */}
          {hasLesson && activeTab === "attendance" && (
            <div>
              <LessonAttendanceTab lessonId={dataDetail.id} />
            </div>
          )}

          {/* Tab Đánh giá — chỉ mount khi mở (gọi list evaluation) */}
          {hasLesson && activeTab === "evaluation" && (
            <div>
              <LessonEvaluationTab lessonId={dataDetail.id} />
            </div>
          )}

          {/* Tab Lịch sử (audit log) */}
          <div className={activeTab === "history" ? "block" : "hidden"}>
            {histories.length === 0 ? (
              <p className="text-[13px] text-gray-400 italic py-2">
                {t("lesson.no_history")}
              </p>
            ) : (
              <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded">
                {histories.map((h: any, idx: number) => (
                  <div key={h.id ?? idx} className="flex flex-col gap-0.5 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-medium text-gray-800">
                        {h.action_label ??
                          (h.action
                            ? t(`lesson.audit_${h.action}`, {
                                defaultValue: h.action,
                              })
                            : "—")}
                      </span>
                      <span className="text-[12px] text-gray-400 shrink-0">
                        {h.created_at
                          ? new Date(h.created_at).toLocaleString("vi-VN")
                          : ""}
                      </span>
                    </div>
                    {h.reason && (
                      <span className="text-[12px] text-gray-500">
                        {t("common.reason")}: {h.reason}
                      </span>
                    )}
                    {(h.created_by_name || h.created_by) && (
                      <span className="text-[12px] text-gray-400">
                        {h.created_by_name ?? `#${h.created_by}`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormTera>
      </div>
    );
  },
);

export default LessonForm;
