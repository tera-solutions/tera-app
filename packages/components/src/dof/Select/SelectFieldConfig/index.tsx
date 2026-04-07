import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";
import { AdministratorApi } from "../../_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";

interface SelectFieldConfigProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  optionCustom?: OptionProps[];
  isCheckAll?: boolean;
  typeLabel?: "field" | "form-field";
  isRefetch?: boolean;
}

const SelectFieldConfig = forwardRef<HTMLInputElement, SelectFieldConfigProps>(
  (
    {
      isRefetch,
      isCheckAll = false,
      typeLabel = "field",
      optionCustom = [],
      paramsApi,
      ...props
    },
    ref,
  ) => {
    const [searchFieldConfig, setSearchFieldConfig] = useState<string>("");
    const searchFieldConfigDebounce = useDebounce(searchFieldConfig, 300);

    const { data: listField, refetch } = useQuery({
      queryKey: ["get-list-field-config", searchFieldConfigDebounce, paramsApi],

      queryFn: () =>
        AdministratorApi.getListFieldConfig({
          page: 1,
          limit: 10,
          keyword: searchFieldConfigDebounce,
          ...paramsApi,
        }),

      enabled: !props?.disabled,
      staleTime: 300000,
      gcTime: 300000,
    });

    const renderLabel = (field) => {
      switch (typeLabel) {
        case "field":
          return field?.title;
        case "form-field":
          return `${field?.form?.title} - ${field?.title}`;
        default:
          return field?.title;
      }
    };

    const optionFieldConfig: OptionProps[] = useMemo(() => {
      const options = listField?.data?.map((field) => ({
        label: renderLabel(field),
        value: field?.id,
      }));
      return options || [];
    }, [listField]);

    useEffect(() => {
      if (isRefetch) refetch();
    }, [isRefetch]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
        labelInValue
        options={[...optionCustom, ...optionFieldConfig]}
        searchValue={searchFieldConfig}
        onSearch={setSearchFieldConfig}
        isCheckAll={isCheckAll}
        placeholder="Vui lòng chọn"
        {...props}
      />
    );
  },
);

export default SelectFieldConfig;
