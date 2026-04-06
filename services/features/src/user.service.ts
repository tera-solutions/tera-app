import { useStates } from '@hooks/useStates';
import { delay } from '@tera/common/utils';
import GeneralService from '@databases/general/service';
import { useTableVersion } from '@databases/table_version/hook/useTableVersion';
import TableVersionService from '@databases/table_version/service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserAPI } from '@services/api/UserAPI';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useGetProfile = () => {
  const {
    authStore: { authenticated, updateUser },
  } = useStates();

  const { version: user_ver = 0 } = useTableVersion('users') ?? {};

  const result = useQuery({
    queryKey: ['get_profile', user_ver],
    queryFn: async () => {
      const result = await UserAPI.getProfile();
      if (result?.data) {
        updateUser({ user: result?.data });
        GeneralService.upsert('users', result?.data, user_ver);
      }
      return result;
    },
    staleTime: 30000,
    enabled: authenticated && !!user_ver,
  });

  return result;
};

export const useUpdateProfile = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: any) => UserAPI.updateProfile({ params }),
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: ['get_profile'] });
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

export const useChangePassword = (callback?: () => void) => {
  const {
    authStore: { clear },
  } = useStates();

  return useMutation({
    mutationFn: (params: any) => UserAPI.changePassword({ params }),
    onSuccess: async (res) => {
      Toast.show({
        type: 'success',
        text1: res?.msg,
      });
      await AsyncStorage.clear();
      clear();
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

export const useCheckConnect = (timeout = 0) => {
  const {
    authStore: { authenticated, updateUser },
    generalStore: { version },
  } = useStates();
  const { version: user_ver = 0 } = useTableVersion('users') ?? {};

  const result = useQuery({
    queryKey: ['check_connect', version],
    queryFn: async () => {
      await delay(timeout);
      console.tron('==== CHECK CONNECT AUTH =====');
      const result = await UserAPI.checkConnect();
      const table_version = result?.table_version || [];

      if (Array.isArray(table_version) && table_version?.length > 0) {
        console.tron(
          '==== insert or update table_version_logs =====',
          table_version,
        );

        const app_version = table_version?.find(
          (obj) => obj.table_name === 'app_version',
        );
        if (app_version?.value && app_version?.value !== version) {
          console.tron(
            '==== change deferent version =====',
            app_version?.value,
            version,
          );
          // await DB.syncDataFromServer('reset');
        }

        TableVersionService.bulkUpdate(table_version);
      }

      if (result?.user) {
        updateUser({ user: result?.user });

        GeneralService.upsert('users', result?.user, user_ver || version);
      }
      return result;
    },
    staleTime: 300000,
    enabled: authenticated,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  return result;
};
