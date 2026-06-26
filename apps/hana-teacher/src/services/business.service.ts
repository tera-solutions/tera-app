import { useStates } from '@hooks/useStates';
import { BusinessAPI } from '@hana/teacher/services/api/BusinessAPI';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useGetBusiness = (timeout: number = 0) => {
  const {
    uiStore: { setStore },
    authStore: { authenticated },
    generalStore: { setVersion },
  } = useStates();

  const result = useQuery({
    queryKey: ['get_business'],
    queryFn: async () => {
      const res = await BusinessAPI.getBusiness();
      if (res) {
        setStore(res);
      }

      return res;
    },
    staleTime: Infinity,
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
