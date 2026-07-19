import { useEffect, useState } from "react";
import moment from "moment";
import { Button, notification, Select, TextArea } from "tera-dls";

import Card from "_common/components/Card";
import ClassroomSelect from "_common/components/ClassroomSelect";
import LessonSelect from "_common/components/LessonSelect";
import StudentSelect from "_common/components/StudentSelect";
import useCurrentTeacher from "_common/hooks/useCurrentTeacher";
import { useMeta } from "_common/hooks/useMeta";
import { LeaveRequestService, LessonService } from "@tera/modules/education";

import type { LeaveReasonType, LeaveRequestType } from "../_interface";

const REASON_MAX = 500;

type FieldError = Partial<Record<"requester" | "lesson" | "reasonType" | "reason", string>>;
const ERR_TEXT = "mt-1 text-xs text-rose-500";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-1.5 block text-sm font-medium text-slate-600">
    {children} <span className="text-rose-500">*</span>
  </label>
);

const PaperPlane = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path
      d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Form "Tạo đơn xin nghỉ" — gắn với MỘT buổi học cụ thể (`v1/edu/leave/create`).
 * `leave_date` PHẢI khớp `lesson.lesson_date` (BE guard) → tự lấy từ buổi học đã
 * chọn thay vì cho người dùng nhập tay, tránh lỗi lệch ngày.
 */
const CreateLeaveForm = () => {
  const { teacherId } = useCurrentTeacher();
  const { getOptions } = useMeta();

  const [requestType, setRequestType] = useState<LeaveRequestType>("student_leave");
  const [studentId, setStudentId] = useState<number | string | undefined>(undefined);
  const [classRoomId, setClassRoomId] = useState<number | string | undefined>(undefined);
  const [lessonId, setLessonId] = useState<number | string | undefined>(undefined);
  const [reasonType, setReasonType] = useState<LeaveReasonType | "">("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<FieldError>({});

  const lessonDetailQuery = LessonService.useLessonDetail(
    { id: lessonId ?? "" },
    { enabled: !!lessonId },
  );
  // LessonController::detail() trả về { data: { lesson: {...} } } — buổi học nằm
  // trong key `lesson`, không phải phẳng ở `data` (đây mới là nguyên nhân chính
  // khiến lessonDate luôn null dù đã chọn buổi học).
  const lessonDate: string | null = lessonDetailQuery.data?.data?.lesson?.lesson_date ?? null;
  // BE serialize field `date` sang ISO UTC (vd "2026-07-18T17:00:00Z" cho ngày
  // 19/07 giờ VN, app.timezone=Asia/Ho_Chi_Minh) — PHẢI parse theo giờ local (không
  // dùng .utc()) rồi lấy Y-m-d mới ra đúng ngày, khớp với CreateLeaveRequestRequest
  // kỳ vọng "leave_date (Y-m-d)" và LeaveRequestService::assertLessonBookable so
  // sánh bằng Carbon::parse(...)->toDateString() (BR002).
  const leaveDateYmd: string | null = lessonDate ? moment(lessonDate).format("YYYY-MM-DD") : null;

  // Đổi loại đơn thì bỏ lựa chọn cũ không còn phù hợp.
  useEffect(() => {
    setStudentId(undefined);
    setLessonId(undefined);
    setClassRoomId(undefined);
    setErrors({});
  }, [requestType]);

  const requesterId = requestType === "teacher_leave" ? teacherId ?? undefined : studentId;

  const { mutate: createLeave, isPending } = LeaveRequestService.useLeaveRequestCreate();

  const reset = () => {
    setStudentId(undefined);
    setClassRoomId(undefined);
    setLessonId(undefined);
    setReasonType("");
    setReason("");
    setErrors({});
  };

  const validate = (): FieldError => {
    const e: FieldError = {};
    if (!requesterId) e.requester = requestType === "student_leave" ? "Vui lòng chọn học viên." : "Không xác định được hồ sơ giáo viên.";
    if (!lessonId) {
      e.lesson = "Vui lòng chọn buổi học xin nghỉ.";
    } else if (!leaveDateYmd) {
      // lessonId đã chọn nhưng useLessonDetail (async, kích hoạt SAU khi chọn) chưa
      // trả về kịp — đây KHÔNG phải lỗi "chưa chọn", tránh báo nhầm message đó.
      e.lesson = "Đang tải thông tin buổi học, vui lòng thử lại sau giây lát.";
    }
    if (!reasonType) e.reasonType = "Vui lòng chọn loại lý do.";
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    createLeave(
      {
        params: {
          request_type: requestType,
          requester_id: requesterId,
          class_room_id: classRoomId,
          lesson_id: lessonId,
          leave_date: leaveDateYmd,
          reason_type: reasonType,
          reason: reason.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Đã gửi đơn xin nghỉ" });
          reset();
        },
        onError: (error: any) =>
          notification.error({ message: error?.data?.msg ?? "Không thể gửi đơn xin nghỉ" }),
      },
    );
  };

  return (
    <Card animated={false} className="xmd:p-5">
      <div className="mb-4 flex items-center gap-2 text-slate-800">
        <span className="text-brand">
          <PaperPlane />
        </span>
        <h2 className="text-base font-semibold">Tạo đơn xin nghỉ</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <Label>Loại đơn</Label>
          <Select
            className="h-11 w-full"
            value={requestType}
            onChange={(v: string) => setRequestType(v as LeaveRequestType)}
            options={getOptions("leave_request_type")}
          />
        </div>

        {requestType === "student_leave" && (
          <div>
            <Label>Học viên</Label>
            <StudentSelect value={studentId} onChange={setStudentId} className="h-11 w-full" />
            {errors.requester && <p className={ERR_TEXT}>{errors.requester}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Lớp học (thu hẹp danh sách buổi học)</Label>
            <ClassroomSelect
              value={classRoomId}
              onChange={setClassRoomId}
              allowClear
              className="h-11 w-full"
              placeholder="Tất cả lớp"
            />
          </div>
          <div>
            <Label>Buổi học xin nghỉ</Label>
            <LessonSelect
              value={lessonId}
              onChange={setLessonId}
              classRoomId={classRoomId}
              allowClear
              className="h-11 w-full"
            />
            {errors.lesson && <p className={ERR_TEXT}>{errors.lesson}</p>}
            {lessonId && leaveDateYmd && (
              <p className="mt-1 text-xs text-slate-400">
                Ngày nghỉ: {moment(leaveDateYmd).format("DD/MM/YYYY")}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Loại lý do</Label>
          <Select
            className="h-11 w-full"
            value={reasonType || undefined}
            placeholder="Chọn loại lý do"
            options={getOptions("leave_reason_type")}
            onChange={(v: string) => setReasonType(v as LeaveReasonType)}
          />
          {errors.reasonType && <p className={ERR_TEXT}>{errors.reasonType}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-600">Mô tả lý do (tùy chọn)</label>
          <div className="relative">
            <TextArea
              value={reason}
              maxLength={REASON_MAX}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập mô tả chi tiết..."
              rows={3}
              className="w-full resize-none rounded-xl"
            />
            <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-slate-300">
              {reason.length}/{REASON_MAX}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-1">
          <Button outlined onClick={reset} disabled={isPending}>
            Hủy
          </Button>
          <Button
            onClick={submit}
            disabled={isPending || (!!lessonId && lessonDetailQuery.isLoading)}
            className="gap-1.5"
          >
            <PaperPlane />
            Gửi đơn xin nghỉ
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CreateLeaveForm;
