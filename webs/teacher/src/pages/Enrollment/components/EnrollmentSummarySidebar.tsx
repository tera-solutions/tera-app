import Card from "_common/components/Card";
import type { Classroom } from "pages/Classroom/_interface";

import type { EnrollmentPricing } from "../_interface";
import { calcTuitionAmount, formatVnd } from "../_utils";

interface EnrollmentSummarySidebarProps {
  classroom: Classroom | null;
  pricing: EnrollmentPricing;
  studentCount: number;
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="font-medium text-slate-800">{value}</span>
  </div>
);

const EnrollmentSummarySidebar = ({ classroom, pricing, studentCount }: EnrollmentSummarySidebarProps) => {
  const tuitionAmount = calcTuitionAmount(pricing);
  const total = tuitionAmount * Math.max(studentCount, 1);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">Tóm tắt</p>
        <div className="flex flex-col gap-2">
          <Row label="Lớp" value={classroom?.name ?? "Chưa chọn"} />
          <Row label="Học phí" value={`${formatVnd(pricing.price_per_lesson)}/buổi`} />
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
        <p className="text-xl font-bold text-brand">{formatVnd(total)}</p>
      </Card>
    </div>
  );
};

export default EnrollmentSummarySidebar;
