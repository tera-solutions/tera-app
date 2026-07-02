/* Import: library */
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Modal, notification } from "tera-dls";

/* Import: packages */
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: services */
import { EnrollmentService, ClassRoomService } from "@tera/modules";

/* Import: pages */
import ClassCapacity from "./ClassCapacity";
import { IEnrollment } from "pages/education/enrollment/_interface";

interface TransferStudentProps {
  enrollment: IEnrollment;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SELECT_CLASS =
  "w-full h-9 border border-gray-300 bg-white px-3 text-[13px] rounded focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500";

/** Modal chuyển lớp học viên: to_class_id + transfer_date + reason */
const TransferStudent = ({
  enrollment,
  open,
  onClose,
  onSuccess,
}: TransferStudentProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const [toClassId, setToClassId] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [reason, setReason] = useState("");

  const { mutate: onTransfer, isPending } =
    EnrollmentService.useEnrollmentTransfer();

  const { data: classData } = ClassRoomService.useClassRoomList({
    params: { page: 1, per_page: 100 },
  });
  // loại bỏ lớp hiện tại khỏi danh sách chuyển đến
  const classes: any[] = useMemo(
    () =>
      (classData?.data?.items ?? []).filter(
        (c: any) => c.id !== enrollment?.class_id,
      ),
    [classData, enrollment],
  );

  const canSubmit = !!toClassId && !!transferDate && !!reason.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onTransfer(
      {
        id: enrollment.id,
        params: {
          to_class_id: Number(toClassId),
          transfer_date: transferDate,
          reason: reason.trim(),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
          queryClient.invalidateQueries({ queryKey: ["enrollment", "detail"] });
          notification.success({ message: t("enrollment.transfer_success") });
          onClose();
          onSuccess?.();
        },
        onError: (error: any) =>
          notification.error({
            message: error?.message || t("common.error_message"),
          }),
      },
    );
  };

  return (
    <Modal
      title={t("enrollment.transfer_title")}
      open={open}
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
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            className="px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? t("common.processing") : t("enrollment.transfer_confirm")}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {/* Lớp hiện tại */}
        <div className="text-[13px] text-gray-600">
          {t("enrollment.current_class")}:{" "}
          <span className="font-medium text-gray-800">
            {enrollment?.class?.code
              ? `${enrollment.class.code} - ${enrollment.class.name}`
              : (enrollment?.class?.name ?? "—")}
          </span>
        </div>

        {/* Lớp chuyển đến */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] text-gray-600 font-medium">
            {t("enrollment.to_class")} <span className="text-red-500">*</span>
          </label>
          <select
            className={SELECT_CLASS}
            style={{ color: toClassId ? "#111827" : "#9ca3af" }}
            value={toClassId}
            onChange={(e) => setToClassId(e.target.value)}
          >
            <option value="" disabled hidden>
              {t("form.enter_value", { key: t("enrollment.to_class") })}
            </option>
            {classes.map((c) => (
              <option key={c.id} value={String(c.id)} style={{ color: "#111827" }}>
                {c.code ? `${c.code} - ${c.name}` : c.name}
              </option>
            ))}
          </select>
        </div>

        {toClassId && <ClassCapacity classId={toClassId} />}

        {/* Ngày chuyển */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] text-gray-600 font-medium">
            {t("enrollment.transfer_date")} <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className={SELECT_CLASS}
            value={transferDate}
            onChange={(e) => setTransferDate(e.target.value)}
          />
        </div>

        {/* Lý do */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] text-gray-600 font-medium">
            {t("common.reason")} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("common.reason_placeholder")}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none"
          />
        </div>
      </div>
    </Modal>
  );
};

export default TransferStudent;
