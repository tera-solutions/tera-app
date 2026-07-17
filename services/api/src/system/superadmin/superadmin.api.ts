import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export interface AssignPlanPayload {
  id: string | number;
  params: {
    package_id: number;
    billing_cycle?: "month" | "year";
    payment_method?: string;
    amount?: number;
  };
}

export interface ExtendSubscriptionPayload {
  id: string | number;
  params: { months: number };
}

export interface PackageLimits {
  students?: number | null;
  classes?: number | null;
  teachers?: number | null;
  branches?: number | null;
  parents?: number | null;
  [key: string]: number | null | undefined;
}

export interface PackagePayload {
  package_code?: string;
  name?: string;
  description?: string | null;
  price?: number;
  billing_cycle?: "month" | "year";
  features?: string[];
  limits?: PackageLimits;
  badge?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

const base = `${endpoint}/sys/superadmin`;

export const SuperadminAPI = {
  // ---- Dashboard ----
  getDashboard: async () =>
    await api.get(`${base}/dashboard`).then((r) => r.data),

  // ---- Tenants ----
  getTenantList: async ({ params }: ListPayload) =>
    await api
      .get(`${base}/tenant/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getTenantDetail: async ({ id }: DetailPayload) =>
    await api.get(`${base}/tenant/detail/${id}`).then((r) => r.data),

  suspendTenant: async ({ id }: DetailPayload) =>
    await api.post(`${base}/tenant/suspend/${id}`).then((r) => r.data),

  activateTenant: async ({ id }: DetailPayload) =>
    await api.post(`${base}/tenant/activate/${id}`).then((r) => r.data),

  assignPlan: async ({ id, params }: AssignPlanPayload) =>
    await api
      .post(`${base}/tenant/${id}/subscription/assign`, params)
      .then((r) => r.data),

  extendSubscription: async ({ id, params }: ExtendSubscriptionPayload) =>
    await api
      .post(`${base}/tenant/${id}/subscription/extend`, params)
      .then((r) => r.data),

  cancelSubscription: async ({ id }: DetailPayload) =>
    await api
      .post(`${base}/tenant/${id}/subscription/cancel`)
      .then((r) => r.data),

  // ---- Packages ----
  getPackageList: async ({ params }: ListPayload) =>
    await api
      .get(`${base}/package/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getPackageDetail: async ({ id }: DetailPayload) =>
    await api.get(`${base}/package/detail/${id}`).then((r) => r.data),

  createPackage: async ({ params }: CreatePayload<PackagePayload>) =>
    await api.post(`${base}/package/create`, params).then((r) => r.data),

  updatePackage: async ({ id, params }: UpdatePayload<PackagePayload>) =>
    await api.put(`${base}/package/update/${id}`, params).then((r) => r.data),

  activatePackage: async ({ id }: DetailPayload) =>
    await api.post(`${base}/package/activate/${id}`).then((r) => r.data),

  deactivatePackage: async ({ id }: DetailPayload) =>
    await api.post(`${base}/package/deactivate/${id}`).then((r) => r.data),
};
