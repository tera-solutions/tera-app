import { SelectProps } from "tera-dls/lib/components/Select";
import { useQuery } from "@tanstack/react-query";
import { forwardRef, useState } from "react";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import SelectEntity from "../SelectEntity";
import { AdministratorApi } from "../../_api";
import { TParamsApiDof } from "../../interfaces";

interface IProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  defaultOptions?: any;
  parentMenuId?: number;
  disableOptions?: number[] | string[];
}

const SelectPageConfig = forwardRef<HTMLInputElement, IProps>((props, ref) => {
  const {
    parentMenuId,
    defaultOptions = [],
    paramsApi,
    disableOptions,
    ...restProps
  } = props;
  const [searchPageConfig, setSearchPageConfig] = useState("");
  const searchPageConfigDebounce = useDebounce(searchPageConfig, 300);

  const paramsQuery = {
    limit: 15,
    page: 1,
    ...(searchPageConfigDebounce !== "" && {
      keyword: searchPageConfigDebounce,
    }),
    ...(parentMenuId && { parent_menu_id: parentMenuId }),
    ...paramsApi,
  };

  const { data: pageConfigs } = useQuery({
    queryKey: ["get-page-config-list", paramsQuery],
    queryFn: () => AdministratorApi.getListPageConfig(paramsQuery),
    enabled: !props?.disabled,
    staleTime: 300000,
    gcTime: 300000,
  });

  const options =
    pageConfigs?.data?.map((item) => {
      return {
        label: `${item.code} - ${item.name}`,
        value: item.id,
        ...(disableOptions &&
          disableOptions.includes(item.id as never) && { disabled: true }),
      };
    }) ?? [];

  return (
    <SelectEntity
      ref={ref}
      allowClear
      showSearch
      labelInValue
      options={[...defaultOptions, ...options]}
      onSearch={setSearchPageConfig}
      placeholder="Vui lòng chọn"
      searchValue={searchPageConfigDebounce}
      {...restProps}
    />
  );
});

export default SelectPageConfig;
