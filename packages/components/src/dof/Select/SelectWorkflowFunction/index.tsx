import { useQuery } from '@tanstack/react-query';
import OperationApi from '@tera/api/operation';
import { TParamsApiDof } from '@tera/components/dof/interfaces';
import { useDebounce } from '@tera/commons/hooks/useDebounce';
import { forwardRef, useMemo, useState } from 'react';
import { OptionProps, SelectProps } from 'tera-dls';
import SelectEntity from '../SelectEntity';

interface SelectWorkflowFunctionProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  optionCustom?: OptionProps[];
}

const SelectWorkflowFunction = forwardRef<
  HTMLInputElement,
  SelectWorkflowFunctionProps
>(
  (
    { optionCustom = [], placeholder = 'Vui lòng chọn', paramsApi, ...props },
    ref,
  ) => {
    const [search, setSearch] = useState<string>('');
    const searchDebounce = useDebounce(search, 300);

    const { data: listWorkflowStatus, isLoading } = useQuery(
      [
        'get-workflow-function-list',
        searchDebounce,
        paramsApi?.exclude_key,
        paramsApi,
      ],
      () =>
        OperationApi.getListFunction({
          params: {
            page: 1,
            limit: 15,
            keyword: searchDebounce,
            ...paramsApi,
          },
        }),
      {
        staleTime: 300000,
        cacheTime: 300000,
      },
    );

    const options: OptionProps[] = useMemo(() => {
      return Object.entries(listWorkflowStatus?.data || {})?.map(
        ([key, value]) => ({
          label: value as any,
          value: key,
        }),
      );
    }, [listWorkflowStatus]);

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

export default SelectWorkflowFunction;
