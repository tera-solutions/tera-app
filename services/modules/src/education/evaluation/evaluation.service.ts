
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { EvaluationAPI } from "@tera/api/education/evaluation/evaluation.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useEvaluationList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["evaluation", "list", payload.params],
    queryFn: () => EvaluationAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useEvaluationDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["evaluation", "detail", payload.id],
    queryFn: () => EvaluationAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useEvaluationCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => EvaluationAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation", "list"] });
    },
  });
};

export const useEvaluationUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => EvaluationAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation", "list"] });
    },
  });
};

export const useEvaluationDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => EvaluationAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation", "list"] });
    },
  });
};
