import { useQuery } from "@tanstack/react-query";
import { CrmApi } from "@tera/components/dof/_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";

interface SelectUnitProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  optionCustom?: OptionProps[];
}

const SelectUnit = forwardRef<HTMLInputElement, SelectUnitProps>(
  (
    { optionCustom = [], placeholder = "Vui lòng chọn", paramsApi, ...props },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data: listUnit, isLoading } = useQuery({
      queryKey: ["get-list-unit", searchDebounce, paramsApi],

      queryFn: () =>
        CrmApi.getUnitList({
          page: 1,
          limit: 15,
          keyword: searchDebounce,
          ...paramsApi,
        }),

      staleTime: 300000,
      gcTime: 300000,
    });

    const options: OptionProps[] = useMemo(() => {
      return (
        listUnit?.data.map((unit) => ({
          label: unit.actual_name,
          value: unit.id,
        })) || []
      );
    }, [listUnit]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
        labelInValue
        loading={isLoading}
        placeholder={placeholder}
        options={[...optionCustom, ...options]}
        searchValue={search}
        onSearch={setSearch}
        {...props}
      />
    );
  },
);

export default SelectUnit;
