import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { SuperadminAPI } from "@tera/api";
import type {
  AssignPlanPayload,
  ExtendSubscriptionPayload,
  PackagePayload,
} from "@tera/api";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

const TENANT_KEY = "superadmin-tenant";
const PACKAGE_KEY = "superadmin-package";
const DASHBOARD_KEY = "superadmin-dashboard";

// ---- Dashboard ----
export const usePlatformDashboard = (options?: QueryHookOptions) =>
  useQueryAdapter({
    queryKey: [DASHBOARD_KEY],
    queryFn: () => SuperadminAPI.getDashboard(),
    ...options,
  });

// ---- Tenants ----
export const useTenantList = (payload: ListPayload, options?: QueryHookOptions) =>
  useQueryAdapter({
    queryKey: [TENANT_KEY, "list", payload.params],
    queryFn: () => SuperadminAPI.getTenantList(payload),
    keepPreviousData: true,
    ...options,
  });

export const useTenantDetail = (payload: DetailPayload, options?: QueryHookOptions) =>
  useQueryAdapter({
    queryKey: [TENANT_KEY, "detail", payload.id],
    queryFn: () => SuperadminAPI.getTenantDetail(payload),
    enabled: !!payload.id,
    ...options,
  });

const useTenantMutation = <T>(mutationFn: (payload: T) => Promise<unknown>) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TENANT_KEY] });
      queryClient.invalidateQueries({ queryKey: [DASHBOARD_KEY] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useTenantSuspend = () =>
  useTenantMutation((payload: DetailPayload) => SuperadminAPI.suspendTenant(payload));

export const useTenantActivate = () =>
  useTenantMutation((payload: DetailPayload) => SuperadminAPI.activateTenant(payload));

export const useAssignPlan = () =>
  useTenantMutation((payload: AssignPlanPayload) => SuperadminAPI.assignPlan(payload));

export const useExtendSubscription = () =>
  useTenantMutation((payload: ExtendSubscriptionPayload) => SuperadminAPI.extendSubscription(payload));

export const useCancelSubscription = () =>
  useTenantMutation((payload: DetailPayload) => SuperadminAPI.cancelSubscription(payload));

// ---- Packages ----
export const usePackageAdminList = (payload: ListPayload, options?: QueryHookOptions) =>
  useQueryAdapter({
    queryKey: [PACKAGE_KEY, "list", payload.params],
    queryFn: () => SuperadminAPI.getPackageList(payload),
    keepPreviousData: true,
    ...options,
  });

export const usePackageAdminDetail = (payload: DetailPayload, options?: QueryHookOptions) =>
  useQueryAdapter({
    queryKey: [PACKAGE_KEY, "detail", payload.id],
    queryFn: () => SuperadminAPI.getPackageDetail(payload),
    enabled: !!payload.id,
    ...options,
  });

const usePackageMutation = <T>(mutationFn: (payload: T) => Promise<unknown>) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PACKAGE_KEY] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const usePackageCreate = () =>
  usePackageMutation((payload: CreatePayload<PackagePayload>) => SuperadminAPI.createPackage(payload));

export const usePackageUpdate = () =>
  usePackageMutation((payload: UpdatePayload<PackagePayload>) => SuperadminAPI.updatePackage(payload));

export const usePackageActivate = () =>
  usePackageMutation((payload: DetailPayload) => SuperadminAPI.activatePackage(payload));

export const usePackageDeactivate = () =>
  usePackageMutation((payload: DetailPayload) => SuperadminAPI.deactivatePackage(payload));

export const SuperadminService = {
  usePlatformDashboard,
  useTenantList,
  useTenantDetail,
  useTenantSuspend,
  useTenantActivate,
  useAssignPlan,
  useExtendSubscription,
  useCancelSubscription,
  usePackageAdminList,
  usePackageAdminDetail,
  usePackageCreate,
  usePackageUpdate,
  usePackageActivate,
  usePackageDeactivate,
};
