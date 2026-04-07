import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";
import { AdministratorApi } from "../../_api";
import { TParamsApiDof } from "../../interfaces";

interface SelectControlConfigProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  optionCustom?: OptionProps[];
  isCheckAll?: boolean;
}

const SelectControlConfig = forwardRef<
  HTMLInputElement,
  SelectControlConfigProps
>(({ isCheckAll = false, optionCustom = [], paramsApi, ...props }, ref) => {
  const [searchControlConfig, setSearchControlConfig] = useState<string>("");
  const searchControlConfigDebounce = useDebounce(searchControlConfig, 300);

  const { data: listControl } = useQuery({
    queryKey: [
      "get-list-control-config",
      searchControlConfigDebounce,
      paramsApi,
    ],

    queryFn: () =>
      AdministratorApi.getListControlConfig({
        page: 1,
        limit: 15,
        keyword: searchControlConfigDebounce,
        ...paramsApi,
      }),

    enabled: !props?.disabled,
    staleTime: 300000,
    gcTime: 300000,
  });

  const optionControlConfig: OptionProps[] = useMemo(() => {
    const options = listControl?.data?.map((control) => ({
      label: control?.title,
      value: control?.id,
    }));
    return options || [];
  }, [listControl]);

  return (
    <SelectEntity
      ref={ref}
      allowClear
      showSearch
      labelInValue
      options={[...optionCustom, ...optionControlConfig]}
      searchValue={searchControlConfig}
      onSearch={setSearchControlConfig}
      isCheckAll={isCheckAll}
      placeholder="Vui lòng chọn"
      {...props}
    />
  );
});

export default SelectControlConfig;
