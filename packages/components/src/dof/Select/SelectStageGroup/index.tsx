import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import { CrmApi } from "../../_api";
import { TParamsApiDof } from "../../interfaces";
import SelectEntity from "../SelectEntity";

export interface SelectStageGroupProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  idPrevent?: number;
  optionCustom?: OptionProps[];
  isCheckAll?: boolean;
}

const SelectStageGroup = forwardRef<HTMLSelectElement, SelectStageGroupProps>(
  (
    { isCheckAll = false, optionCustom = [], idPrevent, paramsApi, ...props },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data } = useQuery({
      queryKey: ["get-stage-group-list", searchDebounce, paramsApi],

      queryFn: () =>
        CrmApi.getStageGroupList({
          keyword: searchDebounce,
          ...paramsApi,
        }),

      enabled: !props?.disabled,
      staleTime: 300000,
      gcTime: 300000,
    });

    const optionStage: OptionProps[] = useMemo(() => {
      const options = data?.data
        ?.filter((item) => item?.id !== idPrevent)
        .map((item) => ({
          label: item?.name,
          value: item?.id?.toString(),
        }));
      return options || [];
    }, [data, idPrevent]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch={true}
        labelInValue
        options={[...optionCustom, ...optionStage]}
        searchValue={search}
        onSearch={setSearch}
        isCheckAll={isCheckAll}
        placeholder="Vui lòng chọn"
        {...props}
      />
    );
  },
);

export default SelectStageGroup;
