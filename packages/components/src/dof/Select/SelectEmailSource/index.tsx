import { useQuery } from "@tanstack/react-query";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps } from "tera-dls";
import { SelectProps } from "tera-dls/lib/components/Select";
import SelectEntity from "../SelectEntity";
import { AdministratorApi } from "@tera/components/dof/_api";

interface SelectEmailSourceProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  idPrevent?: number;
  optionCustom?: OptionProps[];
  includesId?: number;
}

const SelectEmailSource = forwardRef<HTMLInputElement, SelectEmailSourceProps>(
  (
    {
      idPrevent,
      optionCustom = [],
      placeholder = "Vui lòng chọn",
      paramsApi,
      ...props
    },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data: listEmail } = useQuery({
      queryKey: ["get-email-source-list", searchDebounce, paramsApi],

      queryFn: () =>
        AdministratorApi.getListEmailConfig({
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
      const options = listEmail?.data
        ?.filter((item) => item?.id !== idPrevent)
        ?.map((config) => ({
          label: config?.name,
          value: config?.id,
        }));
      return options || [];
    }, [listEmail]);

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

export default SelectEmailSource;
