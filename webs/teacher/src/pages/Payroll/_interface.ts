/** [054] Bảng lương + [055] Chi tiết — khớp `v1/hr/payroll/*` (PayrollResource, BE
 * 2026-07-17). Lương = giờ dạy thực tế × đơn giá/giờ + thưởng − phạt; KHÔNG có bảo
 * hiểm/thuế/phụ cấp/lịch sử chuyển khoản — backend không có các khái niệm này. */

export interface PayrollRow {
  id: number;
  month: number;
  year: number;
  totalHours: number;
  baseSalary: number;
  bonus: number;
  penalty: number;
  totalSalary: number;
  status: string;
  paidAt: string | null;
}

export interface ClassIncomeRow {
  classId: number | null;
  className: string;
  sessionCount: number;
  hours: number;
  unitPrice: number;
  total: number;
}

export interface PayrollDetail {
  payroll: PayrollRow;
  teacherName: string;
  teacherCode: string;
  hourlyRate: number;
  classIncome: ClassIncomeRow[];
}
