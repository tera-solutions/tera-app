import { useEffect, useMemo, useState } from "react";
import { Checkbox, DatePicker, Input, InputNumber, notification, Select } from "tera-dls";
import moment from "moment";

import { ClassRoomService, CourseService, LessonPlanService, RoomService } from "@tera/modules/education";
import FormScaff from "@tera/components/dof/FormScaff";

import AvatarUpload from "_common/components/AvatarUpload";
import FieldLabel from "_common/components/FieldLabel";
import useCurrentTeacher from "_common/hooks/useCurrentTeacher";

import type { Classroom } from "../_interface";

const DATE_FORMAT = "YYYY-MM-DD";

const LEARNING_TYPES = [
  { value: "scheduled", label: "Theo lịch cố định" },
  { value: "self_learning", label: "Tự học" },
  { value: "flexible", label: "Linh hoạt" },
];

interface Props {
  open: boolean;
  classroom: Classroom | null;
  onClose: () => void;
}

const empty = {
  name: "",
  code: "",
  course_id: "" as number | "",
  use_course_curriculum: false,
  lesson_plan_ids: [] as number[],
  learning_type: "scheduled",
  start_date: "",
  end_date: "",
  room_id: "" as number | "",
  avatar: "",
  min_warning_capacity: "",
  min_capacity: "",
  max_warning_capacity: "",
  max_capacity: "20",
};

/** Creates or edits the class itself only — its schedule is a separate Timetable,
 * created afterwards from the "Lịch dạy" page (timetable-management.md). */
const ClassFormModal = ({ open, classroom, onClose }: Props) => {
  const isEdit = !!classroom;
  const { mutate: create, isPending: creating } = ClassRoomService.useClassRoomCreate();
  const { mutate: update, isPending: updating } = ClassRoomService.useClassRoomUpdate();
  const { teacherId } = useCurrentTeacher();

  const coursesQuery = CourseService.useCourseList({ params: { per_page: 100 } });
  const courses = useMemo(() => coursesQuery.data?.data?.items ?? [], [coursesQuery.data]);

  const roomsQuery = RoomService.useRoomList({ params: { per_page: 100 } });
  const rooms = useMemo(() => roomsQuery.data?.data?.items ?? [], [roomsQuery.data]);

  const [form, setForm] = useState(empty);
  // Chỉ giáo án đã xuất bản mới sinh được Lesson khi tạo Timetable (lesson.md §7).
  const lessonPlansQuery = LessonPlanService.useLessonPlanList({
    params: {
      per_page: 100,
      filters: { status: "published", course_id: form.course_id || undefined },
    },
  });
  const lessonPlans = useMemo(
    () => lessonPlansQuery.data?.data?.items ?? [],
    [lessonPlansQuery.data],
  );
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!open) return;
    if (classroom) {
      setForm({
        name: classroom.name ?? "",
        code: "",
        course_id: classroom.course_id ?? "",
        use_course_curriculum: false,
        lesson_plan_ids: classroom.lesson_plans.length
          ? classroom.lesson_plans.map((p) => p.id)
          : classroom.lesson_plan_id
            ? [classroom.lesson_plan_id]
            : [],
        learning_type: "scheduled",
        start_date: "",
        end_date: classroom.end_date ?? "",
        room_id: classroom.room_id ?? "",
        avatar: classroom.cover_image ?? "",
        min_warning_capacity:
          classroom.min_warning_capacity != null ? String(classroom.min_warning_capacity) : "",
        min_capacity: classroom.min_capacity != null ? String(classroom.min_capacity) : "",
        max_warning_capacity:
          classroom.max_warning_capacity != null ? String(classroom.max_warning_capacity) : "",
        max_capacity: String(classroom.max_students ?? 20),
      });
    } else {
      setForm(empty);
    }
  }, [open, classroom]);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      notification.warning({ message: "Vui lòng nhập tên lớp" });
      return;
    }
    const capacityParams = {
      min_warning_capacity: form.min_warning_capacity ? Number(form.min_warning_capacity) : undefined,
      min_capacity: form.min_capacity ? Number(form.min_capacity) : undefined,
      max_warning_capacity: form.max_warning_capacity ? Number(form.max_warning_capacity) : undefined,
      max_capacity: Number(form.max_capacity || 1),
    };
    const done = {
      onSuccess: () => {
        notification.success({
          message: isEdit
            ? "Đã cập nhật lớp"
            : "Đã tạo lớp. Vào Lịch dạy để tạo thời khóa biểu cho lớp này.",
        });
        onClose();
      },
      onError: (e: any) =>
        notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể lưu lớp" }),
    };

    if (isEdit && classroom) {
      update(
        {
          id: classroom.id,
          params: {
            name: form.name.trim(),
            avatar: form.avatar || undefined,
            lesson_plan_id: form.lesson_plan_ids[0] ?? undefined,
            lesson_plan_ids: form.lesson_plan_ids,
            room_id: form.room_id ? Number(form.room_id) : undefined,
            end_date: form.end_date || undefined,
            ...capacityParams,
          },
        },
        done,
      );
    } else {
      if (!form.code.trim() || !form.course_id || !form.start_date) {
        notification.warning({ message: "Nhập mã lớp, khóa học và ngày bắt đầu" });
        return;
      }
      create(
        {
          params: {
            name: form.name.trim(),
            code: form.code.trim(),
            course_id: Number(form.course_id),
            use_course_curriculum: form.use_course_curriculum,
            lesson_plan_id: form.lesson_plan_ids[0] ?? undefined,
            lesson_plan_ids: form.lesson_plan_ids,
            learning_type: form.learning_type,
            start_date: form.start_date,
            end_date: form.end_date || undefined,
            room_id: form.room_id ? Number(form.room_id) : undefined,
            avatar: form.avatar || undefined,
            teacher_id: teacherId ?? undefined,
            ...capacityParams,
          },
        },
        done,
      );
    }
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={isEdit}
      titleCreate="Tạo lớp học"
      titleEdit="Sửa lớp học"
      className="!w-[95%] xmd:!w-[520px]"
      confirmLoading={creating || updating}
      onOk={handleSubmit}
    >
      <div className="space-y-3">
        <div className="flex justify-center">
          <AvatarUpload
            src={form.avatar}
            alt={form.name}
            onUploaded={(url) => set({ avatar: url })}
          />
        </div>
        <div>
          <FieldLabel required>Tên lớp</FieldLabel>
          <Input value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        {!isEdit && (
          <>
            <div>
              <FieldLabel required>Mã lớp</FieldLabel>
              <Input value={form.code} onChange={(e) => set({ code: e.target.value })} />
            </div>
            <div>
              <FieldLabel required>Khóa học</FieldLabel>
              <Select
                value={form.course_id}
                placeholder="— Chọn khóa học —"
                options={courses.map((c: any) => ({ value: c.id, label: c.name }))}
                onChange={(v) =>
                  set({
                    course_id: v != null ? Number(v) : "",
                    use_course_curriculum: v != null ? form.use_course_curriculum : false,
                  })
                }
              />
              {!!form.course_id && (
                <div className="mt-2">
                  <Checkbox
                    checked={form.use_course_curriculum}
                    onChange={(e) => set({ use_course_curriculum: e.target.checked })}
                  >
                    <p className="block text-xs font-medium text-slate-500">Sao chép chương trình học từ khóa học vào lớp này</p>
                  </Checkbox>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Hình thức</FieldLabel>
                <Select
                  value={form.learning_type}
                  options={LEARNING_TYPES}
                  onChange={(v) => set({ learning_type: v as string })}
                />
              </div>
              <div>
                <FieldLabel required>Ngày bắt đầu</FieldLabel>
                <DatePicker
                  className="w-full"
                  format={DATE_FORMAT}
                  value={form.start_date ? moment(form.start_date, DATE_FORMAT) : undefined}
                  onChange={(v: any) => set({ start_date: v ? moment(v).format(DATE_FORMAT) : "" })}
                />
              </div>
            </div>
          </>
        )}
        <div>
          <FieldLabel>Giáo án</FieldLabel>
          <Select
            mode="multiple"
            value={form.lesson_plan_ids}
            placeholder="— Chưa gắn giáo án —"
            options={lessonPlans.map((lp: any) => ({
              value: lp.id,
              label: `${lp.plan_name ?? lp.name}${lp.plan_code ? ` (${lp.plan_code})` : ""}`,
            }))}
            onChange={(v: any) => set({ lesson_plan_ids: (v ?? []).map(Number) })}
          />
          <p className="mt-1 text-xs text-slate-400">
            Có thể gắn nhiều giáo án — giáo viên sẽ chọn 1 trong số này khi bắt đầu từng buổi học.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Phòng học</FieldLabel>
            <Select
              value={form.room_id}
              placeholder="— Chưa chọn phòng —"
              options={rooms.map((r: any) => ({ value: r.id, label: r.room_name ?? r.name }))}
              onChange={(v) => set({ room_id: v != null ? Number(v) : "" })}
            />
          </div>
          <div>
            <FieldLabel>Ngày kết thúc</FieldLabel>
            <DatePicker
              className="w-full"
              format={DATE_FORMAT}
              value={form.end_date ? moment(form.end_date, DATE_FORMAT) : undefined}
              onChange={(v: any) => set({ end_date: v ? moment(v).format(DATE_FORMAT) : "" })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Sĩ số cảnh báo tối thiểu</FieldLabel>
            <InputNumber
              min={0}
              className="w-full"
              value={form.min_warning_capacity ? Number(form.min_warning_capacity) : undefined}
              onChange={(v) => set({ min_warning_capacity: v == null ? "" : String(v) })}
            />
          </div>
          <div>
            <FieldLabel>Sĩ số tối thiểu</FieldLabel>
            <InputNumber
              min={0}
              className="w-full"
              value={form.min_capacity ? Number(form.min_capacity) : undefined}
              onChange={(v) => set({ min_capacity: v == null ? "" : String(v) })}
            />
          </div>
          <div>
            <FieldLabel>Sĩ số cảnh báo tối đa</FieldLabel>
            <InputNumber
              min={0}
              className="w-full"
              value={form.max_warning_capacity ? Number(form.max_warning_capacity) : undefined}
              onChange={(v) => set({ max_warning_capacity: v == null ? "" : String(v) })}
            />
          </div>
          <div>
            <FieldLabel required>Sĩ số tối đa</FieldLabel>
            <InputNumber
              min={1}
              className="w-full"
              value={form.max_capacity ? Number(form.max_capacity) : undefined}
              onChange={(v) => set({ max_capacity: v == null ? "" : String(v) })}
            />
          </div>
        </div>
      </div>
    </FormScaff>
  );
};

export default ClassFormModal;
