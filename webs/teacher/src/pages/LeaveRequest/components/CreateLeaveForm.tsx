import { useRef, useState } from "react";
import moment from "moment";
import { Button, DatePicker, notification } from "tera-dls";

import Card from "_common/components/Card";
import CompactSelect from "_common/components/CompactSelect";

import { LEAVE_DURATION_OPTIONS, LEAVE_TYPE_OPTIONS } from "../_mock";

const DATE_FORMAT = "DD/MM/YYYY";
const REASON_MAX = 500;

// rc-picker (tera-dls) mặc định cao 26px → chuẩn hoá cao 44px + full width cho form.
const PICKER_CLASS =
  "w-full h-11! [&_input]:text-sm! hover:border-blue-700! focus-within:border-blue-700!";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-1.5 block text-sm font-medium text-slate-600">
    {children} <span className="text-rose-500">*</span>
  </label>
);

/** Icon máy bay giấy (tiêu đề form) + đám mây (upload) — inline SVG, không phụ thuộc bộ icon. */
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
const CloudUp = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
    <path
      d="M7 18a4 4 0 0 1-.5-7.97 6 6 0 0 1 11.5 1.3A3.5 3.5 0 0 1 17.5 18M12 12v6m0-6-2.5 2.5M12 12l2.5 2.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const emptyForm = {
  type: "",
  duration: "",
  from: null as moment.Moment | null,
  to: null as moment.Moment | null,
  reason: "",
  fileName: "",
};

/**
 * Form "Tạo đơn xin nghỉ" — UI-only (chưa wire API). Khi gửi chỉ báo thông báo demo.
 * Người làm API sẽ nối submit vào `EduLeaveService.useCreateLeave()` (route `v1/edu/leave/create`).
 */
type FieldError = Partial<Record<"type" | "from" | "to" | "reason", string>>;
const ERR_TEXT = "mt-1 text-xs text-rose-500";

const CreateLeaveForm = () => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FieldError>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cập nhật form + xóa lỗi của đúng field vừa sửa (validate lại khi submit).
  const patch = (p: Partial<typeof form>) => {
    setForm((f) => ({ ...f, ...p }));
    setErrors((e) => {
      const next = { ...e };
      Object.keys(p).forEach((k) => delete (next as Record<string, string>)[k]);
      return next;
    });
  };

  // Tổng số ngày (bao gồm cả ngày đầu & cuối). `.clone()` để KHÔNG mutate moment trong state.
  const totalDays =
    form.from && form.to
      ? Math.max(
          0,
          form.to.clone().startOf("day").diff(form.from.clone().startOf("day"), "days") + 1,
        )
      : 0;

  const reset = () => {
    setForm(emptyForm);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = (): FieldError => {
    const e: FieldError = {};
    if (!form.type) e.type = "Vui lòng chọn loại nghỉ.";
    if (!form.from) e.from = "Vui lòng chọn ngày bắt đầu.";
    if (!form.to) e.to = "Vui lòng chọn ngày kết thúc.";
    if (form.from && form.to && form.to.isBefore(form.from, "day"))
      e.to = "Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.";
    if (!form.reason.trim()) e.reason = "Vui lòng nhập lý do nghỉ.";
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    // ⚠️ UI-only: chưa gửi lên server. Wire API tại đây (EduLeaveService.useCreateLeave).
    notification.warning({
      message: "Giao diện demo — chức năng gửi đơn sẽ được kết nối API.",
    });
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
        {/* Loại nghỉ + Thời gian nghỉ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Loại nghỉ</Label>
            <CompactSelect
              allowClear
              className={`h-11 w-full text-sm ${errors.type ? "border-rose-400!" : ""}`}
              value={form.type}
              placeholder="Chọn loại nghỉ"
              options={LEAVE_TYPE_OPTIONS}
              onChange={(v) => patch({ type: v })}
            />
            {errors.type && <p className={ERR_TEXT}>{errors.type}</p>}
          </div>
          <div>
            <Label>Thời gian nghỉ</Label>
            <CompactSelect
              allowClear
              className="h-11 w-full text-sm"
              value={form.duration}
              placeholder="Tùy chọn"
              options={LEAVE_DURATION_OPTIONS}
              onChange={(v) => patch({ duration: v })}
            />
          </div>
        </div>

        {/* Từ ngày + Đến ngày + Tổng số ngày */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_150px] sm:items-end">
          <div>
            <Label>Từ ngày</Label>
            <DatePicker
              className={`${PICKER_CLASS} ${errors.from ? "border-rose-400!" : ""}`}
              format={DATE_FORMAT}
              placeholder="Chọn ngày"
              value={form.from ?? undefined}
              inputReadOnly
              onChange={(d: any) => patch({ from: d ?? null })}
            />
            {errors.from && <p className={ERR_TEXT}>{errors.from}</p>}
          </div>
          <div>
            <Label>Đến ngày</Label>
            <DatePicker
              className={`${PICKER_CLASS} ${errors.to ? "border-rose-400!" : ""}`}
              format={DATE_FORMAT}
              placeholder="Chọn ngày"
              value={form.to ?? undefined}
              disabledDate={(d: any) =>
                form.from ? d && d.isBefore(form.from, "day") : false
              }
              inputReadOnly
              onChange={(d: any) => patch({ to: d ?? null })}
            />
            {errors.to && <p className={ERR_TEXT}>{errors.to}</p>}
          </div>
          <div className="col-span-2 flex flex-col items-center justify-center rounded-xl bg-sky-50 px-4 py-3.5 sm:col-span-1">
            <span className="text-[11px] text-slate-500">Tổng số ngày</span>
            <span className="text-slate-800">
              <span className="text-lg font-bold text-brand">{totalDays}</span>{" "}
              <span className="text-xs">ngày</span>
            </span>
          </div>
        </div>

        {/* Lý do nghỉ */}
        <div>
          <Label>Lý do nghỉ</Label>
          <div className="relative">
            <textarea
              value={form.reason}
              maxLength={REASON_MAX}
              onChange={(e) => patch({ reason: e.target.value })}
              placeholder="Nhập lý do xin nghỉ..."
              rows={3}
              className={`w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring focus:ring-blue-300 ${
                errors.reason
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 focus:border-blue-500"
              }`}
            />
            <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-slate-300">
              {form.reason.length}/{REASON_MAX}
            </span>
          </div>
          {errors.reason && <p className={ERR_TEXT}>{errors.reason}</p>}
        </div>

        {/* Đính kèm tài liệu */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-600">
            Đính kèm tài liệu (nếu có)
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center transition-colors hover:border-blue-400 hover:bg-sky-50/60"
          >
            <span className="text-brand">
              <CloudUp />
            </span>
            <span className="text-sm text-slate-600">
              Kéo thả file vào đây hoặc{" "}
              <span className="font-medium text-brand">chọn file</span>
            </span>
            <span className="text-[11px] text-slate-400">
              PDF, DOC, DOCX, JPG, PNG (tối đa 10MB)
            </span>
            {form.fileName && (
              <span className="mt-1 max-w-full truncate text-xs font-medium text-slate-700">
                📎 {form.fileName}
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => patch({ fileName: e.target.files?.[0]?.name ?? "" })}
          />
        </div>

        {/* Nút hành động — dùng tera-dls Button cho đồng bộ các trang khác */}
        <div className="flex justify-end gap-2.5 pt-1">
          <Button outlined onClick={reset}>
            Hủy
          </Button>
          <Button onClick={submit} className="gap-1.5">
            <PaperPlane />
            Gửi đơn xin nghỉ
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CreateLeaveForm;
