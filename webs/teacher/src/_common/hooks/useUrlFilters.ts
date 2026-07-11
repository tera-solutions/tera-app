import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type UrlFieldType = "string" | "number" | "boolean" | "string[]" | "number[]";

export interface UrlFieldConfig<T> {
  type: UrlFieldType;
  default: T;
  /** URL query key to use instead of the object's own key (e.g. `course_id`). */
  param?: string;
}

export type UrlFiltersConfig<T> = { [K in keyof T]: UrlFieldConfig<T[K]> };

const camelToSnake = (key: string): string =>
  key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const paramName = (key: string, fieldConfig: UrlFieldConfig<any> | undefined): string =>
  fieldConfig?.param ?? camelToSnake(key);

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

const hasDefaultValue = (defaultValue: unknown): boolean => {
  if (Array.isArray(defaultValue)) return defaultValue.length > 0;
  return defaultValue !== undefined && defaultValue !== "" && defaultValue !== 0;
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
 * URL query keys are always snake_case (`text1_text2`). A camelCase object
 * key (e.g. `courseId`) is auto-converted to its snake_case param
 * (`course_id`) unless an explicit `param` is given.
 *
 * @example
 * const [filters, setFilters] = useUrlFilters({
 *   tab: { type: "string", default: "all" },
 *   courseId: { type: "number", default: undefined }, // -> ?course_id=
 *   search: { type: "string", default: "" },
 *   page: { type: "number", default: 1 },
 * });
 * setFilters({ tab: "published", page: 1 });
 *
 * Pass `syncDefaultsOnMount: true` to write each field's default value into
 * the URL on first render (once), so the initial filter state is reflected
 * in and shareable via the URL. Fields whose default is "empty" (`undefined`,
 * `""`, `0`, or `[]`) are skipped, since they represent "no filter selected"
 * rather than an actual default value.
 */
export function useUrlFilters<T extends Record<string, any>>(
  config: UrlFiltersConfig<T>,
  options?: { syncDefaultsOnMount?: boolean },
): [T, (patch: Partial<T>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!options?.syncDefaultsOnMount) return;
    setSearchParams(
      () => {
        // Read the live URL rather than the `searchParams` closure: another
        // effect may call `setSearchParams` in the same commit (e.g. a page
        // syncing a computed date range on mount), and that closure is only
        // refreshed on the next render, so trusting it here can silently
        // discard the other effect's write.
        const next = new URLSearchParams(window.location.search);
        (Object.keys(config) as (keyof T)[]).forEach((key) => {
          const fieldConfig = config[key];
          const param = paramName(key as string, fieldConfig);
          if (next.get(param) !== null || !hasDefaultValue(fieldConfig.default)) return;
          next.set(
            param,
            Array.isArray(fieldConfig.default)
              ? fieldConfig.default.join(",")
              : String(fieldConfig.default),
          );
        });
        return next;
      },
      { replace: true },
    );
    // Run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filters = useMemo(() => {
    const result = {} as T;
    (Object.keys(config) as (keyof T)[]).forEach((key) => {
      const fieldConfig = config[key];
      const param = paramName(key as string, fieldConfig);
      result[key] = parseValue(searchParams.get(param), fieldConfig);
    });
    return result;
  }, [searchParams]);

  const setFilters = useCallback(
    (patch: Partial<T>) => {
      setSearchParams(
        () => {
          // See the mount-sync effect above: read the live URL instead of
          // the `searchParams` closure to avoid clobbering a write made by
          // another `setSearchParams` call in the same commit.
          const next = new URLSearchParams(window.location.search);
          (Object.keys(patch) as (keyof T)[]).forEach((key) => {
            const value = patch[key];
            const fieldConfig = config[key];
            const param = paramName(key as string, fieldConfig);
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
