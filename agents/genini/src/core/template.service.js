module.exports = ({ Entity, entity, domain }) => `
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { ${Entity}API } from "@tera/api/${domain}/${entity}/${entity}.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

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
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ${Entity}API.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["${entity}", "list"] });
    },
  });
};

export const use${Entity}Update = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ${Entity}API.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["${entity}", "list"] });
    },
  });
};

export const use${Entity}Delete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => ${Entity}API.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["${entity}", "list"] });
    },
  });
};

export const ${Entity}Service = {
  use${Entity}List,
  use${Entity}Detail,
  use${Entity}Create,
  use${Entity}Update,
  use${Entity}Delete,
};
`;