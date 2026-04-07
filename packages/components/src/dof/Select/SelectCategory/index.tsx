import { useQuery } from "@tanstack/react-query";
import { CrmApi } from "@tera/components/dof/_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import SelectEntity from "../SelectEntity";

type SelectCategoryProps = SelectProps & {
  paramsApi?: TParamsApiDof;
};
const SelectCategory = forwardRef<HTMLInputElement, SelectCategoryProps>(
  ({ placeholder = "Vui lòng chọn", paramsApi, ...props }) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const paramsQuery = {
      keyword: searchDebounce,
      ...paramsApi,
    };

    const { data: list } = useQuery({
      queryKey: ["get-list-category", paramsQuery],

      queryFn: () =>
        CrmApi.getCategoryList({
          ...paramsQuery,
        }),

      staleTime: 300000,
      gcTime: 300000,
    });

    const optionsCategory: OptionProps[] = list?.data?.map((category) => ({
      value: category.id,
      label: category.name,
    }));
    return (
      <SelectEntity
        allowClear
        showSearch
        onSearch={setSearch}
        placeholder={placeholder}
        options={optionsCategory}
        {...props}
      />
    );
  },
);

export default SelectCategory;
