import colors from '@tera/commons/constants/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ReservationItem, { Reservation } from './ReservationItem';
import { styles } from './styles';

const tabs = [
  {
    value: 'all',
    text: 'Tất cả',
  },
  {
    value: 'pending',
    text: 'Chờ xử lý',
    count: 1,
  },
  {
    value: 'arrived',
    text: 'Khách đã tới',
    count: 6,
  },
  {
    value: 'complete',
    text: 'Đã chọn chỗ',
  },
  {
    value: 'cancel',
    text: 'Hủy đặt chỗ',
  },
];

const DUMMY_RESERVATIONS: Reservation[] = [
  {
    id: '1',
    customerName: 'Anh Cường',
    code: 'MD65353647',
    time: '18:07',
    date: '07/12',
    status: 'pending',
  },
  {
    id: '2',
    customerName: 'Chị Thảo',
    code: 'MD65353648',
    time: '12:00',
    date: '07/12',
    status: 'arrived',
  },
  {
    id: '3',
    customerName: 'Khách VIP',
    code: 'MD65353649',
    time: '19:30',
    date: '07/12',
    status: 'confirmed',
  },
  {
    id: '4',
    customerName: 'Chị Linh',
    code: 'MD65353650',
    time: '14:00',
    date: '06/12',
    status: 'canceled',
  },
  {
    id: '6',
    customerName: 'Anh Tùng',
    code: 'MD65353651',
    time: '14:00',
    date: '06/12',
    status: 'canceled',
  },
  {
    id: '7',
    customerName: 'CTY TNHH Hoàng NAM',
    code: 'MD65353647',
    time: '12:00',
    date: '07/12',
    status: 'arrived',
  },
];

const OrderBookScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('all');

  const handleCancel = (id: string) => console.tron(`Hủy đặt chỗ: ${id}`);
  const handleArrived = (id: string) => console.tron(`Khách đã tới: ${id}`);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => {
            router.back();
          }}
        >
          <Icon source="arrow-left" size={24} color={colors.gray} />
          <Text style={styles.headerTitle}>Đặt bàn trước</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/sale/order-list')}
          >
            <Icon source="clipboard-text" size={24} color={colors.gray} />
            <Text style={styles.headerButtonText}>Lịch sử</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              console.tron('more');
            }}
          >
            <Icon source="dots-vertical" size={24} color={colors.gray} />
            <Text style={styles.headerButtonText}>Thêm</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.tabsWrapper}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            style={[styles.tab, activeTab === tab.value && styles.activeTab]}
            onPress={() => setActiveTab(tab.value)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.value && styles.activeTabText,
              ]}
            >
              {tab.text}
            </Text>
            {tab?.count && tab?.count > 0 && (
              <Text style={styles.statusTabBadge}>{tab?.count}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={DUMMY_RESERVATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReservationItem
            reservation={item}
            onCancel={() => handleCancel(item.id)}
            onArrived={() => handleArrived(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Không có đơn đặt chỗ nào trong trạng thái này.
          </Text>
        }
      />

      {/* NÚT TẠO ĐƠN HÀNG (Floating Button) */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => console.tron('Tạo đặt chỗ mới')}
      >
        <Icon source="plus" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OrderBookScreen;
