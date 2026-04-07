import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import SelectEntity from "../SelectEntity";
import { AdministratorApi } from "../../_api";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import { EmployeeText } from "@tera/components/web/TableColumnCustom/EmployeeText";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";

interface SelectModuleProps extends SelectProps {
  placeholder?: string;
  paramsApi?: TParamsApiDof;
}

const SelectModule = forwardRef(
  (
    { placeholder = "Vui lòng chọn", paramsApi, ...props }: SelectModuleProps,
    ref,
  ) => {
    const [searchPosition, setSearchPosition] = useState("");
    const searchPositionDebounce = useDebounce(searchPosition, 300);
    const { form } = useTeraForm();
    const { item } = useTeraFormItem();
    const includesID = form?.watch(`${item?.name}`);

    const paramsQuery = {
      limit: 15,
      page: 1,
      name: searchPositionDebounce,
      include_id: includesID,
      ...paramsApi,
    };
    const { data: listModule } = useQuery({
      queryKey: ["get-modules", paramsQuery],
      queryFn: () => AdministratorApi.getListModule(paramsQuery),
      staleTime: 300000,
      gcTime: 300000,
    });

    const optionsPosition: OptionProps[] =
      listModule?.data?.map((module) => ({
        labelDisplay: (
          <EmployeeText
            code={module?.code}
            name={module?.title}
            className="uppercase"
          />
        ),
        label: module?.title,
        value: module?.id,
      })) ?? [];

    return (
      <SelectEntity
        allowClear
        showSearch
        onSearch={setSearchPosition}
        placeholder={placeholder}
        options={optionsPosition}
        {...props}
        ref={ref}
      />
    );
  },
);

export default SelectModule;
