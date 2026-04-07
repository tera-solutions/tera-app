import { useQuery } from "@tanstack/react-query";
import { AdministratorApi } from "@tera/components/dof/_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import SelectEntity from "../SelectEntity";

interface SelectUserProps extends SelectProps {
  placeholder?: string;
  paramsApi?: TParamsApiDof;
}

const SelectUser = forwardRef<HTMLInputElement, SelectUserProps>(
  ({ placeholder = "Vui lòng chọn", ...props }, ref) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const paramsQuery = {
      keyword: searchDebounce,
      ...props?.paramsApi,
    };

    const { data } = useQuery({
      queryKey: ["get-user-list", paramsQuery],
      queryFn: () => AdministratorApi.getListUser(paramsQuery),
      staleTime: 300000,
      gcTime: 300000,
    });
    const options: OptionProps[] = data?.data?.data
      ? data?.data?.data?.map((item) => ({
          label: item?.full_name,
          value: item?.id,
        }))
      : [];

    return (
      <SelectEntity
        allowClear
        showSearch
        searchValue={search}
        onSearch={setSearch}
        placeholder={placeholder}
        options={options}
        {...props}
        ref={ref}
      />
    );
  },
);

export default SelectUser;
