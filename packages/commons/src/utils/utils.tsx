import { StarOutlined } from 'tera-dls';
import _, { isArray, isNumber } from "lodash";
import moment from "moment";
import numeral from "numeral";
import { notification } from "tera-dls";

export const renderRating = (star: number) => {
  return (
    <div className="flex gap-x-1 text-yellow-300">
      {[1, 2, 3, 4, 5].map((rate) =>
        rate <= Number(star) ? (
          <StarOutlined className="size-4 fill-yellow-300" />
        ) : (
          <StarOutlined className="size-4" />
        ),
      )}
    </div>
  );
};

numeral.localeData().delimiters.thousands = ",";

export function formatNumber(value = 0, format = "0,0") {
  if (value === null || value === undefined) return "0";
  return numeral(value).format(format);
}

export function formatDate(value, format = "DD/MM/YYYY", type?) {
  return value && value !== "0000-00-00 00:00:00"
    ? moment(value, type).format(format)
    : "";
}

function isValidDate(dateString) {
  if (!dateString) {
    return false;
  }
  const date = new Date(dateString);
  return !isNaN(Number(date?.getTime()));
}

export function formatDateInput(value) {
  const newDate = isValidDate(value) ? new Date(value) : null;
  return newDate ? moment(newDate).format("YYYY-MM-DD") : "";
}

export function formatDateTimeInput(value) {
  const newDate = isValidDate(value) ? new Date(value) : null;
  return newDate ? moment(newDate).format("YYYY-MM-DD HH:mm:ss") : "";
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

export const parserParamsArray = (param) => {
  if (typeof param === "object" && param !== null) {
    const convertedObj = {};

    for (const key in param) {
      if (Array.isArray(param[key])) {
        convertedObj[key] = param[key].join(",");
      } else {
        convertedObj[key] = param[key];
      }
    }

    return convertedObj;
  }
  return param;
};

export const getMomentData = (data) => {
  return data ? moment(data, "hh:mm:ss") : null;
};

export function checkFileType(file_name) {
  const imageType = ["jpeg", "jpg", "png", "gif"];
  const pdfType = ["pdf"];
  const docType = ["doc", "docx"];
  const excelType = ["xlsx", "csv", "txt", "xltx"];
  const zipType = ["zip", "rar"];
  const zipOther = ["apk", "psd", "ai", "sql"];
  const audioType = [
    "avi",
    "mov",
    "webm",
    "mp4",
    "m4p",
    "mpg",
    "mp2",
    "mpeg",
    "mpe",
    "mpv",
    "m4v",
    "svi",
  ];

  const fileNameSplit = file_name.split(".");
  const fileName = fileNameSplit[fileNameSplit?.length - 1];
  let type = "file";
  if (imageType.indexOf(fileName) > -1) {
    type = "image";
  } else if (pdfType.indexOf(fileName) > -1) {
    type = "pdf";
  } else if (docType.indexOf(fileName) > -1) {
    type = "word";
  } else if (excelType.indexOf(fileName) > -1) {
    type = "excel";
  } else if (zipType.indexOf(fileName) > -1) {
    type = "zip";
  } else if (audioType.indexOf(fileName) > -1) {
    type = "audio";
  } else if (zipOther.indexOf(fileName) > -1) {
    type = "other";
  }

  return type;
}

export const filterField = (params) => {
  const newParams = _.pickBy(params);
  return newParams;
};

export const mergeField = (...params) => {
  const newObj = _.merge({}, ...params);
  return newObj;
};

export const generateNumberDigit = (value: number | string) => {
  return value.toString().padStart(5, "0");
};

export const mergeArrayObjectByKey = (
  originalArray: Array<{ [key: string]: any }> = [],
  newArray: Array<{ [key: string]: any }> = [],
  key: string,
) => {
  const mergedObject = _.merge(
    _.keyBy(originalArray, key),
    _.keyBy(newArray, key),
  );
  return _.values(mergedObject);
};

export const mergeArrayObjectByKeyDependOnNewArray = (
  originalArray: Array<{ [key: string]: any }> = [],
  newArray: Array<{ [key: string]: any }> = [],
  key: string,
) => {
  const mergedObject = _.mergeWith(
    _.keyBy(newArray, key),
    _.keyBy(originalArray, key),
    (originalValue, newValue) => {
      if (!!originalValue?.[key] && !!newValue?.[key]) {
        return { ...newValue, ...originalValue };
      }
      if (!!originalValue?.[key] && !newValue?.[key]) return originalValue;

      return null;
    },
  );
  return _.values(mergedObject).filter((item) => item != null);
};

export const convertArrToString = (arr: string[], separate = " - ") => {
  return arr
    .filter((item) => Boolean(typeof item === "string" && !!item))
    .join(separate);
};

export const convertSize = (sizeBytes: number) => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;

  while (sizeBytes >= 1024 && index < units.length - 1) {
    sizeBytes /= 1024;
    index++;
  }

  return `${sizeBytes.toFixed(0)} ${units[index]}`;
};

export const convertCurrency = (sizeBytes: number) => {
  const units = ["", "", "Tr", "Tỷ"];
  let index = 0;

  while (sizeBytes >= 1024 && index < units.length - 1) {
    sizeBytes /= 1000;
    index++;
  }

  return `${sizeBytes.toFixed(0)} ${units[index]}`;
};

export const trimData = (code: string): string => {
  return code?.split(" ")?.join("");
};

export const convertListOrder = (
  listFieldOrder: any[],
  id: number | string,
  fieldDetail: any,
) => {
  const fistItem = { value: 0, label: "Đứng đầu" };
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

export const calcHeightTable = () => {
  const heightMenu = document.getElementById("header_menu").clientHeight;
  const heightHeader = document.getElementById("header").clientHeight;
  const heightHeaderViewList =
    document.getElementById("header_view_list").clientHeight;
  const heightMinus =
    heightMenu + heightHeader + heightHeaderViewList + 40 + 56 + 76;
  // 40: padding layout, 56: pagination, 76: headerTable
  return heightMinus;
};

export const getTimeRender = (TimeDrop) => {
  const timeDropMoment = moment(TimeDrop);
  const dayAgo = moment().diff(timeDropMoment, "days");
  const hourAgo = moment().diff(timeDropMoment, "hours");
  const minuteAgo = moment().diff(timeDropMoment, "minutes");
  const secondAgo = moment().diff(timeDropMoment, "seconds");

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

export function flattenObject(obj) {
  let result = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = key;
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        const nestedObj = flattenObject(obj[key]);
        result = { ...result, ...nestedObj };
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
}

export const convertArrayToObject = (array: any, key = "id") =>
  [...(array ?? [])].reduce((prev, cur, index) => {
    prev[String(cur[key])] = { ...cur, index };
    return prev;
  }, {});

export const getTabSummaryCount = (
  summary,
  keyTab: string,
  field: string,
): number => {
  const data = summary?.find((item) => item?.[field] === keyTab);
  return data?.total_count ?? 0;
};

export const orderRender = (order: string) => {
  if (!order) return 1;
  return Number(order) + 1;
};

export function hasDuplicateElements(array) {
  const seen = {};

  for (const element of array) {
    if (seen[element]) {
      return true;
    }
    seen[element] = true;
  }

  return false;
}
export const convertOrderSort = (order) => {
  switch (order) {
    case "ascend":
      return "asc";
    case "descend":
      return "desc";
    default:
      return "";
  }
};

export const mergeAlternate = (obj1, obj2) => {
  const merged = {};
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  for (let i = 0; i < keys1.length; i++) {
    merged[keys1[i]] = obj1[keys1[i]];
    merged[keys2[i]] = obj2[keys2[i]];
  }

  return merged;
};

export const renderTotalCount = (list, status) => {
  const item = list?.find((i) => String(i?.status) === String(status));
  return item?.total_count || 0;
};

export const convertBytes = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes == 0) {
    return "n/a";
  }

  const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));

  if (i == 0) {
    return bytes + " " + sizes[i];
  }

  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
};

export const copyText = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      notification.success({ message: "Đã sao chép" });
    })
    .catch(() => {
      notification.error({ message: "Không thể sao chép" });
    });
};

export const getStatusSummaryCount = (summary, status: string): number => {
  const data = summary?.find((item) => item.status === status);
  return data?.total_count ?? 0;
};
