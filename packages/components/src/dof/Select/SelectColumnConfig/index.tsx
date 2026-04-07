import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { OptionProps, parserParamsArray } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";
import { AdministratorApi } from "../../_api";
import { TParamsApiDof } from "../../interfaces";

interface SelectColumnConfigProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  idPrevent?: number;
  typeLabel?: "column" | "table-column";
  optionCustom?: OptionProps[];
  isCheckAll?: boolean;
  isRefetch?: boolean;
}

const SelectColumnConfig = forwardRef<
  HTMLInputElement,
  SelectColumnConfigProps
>(
  (
    {
      isCheckAll = false,
      optionCustom = [],
      idPrevent,
      paramsApi,
      isRefetch = false,
      typeLabel = "column",
      ...props
    },
    ref,
  ) => {
    const [searchColumnConfig, setSearchColumnConfig] = useState<string>("");
    const searchColumnConfigDebounce = useDebounce(searchColumnConfig, 300);

    const { data: listColumn, refetch } = useQuery({
      queryKey: [
        "get-list-column-config",
        searchColumnConfigDebounce,
        paramsApi,
      ],

      queryFn: () =>
        AdministratorApi.getListColumnConfig(
          parserParamsArray({
            page: 1,
            limit: 10,
            ...(searchColumnConfigDebounce !== "" && {
              keyword: searchColumnConfigDebounce,
            }),
            ...paramsApi,
          }),
        ),

      enabled: !props?.disabled,
      staleTime: 300000,
      gcTime: 300000,
    });

    const renderLabel = (column) => {
      switch (typeLabel) {
        case "column":
          return column?.title;
        case "table-column":
          return `${column?.page_table?.name} - ${column?.title}`;
        default:
          return column?.title;
      }
    };

    const optionColumnConfig: OptionProps[] = useMemo(() => {
      const options = listColumn?.data
        ?.filter((item) => item?.id !== idPrevent)
        .map((column) => ({
          label: renderLabel(column),
          value: column?.id,
        }));
      return options || [];
    }, [listColumn]);

    useEffect(() => {
      isRefetch && refetch();
    }, [isRefetch]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
        labelInValue
        options={[...optionCustom, ...optionColumnConfig]}
        searchValue={searchColumnConfig}
        onSearch={setSearchColumnConfig}
        isCheckAll={isCheckAll}
        placeholder="Vui lòng chọn"
        {...props}
      />
    );
  },
);

export default SelectColumnConfig;
