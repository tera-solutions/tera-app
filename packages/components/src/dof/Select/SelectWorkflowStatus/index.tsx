import { useQuery } from '@tanstack/react-query';
import OperationApi from '@tera/api/operation';
import { TParamsApiDof } from '@tera/components/dof/interfaces';
import { useDebounce } from '@tera/commons/hooks/useDebounce';
import { forwardRef, useMemo, useState } from 'react';
import { OptionProps, SelectProps } from 'tera-dls';
import SelectEntity from '../SelectEntity';

interface SelectWorkflowStatusProps extends SelectProps {
  paramsApi?: TParamsApiDof;
  optionCustom?: any[];
  isInspection?: boolean;
}

const SelectWorkflowStatus = forwardRef<
  HTMLInputElement,
  SelectWorkflowStatusProps
>(
  (
    {
      isInspection,
      optionCustom = [],
      placeholder = 'Vui lòng chọn',
      paramsApi,
      ...props
    },
    ref,
  ) => {
    const [search, setSearch] = useState<string>('');
    const searchDebounce = useDebounce(search, 300);

    const { data: listWorkflowStatus, isLoading } = useQuery(
      ['get-status-workflow-list', searchDebounce, paramsApi],
      () =>
        OperationApi.getListStatus({
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
      if (isInspection) {
        return (
          listWorkflowStatus?.data
            ?.filter((status) =>
              status?.functions?.some((func) =>
                [
                  'approve_outbound_inspection',
                  'approve_inbound_inspection',
                ].includes(func?.function_key),
              ),
            )
            ?.map((status) => ({
              key: status.id,
              functions: status?.functions,
              status: status?.status,
              label: status.title,
              value: status.id,
            })) || []
        );
      }

      return (
        listWorkflowStatus?.data.map((status) => ({
          key: status.id,
          functions: status?.functions,
          status: status?.status,
          label: status.title,
          value: status.id,
        })) || []
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

export default SelectWorkflowStatus;
