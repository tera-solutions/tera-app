import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";
import { AdministratorApi } from "../../_api";
import { TParamsApiDof } from "../../interfaces";

interface SelectFormConfigProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  optionCustom?: OptionProps[];
  isCheckAll?: boolean;
}

const SelectFormConfig = forwardRef<HTMLInputElement, SelectFormConfigProps>(
  ({ isCheckAll = false, optionCustom = [], paramsApi, ...props }, ref) => {
    const [searchFormConfig, setSearchFormConfig] = useState<string>("");
    const searchFormConfigDebounce = useDebounce(searchFormConfig, 300);

    const { data: listForm } = useQuery({
      queryKey: ["get-list-form-config", searchFormConfigDebounce, paramsApi],

      queryFn: () =>
        AdministratorApi.getListFormConfig({
          page: 1,
          limit: 10,
          keyword: searchFormConfigDebounce,
          ...paramsApi,
        }),

      enabled: !props?.disabled,
      staleTime: 300000,
      gcTime: 300000,
    });

    const optionFormConfig: OptionProps[] = useMemo(() => {
      const options = listForm?.data?.map((form) => ({
        label: form?.title,
        value: form?.id,
      }));
      return options || [];
    }, [listForm]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
        labelInValue
        options={[...optionCustom, ...optionFormConfig]}
        searchValue={searchFormConfig}
        onSearch={setSearchFormConfig}
        isCheckAll={isCheckAll}
        placeholder="Vui lòng chọn"
        {...props}
      />
    );
  },
);

export default SelectFormConfig;
