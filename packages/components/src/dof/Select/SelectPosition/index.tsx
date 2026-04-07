import { useQueryLegacy } from "@tera/commons/hooks/useQueryLegacy";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import SelectEntity from "../SelectEntity";
import { HrmApi } from "../../_api";

interface SelectPositionProps extends SelectProps {
  placeholder?: string;
  paramsApi?: TParamsApiDof;
}

const SelectPosition = forwardRef(
  (
    { placeholder = "Vui lòng chọn", paramsApi, ...props }: SelectPositionProps,
    ref,
  ) => {
    const [searchPosition, setSearchPosition] = useState("");
    const searchPositionDebounce = useDebounce(searchPosition, 300);
    const paramsQuery = {
      limit: 10,
      page: 1,
      name: searchPositionDebounce,
      ...paramsApi,
    };

    const { data: listPosition, isLoading } = useQueryLegacy({
      queryKey: ["get-position", paramsQuery],
      queryFn: () => HrmApi.getListPosition(paramsQuery),
      staleTime: 300000,
      gcTime: 300000,
      enabled: !!paramsQuery,
    });

    const optionsPosition: OptionProps[] =
      listPosition?.data?.map((position) => ({
        label: position?.name,
        value: position?.id,
      })) ?? [];

    return (
      <SelectEntity
        allowClear
        showSearch
        labelInValue
        onSearch={setSearchPosition}
        placeholder={placeholder}
        options={optionsPosition}
        {...props}
        ref={ref}
      />
    );
  },
);

export default SelectPosition;
