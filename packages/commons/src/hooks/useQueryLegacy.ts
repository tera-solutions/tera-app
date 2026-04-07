import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  QueryKey,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";

// Định nghĩa Interface hỗ trợ cấu trúc cũ và các thuộc tính bị xóa trong v5
export interface UseQueryLegacyOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
> extends UseQueryOptions<TQueryFnData, TError, TData, QueryKey> {
  onSuccess?: (data: TData) => void;
  onError?: (err: TError) => void;
  onSettled?: (data: TData | undefined, err: TError | null) => void;
  // Bổ sung các thuộc tính legacy để tránh lỗi TS(2353)
  cacheTime?: number;
  keepPreviousData?: boolean;
}

export function useQueryLegacy<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
>(
  options: UseQueryLegacyOptions<TQueryFnData, TError, TData>,
): UseQueryResult<TData, TError> {
  // Bóc tách cả cacheTime và keepPreviousData ra để không truyền vào useQuery v5
  const {
    onSuccess,
    onError,
    onSettled,
    cacheTime,
    keepPreviousData,
    ...restOptions
  } = options;

  // Mapping tự động từ v4 sang v5
  const v5Options = { ...restOptions };

  // Nếu có cacheTime, tự động map sang gcTime
  if (cacheTime !== undefined && v5Options.gcTime === undefined) {
    v5Options.gcTime = cacheTime;
  }

  // Nếu có keepPreviousData, v5 dùng placeholderData: keepPreviousData (import từ @tanstack/react-query)
  // Lưu ý: Để dùng chuẩn v5, bạn nên import { keepPreviousData } from '@tanstack/react-query'
  // Ở đây chúng ta tạm ép kiểu để chạy được logic cũ
  if (keepPreviousData) {
    v5Options.placeholderData = (prev) => prev;
  }

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onSettledRef = useRef(onSettled);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    onSettledRef.current = onSettled;
  }, [onSuccess, onError, onSettled]);

  const query = useQuery<TQueryFnData, TError, TData>(v5Options);

  useEffect(() => {
    if (query.isSuccess && query.data !== undefined) {
      onSuccessRef.current?.(query.data);
      onSettledRef.current?.(query.data, null);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      onErrorRef.current?.(query.error as TError);
      onSettledRef.current?.(undefined, query.error as TError);
    }
  }, [query.isError, query.error]);

  return query;
}
