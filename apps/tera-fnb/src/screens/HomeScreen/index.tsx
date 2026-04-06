import colors from '@constants/colors';
import { FONT_FAMILY } from '@constants/typography';
import { useStores } from '@hooks/useStores';
import NetInfo from '@react-native-community/netinfo';
import FeatureList from '@screens/HomeScreen/FeatureList';
import { observer } from 'mobx-react-lite';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import IconMail from '@assets/icons/ic_mail.svg';
import { useSyncQueue } from '@databases/sync_queues/hook/useSyncQueue';
import { syncManager } from '@services/sync/SyncManager';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Icon } from 'react-native-paper';
import SaleChart2 from './SaleChart2';

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
  } = useStores();
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
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.container]}>
      <ScrollView
        overScrollMode="always"
        nestedScrollEnabled={true}
        style={[
          styles.scrollView,
          { marginTop: 0, backgroundColor: 'transparent' },
        ]}
        indicatorStyle="white"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleSyncData}
            // title={'Đang đồng bộ...'}
            // titleColor={colors.white}
            colors={[colors.white]}
            tintColor={'#FF0000'}
            style={{ backgroundColor: 'transparent', zIndex: 100 }}
          />
        }
      >
        <View style={[styles.header]}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => router.push('/more')}
          >
            <View style={styles.avatarPlaceholder} />
            <View>
              <Text style={styles.userName}>{user?.full_name}</Text>
              <Text style={styles.userPosition}>{business_info?.name}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.userInfo}
              onPress={() => router.push('/operation/data-local/list')}
            >
              <Icon source="cloud-sync" size={22} color="#FFF" />
              {count > 0 && (
                <View
                  style={[
                    styles.notificationBadge,
                    { backgroundColor: isOffline ? '#363636' : '#04cf15' },
                  ]}
                >
                  <Text style={styles.badgeText}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.mailContent}>
              <IconMail width={20} height={20} color="#FFF" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Vùng bo góc trắng của giao diện Figma */}
        <View style={styles.mainContent}>
          {/* 3.2. Metrics Card */}
          <View style={styles.metricsRow}>
            {metrics.map((metric, index) => (
              <View key={index} style={styles.metricCard}>
                <Text style={styles.metricValue}>{metric.count}</Text>
                <Text style={styles.metricTitle}>{metric.title}</Text>
                <Text style={styles.metricAmount}>{metric.amount}</Text>
                <Text style={styles.metricSubText}>{metric.subText}</Text>
              </View>
            ))}
          </View>

          {/* 3.3. Feature Grid */}
          <FeatureList />
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>Tình hình bán hàng</Text>
          <SaleChart2 />
          <View style={styles.separator} />
          {/* 3.4. Content Section - Chủ đề cho bạn */}
          <Text style={styles.sectionTitle}>Chủ đề cho bạn</Text>
          <View style={styles.topicRow}>
            {/*  */}
            <View style={styles.topicPlaceholder} />
            <View style={styles.topicPlaceholder} />
          </View>
        </View>
      </ScrollView>
      {/* <BottomTabBar /> */}
    </SafeAreaView>
  );
});

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  // Header Styles
  header: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    // zIndex: 9,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 10,
    opacity: 0.5,
  },
  userName: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: FONT_FAMILY.BOLD,
  },
  userPosition: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mailContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Main Content (Vùng trắng cong)
  mainContent: {
    backgroundColor: colors.bgGray,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 15,
    paddingTop: 10,
    minHeight: 800,
    // zIndex: 10,
  },

  // Metrics Card Styles
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -40,
    marginBottom: 20,
    paddingHorizontal: 5,
    backgroundColor: colors.white,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricCard: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  metricValue: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.BOLD,
    textAlign: 'center',
  },
  metricTitle: {
    fontSize: 12,
    color: colors.gray,
    fontFamily: FONT_FAMILY.Light,
    marginTop: 5,
    textAlign: 'center',
  },
  metricAmount: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.BOLD,
    marginTop: 15,
    lineHeight: 18,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  metricSubText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.gray,
    fontFamily: FONT_FAMILY.Light,
    textAlign: 'center',
  },
  // FeatureButton style (cần được định nghĩa trong @components/FeatureButton)

  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },

  // Content Section Styles
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 5,
  },
  topicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  topicPlaceholder: {
    width: '48%',
    aspectRatio: 1.5,
    backgroundColor: '#DCDCDC', // Màu placeholder cho hình ảnh
    borderRadius: 10,
  },
  taskList: {
    // Styling cho danh sách nhiệm vụ
  },
  // TaskItem style (cần được định nghĩa trong @components/TaskItem)
});
