import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type UrlFieldType = "string" | "number" | "boolean" | "string[]" | "number[]";

export interface UrlFieldConfig<T> {
  type: UrlFieldType;
  default: T;
  /** URL query key to use instead of the object's own key (e.g. `course_id`). */
  param?: string;
}

export type UrlFiltersConfig<T> = { [K in keyof T]: UrlFieldConfig<T[K]> };

const parseValue = (raw: string | null, config: UrlFieldConfig<any>): any => {
  if (raw === null) return config.default;
  switch (config.type) {
    case "number": {
      const num = Number(raw);
      return Number.isNaN(num) ? config.default : num;
    }
    case "boolean":
      return raw === "true";
    case "string[]":
      return raw === "" ? [] : raw.split(",");
    case "number[]":
      return raw === ""
        ? []
        : raw
            .split(",")
            .map(Number)
            .filter((n) => !Number.isNaN(n));
    default:
      return raw;
  }
};

const isDefaultValue = (value: unknown, defaultValue: unknown): boolean => {
  if (Array.isArray(value) && Array.isArray(defaultValue)) {
    return value.length === defaultValue.length &&
      value.every((v, i) => v === defaultValue[i]);
  }
  return value === defaultValue || value === undefined || value === "";
};

/**
 * Keeps a set of list-page filters (search, tab, page, dropdown filters...)
 * in sync with the URL query string, so filters survive a refresh and the
 * URL is shareable/bookmarkable. Values equal to their default are omitted
 * from the URL to keep it clean.
 *
 * @example
 * const [filters, setFilters] = useUrlFilters({
 *   tab: { type: "string", default: "all" },
 *   courseId: { type: "number", default: undefined, param: "course_id" },
 *   search: { type: "string", default: "" },
 *   page: { type: "number", default: 1 },
 * });
 * setFilters({ tab: "published", page: 1 });
 */
export function useUrlFilters<T extends Record<string, any>>(
  config: UrlFiltersConfig<T>,
): [T, (patch: Partial<T>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const result = {} as T;
    (Object.keys(config) as (keyof T)[]).forEach((key) => {
      const fieldConfig = config[key];
      const param = fieldConfig.param ?? (key as string);
      result[key] = parseValue(searchParams.get(param), fieldConfig);
    });
    return result;
  }, [searchParams]);

  const setFilters = useCallback(
    (patch: Partial<T>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          (Object.keys(patch) as (keyof T)[]).forEach((key) => {
            const value = patch[key];
            const fieldConfig = config[key];
            const param = fieldConfig?.param ?? (key as string);
            if (isDefaultValue(value, fieldConfig?.default)) {
              next.delete(param);
              return;
            }
            next.set(
              param,
              Array.isArray(value) ? value.join(",") : String(value),
            );
          });
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return [filters, setFilters];
}
