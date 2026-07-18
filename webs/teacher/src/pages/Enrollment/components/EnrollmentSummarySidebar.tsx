import Card from "_common/components/Card";
import type { Classroom } from "pages/Classroom/_interface";

import type { EnrollmentPricing } from "../_interface";
import { calcTuitionAmount, formatVnd } from "../_utils";

interface EnrollmentSummarySidebarProps {
  classroom: Classroom | null;
  /** null = pricing step not confirmed yet — don't show computed numbers as
   * if they were real, since they'd just be the unconfirmed form defaults. */
  pricing: EnrollmentPricing | null;
  studentCount: number;
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="font-medium text-slate-800">{value}</span>
  </div>
);

const EnrollmentSummarySidebar = ({ classroom, pricing, studentCount }: EnrollmentSummarySidebarProps) => {
  const tuitionAmount = pricing ? calcTuitionAmount(pricing) : 0;
  // No phantom "assume 1 student" floor — 0 học viên really does mean 0đ.
  const total = tuitionAmount * studentCount;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">Tóm tắt</p>
        <div className="flex flex-col gap-2">
          <Row label="Lớp" value={classroom?.name ?? "Chưa chọn"} />
          <Row
            label="Học phí"
            value={pricing ? `${formatVnd(pricing.price_per_lesson)}/buổi` : "Chưa thiết lập"}
          />
          <Row label="Số HV" value={studentCount} />
        </div>
      </Card>

      {classroom && (
        <Card>
          <p className="mb-3 text-sm font-semibold text-slate-700">Thống kê học viên</p>
          <div className="flex flex-col gap-2">
            <Row label="Đã đăng ký" value={classroom.student_count} />
            <Row label="Chỗ trống" value={Math.max(classroom.max_students - classroom.student_count, 0)} />
          </div>
        </Card>
      )}

      <Card>
        <p className="mb-1 text-xs text-slate-400">Tổng thanh toán</p>
        <p className="text-xl font-bold text-brand">
          {pricing && studentCount > 0 ? formatVnd(total) : "—"}
        </p>
      </Card>
    </div>
  );
};

export default EnrollmentSummarySidebar;
