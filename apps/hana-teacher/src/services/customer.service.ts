import CustomerService from '@databases/customer/service';
import { useTableVersion } from '@databases/table_version/hook/useTableVersion';
import TableVersionService from '@databases/table_version/service';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { omit } from 'lodash';
import { useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { createPayload, deletePayload, updatePayload } from './_interface';
import { CustomerAPI } from './api/CustomerAPI';

export const useGetCustomerListInfinite = (params: any) => {
  const { version: ver_customer = 0, is_dirty } =
    useTableVersion('customers') ?? {};

  const result = useInfiniteQuery({
    queryKey: ['customer_local', 'list', params, ver_customer, is_dirty],
    queryFn: async ({ pageParam }) =>
      CustomerService.getAll({
        ...params,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    enabled: !!ver_customer,
    staleTime: 0,
  });

  const flattenedData = useMemo(
    () => result.data?.pages.flat() ?? [],
    [result.data?.pages],
  );

  return {
    ...result,
    data: flattenedData,
  };
};

export const useGetCustomerList = (params: any) => {
  const queryClient = useQueryClient();

  const { version: ver_customer = 0, is_dirty } =
    useTableVersion('business_customer') ?? {};

  console.log('useGetCustomerList', ver_customer, is_dirty);

  const result = useQuery({
    queryKey: ['customer', 'list', params, ver_customer, is_dirty],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await CustomerAPI.getList({
        params: { ...params, page: pageParam },
      });
      const data = response.data?.data || [];
      if (data.length > 0) {
        await CustomerService.bulkUpdate(data, ver_customer);
        await TableVersionService.upsert(
          'business_customer',
          ver_customer,
          is_dirty,
        );
        console.log('customer bulkUpdate');
        // if (!!is_dirty) {
        //   queryClient.invalidateQueries({
        //     queryKey: ['customer_local', 'list'],
        //   });
        // }
      }
      return response.data;
    },
    enabled: !!ver_customer && !!is_dirty,
    staleTime: 0,
  });

  return {
    ...result,
    meta: omit(result.data?.[0], ['data']),
    data: result.data?.data || [],
  };
};

export const useGetCustomerDetail = (id: string) => {
  const result = useQuery({
    queryKey: ['customer', 'detail', id],
    queryFn: () => CustomerService.getDetail(id),
    staleTime: 0,
    enabled: !!id,
  });

  return result;
};

export const useCreateOrUpdateCustomer = () => {
  return useMutation({
    mutationFn: async (variables: createPayload) => {
      return await CustomerService.upsert(variables.params);
    },
    onSuccess: async (res, variables) => {
      Toast.show({
        type: 'success',
        text1: res?.msg || 'Thao tác thành công',
      });
      if (typeof variables?.callback === 'function') {
        variables.callback();
      }
    },
    onError: (error: any) => {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: error?.msg || error?.message,
      });
    },
  });
};

export const useUpdateCustomer = () => {
  return useMutation({
    mutationFn: async (variables: updatePayload) => {
      return await CustomerAPI.update({
        id: variables.id,
        params: variables.params,
      });
    },
    onSuccess: async (res, variables) => {
      Toast.show({
        type: 'success',
        text1: res?.msg,
      });
      if (typeof variables?.callback === 'function') {
        variables.callback();
      }
    },
    onError: (error: any) => {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: error?.msg || error?.message,
      });
    },
  });
};

export const useDeleteCustomer = () => {
  return useMutation({
    mutationFn: async (variables: deletePayload) => {
      return await CustomerService.deleteByKey(variables.id);
    },
    onSuccess: async (res: any, variables) => {
      Toast.show({
        type: 'success',
        text1: res?.msg || 'Thao tác thành công',
      });
      if (typeof variables?.callback === 'function') {
        variables.callback();
      }
    },
    onError: (error: any) => {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: error?.msg || error?.message,
      });
    },
  });
};
