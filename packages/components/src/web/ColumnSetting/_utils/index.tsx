import _ from "lodash";

export const mergeArrayObjectForSettingColumns = (
  originalArray: Array<{ [key: string]: any }> = [],
  newArray: Array<{ [key: string]: any }> = [],
  key: string,
) => {
  const mergedObject = _.mergeWith(
    _.keyBy(newArray, key),
    _.keyBy(originalArray, key),
    (originalValue, newValue) => {
      if (!!originalValue?.[key] && !!newValue?.[key]) {
        return { ...originalValue, ...newValue };
      }
      if (!!originalValue?.[key] && !newValue?.[key]) return originalValue;

      return null;
    },
  );
  return _.values(mergedObject).filter((item) => item != null);
};
