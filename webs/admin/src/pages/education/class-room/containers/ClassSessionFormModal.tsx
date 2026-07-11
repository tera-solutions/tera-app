/* Import: library */
import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { Modal, notification, DatePicker } from "tera-dls";
import { SelectField } from "@tera/components/dof/Control/Select";

/* Import: packages */
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { ClassSessionService, RoomService, TeacherService } from "@tera/modules";

/* Import: pages */
import MultiSelect, { MultiOption } from "_common/components/MultiSelect";
import { IClassSession } from "pages/education/class-room/_interface";

const INPUT_CLASS =
  "w-full h-9 border border-gray-300 rounded-[3px] bg-white px-3 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-100 box-border";

const toHHMM = (v?: string) => (v ? String(v).slice(0, 5) : "");

interface Props {
  open: boolean;
  type: "create" | "update" | "detail";
  classId?: number;
  session?: IClassSession | null;
  tagOptions?: MultiOption[];
  onClose: () => void;
}

const empty = {
  name: "",
  session_date: "",
  start_time: "",
  end_time: "",
  teacher_id: "",
  substitute_teacher_id: "",
  room_id: "",
  tag_ids: [] as string[],
  note: "",
};

const ClassSessionFormModal = observer(
  ({ open, type, classId, session, tagOptions = [], onClose }: Props) => {
    const { t } = useTranslation();
    const { globalStore } = useStores();
    const queryClient = useQueryClient();
    const isView = type === "detail";
    const isUpdate = type === "update";

    const [form, setForm] = useState<any>(empty);

    const { data: teacherData } = TeacherService.useTeacherList({
      params: { page: 1, per_page: 100 },
    });
    const teachers: any[] = teacherData?.data?.items ?? [];

    const { data: roomData } = RoomService.useRoomList({
      params: { page: 1, per_page: 100, status: "active" },
    });
    const rooms: any[] = roomData?.data?.items ?? [];

    const { mutate: onCreate, isPending: creating } =
      ClassSessionService.useClassSessionCreate();
    const { mutate: onUpdate, isPending: updating } =
      ClassSessionService.useClassSessionUpdate();

    useEffect(() => {
      if (session && (isUpdate || isView)) {
        setForm({
          name: session.name ?? "",
          session_date: session.session_date ?? "",
          start_time: toHHMM(session.start_time),
          end_time: toHHMM(session.end_time),
          teacher_id: session.teacher_id ? String(session.teacher_id) : "",
          substitute_teacher_id: session.substitute_teacher_id
            ? String(session.substitute_teacher_id)
            : "",
          room_id: session.room_id != null ? String(session.room_id) : "",
          tag_ids: (session.tags ?? []).map((tg: any) =>
            String(tg?.id ?? tg),
          ),
          note: session.note ?? "",
        });
      } else {
        setForm(empty);
      }
    }, [session, isUpdate, isView, open]);

    // Merge tag của buổi đang sửa vào options (để hiện đúng dù không có trong list derived)
    const tagOpts: MultiOption[] = useMemo(() => {
      const map = new Map<string, string>();
      tagOptions.forEach((o) => map.set(o.value, o.label));
      (session?.tags ?? []).forEach((tg: any) => {
        const id = String(tg?.id ?? tg);
        if (!map.has(id)) map.set(id, tg?.name ?? tg?.label ?? id);
      });
      return [...map.entries()].map(([value, label]) => ({ value, label }));
    }, [tagOptions, session]);

    const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

    const statusItem = useMemo(
      () => globalStore.getMetaItem("class_session_status", session?.status),
      [globalStore, session],
    );

    const handleSubmit = () => {
      if (
        !form.name?.trim() ||
        !form.session_date ||
        !form.start_time ||
        !form.end_time
      ) {
        notification.error({ message: t("validate.required") });
        return;
      }
      if (form.end_time <= form.start_time) {
        notification.error({ message: t("classroom.schedule_time_invalid") });
        return;
      }
      const params = {
        name: form.name.trim(),
        session_date: form.session_date,
        start_time: form.start_time,
        end_time: form.end_time,
        teacher_id: form.teacher_id ? Number(form.teacher_id) : undefined,
        substitute_teacher_id: form.substitute_teacher_id
          ? Number(form.substitute_teacher_id)
          : undefined,
        room_id: form.room_id ? Number(form.room_id) : undefined,
        tag_ids: form.tag_ids?.length
          ? form.tag_ids.map((id: string) => Number(id))
          : undefined,
        note: form.note?.trim() || undefined,
      };
      const cb = {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["class-session", "list"] });
          // Statistics vận hành nằm trong class-room detail → refresh
          queryClient.invalidateQueries({ queryKey: ["class-room", "detail"] });
          queryClient.invalidateQueries({ queryKey: ["class-room", "list"] });
          notification.success({
            message: isUpdate
              ? t("common.update_success")
              : t("common.create_success"),
          });
          onClose();
        },
        onError: (e: any) =>
          notification.error({
            message: e?.message || t("common.error_message"),
          }),
      };
      if (isUpdate) onUpdate({ id: session?.id, params }, cb);
      else onCreate({ params: { class_id: classId, ...params } }, cb);
    };

    const titleMap = {
      create: t("classroom.session_create"),
      update: t("classroom.session_update"),
      detail: t("classroom.session_detail"),
    };

    return (
      <Modal
        title={titleMap[type]}
        open={open}
        onCancel={onClose}
        closeIcon={false}
        centered
        width="92%"
        className="max-w-[560px]!"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50"
            >
              {isView ? t("button.cancel") : t("button.cancel")}
            </button>
            {!isView && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={creating || updating}
                className="px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {creating || updating ? t("common.processing") : t("button.save")}
              </button>
            )}
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3">
          {isView && session && (
            <div className="flex items-center gap-3 text-[13px]">
              <span className="text-gray-500">
                {t("classroom.session_no")}: <b>{session.session_no}</b>
              </span>
              <span className="text-gray-500">
                {session.code}
              </span>
              {session.status && (
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium"
                  style={{
                    color: statusItem?.color,
                    backgroundColor: statusItem?.backgroundColor,
                  }}
                >
                  {statusItem?.label ?? session.status}
                </span>
              )}
            </div>
          )}

          <Field label={t("classroom.session_name")} required>
            <input
              className={INPUT_CLASS}
              value={form.name}
              disabled={isView || isUpdate}
              onChange={(e) => set("name", e.target.value)}
              placeholder={t("classroom.session_name")}
            />
          </Field>

          <div className="grid grid-cols-1 xmd:grid-cols-3 gap-3">
            <Field label={t("classroom.session_date")} required>
              <DatePicker
                className="w-full"
                value={
                  form.session_date
                    ? moment(form.session_date, "YYYY-MM-DD")
                    : undefined
                }
                format="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                disabled={isView}
                allowClear
                onChange={(date: any) =>
                  set("session_date", date ? moment(date).format("YYYY-MM-DD") : "")
                }
              />
            </Field>
            <Field label={t("classroom.start_time")} required>
              <input
                type="time"
                className={INPUT_CLASS}
                value={form.start_time}
                disabled={isView}
                onChange={(e) => set("start_time", e.target.value)}
              />
            </Field>
            <Field label={t("classroom.end_time")} required>
              <input
                type="time"
                className={INPUT_CLASS}
                value={form.end_time}
                disabled={isView}
                onChange={(e) => set("end_time", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 xmd:grid-cols-2 gap-3">
            <Field label={t("classroom.teacher")}>
              <SelectField
                options={teachers.map((tc) => ({
                  value: String(tc.id),
                  label: tc.code ? `${tc.full_name} (${tc.code})` : tc.full_name,
                }))}
                placeholder="—"
                value={form.teacher_id}
                disabled={isView}
                onChange={(val) => set("teacher_id", String(val ?? ""))}
              />
            </Field>
            <Field label={t("classroom.substitute_teacher")}>
              <SelectField
                options={teachers.map((tc) => ({
                  value: String(tc.id),
                  label: tc.code ? `${tc.full_name} (${tc.code})` : tc.full_name,
                }))}
                placeholder="—"
                value={form.substitute_teacher_id}
                disabled={isView}
                onChange={(val) => set("substitute_teacher_id", String(val ?? ""))}
              />
            </Field>
          </div>

          <Field label={t("classroom.room")}>
            <SelectField
              options={rooms.map((r) => ({
                value: String(r.id),
                label: [
                  r.room_name ?? r.name ?? `#${r.id}`,
                  r.room_code ? ` (${r.room_code})` : "",
                  r.capacity != null ? ` · ${r.capacity} ${t("classroom.seats")}` : "",
                ].join(""),
              }))}
              placeholder="—"
              value={form.room_id}
              disabled={isView}
              onChange={(val) => set("room_id", String(val ?? ""))}
            />
          </Field>

          <Field label={t("classroom.tags")}>
            {isView ? (
              <div className="flex flex-wrap gap-1 min-h-9 items-center">
                {(form.tag_ids ?? []).length === 0 ? (
                  <span className="text-gray-300 text-[13px]">—</span>
                ) : (
                  (form.tag_ids ?? []).map((id: string) => {
                    const opt = tagOpts.find((o) => o.value === id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[12px] font-medium"
                        style={{ color: "#1d4ed8", backgroundColor: "#dbeafe" }}
                      >
                        {opt?.label ?? id}
                      </span>
                    );
                  })
                )}
              </div>
            ) : (
              <MultiSelect
                options={tagOpts}
                value={form.tag_ids ?? []}
                placeholder={t("classroom.all_tags")}
                onChange={(v) => set("tag_ids", v)}
              />
            )}
          </Field>

          <Field label={t("classroom.note")}>
            <textarea
              className={`${INPUT_CLASS} h-auto py-2 resize-none`}
              rows={3}
              value={form.note}
              disabled={isView}
              onChange={(e) => set("note", e.target.value)}
              placeholder={t("classroom.note")}
            />
          </Field>
        </div>
      </Modal>
    );
  },
);

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-[12px] text-gray-500 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export default ClassSessionFormModal;
