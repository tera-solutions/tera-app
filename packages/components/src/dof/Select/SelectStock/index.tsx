import { useQuery } from "@tanstack/react-query";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";
import StockApi from "@tera/api/stock";

interface IProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  optionCustom?: OptionProps[];
}

const SelectStock = forwardRef<HTMLInputElement, IProps>(
  (
    { optionCustom = [], placeholder = "Vui lòng chọn", paramsApi, ...props },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data: stock, isLoading } = useQuery({
      queryKey: ["get-list-stock", searchDebounce, paramsApi],

      queryFn: () =>
        StockApi.getList({
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
        stock?.data.map((item) => ({
          label: item.stock_name,
          value: item.id,
        })) || []
      );
    }, [stock]);

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

export default SelectStock;
