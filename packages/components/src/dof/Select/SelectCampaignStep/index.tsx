import { useQuery } from "@tanstack/react-query";
import { CrmApi } from "@tera/components/dof/_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";

interface SelectEmployeeProps extends SelectProps {
  paramsApi?: TParamsApiDof;
}

const SelectCampaignStep = forwardRef<HTMLInputElement, SelectEmployeeProps>(
  (
    { selectedValue, placeholder = "Vui lòng chọn", paramsApi, mode, ...props },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data: listCampaignStep, isLoading } = useQuery({
      queryKey: ["get-campaign-step-list", searchDebounce, paramsApi],

      queryFn: () =>
        CrmApi.getStepList({
          params: {
            page: 1,
            limit: 10,
            keyword: searchDebounce,
            order_field: "order",
            order_by: "asc",
            ...paramsApi,
          },
        }),

      staleTime: 300000,
      gcTime: 300000,
    });

    const options: OptionProps[] = useMemo(() => {
      const options = listCampaignStep?.data?.map((step) => ({
        label: step?.name,
        value: step?.id,
      }));
      return options || [];
    }, [listCampaignStep, mode]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
        labelInValue
        loading={isLoading}
        placeholder={placeholder}
        options={options}
        searchValue={search}
        selectedValue={selectedValue}
        onSearch={setSearch}
        mode={mode}
        {...props}
      />
    );
  },
);

export default SelectCampaignStep;
