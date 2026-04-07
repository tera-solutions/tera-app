import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import { AdministratorApi } from "../../_api";
import { TObjectType, TParamsApiDof } from "../../interfaces";
import SelectEntity from "../SelectEntity";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";

export interface SelectDataTypeProps extends SelectProps {
  objectType?: TObjectType;
  paramsApi?: TParamsApiDof;
  idPrevent?: number;
  optionCustom?: OptionProps[];
  isCheckAll?: boolean;
}

const SelectDataType = forwardRef<HTMLSelectElement, SelectDataTypeProps>(
  (
    {
      objectType,
      isCheckAll = false,
      optionCustom = [],
      idPrevent,
      paramsApi,
      ...props
    },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 800);
    const { form } = useTeraForm();
    const { item } = useTeraFormItem();
    const includesKey = form?.watch(`${item?.name}`);

    const { data } = useQuery({
      queryKey: [
        "get-list-data-type",
        searchDebounce,
        paramsApi,
        objectType,
        includesKey,
      ],

      queryFn: () =>
        AdministratorApi.getListDataType({
          keyword: searchDebounce,
          object_type: objectType,
          include_key: includesKey,
          ...paramsApi,
        }),

      staleTime: 300000,
      gcTime: 300000,
    });

    const optionColumnConfig: OptionProps[] = useMemo(() => {
      const options = data?.data
        ?.filter((item) => item?.id !== idPrevent)
        .map((column) => ({
          label: column?.title || column?.concatenated_key,
          value: column?.concatenated_key,
          key: column?.key,
        }));
      return options || [];
    }, [data, idPrevent]);

    const showSearch = useMemo(() => {
      return data?.total_items > 15;
    }, [data]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch={showSearch}
        labelInValue
        options={[...optionCustom, ...optionColumnConfig]}
        searchValue={search}
        onSearch={setSearch}
        isCheckAll={isCheckAll}
        placeholder="Vui lòng chọn"
        {...props}
      />
    );
  },
);

export default SelectDataType;
