/**
 * useListResponse
 *
 * Helper chuẩn hóa cách truy cập dữ liệu từ tất cả API get list.
 *
 * Tất cả API trong hệ thống trả về cùng một cấu trúc:
 * {
 *   success: boolean,
 *   data: {
 *     items: T[],
 *     pagination: { total, per_page, current_page, last_page }
 *   }
 * }
 *
 * Lưu ý: Cấu trúc này KHÁC với PaginatedResponse<T> định nghĩa trong @tera/api/_interface
 * (vốn dùng data[] + meta). Dùng các helper dưới đây để truy cập đúng path.
 */

// ── Types ──────────────────────────────────────────────────────

export interface ApiPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ApiListData<T> {
  items: T[];
  pagination: ApiPagination;
}

export interface ApiListResponse<T> {
  success: boolean;
  msg?: string;
  code?: number;
  errors?: unknown;
  data?: ApiListData<T>;
}

// ── Helpers ────────────────────────────────────────────────────

/**
 * Lấy mảng items từ response của useXxxList hook.
 *
 * @example
 * const { data } = useClassRoomList({ params });
 * const items = getListItems<ClassRoomResponse>(data);
 */
export function getListItems<T>(response: unknown): T[] {
  return (response as ApiListResponse<T>)?.data?.items ?? [];
}

/**
 * Lấy pagination từ response của useXxxList hook.
 *
 * @example
 * const { data } = useClassRoomList({ params });
 * const { total, current_page } = getListPagination(data);
 */
export function getListPagination(response: unknown): ApiPagination {
  return (response as ApiListResponse<unknown>)?.data?.pagination ?? {
    total: 0,
    per_page: 20,
    current_page: 1,
    last_page: 1,
  };
}

/**
 * Destructure cả items lẫn pagination trong một lần.
 *
 * @example
 * const { data } = useClassRoomList({ params });
 * const { items, pagination } = getListData<ClassRoomResponse>(data);
 */
export function getListData<T>(response: unknown): {
  items: T[];
  pagination: ApiPagination;
} {
  return {
    items: getListItems<T>(response),
    pagination: getListPagination(response),
  };
}
