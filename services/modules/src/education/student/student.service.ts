import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import {
  ListPayload,
  DetailPayload,
  CreatePayload,
  UpdatePayload,
  DeletePayload,
  ExportPayload,
} from "@tera/api/_interface";
import { StudentAPI } from "@tera/api";
import { useTranslation } from "react-i18next";

// QUERY
export const useStudentList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["student", "list", payload.params],
    queryFn: () => StudentAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useStudentDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["student", "detail", payload.id],
    queryFn: () => StudentAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useStudentCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => StudentAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useStudentUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => StudentAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useStudentDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => StudentAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useStudentExport = () => {
  const { t } = useTranslation();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => StudentAPI.export(payload),
    onSuccess: (res) => {
      if (res?.data?.link) {
        window.open(res?.data?.link, "_blank");
      }
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const StudentService = {
  useStudentList,
  useStudentDetail,
  useStudentCreate,
  useStudentUpdate,
  useStudentDelete,
  useStudentExport,
};
