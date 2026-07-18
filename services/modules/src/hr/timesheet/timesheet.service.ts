import { useQueryAdapter, QueryHookOptions } from "@tera/commons/hooks/queryAdapter";
import { TimesheetAPI } from "@tera/api";
import { ListPayload } from "@tera/api/_interface";

export const useTimesheetList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["timesheet", "list", payload.params],
    queryFn: () => TimesheetAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useTimesheetSummary = (
  params: { date_from?: string; date_to?: string; month?: string } = {},
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["timesheet", "summary", params],
    queryFn: () => TimesheetAPI.getSummary(params),
    ...options,
  });
};

export const TimesheetService = {
  useTimesheetList,
  useTimesheetSummary,
};
