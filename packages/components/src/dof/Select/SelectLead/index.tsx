import { useQuery } from "@tanstack/react-query";
import { CrmApi } from "@tera/components/dof/_api";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import { TParamsApiDof } from "../../interfaces";
import SelectEntity from "../SelectEntity";

export interface SelectDataTypeProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  optionCustom?: OptionProps[];
  isCheckAll?: boolean;
}

const SelectLead = forwardRef<HTMLSelectElement, SelectDataTypeProps>(
  ({ isCheckAll = false, optionCustom = [], paramsApi, ...props }, ref) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data } = useQuery({
      queryKey: ["get-lead-list", searchDebounce, paramsApi],

      queryFn: () => {
        return CrmApi.getLeadList({
          params: {
            keyword: searchDebounce,
            ...paramsApi,
          },
        });
      },

      enabled: !props?.disabled,
      staleTime: 300000,
      gcTime: 300000,
    });

    const optionColumnConfig: OptionProps[] = useMemo(() => {
      const options = data?.data?.map((item) => ({
        label: item?.business_name,
        value: item?.id,
      }));
      return options || [];
    }, [data]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
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

export default SelectLead;
