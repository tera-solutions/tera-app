/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const endpointSocket = process.env.EXPO_PUBLIC_SOCKET_URL;
export const endpointAuth = `${process.env.EXPO_PUBLIC_API_URL}/auth/api`;
export const endpointPortal = `${process.env.EXPO_PUBLIC_API_URL}/portal/api`;
export const endpointCRM = `${process.env.EXPO_PUBLIC_API_URL}/crm/api`;
export const appVersion = process.env.EXPO_PUBLIC_APP_VERSION
  ? Number(process.env.EXPO_PUBLIC_APP_VERSION)
  : 1;
export const dbName = process.env.EXPO_PUBLIC_DB_NAME || 'db_tera_fnb';

export const viLocale = {
  save: 'Lưu',
  selectSingle: 'Chọn ngày',
  selectMultiple: 'Chọn nhiều ngày',
  selectRange: 'Chọn khoảng ngày',
  notAllowed: 'Không được phép',
  typeDate: 'Nhập ngày',
  invalidCharacter: 'Ký tự không hợp lệ',
  pickDateFromCalendar: 'Chọn từ lịch',
  close: 'Đóng',
  previous: 'Tháng trước',
  next: 'Tháng sau',
  // --- Bổ sung các trường còn thiếu để fix lỗi ts(2345) ---
  hour: 'Giờ',
  minute: 'Phút',
  label: 'Chọn thời gian', // Nhãn chung
  typeTime: 'Nhập thời gian',
  am: 'AM',
  pm: 'PM',
  notAccordingToDateFormat: (inputFormat: string) =>
    `Định dạng ngày phải là ${inputFormat}`,
  mustBeHigherThan: (date: string) => `Phải sau ngày ${date}`,
  mustBeLowerThan: (date: string) => `Phải trước ngày ${date}`,
  mustBeBetween: (startDate: string, endDate: string) =>
    `Phải nằm trong khoảng ${startDate} - ${endDate}`,
  dateIsDisabled: 'Ngày này không khả dụng',
};
