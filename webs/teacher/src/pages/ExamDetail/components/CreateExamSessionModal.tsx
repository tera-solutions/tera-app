import { useEffect, useMemo, useState } from "react";
import { DatePicker, notification, Select, TimePicker } from "tera-dls";
import moment from "moment";

import FormScaff from "@tera/components/dof/FormScaff";
import FieldLabel from "_common/components/FieldLabel";
import { ClassRoomService, ClassSessionService, ExamSessionService, RoomService } from "@tera/modules/education";
import { TeacherService } from "@tera/modules/hr";

const DATE_FORMAT = "YYYY-MM-DD";

interface Props {
  open: boolean;
  examId: number | null;
  onClose: () => void;
  onCreated?: (sessionId: number) => void;
}

const empty = {
  class_room_id: "" as number | "",
  class_session_id: "" as number | "",
  room_id: "" as number | "",
  teacher_id: "" as number | "",
  exam_date: "",
  start_time: "",
  end_time: "",
};

/** Schedules a new sitting for an exam bank and, when a class is picked,
 * auto-seats every active student of that class (exam.md §VIII/§IX). */
const CreateExamSessionModal = ({ open, examId, onClose, onCreated }: Props) => {
  const [form, setForm] = useState(empty);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const { mutate: createSession, isPending: creating } = ExamSessionService.useExamSessionCreate();
  const { mutate: registerByClass, isPending: registering } = ExamSessionService.useExamSessionRegisterByClass();

  const classesQuery = ClassRoomService.useClassRoomList({ params: { per_page: 100 } });
  const classes = useMemo(() => classesQuery.data?.data?.items ?? [], [classesQuery.data]);

  const classSessionsQuery = ClassSessionService.useClassSessionList(
    { params: { per_page: 100, filters: { class_id: form.class_room_id || undefined } } },
    { enabled: !!form.class_room_id },
  );
  const classSessions = useMemo(
    () => classSessionsQuery.data?.data?.items ?? [],
    [classSessionsQuery.data],
  );

  const roomsQuery = RoomService.useRoomList({ params: { per_page: 100 } });
  const rooms = useMemo(() => roomsQuery.data?.data?.items ?? [], [roomsQuery.data]);

  const teachersQuery = TeacherService.useTeacherList({ params: { per_page: 100 } });
  const teachers = useMemo(() => teachersQuery.data?.data?.items ?? [], [teachersQuery.data]);

  useEffect(() => {
    if (open) setForm(empty);
  }, [open]);

  const handleSubmit = () => {
    if (!examId) return;
    if (!form.exam_date || !form.start_time || !form.end_time) {
      notification.warning({ message: "Vui lòng chọn ngày thi, giờ bắt đầu và giờ kết thúc" });
      return;
    }

    createSession(
      {
        params: {
          exam_id: examId,
          class_room_id: form.class_room_id || undefined,
          class_session_id: form.class_session_id || undefined,
          room_id: form.room_id || undefined,
          teacher_id: form.teacher_id || undefined,
          exam_date: form.exam_date,
          start_time: form.start_time,
          end_time: form.end_time,
        },
      },
      {
        onSuccess: (res: any) => {
          const sessionId = res?.data?.id;
          if (form.class_room_id && sessionId) {
            registerByClass(
              { id: sessionId, params: { class_room_id: Number(form.class_room_id) } },
              {
                onSuccess: () => {
                  notification.success({ message: "Đã lên lịch thi và đăng ký học viên trong lớp" });
                  onCreated?.(sessionId);
                  onClose();
                },
                onError: () => {
                  notification.warning({
                    message: "Đã lên lịch thi nhưng không đăng ký được học viên, hãy đăng ký thủ công",
                  });
                  onCreated?.(sessionId);
                  onClose();
                },
              },
            );
          } else {
            notification.success({ message: "Đã lên lịch thi" });
            if (sessionId) onCreated?.(sessionId);
            onClose();
          }
        },
        onError: (e: any) =>
          notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể lên lịch thi" }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={false}
      titleCreate="Lên lịch thi"
      titleEdit="Lên lịch thi"
      className="!w-[95%] xmd:!w-[480px]"
      confirmLoading={creating || registering}
      onOk={handleSubmit}
    >
      <div className="space-y-3">
        <div>
          <FieldLabel>Lớp học (tự động đăng ký học viên)</FieldLabel>
          <Select
            value={form.class_room_id}
            placeholder="— Không gắn lớp —"
            options={classes.map((c: any) => ({ value: c.id, label: c.name }))}
            onChange={(v) => set({ class_room_id: v != null ? Number(v) : "", class_session_id: "" })}
          />
        </div>
        {!!form.class_room_id && (
          <div>
            <FieldLabel>Buổi học</FieldLabel>
            <Select
              value={form.class_session_id}
              placeholder="— Không gắn buổi học cụ thể —"
              loading={classSessionsQuery.isLoading}
              options={classSessions.map((s: any) => ({
                value: s.id,
                label: `Buổi ${s.session_no ?? ""} — ${s.session_date ?? ""}`.trim(),
              }))}
              onChange={(v) => set({ class_session_id: v != null ? Number(v) : "" })}
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Phòng thi</FieldLabel>
            <Select
              value={form.room_id}
              placeholder="— Chưa chọn phòng —"
              options={rooms.map((r: any) => ({ value: r.id, label: r.room_name ?? r.name }))}
              onChange={(v) => set({ room_id: v != null ? Number(v) : "" })}
            />
          </div>
          <div>
            <FieldLabel>Giám thị</FieldLabel>
            <Select
              value={form.teacher_id}
              placeholder="— Chưa chọn giám thị —"
              options={teachers.map((t: any) => ({ value: t.id, label: t.full_name ?? t.name }))}
              onChange={(v) => set({ teacher_id: v != null ? Number(v) : "" })}
            />
          </div>
        </div>
        <div>
          <FieldLabel required>Ngày thi</FieldLabel>
          <DatePicker
            className="w-full"
            format={DATE_FORMAT}
            value={form.exam_date ? moment(form.exam_date, DATE_FORMAT) : undefined}
            onChange={(v: any) => set({ exam_date: v ? moment(v).format(DATE_FORMAT) : "" })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Giờ bắt đầu</FieldLabel>
            <TimePicker
              className="w-full"
              format="HH:mm"
              value={form.start_time ? moment(form.start_time, "HH:mm") : undefined}
              onChange={(v: any) => set({ start_time: v ? moment(v).format("HH:mm") : "" })}
            />
          </div>
          <div>
            <FieldLabel required>Giờ kết thúc</FieldLabel>
            <TimePicker
              className="w-full"
              format="HH:mm"
              value={form.end_time ? moment(form.end_time, "HH:mm") : undefined}
              onChange={(v: any) => set({ end_time: v ? moment(v).format("HH:mm") : "" })}
            />
          </div>
        </div>
      </div>
    </FormScaff>
  );
};

export default CreateExamSessionModal;
