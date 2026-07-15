/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, notification } from "tera-dls";

/* Import: packages */
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: services */
import { AttendanceService } from "@tera/modules";

// Ô chọn giờ: dùng <input type="time"> native (mobile lẫn desktop) — OS/trình duyệt tự
// render popup, kéo chọn giờ mượt bằng touch. Đã thử tera-dls TimePicker (rc-picker)
// nhưng popup trên mobile phải TAP 1 lần rồi mới cuộn cột giờ được (lỗi touch-scroll
// trong rc-picker, tarball không patch được) → quay lại native cho cả 2.
const TimeField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[13px] text-gray-600 font-medium">{label}</label>
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-9 border border-gray-300 rounded px-3 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
    />
  </div>
);

interface IProps {
  record: any | null;
  onClose: () => void;
}

// checkin_time/checkout_time là ISO UTC → lấy "HH:mm" cho <input type="time">
const toTimeInput = (v?: string | null) => (v ? String(v).slice(11, 16) : "");

// Ngày (YYYY-MM-DD) theo lịch địa phương — khớp cách app hiển thị ngày buổi học
// (fmtDate dùng toLocaleDateString local); dữ liệu check-in sẵn có cũng lưu theo
// ngày buổi học, KHÔNG phải ngày UTC thô (lệch 1 ngày do VN = UTC+7).
const localDatePart = (iso: string) => {
  const d = new Date(iso);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

// ⚠️ Timezone: bảng hiển thị giờ = slice(11..16) của ISO (raw UTC, KHÔNG đổi tz) —
// dữ liệu lưu giờ VN thẳng vào field UTC. Nhưng route update lại COI input là giờ VN
// rồi quy về UTC (−7h) khi lưu (verify staging 2026-07-15: gửi 10:15Z → lưu & hiển thị
// 03:15). Để giờ admin nhập khớp giờ hiển thị lại, BÙ +7h (offset VN cố định, không DST)
// trước khi gửi — backend trừ 7h là ra đúng giá trị raw cần lưu. (Chỉ GIỜ được hiển thị,
// nên phần NGÀY của check-in không ảnh hưởng — giữ ngày sẵn có / ngày buổi học.)
const VN_OFFSET_MIN = 7 * 60;
const buildIso = (time: string, record: any): string | null => {
  if (!time) return null;
  const existing = record?.checkin_time || record?.checkout_time;
  const datePart = existing
    ? String(existing).slice(0, 10)
    : record?.session?.session_date
      ? localDatePart(record.session.session_date)
      : localDatePart(new Date().toISOString());
  const d = new Date(`${datePart}T${time}:00Z`); // giờ admin nhập, coi như UTC
  d.setUTCMinutes(d.getUTCMinutes() + VN_OFFSET_MIN); // bù +7h để backend trừ lại
  return d.toISOString().replace(/\.\d{3}Z$/, ".000000Z");
};

/**
 * Modal sửa nhanh 1 bản ghi điểm danh: ghi chú + giờ check-in + giờ check-out.
 * (PUT edu/attendance/update/:id nhận 3 field này — trước đây UI chỉ đổi status.)
 */
const AttendanceEditModal = ({ record, onClose }: IProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const { mutate: upsert, isPending } = AttendanceService.useUpsertAttendance();

  const [note, setNote] = useState("");
  const [checkinTime, setCheckinTime] = useState("");
  const [checkoutTime, setCheckoutTime] = useState("");

  // Nạp giá trị mỗi khi mở modal với 1 bản ghi khác
  useEffect(() => {
    if (!record) return;
    setNote(record.note ?? "");
    setCheckinTime(toTimeInput(record.checkin_time));
    setCheckoutTime(toTimeInput(record.checkout_time));
  }, [record]);

  const handleSave = () => {
    if (!record) return;
    upsert(
      {
        id: record.id,
        params: {
          // backend update BẮT BUỘC có status (đọc $data['status'] không guard)
          // → giữ nguyên trạng thái hiện tại khi chỉ sửa note/giờ.
          status: record.status,
          note: note.trim(),
          checkin_time: buildIso(checkinTime, record),
          checkout_time: buildIso(checkoutTime, record),
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: t("common.update_success") });
          onClose();
        },
        onError: (error: any) =>
          notification.error({
            message: error?.message || t("common.error_message"),
          }),
      },
    );
  };

  const studentName =
    record?.student?.name ?? record?.student?.full_name ?? "";

  return (
    <Modal
      title={`${t("attendance.edit_title")}${studentName ? `: ${studentName}` : ""}`}
      open={!!record}
      onCancel={onClose}
      closeIcon={false}
      centered
      width={isMobile ? "92%" : 500}
      className="max-w-[500px]!"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            {t("button.cancel")}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? t("common.processing") : t("button.save")}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <TimeField
            label={t("attendance.checkin_time")}
            value={checkinTime}
            onChange={setCheckinTime}
          />
          <TimeField
            label={t("attendance.checkout_time")}
            value={checkoutTime}
            onChange={setCheckoutTime}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-gray-600 font-medium">
            {t("attendance.note")}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("attendance.note_placeholder")}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AttendanceEditModal;
