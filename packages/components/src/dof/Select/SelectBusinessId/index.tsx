import { useQueryLegacy } from "@tera/commons/hooks/useQueryLegacy";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import { AdministratorApi } from "../../_api";
import SelectEntity from "../SelectEntity";

interface SelectBusinessIdProps extends SelectProps {
  placeholder?: string;
  paramsApi?: TParamsApiDof;
}

const SelectBusinessId = forwardRef(
  (
    {
      placeholder = "Vui lòng chọn",
      paramsApi,
      ...props
    }: SelectBusinessIdProps,
    ref,
  ) => {
    const [search, setSearch] = useState("");
    const searchDebounce = useDebounce(search, 300);
    const paramsQuery = {
      keyword: searchDebounce,
      ...paramsApi,
    };
    const { data: listData, isLoading } = useQueryLegacy(
      ["get-business-list", paramsQuery],
      () => AdministratorApi.getListBusiness(paramsQuery),
      {
        staleTime: 300000,
        cacheTime: 300000,
      },
    );

    const optionsPosition: OptionProps[] =
      listData?.data?.data?.map((item) => ({
        label: `${item?.id} - ${item?.name}`,
        value: item?.id,
      })) ?? [];

    return (
      <SelectEntity
        allowClear
        showSearch
        labelInValue
        onSearch={setSearch}
        placeholder={placeholder}
        options={optionsPosition}
        loading={isLoading}
        {...props}
        ref={ref}
      />
    );
  },
);

export default SelectBusinessId;
