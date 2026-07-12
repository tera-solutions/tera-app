import { ExamDetailTab, ExamResultGrade, ExamStatus, RegistrationStatus } from './types';

export const DETAIL_TABS: { key: ExamDetailTab; label: string; iconName: string }[] = [
  { key: 'overview', label: 'Tổng quan', iconName: 'chart-pie' },
  { key: 'questions', label: 'Câu hỏi', iconName: 'file-document-outline' },
  { key: 'results', label: 'Kết quả', iconName: 'chart-bar' },
  { key: 'students', label: 'Học viên', iconName: 'account-group-outline' },
  { key: 'settings', label: 'Cài đặt', iconName: 'cog-outline' },
];

export const STATUS_CONFIG: Record<ExamStatus, { label: string; bg: string; color: string }> = {
  scheduled: { label: 'Chưa bắt đầu', bg: '#F1F5F9', color: '#64748B' },
  in_progress: { label: 'Đang diễn ra', bg: '#F0FDF4', color: '#16A34A' },
  closed: { label: 'Đã đóng', bg: '#EEF5FF', color: '#0066CC' },
};

export const REGISTRATION_STATUS_LABEL: Record<RegistrationStatus, string> = {
  registered: 'Đã đăng ký',
  in_progress: 'Đang làm bài',
  submitted: 'Đã nộp bài',
  absent: 'Vắng thi',
  graded: 'Đã chấm điểm',
  published: 'Đã công bố điểm',
};

export const GRADE_LABEL: Record<ExamResultGrade, { label: string; color: string }> = {
  excellent: { label: 'Xuất sắc', color: '#10B981' },
  good: { label: 'Giỏi', color: '#38BDF8' },
  pass: { label: 'Đạt', color: '#F59E0B' },
  fail: { label: 'Chưa đạt', color: '#EF4444' },
};

// ── Mock data — chưa có API riêng cho các tab này ──────────────────

export const MOCK_QUESTIONS = [
  { id: 'q1', no: 1, type: 'Trắc nghiệm', content: 'Chọn đáp án đúng: "She ___ to school every day."', score: 1 },
  { id: 'q2', no: 2, type: 'Trắc nghiệm', content: 'Nghe và chọn từ đúng với đoạn hội thoại.', score: 1 },
  { id: 'q3', no: 3, type: 'Tự luận', content: 'Viết đoạn văn ngắn (3-5 câu) giới thiệu về gia đình em.', score: 3 },
  { id: 'q4', no: 4, type: 'Tự luận', content: 'Sắp xếp các từ sau thành câu hoàn chỉnh.', score: 2 },
];

export const MOCK_STUDENT_CONTACTS = [
  { id: 'c1', name: 'Nguyễn Minh Anh', parentName: 'Anh Nguyễn Văn Hùng', parentPhone: '090xxxxxx1' },
  { id: 'c2', name: 'Trần Bảo Châu', parentName: 'Chị Trần Thị Lan', parentPhone: '090xxxxxx2' },
  { id: 'c3', name: 'Lê Hoàng Nam', parentName: 'Anh Lê Văn Sơn', parentPhone: '090xxxxxx3' },
];

export const MOCK_SETTINGS = [
  { id: 's1', label: 'Cho phép học viên xem lại bài làm', iconName: 'eye-outline', value: true },
  { id: 's2', label: 'Công khai điểm cho phụ huynh', iconName: 'account-heart-outline', value: true },
  { id: 's3', label: 'Gửi thông báo khi có điểm mới', iconName: 'bell-ring-outline', value: false },
  { id: 's4', label: 'Cho phép nộp bài trễ', iconName: 'clock-alert-outline', value: false },
];
