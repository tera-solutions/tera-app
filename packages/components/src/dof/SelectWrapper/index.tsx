import { useQueryLegacy } from "@tera/commons/hooks/tanstack";

import { useEffect, useState } from "react";
import { notification } from "tera-dls";
import SelectWrapperApi from "./_api";

export default function SelectWrapper({
  data = null,
  type = null,
  params = {},
  onReceiveData,
  children,
}) {
  const [sourceData, setSourceData] = useState(null);
  const urlApi = sourceData?.url;

  useQueryLegacy({
    queryKey: ["get-data-source", type],

    queryFn: () => {
      const params = {
        code: type,
      };
      return SelectWrapperApi.getDataSource(params);
    },

    enabled: !!type && !data,
    gcTime: 300000,
    staleTime: 300000,

    onSuccess: (data) => {
      if (data?.code !== 200) {
        throw data;
      }
      if (Array.isArray(data?.data?.data)) {
        const resultSource = data?.data?.data?.find(
          (obj) => obj?.code === type,
        );
        setSourceData(resultSource);
      }
    },

    onError: (error: any) => {
      notification.error(error?.msg || error?.message);
    },
  });

  //test api
  const { data: dataSource } = useQueryLegacy({
    queryKey: [`get-list-data-source-${type}`, type],

    queryFn: () =>
      SelectWrapperApi.getListTest(type, {
        limit: 10,
        page: 1,
        ...params,
      }),

    enabled: !!urlApi && !!type,
    gcTime: 300000,
    staleTime: 300000,
  });

  // const { data: dataSource } = useQuery(
  //   ['get-list-data-source', params, urlApi],
  //   () =>
  //     SelectWrapperApi.getListDataSource(urlApi, {
  //       limit: 10,
  //       page: 1,
  //       ...params,
  //     }),
  //   {
  //     enabled: !!urlApi,
  //     gcTime: 300000,
  //     staleTime: 300000,
  //   },
  // );

  useEffect(() => {
    if (dataSource) onReceiveData(dataSource);
  }, [dataSource]);

  return <>{children}</>;
}
