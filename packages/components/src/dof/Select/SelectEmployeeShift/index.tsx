import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { TParamsApi } from "@tera/commons/interfaces/api";
import { forwardRef, useState } from "react";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";
import { HrmApi } from "../../_api";

interface EmployeeShiftProps extends SelectProps {
  paramsApi?: TParamsApi;
}

const SelectEmployeeShift = forwardRef<HTMLInputElement, EmployeeShiftProps>(
  (props, ref) => {
    const { paramsApi, ...restProps } = props;
    const [searchEmployeeShift, setSearchEmployeeShift] = useState("");
    const searchEmployeeShiftDebounce = useDebounce(searchEmployeeShift, 300);
    const paramsQuery = {
      limit: 10,
      page: 1,
      name: searchEmployeeShiftDebounce,
      ...paramsApi,
    };
    const { data: listEmployeeShift } = useQuery({
      queryKey: ["get-employee-shift", paramsQuery],
      queryFn: () => HrmApi.getListEmployeeShift(paramsQuery),
      staleTime: 300000,
      gcTime: 300000,
    });

    const options = listEmployeeShift?.data?.map((item) => {
      return { label: item.name_shift, value: item.id };
    });

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
        labelInValue
        options={options}
        onSearch={setSearchEmployeeShift}
        {...restProps}
      />
    );
  },
);

export default SelectEmployeeShift;
