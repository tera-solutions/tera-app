import { useQuery } from "@tanstack/react-query";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import { AdministratorApi } from "../../_api";
import SelectEntity from "../SelectEntity";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";

interface SelectObjectTypeProps extends SelectProps {
  placeholder?: string;
  paramsApi?: TParamsApiDof;
}

const SelectObjectType = forwardRef<HTMLInputElement, SelectObjectTypeProps>(
  ({ placeholder = "Vui lòng chọn", paramsApi, ...props }, ref) => {
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 300);
    const { form } = useTeraForm();
    const { item } = useTeraFormItem();
    const includeKey = form?.watch(`${item?.name}`);
    const paramsQuery = {
      keyword: searchDebounce,
      include_key: includeKey,
      ...paramsApi,
    };

    const { data: listObjectType } = useQuery({
      queryKey: ["get-list-object-type", paramsQuery],
      queryFn: () => AdministratorApi.getListObjectType(paramsQuery),
      staleTime: 300000,
      gcTime: 300000,
    });

    const optionsObjectType: OptionProps[] =
      listObjectType?.data?.map((type) => ({
        label: type?.object_type,
        value: type?.key,
      })) ?? [];

    return (
      <SelectEntity
        allowClear
        showSearch
        searchValue={search}
        onSearch={setSearch}
        placeholder={placeholder}
        options={optionsObjectType}
        {...props}
        ref={ref}
      />
    );
  },
);

export default SelectObjectType;
