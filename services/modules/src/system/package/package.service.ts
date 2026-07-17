import {
  useQueryAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { PackageAPI } from "@tera/api";
import { ListPayload } from "@tera/api/_interface";

export const usePackageList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["package", "list", payload.params],
    queryFn: () => PackageAPI.getList(payload),
    ...options,
  });
};

export const PackageService = {
  usePackageList,
};
