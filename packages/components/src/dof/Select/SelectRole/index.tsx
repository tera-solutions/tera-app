import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps, parserParamsArray } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import { AdministratorApi } from "../../_api";
import { TParamsApiDof } from "../../interfaces";
import SelectEntity from "../SelectEntity";

interface SelectRoleProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  optionCustom?: OptionProps[];
  isCheckAll?: boolean;
}

const SelectRole = forwardRef<HTMLInputElement, SelectRoleProps>(
  ({ isCheckAll = false, optionCustom = [], paramsApi, ...props }, ref) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data: listRole } = useQuery({
      queryKey: ["get-list-role", searchDebounce, paramsApi],

      queryFn: () =>
        AdministratorApi.getListRole(
          parserParamsArray({
            page: 1,
            limit: 10,
            ...(searchDebounce !== "" && {
              keyword: searchDebounce,
            }),
            ...paramsApi,
          }),
        ),

      enabled: !props?.disabled,
      staleTime: 300000,
      gcTime: 300000,
    });

    const optionColumnConfig: OptionProps[] = useMemo(() => {
      const options = listRole?.data.map((item) => ({
        label: item?.title,
        value: item?.id,
      }));
      return options || [];
    }, [listRole]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
        labelInValue
        options={[...optionCustom, ...optionColumnConfig]}
        searchValue={search}
        onSearch={setSearch}
        isCheckAll={isCheckAll}
        placeholder="Vui lòng chọn"
        {...props}
      />
    );
  },
);

export default SelectRole;
