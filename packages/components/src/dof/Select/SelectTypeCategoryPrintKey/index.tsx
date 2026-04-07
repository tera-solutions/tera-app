import { useQuery } from "@tanstack/react-query";
import { HrmApi } from "@tera/components/dof/_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import SelectEntity from "../SelectEntityNew";

interface SelectCategoryTypeProps extends SelectProps {
  placeholder?: string;
  paramsApi?: TParamsApiDof;
}

const SelectPrintCategoryType = forwardRef(
  (
    {
      placeholder = "Vui lòng chọn",
      paramsApi,
      ...props
    }: SelectCategoryTypeProps,
    ref,
  ) => {
    const [searchCategoryType, setSearchCategoryType] = useState("");
    const searchCategoryTypeDebounce = useDebounce(searchCategoryType, 300);
    const paramsQuery = {
      page: 1,
      keyword: searchCategoryTypeDebounce,
      ...paramsApi,
    };
    const { data: listCategoryType } = useQuery({
      queryKey: ["get-list-print-key-category-type", paramsQuery],
      queryFn: () => HrmApi.getListSelectTypeCategoryPrintKey(paramsQuery),
      staleTime: 300000,
      gcTime: 300000,
    });

    const optionsCategoryType: OptionProps[] =
      listCategoryType?.map((categoryType) => ({
        label: categoryType?.type,
        value: categoryType?.type,
      })) ?? [];

    return (
      <SelectEntity
        allowClear
        showSearch
        labelInValue
        onSearch={setSearchCategoryType}
        placeholder={placeholder}
        options={optionsCategoryType}
        searchValue={searchCategoryType}
        {...props}
        ref={ref}
      />
    );
  },
);

export default SelectPrintCategoryType;
