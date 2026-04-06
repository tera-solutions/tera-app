import AsyncStorage from '@react-native-async-storage/async-storage';
import { isArray, isNumber } from 'lodash';
import moment from 'moment';
import numeral from 'numeral';

numeral.localeData().delimiters.thousands = ',';

export function formatNumber(
  value: string | number | undefined,
  format = '0,0.[000]',
) {
  if (value === '') return '';
  if (value === null || value === undefined) return '0';
  return numeral(value).format(format);
}

export function formatBalance(value = 0, format = '0,0') {
  if (value === null || value === undefined) return '0';
  return numeral(value / 1000).format(format);
}

export function formatCurrency(value = 0, symbol = 'đ', format = '0,0') {
  if (value === null || value === undefined) return '0 đ';

  let currencySymbol = 'đ';
  if (symbol) {
    currencySymbol = symbol;
  }

  return `${numeral(value).format(format)} ${currencySymbol}`;
}

export function formatDate(value: any, format = 'DD/MM/YYYY', type?: string) {
  return value && value !== '0000-00-00 00:00:00'
    ? moment(value, type).format(format)
    : '';
}

function isValidDate(dateString: any) {
  if (!dateString) {
    return false;
  }
  const date = new Date(dateString);
  return !isNaN(Number(date?.getTime()));
}

export function formatDateInput(value: any) {
  const newDate = isValidDate(value) ? new Date(value) : null;
  return newDate ? moment(newDate).format('YYYY-MM-DD') : '';
}

export function formatDateTimeInput(value: any) {
  const newDate = isValidDate(value) ? new Date(value) : null;
  return newDate ? moment(newDate).format('YYYY-MM-DD HH:mm:ss') : '';
}

export function removeKeyFromObject(
  originalObject: Record<string, any>,
  keyToRemove: string,
): Record<string, any> {
  const updatedObject = { ...originalObject };

  if (Object.prototype.hasOwnProperty.call(updatedObject, keyToRemove)) {
    delete updatedObject[keyToRemove];
  }

  return updatedObject;
}

export const getFieldObjToArr = (arr: any[], field: string) => {
  if (!isArray(arr)) return arr;
  const newArr = arr.map((item) => item?.[field]);
  return newArr;
};
export function checkFileType(file_name: string) {
  const imageType = ['jpeg', 'jpg', 'png', 'gif'];
  const pdfType = ['pdf'];
  const docType = ['doc', 'docx'];
  const excelType = ['xlsx', 'csv', 'txt', 'xltx'];
  const zipType = ['zip', 'rar'];
  const zipOther = ['apk', 'psd', 'ai', 'sql'];
  const audioType = [
    'avi',
    'mov',
    'webm',
    'mp4',
    'm4p',
    'mpg',
    'mp2',
    'mpeg',
    'mpe',
    'mpv',
    'm4v',
    'svi',
  ];

  const fileNameSplit = file_name.split('.');
  const fileName = fileNameSplit[fileNameSplit?.length - 1];
  let type = 'file';
  if (imageType.indexOf(fileName) > -1) {
    type = 'image';
  } else if (pdfType.indexOf(fileName) > -1) {
    type = 'pdf';
  } else if (docType.indexOf(fileName) > -1) {
    type = 'word';
  } else if (excelType.indexOf(fileName) > -1) {
    type = 'excel';
  } else if (zipType.indexOf(fileName) > -1) {
    type = 'zip';
  } else if (audioType.indexOf(fileName) > -1) {
    type = 'audio';
  } else if (zipOther.indexOf(fileName) > -1) {
    type = 'other';
  }

  return type;
}

export const convertArrToString = (arr: string[], separate = ' - ') => {
  return arr
    .filter((item) => Boolean(typeof item === 'string' && !!item))
    .join(separate);
};

export const convertSize = (sizeBytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;

  while (sizeBytes >= 1024 && index < units.length - 1) {
    sizeBytes /= 1024;
    index++;
  }

  return `${sizeBytes.toFixed(0)} ${units[index]}`;
};

export const convertCurrency = (sizeBytes: number) => {
  const units = ['', '', 'Tr', 'Tỷ'];
  let index = 0;

  while (sizeBytes >= 1024 && index < units.length - 1) {
    sizeBytes /= 1000;
    index++;
  }

  return `${sizeBytes.toFixed(0)} ${units[index]}`;
};

export const trimData = (code: string): string => {
  return code?.split(' ')?.join('');
};

export const convertListOrder = (
  listFieldOrder: any[],
  id: number | string,
  fieldDetail: any,
) => {
  const fistItem = { value: 0, label: 'Đứng đầu' };
  if (isArray(listFieldOrder)) {
    const arrExist = id
      ? listFieldOrder.filter((field: any) => field?.id !== fieldDetail?.id)
      : listFieldOrder;
    const mapArray = arrExist.map((Order) => ({
      value: isNumber(Order?.order) ? Order?.order : Number(Order?.order),
      label: Order?.title,
    }));
    return [fistItem, ...mapArray];
  }
  return [];
};

export const getTimeRender = (TimeDrop: string) => {
  const timeDropMoment = moment(TimeDrop);
  const dayAgo = moment().diff(timeDropMoment, 'days');
  const hourAgo = moment().diff(timeDropMoment, 'hours');
  const minuteAgo = moment().diff(timeDropMoment, 'minutes');
  const secondAgo = moment().diff(timeDropMoment, 'seconds');

  if (hourAgo === 0 && minuteAgo === 0 && secondAgo < 60) {
    return `${secondAgo} giây trước`;
  }

  if (hourAgo === 0 && minuteAgo < 60) {
    return `${minuteAgo} phút trước`;
  }

  if (dayAgo === 0 && hourAgo < 24) {
    return `${hourAgo} giờ trước`;
  }

  return formatDate(TimeDrop);
};

export const convertArrayToObject = (array: any, key = 'id') =>
  [...(array ?? [])].reduce((prev, cur, index) => {
    prev[String(cur[key])] = { ...cur, index };
    return prev;
  }, {});

export const mergeUniqueArray = (oldItems: any[], newItems: any[]) => {
  const seenIds = new Set(oldItems.map((item) => item.id));
  const filteredNewItems = newItems.filter((item) => !seenIds.has(item.id));
  return [...oldItems, ...filteredNewItems];
};

export const getDataStorage = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);

    // Kiểm tra nếu có dữ liệu thì parse, không thì trả về null
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // Error reading value (VD: lỗi phân quyền hoặc bộ nhớ đầy)
    console.error('AsyncStorage Get Error:', e);
    return null;
  }
};

export const parseValue = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch {
    return value; // Trả về string gốc nếu không phải JSON
  }
};

export const stringifyValue = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
};

export const isJSON = (str: any) => {
  try {
    if (typeof str === 'string') {
      const result = JSON.parse(str);
      return typeof result === 'object' && result !== null;
    }

    return !!str && typeof str === 'object' && str.constructor === Object;
  } catch (e) {
    return false;
  }
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
