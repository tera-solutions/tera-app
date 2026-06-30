import { useQueryAdapter } from "@tera/commons/hooks/queryAdapter";
import { DashboardAPI } from "@tera/api";

// QUERY
export const useDashboardSummary = () => {
  return useQueryAdapter({
    queryKey: ["dashboard", "summary"],
    queryFn: () => DashboardAPI.getSummary(),
  });
};

export const DashboardService = {
  useDashboardSummary,
};
