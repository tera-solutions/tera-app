import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { EmployeeText } from "@tera/components/web/EmployeeText";
import SelectEntity from "../SelectEntity";
import { AdministratorApi } from "../../_api";

interface SelectEpicProps extends SelectProps {
  paramsApi?: TParamsApiDof;
}

const SelectEpic = forwardRef(
  (
    { placeholder = "Chọn Epic", paramsApi, ...props }: SelectEpicProps,
    ref,
  ) => {
    const [search, setSearch] = useState("");
    const searchDebounce = useDebounce(search, 300);
    const paramsQuery = {
      limit: 15,
      page: 1,
      keyword: searchDebounce,
      ...paramsApi,
    };
    const {
      data: listEpic,
      isLoading,
      isFetching,
    } = useQuery({
      queryKey: ["get-epic-list", paramsQuery],
      queryFn: () => AdministratorApi.getListEpic(paramsQuery),
      staleTime: 300000,
      gcTime: 300000,
      enabled: !!paramsQuery,
    });
    const options: OptionProps[] =
      listEpic?.data?.map((item) => ({
        labelDisplay: <EmployeeText code={item?.code} name={item?.name} />,
        label: item?.name,
        value: item?.id,
      })) ?? [];

    return (
      <SelectEntity
        allowClear
        showSearch
        onSearch={setSearch}
        placeholder={placeholder}
        options={options}
        loading={isLoading}
        {...props}
        ref={ref}
      />
    );
  },
);

export default SelectEpic;
