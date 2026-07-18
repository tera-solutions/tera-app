import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { PayrollAPI, GeneratePayrollParams } from "@tera/api";
import { DetailPayload, ListPayload } from "@tera/api/_interface";

export const usePayrollList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["payroll", "list", payload.params],
    queryFn: () => PayrollAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const usePayrollDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["payroll", "detail", payload.id],
    queryFn: () => PayrollAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

export const usePayrollGenerate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (params: GeneratePayrollParams) => PayrollAPI.generate(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
  });
};

export const PayrollService = {
  usePayrollList,
  usePayrollDetail,
  usePayrollGenerate,
};
