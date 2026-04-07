import { useQuery } from "@tanstack/react-query";
import RequestApi from "@tera/components/dof/_api/request";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import SelectEntity from "../SelectEntity";

interface SelectRequestGroupProps extends SelectProps {
  placeholder?: string;
  paramsApi?: TParamsApiDof;
}

const SelectRequestGroup = forwardRef<
  HTMLInputElement,
  SelectRequestGroupProps
>(({ placeholder = "Vui lòng chọn", ...props }, ref) => {
  const [search, setSearch] = useState<string>("");
  const searchDebounce = useDebounce(search, 300);

  const paramsQuery = {
    keyword: searchDebounce,
  };

  const { data } = useQuery({
    queryKey: ["get-request-group-list", paramsQuery],
    queryFn: () => RequestApi.getListRequestGroup(paramsQuery),
    staleTime: 300000,
    gcTime: 300000,
  });

  const options: OptionProps[] =
    data?.data?.data?.map((item) => ({
      label: `${item?.name} (${item?.status_workflow_text})`,
      value: item?.id,
    })) ?? [];

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
});

export default SelectRequestGroup;
