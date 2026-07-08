import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Button, CheckCircleOutlined, ExclamationCircleOutlined, notification, Spin } from "tera-dls";

import Card from "_common/components/Card";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { useStores } from "@tera/stores/useStores";
import { EnrollmentService, StudentService } from "@tera/modules/education";
import type { Classroom } from "pages/Classroom/_interface";

import type { EnrollmentDraftStudent, EnrollmentPricing, EnrollmentRowResult } from "../_interface";
import { calcTuitionAmount, formatVnd } from "../_utils";

interface StepConfirmProps {
  classroom: Classroom;
  pricing: EnrollmentPricing;
  students: EnrollmentDraftStudent[];
  onBack: () => void;
}

const StepConfirm = observer(({ classroom, pricing, students, onBack }: StepConfirmProps) => {
  const navigate = useNavigate();
  const { globalStore } = useStores();
  const { mutateAsync: createStudent } = StudentService.useStudentCreate();
  const { mutateAsync: createEnrollment } = EnrollmentService.useEnrollmentCreate();

  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<EnrollmentRowResult[]>([]);

  const tuitionAmount = calcTuitionAmount(pricing);
  const total = tuitionAmount * students.length;

  const handleConfirm = async () => {
    setSubmitting(true);
    const rows: EnrollmentRowResult[] = students.map((s) => ({ key: s.key, name: s.name, status: "pending" }));
    setResults(rows);

    const businessId = Number(globalStore.user?.business_id ?? globalStore.business_id);
    const branchId = Number(globalStore.user?.branch_id);

    let successCount = 0;

    for (const student of students) {
      try {
        let studentId: number;
        if (student.mode === "existing") {
          studentId = student.student_id;
        } else {
          const res: any = await createStudent({
            params: {
              name: student.name,
              dob: student.dob,
              gender: student.gender,
              email: student.email || undefined,
              phone: student.phone || undefined,
              business_id: businessId,
              branch_id: branchId,
              enrollment_date: new Date().toISOString().slice(0, 10),
              parents:
                student.parent_name || student.parent_phone
                  ? [{ name: student.parent_name, phone: student.parent_phone }]
                  : undefined,
            },
          });
          studentId = res?.data?.id;
        }

        await createEnrollment({
          params: {
            student_id: studentId,
            course_id: classroom.course_id,
            class_id: classroom.id,
            total_lessons: pricing.total_lessons,
            price_per_lesson: pricing.price_per_lesson,
            discount_percent: pricing.discount_percent || undefined,
            bonus_lessons: pricing.bonus_lessons || undefined,
            paid_amount: pricing.paid_amount || undefined,
            payment_method: pricing.payment_method,
            enrolled_at: new Date().toISOString().slice(0, 10),
          },
        });

        successCount += 1;
        setResults((prev) =>
          prev.map((r) => (r.key === student.key ? { ...r, status: "success" } : r)),
        );
      } catch (error: any) {
        const message = error?.data?.msg ?? error?.message ?? "Ghi danh thất bại";
        setResults((prev) =>
          prev.map((r) => (r.key === student.key ? { ...r, status: "error", message } : r)),
        );
      }
    }

    setSubmitting(false);

    if (successCount === students.length) {
      notification.success({ message: "Ghi danh thành công" });
      navigate(`${PATHS.classroom}/${classroom.id}`);
    } else if (successCount > 0) {
      notification.warning({ message: `Đã ghi danh ${successCount}/${students.length} học viên` });
    } else {
      notification.error({ message: "Ghi danh thất bại" });
    }
  };

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-700">Xác nhận ghi danh</p>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-100 p-3">
          <p className="text-xs text-slate-400">Lớp học</p>
          <p className="text-sm font-medium text-slate-800">{classroom.name}</p>
        </div>
        <div className="rounded-xl border border-slate-100 p-3">
          <p className="text-xs text-slate-400">Học phí / học viên</p>
          <p className="text-sm font-medium text-slate-800">
            {pricing.total_lessons} buổi × {formatVnd(pricing.price_per_lesson)} = {formatVnd(tuitionAmount)}
          </p>
        </div>
      </div>

      <p className="mb-2 text-sm font-semibold text-slate-700">Danh sách học viên ({students.length})</p>
      <div className="flex flex-col gap-2">
        {students.map((s) => {
          const result = results.find((r) => r.key === s.key);
          return (
            <div
              key={s.key}
              className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
            >
              <span className="text-slate-700">{s.name}</span>
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

      <p className="mt-4 text-sm text-slate-600">
        Tổng thanh toán:{" "}
        <span className="text-base font-bold text-brand">{formatVnd(total)}</span>
      </p>

      <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
        <Button outlined onClick={onBack} disabled={submitting}>
          ← Quay lại
        </Button>
        <Button onClick={handleConfirm} disabled={submitting}>
          {submitting ? "Đang xử lý..." : "Xác nhận ghi danh"}
        </Button>
      </div>
    </Card>
  );
});

export default StepConfirm;
