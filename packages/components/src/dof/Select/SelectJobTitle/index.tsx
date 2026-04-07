import { useQueryLegacy } from "@tera/commons/hooks/useQueryLegacy";
import { useDebounce } from "@tera/commons/hooks/useDebounce";
import { forwardRef, useState } from "react";
import { OptionProps, SelectProps } from "tera-dls";
import { TParamsApiDof } from "@tera/components/dof/interfaces";
import SelectEntity from "../SelectEntity";
import { HrmApi } from "../../_api";

interface SelectJobTitleProps extends SelectProps {
  placeholder?: string;
  paramsApi?: TParamsApiDof;
}

const SelectJobTitle = forwardRef(
  (
    { placeholder = "Vui lòng chọn", paramsApi, ...props }: SelectJobTitleProps,
    ref,
  ) => {
    const [searchJobTitle, setSearchJobTitle] = useState("");
    const searchJobTitleDebounce = useDebounce(searchJobTitle, 300);
    const paramsQuery = {
      limit: 10,
      page: 1,
      name: searchJobTitleDebounce,
      ...paramsApi,
    };
    const { data: listJobTitle, isLoading } = useQueryLegacy({
      queryKey: ["get-job-title", paramsApi],
      queryFn: () => HrmApi.getListJobTitle(paramsApi),
      staleTime: 300000,
      gcTime: 300000,
      enabled: !!paramsApi,
    });

    const optionsJobTitle: OptionProps[] =
      listJobTitle?.data?.map((job) => ({
        label: job?.name,
        value: job?.id,
      })) ?? [];

    return (
      <SelectEntity
        allowClear
        showSearch
        labelInValue
        onSearch={setSearchJobTitle}
        placeholder={placeholder}
        options={optionsJobTitle}
        {...props}
        ref={ref}
      />
    );
  },
);

export default SelectJobTitle;
