import { useStates } from '@hooks/useStates';
import { delay } from '@tera/commons/utils';
import GeneralService from '@databases/general/service';
import { useTableVersion } from '@databases/table_version/hook/useTableVersion';
import { BusinessAPI } from '@services/api/BusinessAPI';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useGetBusiness = (timeout: number = 0) => {
  const {
    uiStore: { setStore },
    authStore: { authenticated },
    generalStore: { setVersion },
  } = useStates();

  const { version: business_ver = 0 } = useTableVersion('business') ?? {};

  const result = useQuery({
    queryKey: ['get_business', business_ver],
    queryFn: async () => {
      const parseData = await GeneralService.getValue('business');

      if (parseData) {
        console.tron('==== GET INFO BUSINESS FROM SQLITE=====', business_ver);
        setStore(parseData);
        return { data: parseData, isPending: true };
      }

      await delay(timeout);

      const res = await BusinessAPI.getBusiness();
      if (res) {
        console.tron('==== GET INFO BUSINESS FROM API=====', business_ver);
        setStore(res);
        GeneralService.upsert('business', res, business_ver);
      }

      return res;
    },
    staleTime: Infinity,
    enabled: !!business_ver,
  });

  return result;
};

export const useUpdateBusiness = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: any) => BusinessAPI.updateBusiness({ params }),
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: ['get_business'] });
      Toast.show({
        type: 'success',
        text1: res?.msg,
      });
      if (typeof callback === 'function') {
        callback();
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

export const useRegisterBusiness = (callback?: () => void) => {
  return useMutation({
    mutationFn: (params: any) => BusinessAPI.registerBusiness({ params }),
    onSuccess: async (res) => {
      Toast.show({
        type: 'success',
        text1: res?.msg,
      });
      if (typeof callback === 'function') {
        callback();
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
