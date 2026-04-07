import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { TParamsApi } from "@tera/commons/interfaces/api";
import ServicePackageApi from "@tera/api/servicePackage";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps, ValueType } from "tera-dls";
import SelectEntity from "../SelectEntity";

interface IProps extends SelectProps {
  selectedValue?: ValueType[] | ValueType;
  placeholder?: string;
  paramsApi?: TParamsApi;
}

const SelectServicePackageProduct = forwardRef<HTMLInputElement, IProps>(
  (
    { selectedValue, placeholder = "Vui lòng chọn", paramsApi, mode, ...props },
    ref,
  ) => {
    const [search, setSearch] = useState("");
    const searchDebounce = useDebounce(search, 300);

    const { data: response } = useQuery(
      ["get-service-package-product-list", searchDebounce, paramsApi],
      () =>
        ServicePackageApi.getProduct({
          params: {
            page: 1,
            limit: 10,
            keyword: searchDebounce,
            ...paramsApi,
          },
        }),
      {
        staleTime: 300000,
        cacheTime: 300000,
      },
    );

    const options: OptionProps[] = useMemo(() => {
      const options = response?.data?.map((item) => ({
        label: `${item?.name}`,
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

export default SelectServicePackageProduct;
