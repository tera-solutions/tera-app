import { CalendarCheck, Clock3, ScanLine, Wallet } from 'lucide-react-native';

/**
 * Chưa có API bảng lương giáo viên nào được xác nhận: `TeacherSalaryAPI`
 * (`services/api/src/hr/teacher-salary`) chỉ là scaffold CRUD với route
 * `hr/teacher-salary/*`, KHÔNG có service hook (`useTeacherSalaryList`...)
 * đi kèm, và chưa từng được dùng ở web lẫn app — không có gì để đối chiếu
 * field. Toàn bộ dữ liệu dưới đây là mẫu minh họa, cần thay bằng dữ liệu
 * thật khi có API + hook xác nhận.
 */
export const SEED_PAYSLIP = {
  employeeName: 'Nguyễn Thị Ngọc',
  role: 'Giáo viên Tiếng Anh',
  employeeCode: 'GV00123',
  department: 'Giảng dạy',
  period: '05/2025',
  periodRange: '01/05/2025 - 31/05/2025',
  paymentDate: '05/06/2025',
  totalIncome: 15850000,
  totalDeduction: 1500000,
  netPay: 14350000,
  netPayInWords: 'Mười bốn triệu ba trăm năm mươi nghìn đồng chẵn',
  workDays: '26/26 ngày',
  teachingHours: '104 giờ',
  status: 'approved' as const,
  note: 'Cảm ơn cô đã luôn nỗ lực và đồng hành cùng Hana Edu!',
  incomeItems: [
    { id: 'base', label: 'Lương cơ bản', amount: 8000000 },
    { id: 'attendance', label: 'Phụ cấp chuyên cần', amount: 1000000 },
    { id: 'seniority', label: 'Phụ cấp thâm niên', amount: 1200000 },
    { id: 'class', label: 'Phụ cấp đứng lớp', amount: 3200000 },
    { id: 'performance', label: 'Thưởng hiệu suất', amount: 1000000 },
    { id: 'other_bonus', label: 'Thưởng khác', amount: 450000 },
  ],
  deductionItems: [
    { id: 'bhyt', label: 'BHYT (1.5%)', amount: 120000 },
    { id: 'bhxh', label: 'BHXH (8%)', amount: 640000 },
    { id: 'bhtn', label: 'BHTN (1%)', amount: 80000 },
    { id: 'pit', label: 'Thuế TNCN', amount: 660000 },
  ],
};

export const STATS = [
  { id: 'income', label: 'Tổng thu nhập', valueKey: 'totalIncome', icon: Wallet, color: '#0066cc' },
  { id: 'deduction', label: 'Tổng khấu trừ', valueKey: 'totalDeduction', icon: ScanLine, color: '#16A34A' },
  { id: 'workdays', label: 'Số ngày công', valueKey: 'workDays', icon: CalendarCheck, color: '#F97316' },
  { id: 'hours', label: 'Tổng giờ dạy', valueKey: 'teachingHours', icon: Clock3, color: '#9333EA' },
];
