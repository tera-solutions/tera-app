import { useEffect, useMemo, useState } from "react";

export interface SelectOption {
  value: number | string;
  label: string;
}

interface ListQueryResult {
  data?: { data?: { items?: any[] } };
  isFetching: boolean;
}

interface UseAsyncSelectOptionsParams<TItem> {
  /** One of the generated `useXxxList` hooks from `@tera/modules`. */
  useList: (payload: { params: Record<string, unknown> }) => ListQueryResult;
  toOption: (item: TItem) => SelectOption;
  /** Extra static filters merged into every request (e.g. `{ course_id }`). */
  filters?: Record<string, unknown>;
  pageSize?: number;
  /** Debounce window before typed text becomes a search request (ms). */
  debounce?: number;
}

/**
 * Debounced, server-searched options for an async `Select` box. Wraps one of
 * the generated `useXxxList` hooks so every entity picker (branch/course/
 * classroom/level/student/...) across every portal shares the same
 * search-debounce-and-map plumbing instead of re-implementing it per app.
 */
export const useAsyncSelectOptions = <TItem = any>({
  useList,
  toOption,
  filters,
  pageSize = 20,
  debounce = 350,
}: UseAsyncSelectOptionsParams<TItem>) => {
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setKeyword(search.trim()), debounce);
    return () => clearTimeout(timer);
  }, [search, debounce]);

  const query = useList({
    params: {
      page: 1,
      per_page: pageSize,
      search: keyword || undefined,
      filters,
    },
  });

  const options = useMemo(
    () => (query.data?.data?.items ?? []).map(toOption),
    [query.data],
  );

  return { options, loading: query.isFetching, search, setSearch };
};
