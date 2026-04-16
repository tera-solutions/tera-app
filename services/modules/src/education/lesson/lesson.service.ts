
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { LessonAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useLessonList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["lesson", "list", payload.params],
    queryFn: () => LessonAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useLessonDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["lesson", "detail", payload.id],
    queryFn: () => LessonAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useLessonCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => LessonAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useLessonUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => LessonAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useLessonDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => LessonAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useLessonExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => LessonAPI.export(payload),
    onSuccess: (res) => {
      if (res?.data?.link) {
        window.open(res?.data?.link, "_blank");
      }
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const LessonService = {
  useLessonList,
  useLessonDetail,
  useLessonCreate,
  useLessonUpdate,
  useLessonDelete,
  useLessonExport
};
