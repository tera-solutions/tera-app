import { useEffect, useState } from "react";
import { notification } from "tera-dls";

import { useStores } from "@tera/stores/useStores";
import { RoomService } from "@tera/modules/education";
import FormScaff from "@tera/components/dof/FormScaff";

import type { Room } from "../_interface";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-slate-500";

const ROOM_TYPES = [
  { value: "classroom", label: "Phòng học" },
  { value: "computer_room", label: "Phòng máy" },
  { value: "speaking_room", label: "Phòng speaking" },
];

interface Props {
  open: boolean;
  room: Room | null;
  onClose: () => void;
}

const empty = { room_name: "", room_code: "", floor: "", capacity: "20", room_type: "classroom" };

const RoomFormModal = ({ open, room, onClose }: Props) => {
  const isEdit = !!room;
  const { globalStore } = useStores();
  const { mutate: create, isPending: creating } = RoomService.useRoomCreate();
  const { mutate: update, isPending: updating } = RoomService.useRoomUpdate();

  const [form, setForm] = useState(empty);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!open) return;
    if (room) {
      setForm({
        room_name: room.name ?? "",
        room_code: room.code ?? "",
        floor: room.floor ?? "",
        capacity: String(room.capacity ?? 20),
        room_type: room.type || "classroom",
      });
    } else {
      setForm(empty);
    }
  }, [open, room]);

  const handleSubmit = () => {
    if (!form.room_name.trim()) {
      notification.warning({ message: "Vui lòng nhập tên phòng" });
      return;
    }
    const base = {
      room_name: form.room_name.trim(),
      floor: form.floor.trim() || null,
      capacity: Number(form.capacity || 1),
      room_type: form.room_type,
    };
    const done = {
      onSuccess: () => {
        notification.success({ message: isEdit ? "Đã cập nhật phòng" : "Đã tạo phòng" });
        onClose();
      },
      onError: (e: any) =>
        notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể lưu phòng" }),
    };

    if (isEdit && room) {
      update({ id: room.id, params: base }, done);
    } else {
      if (!form.room_code.trim()) {
        notification.warning({ message: "Vui lòng nhập mã phòng" });
        return;
      }
      const branchId = Number(globalStore.user?.branch_id) || undefined;
      create({ params: { ...base, room_code: form.room_code.trim(), branch_id: branchId } }, done);
    }
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={isEdit}
      titleCreate="Thêm phòng học"
      titleEdit="Sửa phòng học"
      className="!w-[95%] xmd:!w-[480px]"
      confirmLoading={creating || updating}
      onOk={handleSubmit}
    >
      <div className="space-y-3">
        <div>
          <label className={labelClass}>Tên phòng *</label>
          <input className={inputClass} value={form.room_name} onChange={(e) => set({ room_name: e.target.value })} />
        </div>
        {!isEdit && (
          <div>
            <label className={labelClass}>Mã phòng *</label>
            <input className={inputClass} value={form.room_code} onChange={(e) => set({ room_code: e.target.value })} />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Tầng</label>
            <input className={inputClass} value={form.floor} onChange={(e) => set({ floor: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Sức chứa *</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={form.capacity}
              onChange={(e) => set({ capacity: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Loại phòng</label>
          <select className={inputClass} value={form.room_type} onChange={(e) => set({ room_type: e.target.value })}>
            {ROOM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </FormScaff>
  );
};

export default RoomFormModal;
