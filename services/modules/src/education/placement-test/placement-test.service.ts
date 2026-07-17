import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { PlacementTestAPI } from "@tera/api";
import type {
  PlacementTestResultsPayload,
  RecordPlacementTestResultPayload,
} from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const usePlacementTestList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["placement-test", "list", payload.params],
    queryFn: () => PlacementTestAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const usePlacementTestDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["placement-test", "detail", payload.id],
    queryFn: () => PlacementTestAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

export const usePlacementTestResults = (
  payload: PlacementTestResultsPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["placement-test", "results", payload.id, payload.params],
    queryFn: () => PlacementTestAPI.getResults(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const usePlacementTestCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => PlacementTestAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placement-test", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const usePlacementTestUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => PlacementTestAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placement-test", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const usePlacementTestPublish = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => PlacementTestAPI.publish(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placement-test", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const usePlacementTestDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => PlacementTestAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placement-test", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const usePlacementTestRecordResult = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: RecordPlacementTestResultPayload) => PlacementTestAPI.recordResult(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placement-test", "results"] });
      queryClient.invalidateQueries({ queryKey: ["placement-test", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const PlacementTestService = {
  usePlacementTestList,
  usePlacementTestDetail,
  usePlacementTestResults,
  usePlacementTestCreate,
  usePlacementTestUpdate,
  usePlacementTestPublish,
  usePlacementTestDelete,
  usePlacementTestRecordResult,
};
