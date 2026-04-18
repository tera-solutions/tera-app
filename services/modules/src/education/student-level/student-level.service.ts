import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { StudentLevelAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useStudentLevelList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["student-level", "list", payload.params],
    queryFn: () => StudentLevelAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useStudentLevelDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["student-level", "detail", payload.id],
    queryFn: () => StudentLevelAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useStudentLevelCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => StudentLevelAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-level", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useStudentLevelUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => StudentLevelAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-level", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertStudentLevel = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return StudentLevelAPI.update(payload);
      return StudentLevelAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useStudentLevelDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => StudentLevelAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-level", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useStudentLevelExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => StudentLevelAPI.export(payload),
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

export const StudentLevelService = {
  useStudentLevelList,
  useStudentLevelDetail,
  useStudentLevelCreate,
  useStudentLevelUpdate,
  useUpsertStudentLevel,
  useStudentLevelDelete,
  useStudentLevelExport,
};
