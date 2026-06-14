export interface AppConfig {
  apiUrl: string;
  apiKey: string;
}

let _config: AppConfig;

export const setConfig = (config: AppConfig) => {
  _config = config;
};

export const getConfig = () => {
  if (!_config) throw new Error("Config chưa được khởi tạo!");
  return _config;
};

export const endpointSocket = process.env.EXPO_PUBLIC_SOCKET_URL;
export const endpointAuth = `${process.env.EXPO_PUBLIC_API_URL}/api/auth`;
export const endpointPortal = `${process.env.EXPO_PUBLIC_API_URL}/portal/api`;
export const endpointCRM = `${process.env.EXPO_PUBLIC_API_URL}/crm/api`;
export const appVersion = process.env.EXPO_PUBLIC_APP_VERSION
  ? Number(process.env.EXPO_PUBLIC_APP_VERSION)
  : 1;
export const dbName = process.env.EXPO_PUBLIC_DB_NAME || "db_tera_fnb";

export const viLocale = {
  save: "Lưu",
  selectSingle: "Chọn ngày",
  selectMultiple: "Chọn nhiều ngày",
  selectRange: "Chọn khoảng ngày",
  notAllowed: "Không được phép",
  typeDate: "Nhập ngày",
  invalidCharacter: "Ký tự không hợp lệ",
  pickDateFromCalendar: "Chọn từ lịch",
  close: "Đóng",
  previous: "Tháng trước",
  next: "Tháng sau",
  // --- Bổ sung các trường còn thiếu để fix lỗi ts(2345) ---
  hour: "Giờ",
  minute: "Phút",
  label: "Chọn thời gian", // Nhãn chung
  typeTime: "Nhập thời gian",
  am: "AM",
  pm: "PM",
  notAccordingToDateFormat: (inputFormat: string) =>
    `Định dạng ngày phải là ${inputFormat}`,
  mustBeHigherThan: (date: string) => `Phải sau ngày ${date}`,
  mustBeLowerThan: (date: string) => `Phải trước ngày ${date}`,
  mustBeBetween: (startDate: string, endDate: string) =>
    `Phải nằm trong khoảng ${startDate} - ${endDate}`,
  dateIsDisabled: "Ngày này không khả dụng",
};

export const DATE_FORMAT = "DD/MM/YYYY";
export const DATE_BACKEND_FORMAT = "YYYY-MM-DD";
export const DATE_TIME_BACKEND_FORMAT = "YYYY-MM-DD - HH:mm:ss";
export const DATE_TIME_FORMAT = "DD/MM/YYYY - HH:mm";
export const LIMIT_MAX_DATE_TIME = "01/01/2038";
export const LIMIT_MIN_DATE_TIME = "01/01/1970";
export const LOCATION_KEY = "location_id";
export const MAXIMUM_CURRENCY = 999999999999999;
export const MAXIMUM_QUANTITY = 9999;

export const LocalStorage = {
  Token: "tera_cms_token",
  Device: "tera_device_init",
  Permission: "tera_permission",
  StockId: "tera_stock_id",
  LocationId: "tera_location_id",
  RefCode: "tera_ref_code",
};

// const isDev = process.env.NODE_ENV === 'development';

export const endpointMockData =
  "https://c271729d-0a4c-448c-9d8b-f8523695ef42.mock.pstmn.io";

export const config = {
  google: {
    clientID: "",
    keyGMap: "",
  },
  fbConfig: {
    appId: "",
    version: "v1.0",
  },
  hasHeader: false,
  hasMobile: true,
  templates: ["tera"],
  languages: ["vn"],
  app: {},
  uploadKey: "9074c259a7",
  appId: "2",
  privateKey: process.env.EXPO_PUBLIC_TERA_PRIVATE_KEY,
};

export const gender = {
  male: "Nam",
  female: "Nữ",
};

export const genderFull = {
  all: "Tất cả",
  male: "Nam",
  female: "Nữ",
};

export const REGEX = {
  PHONE_NUMBER: /^[0-9+ \-]{8,20}$/,
  KEY: /^[a-z]*$/,
  CODE: /^[a-zA-Z0-9_]*$/,
  EMAIL: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)*(\.[a-zA-Z]{2,})$/,
  IDENTIFY_NUMBER: /^(?:[0-9]{9,12})?$/,
  WEBSITE: /^(https?|ftp):\/\/([^\s\/]+)(\/[^\s]*)*$/,
  PASSWORD: /^[a-zA-Z0-9!@#$%^&*()_+=-]+$/,
  USERNAME: /^[a-zA-Z0-9!@#$%^&*()_+=\-\.]+$/,
};

export const month = {
  1: "Tháng 1",
  2: "Tháng 2",
  3: "Tháng 3",
  4: "Tháng 4",
  5: "Tháng 5",
  6: "Tháng 6",
  7: "Tháng 7",
  8: "Tháng 8",
  9: "Tháng 9",
  10: "Tháng 10",
  11: "Tháng 11",
  12: "Tháng 12",
};

export const timeFormat = {
  date_time: "DD/MM/YYYY HH:mm",
  YYYY_MM_DD: "YYYY/MM/DD HH:mm",
  time_half: "hh:mm",
  time_full: "HH:mm",
};

export const TypesOverTime = {
  weekday: "Ngày thường",
  weekday_night: "Ngày thường (đêm)",
  off: "Ngày nghỉ",
  off_night: "Ngày nghỉ (đêm)",
  holiday: "Ngày lễ",
  holiday_night: "Ngày lễ (đêm)",
};

export const TypesOverForm = {
  payroll: "Tính lương",
  compensatory_leave: "Nghỉ bù",
};

export const StatusYesNo = {
  0: {
    title: "Không",
    color: "red03",
  },
  1: {
    title: "Có",
    color: "green03",
  },
};

export const optionsCustom = {
  label: "Đứng đầu",
  value: 0,
};

export const PAGE_KEY = {
  PRICE_QUOTATION: "crm_quotation",
};

export const STATUS_APPROVAL = {
  CANCEL: "cancel",
};

export const HEADING_CLASS_NAME = "text-main text-base font-medium mb-6";
export const TITLE_CLASS_NAME = "text-[#343C6A] text-2xl font-light";
export const BTN_PRIMARY_LIGHT =
  "text-main border border-main bg-main-100 hover:bg-blue-50 hover:text-main py-2.5 px-5 w-max";
export const BTN_PRIMARY =
  "bg-main py-2.5 px-5 w-max hover:bg-main-500 text-white hover:text-white";
export const labelClassName = "min-w-[200px] text-[#1B1B28] items-start";
