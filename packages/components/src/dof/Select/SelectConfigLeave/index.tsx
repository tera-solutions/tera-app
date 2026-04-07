import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { TParamsApi } from "@tera/commons/interfaces/api";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps, ValueType } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";
import { HrmApi } from "../../_api";

interface SelectConfigLeaveProps extends SelectProps {
  selectedValue?: ValueType[] | ValueType;
  placeholder?: string;
  paramsApi?: TParamsApi;
}

const SelectConfigLeave = forwardRef<HTMLInputElement, SelectConfigLeaveProps>(
  (
    { selectedValue, placeholder = "Vui lòng chọn", paramsApi, mode, ...props },
    ref,
  ) => {
    const [searchAnnualType, setSearchAnnualType] = useState("");
    const searchAnnualTypeDebounce = useDebounce(searchAnnualType, 300);

    const { data: listConfigLeave } = useQuery({
      queryKey: ["get-config-leave-filter", searchAnnualTypeDebounce],

      queryFn: () =>
        HrmApi.getListConfigLeave({
          page: 1,
          limit: 10,
          keyword: searchAnnualTypeDebounce,
          ...paramsApi,
        }),

      staleTime: 300000,
      gcTime: 300000,
    });

    const optionsConfigLeave: OptionProps[] = useMemo(() => {
      const options = listConfigLeave?.data?.map((configLeave) => ({
        label: configLeave?.name,
        value: configLeave?.id,
      }));
      return options;
    }, [listConfigLeave, mode]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
        labelInValue
        placeholder={placeholder}
        options={optionsConfigLeave}
        searchValue={searchAnnualType}
        selectedValue={selectedValue}
        onSearch={setSearchAnnualType}
        {...props}
      />
    );
  },
);

export default SelectConfigLeave;
