import { useQuery } from "@tanstack/react-query";
import { AdministratorApi } from "@tera/components/dof/_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";

interface SelectEmployeeProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  optionCustom?: OptionProps[];
  includesId?: number;
}

const SelectSystemEmail = forwardRef<HTMLInputElement, SelectEmployeeProps>(
  (
    { optionCustom = [], placeholder = "Vui lòng chọn", paramsApi, ...props },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data: emailConfig } = useQuery({
      queryKey: ["get-email-config-list", searchDebounce, paramsApi],

      queryFn: () =>
        AdministratorApi.getMailConfigList({
          params: {
            page: 1,
            limit: 10,
            keyword: searchDebounce,
            ...paramsApi,
            ...(paramsApi?.except_id && {
              except_id: paramsApi?.except_id.join(","),
            }),
          },
        }),

      staleTime: 300000,
      gcTime: 300000,
    });

    const options: OptionProps[] = useMemo(() => {
      const options = emailConfig?.data?.map((config) => ({
        label: ` ${config?.name}`,
        value: config?.id,
      }));
      return options || [];
    }, [emailConfig]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
        labelInValue
        placeholder={placeholder}
        options={[...optionCustom, ...options]}
        searchValue={search}
        onSearch={setSearch}
        {...props}
      />
    );
  },
);

export default SelectSystemEmail;
