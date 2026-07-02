import {
  useQueryAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { DashboardAPI } from "@tera/api";

// QUERY
export const useDashboardSummary = (options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["dashboard", "summary"],
    queryFn: () => DashboardAPI.getSummary(),
    ...options,
  });
};

export const DashboardService = {
  useDashboardSummary,
};
