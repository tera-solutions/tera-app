import { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Button, CheckCircleOutlined, DatePicker, ExclamationCircleOutlined, Select, Spin, TextArea, notification } from "tera-dls";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { EnrollmentService } from "@tera/modules/education";
import type { Classroom } from "pages/Classroom/_interface";

import type { TransferEnrollmentRow } from "../_interface";
import { REASON_OPTIONS } from "../constants";

interface StepConfirmProps {
  students: TransferEnrollmentRow[];
  targetClass: Classroom;
  onBack: () => void;
}

const StepConfirm = ({ students, targetClass, onBack }: StepConfirmProps) => {
  const navigate = useNavigate();
  const { mutateAsync: transferEnrollment } = EnrollmentService.useEnrollmentTransfer();

  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(moment().format("YYYY-MM-DD"));
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<Record<number, { status: "pending" | "success" | "error"; message?: string }>>({});

  const finalReason = reason === "Khác" ? customReason : reason;

  const handleConfirm = async () => {
    if (!finalReason.trim()) {
      notification.error({ message: "Vui lòng nhập lý do chuyển lớp" });
      return;
    }

    setSubmitting(true);
    setResults(Object.fromEntries(students.map((s) => [s.enrollment_id, { status: "pending" as const }])));

    let successCount = 0;

    for (const student of students) {
      try {
        await transferEnrollment({
          id: student.enrollment_id,
          params: { to_class_id: targetClass.id, transfer_date: effectiveDate, reason: finalReason },
        });
        successCount += 1;
        setResults((prev) => ({ ...prev, [student.enrollment_id]: { status: "success" } }));
      } catch (error: any) {
        const message = error?.data?.msg ?? error?.message ?? "Chuyển lớp thất bại";
        setResults((prev) => ({ ...prev, [student.enrollment_id]: { status: "error", message } }));
      }
    }

    setSubmitting(false);

    if (successCount === students.length) {
      notification.success({ message: "Chuyển lớp thành công" });
      navigate(PATHS.students);
    } else if (successCount > 0) {
      notification.warning({ message: `Đã chuyển ${successCount}/${students.length} học viên` });
    } else {
      notification.error({ message: "Chuyển lớp thất bại" });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">
          {students.length > 0 ? students[0].class_name : "—"} → {targetClass.name}
        </p>

        <div className="flex flex-col gap-2">
          {students.map((s) => {
            const result = results[s.enrollment_id];
            return (
              <div
                key={s.enrollment_id}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
              >
                <span className="text-slate-700">{s.student_name}</span>
                {result?.status === "success" && (
                  <CheckCircleOutlined className="h-4 w-4 text-emerald-500" />
                )}
                {result?.status === "error" && (
                  <span className="flex items-center gap-1 text-xs text-red-500">
                    <ExclamationCircleOutlined className="h-4 w-4" />
                    {result.message}
                  </span>
                )}
                {result?.status === "pending" && submitting && <Spin spinning size="small" />}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
          <Button outlined onClick={onBack} disabled={submitting}>
            ← Quay lại
          </Button>
          <Button onClick={handleConfirm} disabled={submitting}>
            {submitting ? "Đang xử lý..." : "Xác nhận chuyển lớp"}
          </Button>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <p className="mb-3 text-sm font-semibold text-slate-700">Lý do chuyển lớp</p>
          <Select
            value={reason}
            onChange={(value: any) => setReason(value)}
            options={REASON_OPTIONS}
            placeholder="Chọn lý do"
            className="mb-2 w-full"
          />
          <TextArea
            value={reason === "Khác" ? customReason : reason}
            onChange={(e) => (reason === "Khác" ? setCustomReason(e.target.value) : setReason(e.target.value))}
            placeholder="Nhập lý do chuyển lớp..."
            rows={3}
          />
          <p className="mb-1 mt-3 text-xs text-slate-400">Ngày có hiệu lực</p>
          <DatePicker
            format="YYYY-MM-DD"
            value={moment(effectiveDate)}
            onChange={(value: any) => setEffectiveDate(value ? moment(value).format("YYYY-MM-DD") : effectiveDate)}
          />
        </Card>

        <Card>
          <p className="mb-2 text-sm font-semibold text-slate-700">Thống kê chuyển lớp</p>
          <EmptyState description="Chưa có thống kê chuyển lớp" className="py-6" />
        </Card>
      </div>
    </div>
  );
};

export default StepConfirm;
