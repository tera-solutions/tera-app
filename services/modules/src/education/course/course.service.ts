import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { CourseAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useCourseList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["course", "list", payload.params],
    queryFn: () => CourseAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useCourseDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["course", "detail", payload.id],
    queryFn: () => CourseAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useCourseCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => CourseAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useCourseUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => CourseAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertCourse = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return CourseAPI.update(payload);
      return CourseAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", "list"] });
      queryClient.invalidateQueries({ queryKey: ["course", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useCourseDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => CourseAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useCourseSuspend = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => CourseAPI.suspend(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", "list"] });
      queryClient.invalidateQueries({ queryKey: ["course", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useCourseRestore = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => CourseAPI.restore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", "list"] });
      queryClient.invalidateQueries({ queryKey: ["course", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const CourseService = {
  useCourseList,
  useCourseDetail,
  useCourseCreate,
  useCourseUpdate,
  useUpsertCourse,
  useCourseDelete,
  useCourseSuspend,
  useCourseRestore,
};
