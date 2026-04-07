import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";
import { HrmApi } from "../../_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";

interface SelectEmployeeProps extends SelectProps {
  paramsApi?: TParamsApiDof;
}

const SelectEmployeeHrm = forwardRef<HTMLInputElement, SelectEmployeeProps>(
  (
    { selectedValue, placeholder = "Vui lòng chọn", paramsApi, mode, ...props },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data: listEmployee } = useQuery({
      queryKey: ["get-employeeHrm", searchDebounce],

      queryFn: () =>
        HrmApi.getListEmployee({
          page: 1,
          limit: 10,
          full_name: searchDebounce,
          ...paramsApi,
        }),

      staleTime: 300000,
      gcTime: 300000,
    });

    const options: OptionProps[] = useMemo(() => {
      const options = listEmployee?.data?.data?.map((employee) => ({
        label:
          mode === "multiple"
            ? employee?.full_name
            : `${employee?.code} - ${employee?.full_name}`,
        value: employee?.id,
      }));
      return options || [];
    }, [listEmployee, mode]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
        labelInValue
        placeholder={placeholder}
        options={options}
        searchValue={search}
        selectedValue={selectedValue}
        onSearch={setSearch}
        mode={mode}
        {...props}
      />
    );
  },
);

export default SelectEmployeeHrm;
