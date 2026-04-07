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
  idPrevent?: number;
  optionCustom?: OptionProps[];
  includesId?: number;
  searchPlaceholder?: string;
}

const SelectCampaign = forwardRef<HTMLInputElement, SelectEmployeeProps>(
  (
    {
      idPrevent,
      optionCustom = [],
      placeholder = "Vui lòng chọn",
      paramsApi,
      searchPlaceholder = "Tìm kiếm theo mã và tên chiến dịch",
      ...props
    },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data: listCampaign, isLoading } = useQuery({
      queryKey: ["get-campaign-list", searchDebounce, paramsApi],

      queryFn: () =>
        CrmApi.getCampaignList({
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
      const options = listCampaign?.data?.data
        ?.filter((item) => item?.id !== idPrevent)
        ?.map((campaign) => ({
          label: `${campaign?.code} - ${campaign?.campaign_name}`,
          value: campaign?.id,
        }));
      return options || [];
    }, [listCampaign]);

    return (
      <SelectEntity
        ref={ref}
        allowClear
        showSearch
        labelInValue
        loading={isLoading}
        placeholder={placeholder}
        options={[...optionCustom, ...options]}
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder={searchPlaceholder}
        {...props}
      />
    );
  },
);

export default SelectCampaign;
