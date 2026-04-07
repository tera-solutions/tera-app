import { useQuery } from "@tanstack/react-query";
import { CrmApi } from "@tera/components/dof/_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";

interface SelectBrandProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  optionCustom?: OptionProps[];
}

const SelectBrand = forwardRef<HTMLInputElement, SelectBrandProps>(
  (
    { optionCustom = [], placeholder = "Vui lòng chọn", paramsApi, ...props },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data: listBrand, isLoading } = useQuery({
      queryKey: ["get-list-brand", searchDebounce, paramsApi],

      queryFn: () =>
        CrmApi.getBrandList({
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
        listBrand?.data.map((brand) => ({
          label: brand.name,
          value: brand.id,
        })) || []
      );
    }, [listBrand]);

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

export default SelectBrand;
