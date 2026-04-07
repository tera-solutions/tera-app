import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import { AdministratorApi } from "../../_api";
import { TParamsApiDof, TStatusType } from "../../interfaces";
import SelectEntity from "../SelectEntity";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";

export interface SelectDataStatusProps extends SelectProps {
  statusType?: TStatusType;
  paramsApi?: TParamsApiDof;
  idPrevent?: number;
  keyPrevent?: string;
  optionCustom?: OptionProps[];
  isCheckAll?: boolean;
  keyValue?: "key" | "id";
  prevent?: string[];
}

const SelectDataStatus = forwardRef<HTMLSelectElement, SelectDataStatusProps>(
  (
    {
      statusType,
      isCheckAll = false,
      optionCustom = [],
      idPrevent,
      keyPrevent,
      paramsApi,
      keyValue = "key",
      prevent = [],
      ...props
    },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);
    const { form } = useTeraForm();
    const { item } = useTeraFormItem();
    const includesKey = form?.watch(`${item?.name}`);

    const { data } = useQuery({
      queryKey: [
        "get-list-data-type",
        searchDebounce,
        paramsApi,
        statusType,
        includesKey,
      ],

      queryFn: () =>
        AdministratorApi.getListDataStatus({
          keyword: searchDebounce,
          ...paramsApi,
          object_status: statusType,
          include_key: includesKey,
        }),

      enabled: !props?.disabled,
      staleTime: 300000,
      gcTime: 300000,
    });

    const optionColumnConfig: OptionProps[] = useMemo(() => {
      const options = data?.data
        ?.filter((item) => item?.id !== idPrevent)
        ?.filter((item) => item?.concatenated_key !== keyPrevent)
        ?.filter((item) => {
          const data =
            keyValue === "key" ? item?.concatenated_key : String(item?.id);
          return !prevent.includes(data);
        })
        .map((status) => ({
          label: status?.title || status?.concatenated_key,
          value: keyValue === "key" ? status?.concatenated_key : status?.id,
        }));
      return options || [];
    }, [data, idPrevent, keyPrevent]);

    const showSearch = useMemo(() => {
      return data?.total_items > 15;
    }, []);

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

export default SelectDataStatus;
