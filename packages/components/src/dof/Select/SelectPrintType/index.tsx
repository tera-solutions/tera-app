import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import SelectEntity from "../SelectEntityNew";
import { HrmApi } from "../../_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";

interface SelectPrintTypeProps extends SelectProps {
  placeholder?: string;
  paramsApi?: TParamsApiDof;
}

const SelectPrintType = forwardRef(
  (
    {
      placeholder = "Vui lòng chọn",
      paramsApi,
      ...props
    }: SelectPrintTypeProps,
    ref,
  ) => {
    const [searchPrintType, setSearchPrintType] = useState("");
    const searchPrintTypeDebounce = useDebounce(searchPrintType, 600);
    const paramsQuery = {
      page: 1,
      keyword: searchPrintTypeDebounce,
      ...paramsApi,
    };
    const { data: listPrintType } = useQuery({
      queryKey: ["get-list-print-type", paramsQuery],
      queryFn: () => HrmApi.getListSelectPrintType(paramsQuery),
      staleTime: 300000,
      gcTime: 300000,
    });

    const optionsPrintType: OptionProps[] =
      listPrintType?.data?.map((printType) => ({
        label: printType?.title,
        value: printType?.id,
      })) ?? [];

    return (
      <SelectEntity
        allowClear
        labelInValue
        showSearch={listPrintType?.total_items >= 15}
        onSearch={setSearchPrintType}
        placeholder={placeholder}
        options={optionsPrintType}
        searchValue={searchPrintType}
        {...props}
        ref={ref}
      />
    );
  },
);

export default SelectPrintType;
