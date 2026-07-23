import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { CertificateAPI } from "@tera/api";

const invalidateClass = (queryClient: ReturnType<typeof useQueryClient>, classId: number | string) => {
  queryClient.invalidateQueries({ queryKey: ["certificate", "eligibility", classId] });
  queryClient.invalidateQueries({ queryKey: ["certificate", "list", classId] });
};

export const useCertificateEligibility = (classId: number | string, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["certificate", "eligibility", classId],
    queryFn: () => CertificateAPI.eligibility(classId),
    enabled: !!classId,
    ...options,
  });
};

export const useCertificateList = (classId: number | string, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["certificate", "list", classId],
    queryFn: () => CertificateAPI.list(classId),
    enabled: !!classId,
    ...options,
  });
};

export const useCertificateListByStudent = (studentId: number | string, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["certificate", "listByStudent", studentId],
    queryFn: () => CertificateAPI.listByStudent(studentId),
    enabled: !!studentId,
    ...options,
  });
};

export const useCertificateIssue = (classId: number | string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (studentId: number | string) => CertificateAPI.issue(classId, studentId),
    onSuccess: () => invalidateClass(queryClient, classId),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useCertificateRevoke = (classId: number | string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: ({ id, reason }: { id: number | string; reason?: string }) =>
      CertificateAPI.revoke(id, reason),
    onSuccess: () => invalidateClass(queryClient, classId),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

/** Public — no auth. Used by the standalone QR verification page. */
export const useCertificateVerify = (token: string, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["certificate", "verify", token],
    queryFn: () => CertificateAPI.verify(token),
    enabled: !!token,
    retry: false,
    ...options,
  });
};

export const CertificateService = {
  useCertificateEligibility,
  useCertificateList,
  useCertificateListByStudent,
  useCertificateIssue,
  useCertificateRevoke,
  useCertificateVerify,
};
