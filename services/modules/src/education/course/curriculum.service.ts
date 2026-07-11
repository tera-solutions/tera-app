import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { CurriculumAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

const KEY = "course-curriculum";

// QUERY
export const useCourseCurriculumList = (
  payload: ListPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: [KEY, "list", payload.params],
    queryFn: () => CurriculumAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useCourseCurriculumDetail = (
  payload: DetailPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: [KEY, "detail", payload.id],
    queryFn: () => CurriculumAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useCourseCurriculumCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => CurriculumAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: ["course", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useCourseCurriculumUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => CurriculumAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: ["course", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useCourseCurriculumDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => CurriculumAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: ["course", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const CourseCurriculumService = {
  useCourseCurriculumList,
  useCourseCurriculumDetail,
  useCourseCurriculumCreate,
  useCourseCurriculumUpdate,
  useCourseCurriculumDelete,
};
