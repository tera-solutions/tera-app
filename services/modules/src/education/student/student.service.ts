import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { StudentAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

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

export const useUpsertStudent = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return StudentAPI.update(payload);
      return StudentAPI.create(payload);
    },
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

export const useStudentSuspend = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => StudentAPI.suspend(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
      queryClient.invalidateQueries({ queryKey: ["student", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useStudentRestore = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => StudentAPI.restore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
      queryClient.invalidateQueries({ queryKey: ["student", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useStudentExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
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
  useUpsertStudent,
  useStudentDelete,
  useStudentSuspend,
  useStudentRestore,
  useStudentExport,
};
