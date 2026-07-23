import type { SettingsTabKey } from "./_interface";

export const SETTINGS_TABS: { key: SettingsTabKey; label: string }[] = [
  { key: "profile", label: "Hồ sơ cá nhân" },
  { key: "password", label: "Đổi mật khẩu" },
  { key: "notification", label: "Thông báo" },
  { key: "general", label: "Tùy chọn chung" },
  { key: "appearance", label: "Giao diện" },
  { key: "bank_account", label: "Tài khoản nhận học phí" },
  { key: "recurring_invoice", label: "Hóa đơn định kỳ" },
  { key: "evaluation_criteria", label: "Bảng tiêu chí đánh giá" },
];

// VietQR bank identifiers (BIN) for the common list — https://api.vietqr.io/v2/banks.
// Any bank_code value is accepted by the backend; this is just a convenience picker.
export const VIETQR_BANKS = [
  { value: "970422", label: "MB Bank" },
  { value: "970436", label: "Vietcombank" },
  { value: "970407", label: "Techcombank" },
  { value: "970418", label: "BIDV" },
  { value: "970415", label: "VietinBank" },
  { value: "970405", label: "Agribank" },
  { value: "970416", label: "ACB" },
  { value: "970432", label: "VPBank" },
  { value: "970423", label: "TPBank" },
  { value: "970403", label: "Sacombank" },
];

export const NOTIFICATION_SETTINGS = [
  { key: "notification.new_message", label: "Thông báo tin nhắn", description: "Nhận thông báo khi có tin nhắn mới" },
  { key: "notification.new_assignment", label: "Thông báo bài tập", description: "Nhận thông báo khi có bài tập mới" },
  { key: "notification.attendance", label: "Thông báo điểm danh", description: "Nhận thông báo điểm danh hàng ngày" },
  { key: "notification.system", label: "Thông báo hệ thống", description: "Các thông báo quan trọng từ hệ thống" },
];

export const TIMEZONE_OPTIONS = [
  { value: "Asia/Bangkok", label: "(GMT+07:00) Bangkok, Hà Nội, Jakarta" },
  { value: "Asia/Tokyo", label: "(GMT+09:00) Tokyo, Seoul" },
  { value: "UTC", label: "(GMT+00:00) UTC" },
];

export const DATE_FORMAT_OPTIONS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

export const TIME_FORMAT_OPTIONS = [
  { value: "24h", label: "24 giờ" },
  { value: "12h", label: "12 giờ" },
];

export const PAGE_SIZE_SETTING_OPTIONS = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
];

export const THEME_MODE_OPTIONS = [
  { value: "light", label: "Sáng" },
  { value: "dark", label: "Tối" },
  { value: "system", label: "Theo hệ thống" },
];

export const THEME_COLOR_OPTIONS = [
  { value: "sky", hex: "#0ea5e9" },
  { value: "emerald", hex: "#10b981" },
  { value: "violet", hex: "#8b5cf6" },
  { value: "amber", hex: "#f59e0b" },
  { value: "red", hex: "#ef4444" },
];

export const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
];
