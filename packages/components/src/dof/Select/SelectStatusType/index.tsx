import { useQuery } from "@tanstack/react-query";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import { AdministratorApi } from "../../_api";
import SelectEntity from "../SelectEntity";
import { useDebounce } from "@tera/commons/hooks/useDebounce";

interface SelectStatusTypeProps extends SelectProps {
  placeholder?: string;
  paramsApi?: TParamsApiDof;
}

const SelectStatusType = forwardRef<HTMLInputElement, SelectStatusTypeProps>(
  ({ placeholder = "Vui lòng chọn", paramsApi, ...props }, ref) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const paramsQuery = {
      keyword: searchDebounce,
      ...paramsApi,
    };

    const { data: listStatusType } = useQuery({
      queryKey: ["get-list-status-type", paramsQuery],
      queryFn: () => AdministratorApi.getListStatusType(paramsQuery),
      staleTime: 300000,
      gcTime: 300000,
    });

    const optionsStatusType: OptionProps[] =
      listStatusType?.data?.map((type) => ({
        label: type?.object_type,
        value: type?.key,
      })) ?? [];

    return (
      <SelectEntity
        allowClear
        showSearch
        searchValue={search}
        onSearch={setSearch}
        placeholder={placeholder}
        options={optionsStatusType}
        {...props}
        ref={ref}
      />
    );
  },
);

export default SelectStatusType;
