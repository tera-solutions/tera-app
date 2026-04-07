import { useStates } from '@hooks/useStates';
import { handleClearApp } from '@tera/commons/utils/helper';
import GeneralService from '@databases/general/service';
import { useTableVersion } from '@databases/table_version/hook/useTableVersion';
import TableVersionService from '@databases/table_version/service';
import { AuthApi } from '@services/api/AuthAPI';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useLogout = (callback?: () => void) => {
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

      handleClearApp();
    },
    onError: async (error: any) => {
      console.error(error);
      handleClearApp();
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

  const { version: settings_ver = 0, is_dirty } =
    useTableVersion('settings') ?? {};
  console.log('settings_ver', settings_ver, is_dirty);

  const result = useQuery({
    queryKey: ['init_data', settings_ver, is_dirty],
    queryFn: async () => {
      const parseData = await GeneralService.getValue('settings', settings_ver);

      if (parseData && !is_dirty) {
        console.tron('==== GET INFO SETTING FROM SQLITE=====', settings_ver);
        setGeneral(parseData);
        return { data: parseData, isPending: true };
      }
      const result = await AuthApi.getDeviceCode();
      if (result) {
        setGeneral(result);
        GeneralService.upsert('settings', result, settings_ver);
        TableVersionService.upsert('settings', settings_ver, is_dirty);
      }

      return result;
    },
    staleTime: Infinity,
  });
  return result;
};
