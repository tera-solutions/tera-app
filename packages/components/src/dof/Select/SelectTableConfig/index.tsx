import { SelectProps } from "tera-dls/lib/components/Select";
import { useQuery } from "@tanstack/react-query";
import { forwardRef, useState } from "react";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import SelectEntity from "../SelectEntity";
import { AdministratorApi } from "../../_api";
import { TParamsApiDof } from "../../interfaces";

interface IProps extends SelectProps {
  pageId?: number | string;
  groupKey?: string;
  defaultOptions?: any;
  paramsApi?: TParamsApiDof;
  isCheckAll?: boolean;
}

const SelectTableConfig = forwardRef<HTMLInputElement, IProps>((props, ref) => {
  const {
    pageId,
    groupKey,
    defaultOptions = [],
    paramsApi,
    isCheckAll = false,
    ...restProps
  } = props;

  const [searchTableConfig, setSearchTableConfig] = useState("");
  const searchTableConfigDebounce = useDebounce(searchTableConfig, 300);
  const paramsQuery = {
    limit: 10,
    page: 1,
    ...(searchTableConfigDebounce !== "" && {
      keyword: searchTableConfigDebounce,
    }),
    ...paramsApi,
  };

  const { data: tableConfigs } = useQuery({
    queryKey: ["get-table-config-by-page-id", paramsQuery, pageId, groupKey],

    queryFn: () =>
      AdministratorApi.getListTableConfig({
        ...paramsQuery,
        page_id: pageId,
        group_key: groupKey,
      }),

    staleTime: 300000,
    gcTime: 300000,
    enabled: !!pageId || !props?.disabled,
  });

  const options =
    tableConfigs?.data?.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    }) ?? [];

  return (
    <SelectEntity
      ref={ref}
      allowClear
      showSearch
      labelInValue
      options={[...defaultOptions, ...options]}
      onSearch={setSearchTableConfig}
      isCheckAll={isCheckAll}
      placeholder="Vui lòng chọn"
      {...restProps}
    />
  );
});

export default SelectTableConfig;
