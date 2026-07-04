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
  onDone: () => void;
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
    try {
      await Promise.all(
        selectedRowKeys.map((id) =>
          AttendanceAPI.update({ id, params: { status } }),
        ),
      );
      notification.success({ message: t("common.update_success") });
      onDone();
    } catch (error: any) {
      notification.error({
        message: error?.message || t("common.error_message"),
      });
    } finally {
      setSavingStatus(null);
      queryClient.invalidateQueries({ queryKey: ["attendance", "list"] });
    }
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
          onClick={onDone}
          className="ml-1 text-[13px] text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline cursor-pointer"
        >
          {t("attendance.clear_selection")}
        </button>
      </div>
    </div>
  );
};

export default BulkAttendance;
