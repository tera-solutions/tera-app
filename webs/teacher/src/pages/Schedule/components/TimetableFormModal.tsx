import { useMemo, useState } from "react";
import { notification, PlusOutlined, Select, TrashOutlined } from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";
import { RoomService, TimetableService } from "@tera/modules/education";
import { TeacherService } from "@tera/modules/hr";

import ClassroomSelect from "_common/components/ClassroomSelect";
import CourseSelect from "_common/components/CourseSelect";
import { WEEKDAY_LABEL } from "pages/Classroom/_utils";

const inputBaseClass =
  "rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none";
const inputClass = `w-full ${inputBaseClass}`;
const labelClass = "mb-1 block text-xs font-medium text-slate-500";

interface RuleRow {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface DateRow {
  date: string;
  start_time: string;
  end_time: string;
}

const emptyRule: RuleRow = { day_of_week: 1, start_time: "18:00", end_time: "19:30" };
const emptyDate: DateRow = { date: "", start_time: "18:00", end_time: "19:30" };

interface Props {
  open: boolean;
  onClose: () => void;
}

const empty = {
  name: "",
  course_id: "" as number | "",
  class_room_id: "" as number | "",
  teacher_id: "" as number | "",
  room_id: "" as number | "",
  start_date: "",
  end_date: "",
};

/** Creates a Timetable — schedule rules/dates + capacity/conflict checks are
 * validated server-side (BR-01/02/03), generating the class sessions. */
const TimetableFormModal = ({ open, onClose }: Props) => {
  const [form, setForm] = useState(empty);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));
  const [pattern, setPattern] = useState<"fixed_weekly" | "specific_dates">("fixed_weekly");
  const [rules, setRules] = useState<RuleRow[]>([{ ...emptyRule }]);
  const [dates, setDates] = useState<DateRow[]>([{ ...emptyDate }]);

  const teachersQuery = TeacherService.useTeacherList({ params: { per_page: 100 } });
  const teacherOptions = useMemo(
    () => (teachersQuery.data?.data?.items ?? []).map((t: any) => ({ value: t.id, label: t.full_name })),
    [teachersQuery.data],
  );
  const roomsQuery = RoomService.useRoomList({ params: { per_page: 100 } });
  const roomOptions = useMemo(
    () => (roomsQuery.data?.data?.items ?? []).map((r: any) => ({ value: r.id, label: r.room_name })),
    [roomsQuery.data],
  );

  const { mutate: create, isPending } = TimetableService.useTimetableCreate();

  const resetAll = () => {
    setForm(empty);
    setPattern("fixed_weekly");
    setRules([{ ...emptyRule }]);
    setDates([{ ...emptyDate }]);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const addRule = () => setRules((prev) => [...prev, { ...emptyRule }]);
  const removeRule = (index: number) => setRules((prev) => prev.filter((_, i) => i !== index));
  const updateRule = (index: number, patch: Partial<RuleRow>) =>
    setRules((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));

  const addDate = () => setDates((prev) => [...prev, { ...emptyDate }]);
  const removeDate = (index: number) => setDates((prev) => prev.filter((_, i) => i !== index));
  const updateDate = (index: number, patch: Partial<DateRow>) =>
    setDates((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));

  const handleSubmit = () => {
    if (!form.name.trim()) {
      notification.warning({ message: "Vui lòng nhập tên thời khóa biểu" });
      return;
    }
    if (!form.class_room_id) {
      notification.warning({ message: "Vui lòng chọn lớp học" });
      return;
    }
    if (!form.start_date || !form.end_date) {
      notification.warning({ message: "Vui lòng chọn ngày bắt đầu và kết thúc" });
      return;
    }
    if (pattern === "fixed_weekly") {
      const invalid = rules.some((r) => !r.start_time || !r.end_time || r.end_time <= r.start_time);
      if (rules.length === 0 || invalid) {
        notification.warning({ message: "Giờ kết thúc phải sau giờ bắt đầu ở mỗi lịch học" });
        return;
      }
    } else {
      const invalid = dates.some((d) => !d.date || !d.start_time || !d.end_time || d.end_time <= d.start_time);
      if (dates.length === 0 || invalid) {
        notification.warning({ message: "Vui lòng nhập đủ ngày/giờ hợp lệ cho mỗi buổi học" });
        return;
      }
    }

    create(
      {
        params: {
          name: form.name.trim(),
          course_id: form.course_id || undefined,
          class_room_id: Number(form.class_room_id),
          teacher_id: form.teacher_id || undefined,
          room_id: form.room_id || undefined,
          start_date: form.start_date,
          end_date: form.end_date,
          schedule_pattern: pattern,
          rules: pattern === "fixed_weekly" ? rules : undefined,
          dates: pattern === "specific_dates" ? dates : undefined,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Đã tạo thời khóa biểu" });
          handleClose();
        },
        onError: (error: any) =>
          notification.error({
            message: error?.data?.msg ?? error?.message ?? "Không thể tạo thời khóa biểu",
          }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={handleClose}
      isEdit={false}
      titleCreate="Tạo thời khóa biểu"
      titleEdit="Tạo thời khóa biểu"
      className="!w-[95%] xmd:!w-[600px]"
      onOk={handleSubmit}
      confirmLoading={isPending}
    >
      <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
        <div>
          <label className={labelClass}>Tên thời khóa biểu *</label>
          <input className={inputClass} value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Khóa học</label>
            <CourseSelect
              value={form.course_id || undefined}
              onChange={(v) => set({ course_id: v != null ? Number(v) : "" })}
              allowClear
              className={inputBaseClass}
            />
          </div>
          <div>
            <label className={labelClass}>Lớp học *</label>
            <ClassroomSelect
              value={form.class_room_id || undefined}
              onChange={(v) => set({ class_room_id: v != null ? Number(v) : "" })}
              courseId={form.course_id || undefined}
              className={inputBaseClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Giáo viên</label>
            <Select
              value={form.teacher_id || undefined}
              onChange={(v: any) => set({ teacher_id: v != null ? Number(v) : "" })}
              options={teacherOptions}
              loading={teachersQuery.isLoading}
              allowClear
              placeholder="Chọn giáo viên"
            />
          </div>
          <div>
            <label className={labelClass}>Phòng học</label>
            <Select
              value={form.room_id || undefined}
              onChange={(v: any) => set({ room_id: v != null ? Number(v) : "" })}
              options={roomOptions}
              loading={roomsQuery.isLoading}
              allowClear
              placeholder="Chọn phòng học"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Ngày bắt đầu *</label>
            <input
              type="date"
              className={inputClass}
              value={form.start_date}
              onChange={(e) => set({ start_date: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Ngày kết thúc *</label>
            <input
              type="date"
              className={inputClass}
              value={form.end_date}
              onChange={(e) => set({ end_date: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Cấu hình lịch học</label>
          <div className="mb-2 flex gap-2">
            <button
              type="button"
              onClick={() => setPattern("fixed_weekly")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                pattern === "fixed_weekly" ? "bg-brand text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              Cố định theo tuần
            </button>
            <button
              type="button"
              onClick={() => setPattern("specific_dates")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                pattern === "specific_dates" ? "bg-brand text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              Theo ngày cụ thể
            </button>
          </div>

          {pattern === "fixed_weekly" ? (
            <div className="flex flex-col gap-2">
              {rules.map((row, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    className={`${inputBaseClass} w-28 shrink-0`}
                    value={row.day_of_week}
                    onChange={(e) => updateRule(index, { day_of_week: Number(e.target.value) })}
                  >
                    {Object.entries(WEEKDAY_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    className={`${inputBaseClass} min-w-0 flex-1`}
                    value={row.start_time}
                    onChange={(e) => updateRule(index, { start_time: e.target.value })}
                  />
                  <span className="shrink-0 text-slate-400">—</span>
                  <input
                    type="time"
                    className={`${inputBaseClass} min-w-0 flex-1`}
                    value={row.end_time}
                    onChange={(e) => updateRule(index, { end_time: e.target.value })}
                  />
                  <button
                    type="button"
                    title="Xóa lịch học"
                    onClick={() => removeRule(index)}
                    disabled={rules.length === 1}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:text-slate-200 disabled:hover:bg-transparent [&_svg]:h-4 [&_svg]:w-4"
                  >
                    <TrashOutlined />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRule}
                className="flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-brand hover:bg-sky-50 [&_svg]:h-3.5 [&_svg]:w-3.5"
              >
                <PlusOutlined />
                Thêm lịch học
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {dates.map((row, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="date"
                    className={`${inputBaseClass} min-w-0 flex-1`}
                    value={row.date}
                    onChange={(e) => updateDate(index, { date: e.target.value })}
                  />
                  <input
                    type="time"
                    className={`${inputBaseClass} min-w-0 flex-1`}
                    value={row.start_time}
                    onChange={(e) => updateDate(index, { start_time: e.target.value })}
                  />
                  <span className="shrink-0 text-slate-400">—</span>
                  <input
                    type="time"
                    className={`${inputBaseClass} min-w-0 flex-1`}
                    value={row.end_time}
                    onChange={(e) => updateDate(index, { end_time: e.target.value })}
                  />
                  <button
                    type="button"
                    title="Xóa buổi học"
                    onClick={() => removeDate(index)}
                    disabled={dates.length === 1}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:text-slate-200 disabled:hover:bg-transparent [&_svg]:h-4 [&_svg]:w-4"
                  >
                    <TrashOutlined />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addDate}
                className="flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-brand hover:bg-sky-50 [&_svg]:h-3.5 [&_svg]:w-3.5"
              >
                <PlusOutlined />
                Thêm buổi học
              </button>
            </div>
          )}
        </div>
      </div>
    </FormScaff>
  );
};

export default TimetableFormModal;
