import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

export function useMutationLegacy<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> & {
  isLoading: boolean;
} {
  // v5 yêu cầu mutationFn phải nằm trong object options
  return useMutation<TData, TError, TVariables, TContext>(
    options,
  ) as unknown as UseMutationResult<TData, TError, TVariables, TContext> & {
    isLoading: boolean;
  };
}
