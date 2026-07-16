// [054] Bảng lương + [055] Chi tiết. UI-only — data từ `_mock.ts`, giữ shape này khi wire API.

export type PayrollStatus = "paid" | "pending" | "processing";

export interface PayrollPeriod {
  id: string; // "2025-05" — dùng cho URL chi tiết
  period: string;
  fromDate: string;
  toDate: string;
  incomeType: string;
  baseSalary: number;
  bonus: number;
  allowance: number;
  deduction: number;
  grossIncome: number;
  netIncome: number;
  status: PayrollStatus;
  paidDate: string;
}

export interface PayrollStats {
  grossIncome: number;
  baseSalary: number;
  bonus: number;
  allowance: number;
  deduction: number;
  netIncome: number;
  monthLabel: string;
}

export interface IncomePoint {
  label: string;
  amount: number;
}

export interface PaymentScheduleRow {
  id: string | number;
  period: string;
  paidDate: string;
  status: PayrollStatus;
}

export interface ActivityItem {
  id: string | number;
  title: string;
  time: string;
}

export interface PayrollLineItem {
  label: string;
  detail: string;
  amount: number;
}

export interface ClassIncomeRow {
  id: string | number;
  className: string;
  subject: string;
  studentCount: number;
  sessionCount: number;
  unitPrice: number;
  total: number;
}

export type TimelineIcon = "created" | "approved" | "paid" | "transfer";

export interface PaymentTimelineItem {
  id: string | number;
  title: string;
  time: string;
  transactionCode?: string;
  icon: TimelineIcon;
}

export interface PayrollDetail {
  id: string;
  period: string;
  teacherName: string;
  teacherCode: string;
  teacherRole: string;
  teacherTitle: string;
  department: string;
  joinDate: string;
  bankAccount: string;
  avatarUrl?: string;
  payDate: string;
  paidDate: string;
  status: PayrollStatus;
  paymentMethod: string;
  netIncome: number;
  grossIncome: number;
  totalDeduction: number;
  salaryItems: PayrollLineItem[]; // lương cơ bản + phụ cấp (SalaryBreakdown)
  bonusItems: PayrollLineItem[]; // các khoản thưởng (BonusInfo)
  deductionItems: PayrollLineItem[];
  classIncome: ClassIncomeRow[];
  classIncomeTotal: number;
  accountantNote: string;
  extraNotes: string[];
  timeline: PaymentTimelineItem[];
}
