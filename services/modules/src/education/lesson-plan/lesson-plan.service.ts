
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { LessonPlanAPI } from "@tera/api/education/lesson-plan/lesson-plan.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useLessonPlanList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["lesson-plan", "list", payload.params],
    queryFn: () => LessonPlanAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useLessonPlanDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["lesson-plan", "detail", payload.id],
    queryFn: () => LessonPlanAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useLessonPlanCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => LessonPlanAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-plan", "list"] });
    },
  });
};

export const useLessonPlanUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => LessonPlanAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-plan", "list"] });
    },
  });
};

export const useLessonPlanDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => LessonPlanAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-plan", "list"] });
    },
  });
};

export const LessonPlanService = {
  useLessonPlanList,
  useLessonPlanDetail,
  useLessonPlanCreate,
  useLessonPlanUpdate,
  useLessonPlanDelete,
};
