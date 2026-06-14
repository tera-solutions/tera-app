import { Splash } from '@components/ui/Splash';
import DB from '@databases/database.native';
import { resetDatabase } from '@databases/sync/service/sync.service';
import { AuthApi } from '@hana/teacher/services/api/AuthAPI';
import { rootStore } from 'src/states/index';
import { useQuery } from '@tanstack/react-query';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert, Platform } from 'react-native';
import { getDataStorage } from '@tera/commons/utils';
import { useStates } from '../hooks/useStates';

interface IDatabaseContext {
  isReady: boolean;
  isHealth: boolean;
  setIsHealth: (status: boolean) => void;
}

// 2. Tạo Context Instance (Value)
const DatabaseContext = createContext<IDatabaseContext | null>(null);

export function DatabaseProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const { generalStore } = useStates();

  const [isReady, setIsReady] = useState(false);
  const [isHealth, setIsHealth] = useState(false);

  const { isPending, status, data } = useQuery({
    queryKey: ['check_health'],
    queryFn: async () => {
      try {
        const result = await AuthApi.checkHealth();
        if (Platform.OS === 'web') return result;
        console.log(result?.app_version, generalStore.version);
        if (result?.app_version !== generalStore.version) {
          Alert.alert('Cập nhật mới', 'Phiên bản mới đã sẵn sàng trên Store.', [
            {
              text: 'Cập nhật ngay',
              onPress: async () => {
                generalStore.setVersion(result?.app_version);
                resetDatabase(true);
              },
            },
          ]);
        }

        return result;
      } catch (error) {
        const dataAuth = await getDataStorage('AuthStore');
        let controls = null;
        let title = 'Hệ thống phản hồi chậm, vui lòng kiểm tra mạng!';
        if (!!dataAuth?.token) {
          title =
            'Hệ thống phản hồi chậm, vui lòng kiểm tra mạng! Bạn có muốn sử dụng với chế độ OFFLINE không?';
          controls = [
            {
              text: 'Không',
              style: 'destructive',
              onPress: () => {
                generalStore.setIsOffline(false);
                console.log('RUN APP WITH STATUS ONLINE');
              },
            },
            {
              text: 'Đồng ý',
              onPress: () => {
                generalStore.setIsOffline(true);
                console.log('RUN APP WITH STATUS OFFLINE');
              },
              style: 'cancel',
            },
          ];
        }
        if (!generalStore.isOffline) {
          Alert.alert('Thông báo mạng!', title, controls as any);
        }
        throw error;
      }
    },
    staleTime: 300000,
    retry: 10,
    enabled: false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    console.log('• API CHECK HEATH: ', status);
    if (status === 'success' && data) {
      setIsHealth(true);
    }
  }, [status, data]);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await DB.initConnection();
        await rootStore.generalStore.fetchSettingsFromLocal();
        await rootStore.uiStore.fetchBusinessFromLocal();
        console.log('✅ Database Is Ready!!');
        setIsReady(true);
      } catch (error) {
        console.error('❌ Database Init Fail:', error);
      }
    };

    prepareApp();
  }, []);

  if (!isReady) return <Splash isLoading={isPending} />;

  console.log('==== BEGIN MOBILE LOAD =====', generalStore.version);

  return (
    <DatabaseContext value={{ isReady, isHealth, setIsHealth }}>
      {children}
    </DatabaseContext>
  );
}

// 4. Custom Hook (Sử dụng Interface IDatabaseContext làm kiểu trả về)
export const useDatabase = (): IDatabaseContext => {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }

  return context; // Lúc này context chắc chắn là IDatabaseContext
};
