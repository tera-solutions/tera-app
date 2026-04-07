import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import PermissionGroupApi from "@tera/api/permissionGroup";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import SelectEntity from "../SelectEntity";

interface SelectPermissionGroupProps extends SelectProps {
  placeholder?: string;
  paramsApi?: TParamsApiDof;
}

const SelectPermissionGroup = forwardRef(
  (
    {
      placeholder = "Vui lòng chọn",
      paramsApi,
      ...props
    }: SelectPermissionGroupProps,
    ref,
  ) => {
    const [searchPermissionGroup, setSearchPermissionGroup] = useState("");
    const searchPermissionGroupDebounce = useDebounce(
      searchPermissionGroup,
      300,
    );
    const paramsQuery = {
      limit: 10,
      page: 1,
      name: searchPermissionGroupDebounce,
      ...paramsApi,
    };
    const { data: listPermissionGroup } = useQueryLegacy({
      queryKey: ["get-permission-group-list", paramsQuery],
      queryFn: () => {
        const params = {
          ...paramsQuery,
        };
        return PermissionGroupApi.getList({ params });
      },
      staleTime: 300000,
      gcTime: 300000,
    });

    const optionsPermissionGroup: OptionProps[] =
      listPermissionGroup?.data?.map((permission) => ({
        label: `${permission?.code} - ${permission?.title}`,
        value: permission?.id,
      })) ?? [];

    return (
      <SelectEntity
        allowClear
        showSearch
        labelInValue
        onSearch={setSearchPermissionGroup}
        placeholder={placeholder}
        options={optionsPermissionGroup}
        {...props}
        ref={ref}
      />
    );
  },
);

export default SelectPermissionGroup;
