/* Import: library */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { notification } from "tera-dls";

/* Import: packages */
import { AttendanceAPI } from "@tera/api";

/* Import: pages */
import { ATT_STATUS_CFG, ATT_STATUS_KEYS } from "./AttendanceStatus";

interface IProps {
  selectedRowKeys: (string | number)[];
  // Xong: truyền danh sách key CÒN LẠI cần giữ chọn (mặc định rỗng = bỏ chọn hết).
  // Dùng để giữ lại các dòng lỗi khi cập nhật một phần thành công.
  onDone: (remainingKeys?: (string | number)[]) => void;
}

const Spinner = () => (
  <svg
    className="w-3.5 h-3.5 animate-spin"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
    />
  </svg>
);

/**
 * Điểm danh hàng loạt: khi có dòng được chọn, hiện thanh hành động với các chip
 * trạng thái. Bấm 1 chip = áp dụng trạng thái đó cho tất cả dòng đã chọn (gọi API
 * Save Attendance/update tuần tự) rồi xoá lựa chọn + refetch.
 */
const BulkAttendance = ({ selectedRowKeys, onDone }: IProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [savingStatus, setSavingStatus] = useState<string | null>(null);

  if (selectedRowKeys.length === 0) return null;

  const handleApply = async (status: string) => {
    if (savingStatus) return;
    setSavingStatus(status);
    // allSettled thay Promise.all: 1 dòng lỗi (buổi bị cancelled/attendance_locked)
    // KHÔNG chặn các dòng còn lại → biết chính xác dòng nào fail.
    const results = await Promise.allSettled(
      selectedRowKeys.map((id) =>
        AttendanceAPI.update({ id, params: { status } }),
      ),
    );
    setSavingStatus(null);
    queryClient.invalidateQueries({ queryKey: ["attendance", "list"] });

    const failedKeys = selectedRowKeys.filter(
      (_, i) => results[i].status === "rejected",
    );
    const okCount = selectedRowKeys.length - failedKeys.length;

    if (failedKeys.length === 0) {
      notification.success({ message: t("common.update_success") });
      onDone();
      return;
    }

    // Thông điệp lỗi đầu tiên (để hiển thị lý do backend từ chối)
    const firstError = results.find((r) => r.status === "rejected") as
      | PromiseRejectedResult
      | undefined;
    const firstErrorMsg =
      firstError?.reason?.message || t("common.error_message");

    if (okCount === 0) {
      // Tất cả đều lỗi → giữ nguyên lựa chọn để thử lại
      notification.error({
        message: `${t("attendance.bulk_all_failed")}: ${firstErrorMsg}`,
      });
      return;
    }

    // Thành công một phần → giữ lại các dòng lỗi để thử lại
    notification.warning({
      message: `${t("attendance.bulk_partial", {
        ok: okCount,
        fail: failedKeys.length,
      })}: ${firstErrorMsg}`,
    });
    onDone(failedKeys);
  };

  return (
    <div className="mb-3 flex flex-col gap-3 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-white px-4 py-3 shadow-sm xmd:flex-row xmd:items-center xmd:justify-between">
      {/* Số lượng đã chọn */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-blue-500 px-2 text-[13px] font-semibold text-white">
          {selectedRowKeys.length}
        </span>
        <span className="text-[13px] font-medium text-gray-700">
          {t("attendance.selected_students")}
        </span>
      </div>

      {/* Chip trạng thái + bỏ chọn */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] text-gray-500">
          {t("attendance.mark_prefix")}
        </span>
        {ATT_STATUS_KEYS.map((s) => {
          const cfg = ATT_STATUS_CFG[s];
          const isSaving = savingStatus === s;
          return (
            <button
              key={s}
              type="button"
              disabled={!!savingStatus}
              onClick={() => handleApply(s)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium transition hover:brightness-95 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              style={{ color: cfg?.color, backgroundColor: cfg?.backgroundColor }}
            >
              {isSaving ? (
                <Spinner />
              ) : (
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: cfg?.color }}
                />
              )}
              {t(`attendance.status_${s}`)}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onDone()}
          className="ml-1 text-[13px] text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline cursor-pointer"
        >
          {t("attendance.clear_selection")}
        </button>
      </div>
    </div>
  );
};

export default BulkAttendance;
