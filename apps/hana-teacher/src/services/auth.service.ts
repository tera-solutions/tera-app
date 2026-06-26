import { useStates } from '@hooks/useStates';
import { AuthApi } from '@hana/teacher/services/api/AuthAPI';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useLogout = (callback?: () => void) => {
  const {
    authStore: { clear },
  } = useStates();
  return useMutation({
    mutationFn: () => AuthApi.logout(),
    onSuccess: async () => {
      if (typeof callback === 'function') {
        callback();
      }
      Toast.show({
        type: 'success',
        text1: 'Đăng xuất thành công!',
      });

      clear();
    },
    onError: async (error: any) => {
      console.error(error);
      clear();
      Toast.show({
        type: 'error',
        text1: error?.msg || error?.message,
      });
    },
  });
};

export const useLogin = (callback?: () => void) => {
  const queryClient = useQueryClient();

  const {
    authStore: { updateUser },
    uiStore: { setIndustry },
  } = useStates();

  return useMutation({
    mutationFn: (params: any) => AuthApi.login({ params }),
    onSuccess: (res, variables) => {
      Toast.show({
        type: 'success',
        text1: 'Đăng nhập thành công!',
      });
      updateUser(res?.data);
      setIndustry(res?.data?.user?.industry || variables?.industry);
      queryClient.invalidateQueries({
        queryKey: ['check_connect'],
      });
    },
    onError: (error: any) => {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: error?.data?.code ? 'Lỗi khi lấy dữ liệu' : 'Lỗi bất thường',
        text2: error?.data?.msg?.message || error?.msg || error?.message,
      });
    },
  });
};

export const useGetDevice = () => {
  const {
    generalStore: { setGeneral, device },
  } = useStates();

  const result = useQuery({
    queryKey: ['init_data'],
    queryFn: async () => {
      const result = await AuthApi.getDeviceCode();
      if (result) {
        setGeneral(result);
      }

      return result;
    },
    staleTime: Infinity,
  });
  return result;
};
