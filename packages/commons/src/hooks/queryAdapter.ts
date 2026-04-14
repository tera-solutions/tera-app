import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";

// ==========================
// QUERY ADAPTER OPTIONS
// ==========================
export interface QueryAdapterOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
> extends UseQueryOptions<TQueryFnData, TError, TData, QueryKey> {
  onSuccess?: (data: TData) => void;
  onError?: (err: TError) => void;
  onSettled?: (data: TData | undefined, err: TError | null) => void;

  // legacy (v4)
  cacheTime?: number;
  keepPreviousData?: boolean;
}

// ==========================
// QUERY ADAPTER
// ==========================
export function useQueryAdapter<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
>(
  options: QueryAdapterOptions<TQueryFnData, TError, TData>,
) {
  const {
    onSuccess,
    onError,
    onSettled,
    cacheTime,
    keepPreviousData,
    ...rest
  } = options;

  const v5Options: any = { ...rest };

  // map cacheTime -> gcTime
  if (cacheTime !== undefined && v5Options.gcTime === undefined) {
    v5Options.gcTime = cacheTime;
  }

  // map keepPreviousData
  if (keepPreviousData) {
    v5Options.placeholderData = (prev: any) => prev;
  }

  const query = useQuery<TQueryFnData, TError, TData>(v5Options);
  console.log("query", query)

  // ==========================
  // lifecycle bridge (fix double trigger)
  // ==========================
  const prevStatus = useRef(query.status);

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onSettledRef = useRef(onSettled);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    onSettledRef.current = onSettled;
  }, [onSuccess, onError, onSettled]);

  useEffect(() => {
    // success transition
    if (prevStatus.current !== "success" && query.isSuccess) {
      onSuccessRef.current?.(query.data as TData);
      onSettledRef.current?.(query.data as TData, null);
    }

    // error transition
    if (prevStatus.current !== "error" && query.isError) {
      onErrorRef.current?.(query.error as TError);
      onSettledRef.current?.(undefined, query.error as TError);
    }

    prevStatus.current = query.status;
  }, [query.status]);

  return query;
}

// ==========================
// MUTATION ADAPTER OPTIONS
// ==========================
export interface MutationAdapterOptions<TData, TError, TVariables>
  extends UseMutationOptions<TData, TError, TVariables> {
  onSuccess?: (data: TData) => void;
  onError?: (err: TError) => void;
  onSettled?: (data: TData | undefined, err: TError | null) => void;
}

// ==========================
// MUTATION ADAPTER
// ==========================
export function useMutationAdapter<
  TData = any,
  TError = Error,
  TVariables = any,
>(
  options: MutationAdapterOptions<TData, TError, TVariables>,
) {
  const { onSuccess, onError, onSettled, ...rest } = options;

  const mutation = useMutation(rest);

  const prevStatus = useRef(mutation.status);

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onSettledRef = useRef(onSettled);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    onSettledRef.current = onSettled;
  }, [onSuccess, onError, onSettled]);

  useEffect(() => {
    if (prevStatus.current !== "success" && mutation.isSuccess) {
      onSuccessRef.current?.(mutation.data as TData);
      onSettledRef.current?.(mutation.data as TData, null);
    }

    if (prevStatus.current !== "error" && mutation.isError) {
      onErrorRef.current?.(mutation.error as TError);
      onSettledRef.current?.(undefined, mutation.error as TError);
    }

    prevStatus.current = mutation.status;
  }, [mutation.status]);

  return mutation;
}