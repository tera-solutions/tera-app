module.exports = ({ Entity, entity, domain }) => `
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { ${Entity}API } from "@tera/api/${domain}/${entity}/${entity}.api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const use${Entity}List = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["${entity}", "list", payload.params],
    queryFn: () => ${Entity}API.getList(payload),
    keepPreviousData: true,
  });
};

export const use${Entity}Detail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["${entity}", "detail", payload.id],
    queryFn: () => ${Entity}API.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const use${Entity}Create = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ${Entity}API.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["${entity}", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const use${Entity}Update = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ${Entity}API.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["${entity}", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const use${Entity}Delete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => ${Entity}API.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["${entity}", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const use${Entity}Export = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => ${Entity}API.export(payload),
    onSuccess: (res) => {
      if (res?.data?.link) {
        window.open(res?.data?.link, "_blank");
      }
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const ${Entity}Service = {
  use${Entity}List,
  use${Entity}Detail,
  use${Entity}Create,
  use${Entity}Update,
  use${Entity}Delete,
  use${Entity}Export
};
`;