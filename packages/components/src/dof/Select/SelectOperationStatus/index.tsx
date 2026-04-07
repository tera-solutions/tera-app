import { useQuery } from "@tanstack/react-query";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useMemo, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import OperationApi from "@tera/api/Purchase/operation";
import SelectEntity from "../SelectEntity";

interface IProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  optionCustom?: OptionProps[];
  object_key:
    | "crm_purchase"
    | "crm_purchase_request"
    | "crm_quotation"
    | "crm_sell"
    | "crm_purchase_return"
    | "crm_sell_return"
    | "crm_inbound_inspection"
    | "crm_outbound_inspection"
    | "crm_purchase_delivery"
    | "crm_sell_delivery"
    | "crm_product";
}

const SelectOperationStatus = forwardRef<HTMLInputElement, IProps>(
  (
    {
      optionCustom = [],
      object_key,
      placeholder = "Vui lòng chọn",
      paramsApi,
      ...props
    },
    ref,
  ) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);

    const { data: response, isLoading } = useQuery({
      queryKey: ["get-operation-status", searchDebounce, paramsApi, object_key],

      queryFn: () =>
        OperationApi.getStatus({
          page: 1,
          limit: 15,
          keyword: searchDebounce,
          object_key,
          ...paramsApi,
        }),

      staleTime: 300000,
      gcTime: 300000,
    });
    const options: OptionProps[] = useMemo(() => {
      return (
        response?.data.map((item) => ({
          label: item.title,
          value: item.id ?? "all",
        })) || []
      );
    }, [response]);

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
        {...props}
      />
    );
  },
);

export default SelectOperationStatus;
