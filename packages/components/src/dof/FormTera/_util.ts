import { timeFormat } from "@tera/commons/constants/common";
import { IRuleValidation, IValidateReturn } from "./_interfaces";
import moment from "moment";

export function checkValidateForm(
  props: IRuleValidation,
  validateDefault: IValidateReturn,
): IValidateReturn {
  const validate = validateDefault || {};

  if (props?.min?.value || props?.max?.value) {
    validate["isNumber"] = (value) => !isNaN(value) || "Nhập một số hợp lệ";
  }
  if (props?.maxDate) {
    validate["maxDate"] = (currentValue, state) => {
      if (
        moment(currentValue, timeFormat.date_time)?.isAfter(
          moment(state?.[props?.maxDate?.key], timeFormat.date_time),
          "minutes",
        )
      ) {
        return props?.maxDate?.message;
      }

      return true;
    };
  }
  if (props?.minDate) {
    validate["minDate"] = (currentValue, state) => {
      if (
        moment(currentValue, timeFormat.date_time)?.isBefore(
          moment(state?.[props?.minDate?.key], timeFormat.date_time),
          "minutes",
        )
      ) {
        return props?.minDate?.message;
      }
      return true;
    };
  }

  if (props?.pattern) {
    validate["isRegex"] = (currentValue) => {
      if (currentValue && !props?.pattern.value.test(currentValue)) {
        return props?.pattern?.message;
      }
      return true;
    };
  }

  if (props?.required) {
    validate["required"] = (currentValue) => {
      const trimmedData = currentValue ?? "";
      if (typeof trimmedData === "string" && trimmedData.trim() === "") {
        return props?.pattern?.message ?? (props?.required as string);
      }
      return true;
    };
  }
  return validate;
}
