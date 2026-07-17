import type {
  ActivityItem,
  IncomePoint,
  PayrollDetail,
  PayrollPeriod,
  PayrollStats,
  PaymentScheduleRow,
} from "./_interface";

// ⚠️ DATA GIẢ — chưa có endpoint Payroll. Khi có backend thì thay bằng service hook (giữ shape `_interface.ts`).

export const PAYROLL_PERIODS: PayrollPeriod[] = [
  { id: "2025-05", period: "05/2025", fromDate: "01/05/2025", toDate: "31/05/2025", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 2800000, allowance: 1200000, deduction: 700000, grossIncome: 11300000, netIncome: 10600000, status: "paid", paidDate: "05/06/2025" },
  { id: "2025-04", period: "04/2025", fromDate: "01/04/2025", toDate: "30/04/2025", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 2500000, allowance: 1000000, deduction: 600000, grossIncome: 9500000, netIncome: 8900000, status: "paid", paidDate: "05/05/2025" },
  { id: "2025-03", period: "03/2025", fromDate: "01/03/2025", toDate: "31/03/2025", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 2200000, allowance: 1000000, deduction: 600000, grossIncome: 9200000, netIncome: 8600000, status: "paid", paidDate: "05/04/2025" },
  { id: "2025-02", period: "02/2025", fromDate: "01/02/2025", toDate: "28/02/2025", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 2000000, allowance: 800000, deduction: 500000, grossIncome: 8800000, netIncome: 8300000, status: "paid", paidDate: "05/03/2025" },
  { id: "2025-01", period: "01/2025", fromDate: "01/01/2025", toDate: "31/01/2025", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 1800000, allowance: 800000, deduction: 500000, grossIncome: 8600000, netIncome: 8100000, status: "paid", paidDate: "05/02/2025" },
  { id: "2024-12", period: "12/2024", fromDate: "01/12/2024", toDate: "31/12/2024", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 2000000, allowance: 800000, deduction: 500000, grossIncome: 8800000, netIncome: 8300000, status: "paid", paidDate: "05/01/2025" },
  { id: "2024-11", period: "11/2024", fromDate: "01/11/2024", toDate: "30/11/2024", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 1600000, allowance: 800000, deduction: 400000, grossIncome: 8400000, netIncome: 8000000, status: "paid", paidDate: "05/12/2024" },
  { id: "2024-10", period: "10/2024", fromDate: "01/10/2024", toDate: "31/10/2024", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 1500000, allowance: 600000, deduction: 400000, grossIncome: 8100000, netIncome: 7700000, status: "paid", paidDate: "05/11/2024" },
  { id: "2024-09", period: "09/2024", fromDate: "01/09/2024", toDate: "30/09/2024", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 1500000, allowance: 600000, deduction: 400000, grossIncome: 8100000, netIncome: 7700000, status: "paid", paidDate: "05/10/2024" },
  { id: "2024-08", period: "08/2024", fromDate: "01/08/2024", toDate: "31/08/2024", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 1400000, allowance: 600000, deduction: 400000, grossIncome: 8000000, netIncome: 7600000, status: "paid", paidDate: "05/09/2024" },
  { id: "2024-07", period: "07/2024", fromDate: "01/07/2024", toDate: "31/07/2024", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 1300000, allowance: 600000, deduction: 400000, grossIncome: 7900000, netIncome: 7500000, status: "paid", paidDate: "05/08/2024" },
  { id: "2024-06", period: "06/2024", fromDate: "01/06/2024", toDate: "30/06/2024", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 1200000, allowance: 600000, deduction: 400000, grossIncome: 7800000, netIncome: 7400000, status: "paid", paidDate: "05/07/2024" },
  { id: "2024-05", period: "05/2024", fromDate: "01/05/2024", toDate: "31/05/2024", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 1200000, allowance: 500000, deduction: 400000, grossIncome: 7700000, netIncome: 7300000, status: "paid", paidDate: "05/06/2024" },
  { id: "2024-04", period: "04/2024", fromDate: "01/04/2024", toDate: "30/04/2024", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 1100000, allowance: 500000, deduction: 400000, grossIncome: 7600000, netIncome: 7200000, status: "paid", paidDate: "05/05/2024" },
  { id: "2024-03", period: "03/2024", fromDate: "01/03/2024", toDate: "31/03/2024", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 1000000, allowance: 500000, deduction: 400000, grossIncome: 7500000, netIncome: 7100000, status: "paid", paidDate: "05/04/2024" },
  { id: "2024-02", period: "02/2024", fromDate: "01/02/2024", toDate: "29/02/2024", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 1000000, allowance: 500000, deduction: 400000, grossIncome: 7500000, netIncome: 7100000, status: "paid", paidDate: "05/03/2024" },
  { id: "2024-01", period: "01/2024", fromDate: "01/01/2024", toDate: "31/01/2024", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 900000, allowance: 500000, deduction: 400000, grossIncome: 7400000, netIncome: 7000000, status: "paid", paidDate: "05/02/2024" },
  { id: "2023-12", period: "12/2023", fromDate: "01/12/2023", toDate: "31/12/2023", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 900000, allowance: 500000, deduction: 400000, grossIncome: 7400000, netIncome: 7000000, status: "paid", paidDate: "05/01/2024" },
  { id: "2023-11", period: "11/2023", fromDate: "01/11/2023", toDate: "30/11/2023", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 800000, allowance: 400000, deduction: 400000, grossIncome: 7200000, netIncome: 6800000, status: "paid", paidDate: "05/12/2023" },
  { id: "2023-10", period: "10/2023", fromDate: "01/10/2023", toDate: "31/10/2023", incomeType: "Lương tháng", baseSalary: 6000000, bonus: 800000, allowance: 400000, deduction: 400000, grossIncome: 7200000, netIncome: 6800000, status: "paid", paidDate: "05/11/2023" },
];

export const CURRENT_STATS: PayrollStats = {
  grossIncome: 11300000,
  baseSalary: 6000000,
  bonus: 2800000,
  allowance: 1200000,
  deduction: 700000,
  netIncome: 10600000,
  monthLabel: "05/2025",
};

export const INCOME_TREND: IncomePoint[] = [
  { label: "12/2024", amount: 8800000 },
  { label: "01/2025", amount: 8600000 },
  { label: "02/2025", amount: 8800000 },
  { label: "03/2025", amount: 9200000 },
  { label: "04/2025", amount: 9500000 },
  { label: "05/2025", amount: 11300000 },
];

export const PAYMENT_SCHEDULE: PaymentScheduleRow[] = [
  { id: 1, period: "Kỳ lương 05/2025", paidDate: "05/06/2025", status: "paid" },
  { id: 2, period: "Kỳ lương 06/2025", paidDate: "05/07/2025", status: "pending" },
  { id: 3, period: "Kỳ lương 07/2025", paidDate: "05/08/2025", status: "pending" },
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
  { id: 1, title: "Lương tháng 05/2025 đã được tạo", time: "15/05/2025 09:30" },
  { id: 2, title: "Bảng lương đã được duyệt", time: "15/05/2025 10:15" },
  { id: 3, title: "Thanh toán lương tháng 04/2025", time: "05/05/2025 14:20" },
];

// Chỉ kỳ mẫu 05/2025 có breakdown đầy đủ; kỳ khác suy từ dòng bảng (`buildDetailFromPeriod`).
export const PAYROLL_DETAIL_SAMPLE: PayrollDetail = {
  id: "2025-05",
  period: "05/2025",
  teacherName: "Cô Ngọc",
  teacherCode: "GV00123",
  teacherRole: "Giáo viên",
  teacherTitle: "Giáo viên Tiếng Anh",
  department: "Giảng dạy",
  joinDate: "10/08/2023",
  bankAccount: "1234 5678 9012 - MB Bank",
  payDate: "05/06/2025",
  paidDate: "05/06/2025",
  status: "paid",
  paymentMethod: "Chuyển khoản ngân hàng",
  netIncome: 10600000,
  grossIncome: 11300000,
  totalDeduction: 700000,
  salaryItems: [
    { label: "Lương cơ bản", detail: "Theo hợp đồng lao động", amount: 6000000 },
    { label: "Phụ cấp trách nhiệm", detail: "Giáo viên chủ nhiệm", amount: 1200000 },
    { label: "Phụ cấp chuyên cần", detail: "Không nghỉ trễ trong tháng", amount: 700000 },
  ],
  bonusItems: [
    { label: "Thưởng hiệu suất", detail: "Hoàn thành chỉ tiêu giảng dạy", amount: 2800000 },
    { label: "Thưởng khác", detail: "Đánh giá từ học viên", amount: 600000 },
  ],
  deductionItems: [
    { label: "Bảo hiểm xã hội", detail: "5% lương cơ bản", amount: 300000 },
    { label: "Bảo hiểm y tế", detail: "1.5% lương cơ bản", amount: 90000 },
    { label: "Bảo hiểm thất nghiệp", detail: "1% lương cơ bản", amount: 60000 },
    { label: "Thuế TNCN", detail: "Tạm tính tháng 05/2025", amount: 250000 },
  ],
  classIncome: [
    { id: 1, className: "Tiếng Anh A2 - Ca tối (T2, 4, 6)", subject: "Tiếng Anh", studentCount: 18, sessionCount: 12, unitPrice: 200000, total: 2400000 },
    { id: 2, className: "Tiếng Anh B1 - Ca sáng (T3, 5, 7)", subject: "Tiếng Anh", studentCount: 16, sessionCount: 13, unitPrice: 200000, total: 2600000 },
    { id: 3, className: "Tiếng Anh giao tiếp - T7/CN", subject: "Tiếng Anh", studentCount: 12, sessionCount: 4, unitPrice: 200000, total: 800000 },
    { id: 4, className: "Lớp kèm 1-1", subject: "Tiếng Anh", studentCount: 3, sessionCount: 6, unitPrice: 250000, total: 1500000 },
  ],
  classIncomeTotal: 7300000,
  accountantNote:
    "Bảng lương tháng 05/2025 đã được duyệt. Cảm ơn cô đã hoàn thành tốt công việc!",
  extraNotes: [
    "Lương được tính dựa trên số buổi dạy thực tế và hiệu suất công việc.",
    "Mọi thắc mắc vui lòng liên hệ phòng Kế toán.",
    "Bảng lương này được tạo tự động bởi hệ thống.",
  ],
  timeline: [
    { id: 1, title: "Đã tạo bảng lương", time: "28/05/2025 09:15 bởi Hệ thống", icon: "created" },
    { id: 2, title: "Đã duyệt bảng lương", time: "29/05/2025 14:30 bởi Kế toán", icon: "approved" },
    { id: 3, title: "Đã thanh toán", time: "05/06/2025 09:20", icon: "paid" },
    { id: 4, title: "Đã chuyển khoản", time: "05/06/2025 09:25", transactionCode: "MB202506050925123456", icon: "transfer" },
  ],
};

// Giữ đúng con số của dòng bảng; khấu trừ tách theo tỷ lệ mẫu (BHXH 5% / BHYT 1.5% / BHTN 1% / còn lại = thuế).
export const buildDetailFromPeriod = (p: PayrollPeriod): PayrollDetail => {
  const sample = PAYROLL_DETAIL_SAMPLE;
  const bhxh = Math.round(p.baseSalary * 0.05);
  const bhyt = Math.round(p.baseSalary * 0.015);
  const bhtn = Math.round(p.baseSalary * 0.01);
  const tax = Math.max(0, p.deduction - bhxh - bhyt - bhtn);

  return {
    ...sample,
    id: p.id,
    period: p.period,
    payDate: p.paidDate,
    paidDate: p.paidDate,
    status: p.status,
    netIncome: p.netIncome,
    grossIncome: p.grossIncome,
    totalDeduction: p.deduction,
    salaryItems: [
      { label: "Lương cơ bản", detail: "Theo hợp đồng lao động", amount: p.baseSalary },
      { label: "Phụ cấp", detail: "Phụ cấp trách nhiệm & chuyên cần", amount: p.allowance },
    ],
    bonusItems: [{ label: "Thưởng hiệu suất", detail: "Hoàn thành chỉ tiêu giảng dạy", amount: p.bonus }],
    deductionItems: [
      { label: "Bảo hiểm xã hội", detail: "5% lương cơ bản", amount: bhxh },
      { label: "Bảo hiểm y tế", detail: "1.5% lương cơ bản", amount: bhyt },
      { label: "Bảo hiểm thất nghiệp", detail: "1% lương cơ bản", amount: bhtn },
      { label: "Thuế TNCN", detail: `Tạm tính tháng ${p.period}`, amount: tax },
    ],
  };
};

export const getPayrollDetail = (id: string): PayrollDetail | undefined => {
  if (id === PAYROLL_DETAIL_SAMPLE.id) return PAYROLL_DETAIL_SAMPLE;
  const period = PAYROLL_PERIODS.find((p) => p.id === id);
  return period ? buildDetailFromPeriod(period) : undefined;
};
