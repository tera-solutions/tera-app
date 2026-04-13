
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { TemplateAPI } from "@tera/api/notification/template/template.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useTemplateList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["template", "list", payload.params],
    queryFn: () => TemplateAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useTemplateDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["template", "detail", payload.id],
    queryFn: () => TemplateAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useTemplateCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => TemplateAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template", "list"] });
    },
  });
};

export const useTemplateUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => TemplateAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template", "list"] });
    },
  });
};

export const useTemplateDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => TemplateAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template", "list"] });
    },
  });
};
