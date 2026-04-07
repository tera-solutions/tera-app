import { useQuery } from "@tanstack/react-query";
import { EmployeeText } from "@tera/components/web/TableColumnCustom/EmployeeText";
import { CrmApi } from "@tera/components/dof/_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";

interface SelectEmployeeProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  valueKey?: string;
}

const SelectEmployeeCrm = forwardRef<HTMLInputElement, SelectEmployeeProps>(
  (
    {
      selectedValue,
      placeholder = "Vui lòng chọn",
      paramsApi,
      mode,
      valueKey = "id",
      ...props
    },
    ref,
  ) => {
    const [searchEmployee, setSearchEmployee] = useState<string>("");
    const searchEmployeeDebounce = useDebounce(searchEmployee, 300);

    const { data: listEmployee, isLoading } = useQuery({
      queryKey: ["get-list-employee", searchEmployeeDebounce, paramsApi],

      queryFn: () =>
        CrmApi.getEmployeeList({
          params: {
            page: 1,
            limit: 10,
            keyword: searchEmployeeDebounce,
            onlyUser: 1,
            ...paramsApi,
          },
        }),

      staleTime: 300000,
      gcTime: 300000,
    });
    const optionsEmployee: OptionProps[] = useMemo(() => {
      const options = listEmployee?.data?.map((employee) => ({
        labelDisplay:
          mode === "multiple" ? (
            employee?.full_name
          ) : (
            <EmployeeText code={employee?.code} name={employee?.full_name} />
          ),
        label:
          mode === "multiple"
            ? employee?.full_name
            : `${employee?.code} - ${employee?.full_name}`,
        value: employee?.[valueKey],
      }));
      return options;
    }, [listEmployee, mode]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
        labelInValue
        loading={isLoading}
        placeholder={placeholder}
        options={optionsEmployee}
        searchValue={searchEmployee}
        selectedValue={selectedValue}
        onSearch={setSearchEmployee}
        mode={mode}
        {...props}
      />
    );
  },
);

export default SelectEmployeeCrm;
