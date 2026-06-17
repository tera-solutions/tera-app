import { useStates } from '@hooks/useStates';
import NetInfo from '@react-native-community/netinfo';
import { observer } from 'mobx-react-lite';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSyncQueue } from '@databases/sync_queues/hook/useSyncQueue';
import { syncManager } from '@hana/teacher/services/sync/SyncManager';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Icon } from 'react-native-paper';
import HomeHeader from '@screens/HomeScreen/HomeHeader';
import TodayActivityCard from './TodayActivityCard';
import SubjectGrid from './SubjectGrid';
import LessonSection from './LessonSection';
import WeeklyChallengeCard from './WeeklyChallengeCard';

// --- 2. Dữ liệu Mẫu (Mock Data) ---
const metrics: any[] = [
  {
    title: 'Đơn hàng tháng này',
    count: '9',
    amount: '290,000,000 đ',
    subText: 'Doanh thu tháng này',
  },
  {
    title: 'Khách hàng tháng này',
    count: '9',
    amount: '10,000,000 đ',
    subText: 'Công nợ tháng này',
  },
];

const tasks = [
  'Nhiệm vụ tưới cây',
  'Nhiệm vụ code layout',
  'Nhiệm vụ lấy dữ liệu',
];

const HomeScreen = observer(() => {
  const {
    authStore: { user },
    uiStore: { business_info },
  } = useStates();
  const router = useRouter();
  const { count } = useSyncQueue();
  const insets = useSafeAreaInsets();
  const [isOffline, setIsOffline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsOffline(!state.isConnected);
    });
  }, []);

  const handleSyncData = async () => {
    setRefreshing(true);
    await syncManager.addQueue({
      table_name: 'generals',
      type: 'realtime',
      action: 'GET',
    });
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScrollView>
      <HomeHeader />

      <TodayActivityCard />

      <SubjectGrid />

      <LessonSection />

      <WeeklyChallengeCard />
    </ScrollView>
  );
});

export default HomeScreen;
