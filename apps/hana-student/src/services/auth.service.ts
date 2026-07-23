import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { AuthApi } from '@tera/api/auth';

import { useStates } from '@hooks/useStates';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const {
    authStore: { updateUser },
  } = useStates();

  return useMutation({
    mutationFn: (params: any) => AuthApi.login(params),
    onSuccess: (res) => {
      Toast.show({ type: 'success', text1: 'Đăng nhập thành công!' });
      updateUser(res?.data);
      queryClient.invalidateQueries({ queryKey: ['get_profile'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Đăng nhập thất bại',
        text2: error?.data?.msg?.message || error?.msg || error?.message,
      });
    },
  });
};

export const useLogout = (callback?: () => void) => {
  const {
    authStore: { clear },
  } = useStates();

  return useMutation({
    mutationFn: () => AuthApi.logout(),
    onSuccess: async () => {
      Toast.show({ type: 'success', text1: 'Đăng xuất thành công!' });
      await clear();
      callback?.();
    },
    onError: async (error: any) => {
      await clear();
      Toast.show({ type: 'error', text1: error?.msg || error?.message });
    },
  });
};

export const useRegister = (callback?: () => void) => {
  return useMutation({
    mutationFn: (params: any) => AuthApi.register(params),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Đăng ký thành công!',
        text2: 'Vui lòng đăng nhập để tiếp tục',
      });
      callback?.();
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Đăng ký thất bại',
        text2: error?.data?.msg?.message || error?.msg || error?.message,
      });
    },
  });
};

export const useGetDevice = () => {
  const {
    generalStore: { setInitData },
  } = useStates();

  return useQuery({
    queryKey: ['get_device'],
    queryFn: async () => {
      const result = await AuthApi.getDeviceCode();
      setInitData(result);
      return result;
    },
    staleTime: 300000,
  });
};

export const useGetProfile = (enabled: boolean) => {
  const {
    authStore: { updateUser },
  } = useStates();

  return useQuery({
    queryKey: ['get_profile'],
    queryFn: async () => {
      const result = await AuthApi.getProfile();
      updateUser(result?.data ? { user: result.data } : undefined);
      return result;
    },
    enabled,
    staleTime: 300000,
  });
};
