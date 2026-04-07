import { useQuery } from "@tanstack/react-query";
import { CrmApi } from "@tera/components/dof/_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";

interface SelectWarrantyProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  optionCustom?: OptionProps[];
}

const SelectWarranty = forwardRef<HTMLInputElement, SelectWarrantyProps>(
  (
    { optionCustom = [], placeholder = "Vui lòng chọn", paramsApi, ...props },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data: listWarranty, isLoading } = useQuery({
      queryKey: ["get-list-warranty", searchDebounce, paramsApi],

      queryFn: () =>
        CrmApi.getWarrantyList({
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
        listWarranty?.data.map((warranty) => ({
          label: warranty.name,
          value: warranty.id,
        })) || []
      );
    }, [listWarranty]);

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

export default SelectWarranty;
