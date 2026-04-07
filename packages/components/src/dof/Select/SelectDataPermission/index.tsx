import { useDebounce } from "@tera/commons/hooks/useDebounce";
import ConfigPermissionApi from "@tera/api/configPermission";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import { useQueryLegacy } from "@tera/commons/hooks/useQueryLegacy";
import { TObjectType, TParamsApiDof } from "../../interfaces";
import SelectEntity from "../SelectEntity";

export interface SelectDataPermissionProps extends SelectProps {
  objectType?: TObjectType;
  paramsApi?: TParamsApiDof;
  idPrevent?: number;
  optionCustom?: OptionProps[];
  isCheckAll?: boolean;
}

const SelectDataPermission = forwardRef<
  HTMLSelectElement,
  SelectDataPermissionProps
>(
  (
    {
      objectType,
      isCheckAll = false,
      optionCustom = [],
      idPrevent,
      paramsApi,
      ...props
    },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data, isLoading, isFetching } = useQueryLegacy({
      queryKey: [
        "get-config-permission",
        searchDebounce,
        paramsApi,
        objectType,
      ],

      queryFn: () =>
        ConfigPermissionApi.getList({
          keyword: searchDebounce,
          limit: 15,
          page: 1,
          ...paramsApi,
        }),

      staleTime: 300000, // 5 phút
      gcTime: 300000, // Trước đây là cacheTime
    });

    const optionPermissionConfig: OptionProps[] = useMemo(() => {
      const options = data?.data
        ?.filter((item) => item?.id !== idPrevent)
        .map((permission) => ({
          label: `${permission?.code} - ${permission?.title}`,
          value: permission?.id,
        }));
      return options || [];
    }, [data, idPrevent]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch={data?.total_items > 15}
        labelInValue
        options={[...optionCustom, ...optionPermissionConfig]}
        searchValue={search}
        onSearch={setSearch}
        isCheckAll={isCheckAll}
        placeholder="Vui lòng chọn"
        {...props}
      />
    );
  },
);

export default SelectDataPermission;
