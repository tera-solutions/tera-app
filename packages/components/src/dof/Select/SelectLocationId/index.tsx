import { useQuery } from "@tanstack/react-query";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import { CrmApi } from "../../_api";
import SelectEntity from "../SelectEntity";

interface SelectLocationIdProps extends SelectProps {
  placeholder?: string;
  paramsApi?: TParamsApiDof;
  optionCustom?: OptionProps[];
  isCheckAll?: boolean;
}

const SelectLocationId = forwardRef<HTMLInputElement, SelectLocationIdProps>(
  (
    {
      placeholder = "Vui lòng chọn",
      isCheckAll = false,
      optionCustom = [],
      paramsApi,
      ...props
    },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const paramsQuery = {
      keyword: searchDebounce,
      ...paramsApi,
    };

    const { data: listLocationId } = useQuery({
      queryKey: ["get-list-location-id", paramsQuery],
      queryFn: () => CrmApi.getListLocationId(paramsQuery),
      enabled: !props?.disabled,
      staleTime: 300000,
      gcTime: 300000,
    });

    const options: OptionProps[] =
      listLocationId?.data?.data?.map((location) => ({
        label: `${location?.id} - ${location?.name}`,
        value: location?.id,
      })) ?? [];

    return (
      <SelectEntity
        allowClear
        showSearch
        labelInValue
        onSearch={setSearch}
        placeholder={placeholder}
        options={[...optionCustom, ...options]}
        isCheckAll={isCheckAll}
        {...props}
        ref={ref}
      />
    );
  },
);

export default SelectLocationId;
