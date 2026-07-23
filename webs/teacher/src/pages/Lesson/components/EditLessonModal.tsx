import { useEffect, useMemo, useState } from "react";
import { notification, Select, TextArea } from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";
import FieldLabel from "_common/components/FieldLabel";
import { LessonService } from "@tera/modules/education";
import { TeacherService } from "@tera/modules/hr";

import type { LessonDetail } from "../_interface";

// Backend only accepts these 3 plain-progression statuses via update — cancel/
// lock/unlock go through their own dedicated endpoints (lesson.md §8).
const STATUS_OPTIONS = [
  { value: "scheduled", label: "Đã lên lịch" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "in_progress", label: "Đang diễn ra" },
];

interface EditLessonModalProps {
  open: boolean;
  lesson: LessonDetail | null;
  onClose: () => void;
}

const EditLessonModal = ({ open, lesson, onClose }: EditLessonModalProps) => {
  const [teacherId, setTeacherId] = useState<number | "">("");
  const [status, setStatus] = useState("scheduled");
  const [note, setNote] = useState("");

  const teachersQuery = TeacherService.useTeacherList({ params: { per_page: 100 } });
  const teacherOptions = useMemo(
    () =>
      (teachersQuery.data?.data?.items ?? []).map((t: any) => ({
        value: t.id,
        label: t.full_name,
      })),
    [teachersQuery.data],
  );

  useEffect(() => {
    if (!open || !lesson) return;
    setTeacherId(lesson.teacher_id ?? "");
    setStatus(STATUS_OPTIONS.some((o) => o.value === lesson.status) ? lesson.status : "scheduled");
    setNote(lesson.lesson_note ?? "");
  }, [open, lesson]);

  const { mutate: update, isPending } = LessonService.useLessonUpdate();

  const handleSubmit = () => {
    if (!lesson) return;
    update(
      {
        id: lesson.id,
        params: {
          teacher_id: teacherId === "" ? null : Number(teacherId),
          status,
          lesson_note: note.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Đã cập nhật bài học" });
          onClose();
        },
        onError: (error: any) =>
          notification.error({ message: error?.data?.msg ?? "Không thể cập nhật bài học" }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit
      titleCreate="Chỉnh sửa bài học"
      titleEdit="Chỉnh sửa bài học"
      className="!w-[95%] xmd:!w-[460px]"
      okText="Lưu"
      onOk={handleSubmit}
      confirmLoading={isPending}
    >
      <div className="space-y-3">
        <div>
          <FieldLabel>Giáo viên</FieldLabel>
          <Select
            value={teacherId}
            placeholder="Chọn giáo viên"
            allowClear
            options={teacherOptions}
            onChange={(v: any) => setTeacherId(v != null ? Number(v) : "")}
          />
        </div>
        <div>
          <FieldLabel required>Trạng thái</FieldLabel>
          <Select value={status} options={STATUS_OPTIONS} onChange={(v: any) => setStatus(v)} />
        </div>
        <div>
          <FieldLabel>Ghi chú bài học</FieldLabel>
          <TextArea rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>
    </FormScaff>
  );
};

export default EditLessonModal;
