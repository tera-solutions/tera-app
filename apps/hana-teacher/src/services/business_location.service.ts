import BusinessLocationService from '@databases/business_locations/service';
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
import { BusinessLocationAPI } from './api/BusinessLocationAPI';

export const useGetBusinessLocationListInfinite = (params: any) => {
  const { version: ver_locations = 0, is_dirty } =
    useTableVersion('business_locations') ?? {};

  // console.log('get list location from DB', !!ver_locations, ver_locations);

  const result = useInfiniteQuery({
    queryKey: [
      'business_location_local',
      'list',
      params,
      ver_locations,
      is_dirty,
    ],
    queryFn: async ({ pageParam }) =>
      BusinessLocationService.getAll({
        ...params,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    enabled: !!ver_locations,
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

export const useGetBusinessLocationList = (params: any) => {
  const queryClient = useQueryClient();

  const { version: ver_locations = 0, is_dirty } =
    useTableVersion('business_locations') ?? {};

  console.log('useGetBusinessLocationList', ver_locations, is_dirty);

  const result = useQuery({
    queryKey: ['business_location', 'list', params, ver_locations, is_dirty],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await BusinessLocationAPI.getList({
        params: { ...params, page: pageParam },
      });
      const data = response.data?.data || [];
      if (data.length > 0) {
        await BusinessLocationService.bulkUpdate(data, ver_locations);
        await TableVersionService.upsert(
          'business_locations',
          ver_locations,
          is_dirty,
        );
        console.log('business_location bulkUpdate');
        // if (!!is_dirty) {
        //   queryClient.invalidateQueries({
        //     queryKey: ['business_location_local', 'list'],
        //   });
        // }
      }
      return response.data;
    },
    enabled: !!ver_locations && !!is_dirty,
    staleTime: 0,
  });

  return {
    ...result,
    meta: omit(result.data?.[0], ['data']),
    data: result.data?.data || [],
  };
};

export const useGetBusinessLocationDetail = (id: string) => {
  const result = useQuery({
    queryKey: ['business_location', 'detail', id],
    queryFn: () => BusinessLocationService.getDetail(id),
    staleTime: Infinity,
    enabled: !!id,
  });

  return result;
};

export const useCreateOrUpdateBusinessLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: createPayload) => {
      return await BusinessLocationService.upsert(variables.params);
    },
    onSuccess: async (res, variables) => {
      Toast.show({
        type: 'success',
        text1: res?.msg || 'Thao tác thành công',
      });
      queryClient.invalidateQueries({
        queryKey: ['get_business'],
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

export const useUpdateBusinessLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: updatePayload) => {
      return await BusinessLocationAPI.update({
        id: variables.id,
        params: variables.params,
      });
    },
    onSuccess: async (res, variables) => {
      Toast.show({
        type: 'success',
        text1: res?.msg,
      });
      queryClient.invalidateQueries({
        queryKey: ['business_location', 'detail', variables.id],
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

export const useDeleteBusinessLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: deletePayload) => {
      return await BusinessLocationService.deleteByKey(variables.id);
    },
    onSuccess: async (res: any, variables) => {
      Toast.show({
        type: 'success',
        text1: res?.msg || 'Thao tác thành công',
      });
      queryClient.invalidateQueries({
        queryKey: ['get_business'],
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
