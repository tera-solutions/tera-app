import { useQuery } from "@tanstack/react-query";
import { CrmApi } from "@tera/components/dof/_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";

interface IProps extends SelectProps {
  paramsApi?: TParamsApiDof;
}

const SelectCampaignEmployee = forwardRef<HTMLInputElement, IProps>(
  (
    { selectedValue, placeholder = "Vui lòng chọn", paramsApi, mode, ...props },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data: members, isLoading } = useQuery({
      queryKey: ["get-campaign-member-list", paramsApi, searchDebounce],

      queryFn: () =>
        CrmApi.getMemberList({
          params: {
            page: 1,
            limit: 10,
            keyword: searchDebounce,
            ...paramsApi,
          },
        }),

      staleTime: 300000,
      gcTime: 300000,
    });

    const options: OptionProps[] = useMemo(() => {
      const options = members?.data
        ?.filter((item) => !!item?.employee)
        ?.map(({ employee }) => ({
          label: `${employee?.code} - ${employee?.full_name}`,
          value: employee?.id,
        }));
      return options || [];
    }, [members, mode]);

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

export default SelectCampaignEmployee;
