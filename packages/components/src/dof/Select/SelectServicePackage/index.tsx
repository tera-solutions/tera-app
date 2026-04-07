import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { TParamsApi } from "@tera/commons/interfaces/api";
import ServicePackageApi from "@tera/api/servicePackage";
import { forwardRef, useMemo, useState } from "react";
import { useQueryLegacy } from "@tera/commons/hooks/useQueryLegacy";
import { OptionProps } from "tera-dls";
import { SelectProps, ValueType } from "tera-dls";
import SelectEntity from "../SelectEntity";

interface IProps extends SelectProps {
  selectedValue?: ValueType[] | ValueType;
  placeholder?: string;
  paramsApi?: TParamsApi;
}

const SelectServicePackage = forwardRef<HTMLInputElement, IProps>(
  (
    { selectedValue, placeholder = "Vui lòng chọn", paramsApi, mode, ...props },
    ref,
  ) => {
    const [search, setSearch] = useState("");
    const searchDebounce = useDebounce(search, 300);

    const {
      data: response,
      isLoading,
      isError,
    } = useQueryLegacy({
      // Query Key phải là một mảng
      queryKey: ["get-service-package-list", searchDebounce, paramsApi],

      // Query Function: Tách biệt rõ ràng
      queryFn: () =>
        ServicePackageApi.getList({
          params: {
            page: 1,
            limit: 10,
            keyword: searchDebounce,
            ...paramsApi,
          },
        }),

      // Option mới: cacheTime đã đổi tên thành gcTime (Garbage Collection Time)
      staleTime: 300000, // 5 phút
      gcTime: 300000,
    });
    const options: OptionProps[] = useMemo(() => {
      const options = response?.data?.map((item) => ({
        label: `${item.code} - ${item?.name}`,
        value: item?.id,
      }));
      return options;
    }, [response, mode]);

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
        {...props}
      />
    );
  },
);

export default SelectServicePackage;
