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
import { styles } from './styles';

// --- Dữ liệu giả định ---
type ShippingStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Canceled';
type StatusConfigValue = {
  label: string;
  color: string;
};
type StatusConfigMap = Record<ShippingStatus, StatusConfigValue>;

interface ShippingNote {
  id: string;
  code: string;
  customer: string;
  status: ShippingStatus;
  totalItems: number;
  date: string;
  carrier: string; // Đơn vị vận chuyển
}

const MOCK_SHIPPING_NOTES: ShippingNote[] = [
  {
    id: '1',
    code: 'SHIP-12345',
    customer: 'Nguyễn Quốc Trường',
    status: 'Shipped',
    totalItems: 3,
    date: '14/12/2025',
    carrier: 'GHN',
  },
  {
    id: '2',
    code: 'SHIP-12344',
    customer: 'Khách lẻ - 037xxxx156',
    status: 'Delivered',
    totalItems: 1,
    date: '13/12/2025',
    carrier: 'ViettelPost',
  },
  {
    id: '3',
    code: 'SHIP-12343',
    customer: 'Công ty ABC',
    status: 'Pending',
    totalItems: 5,
    date: '13/12/2025',
    carrier: 'J&T',
  },
  {
    id: '4',
    code: 'SHIP-12342',
    customer: 'Khách sỉ - HN',
    status: 'Canceled',
    totalItems: 2,
    date: '12/12/2025',
    carrier: 'GHN',
  },
];

const STATUS_MAP: StatusConfigMap = {
  Pending: { label: 'Chờ xử lý', color: '#FBBF24' },
  Shipped: { label: 'Đang giao', color: '#3B82F6' },
  Delivered: { label: 'Đã giao', color: '#10B981' },
  Canceled: { label: 'Đã hủy', color: '#EF4444' },
};

// --- Component Item Phiếu vận chuyển ---
const ShippingNoteItem: React.FC<{
  item: ShippingNote;
  onPress: () => void;
}> = ({ item, onPress }) => {
  const statusInfo = STATUS_MAP[item.status];

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemCode}>{item.code}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusInfo.color + '20' },
          ]}
        >
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.label}
          </Text>
        </View>
      </View>
      <Text style={styles.itemCustomer}>Khách hàng: {item.customer}</Text>
      <View style={styles.itemFooter}>
        <Text style={styles.itemDetail}>
          SL: {item.totalItems} | {item.carrier}
        </Text>
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const ShippingManagementScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [filterStatus, setFilterStatus] = useState<
    'All' | ShippingNote['status']
  >('All');

  const filteredList =
    filterStatus === 'All'
      ? MOCK_SHIPPING_NOTES
      : MOCK_SHIPPING_NOTES.filter((n) => n.status === filterStatus);

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Quản lý Vận chuyển</Text>
          <TouchableOpacity onPress={() => console.tron('Bộ lọc')}>
            <Icon source="filter-variant" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* TAB FILTER */}
        <View style={{ height: 45 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabRow}
          >
            <TouchableOpacity
              style={[
                styles.tabButton,
                filterStatus === 'All' && styles.activeTab,
              ]}
              onPress={() => setFilterStatus('All')}
            >
              <Text
                style={[
                  styles.tabText,
                  filterStatus === 'All' && styles.activeTabText,
                ]}
              >
                Tất cả ({MOCK_SHIPPING_NOTES.length})
              </Text>
            </TouchableOpacity>
            {Object.keys(STATUS_MAP).map((statusKey) => (
              <TouchableOpacity
                key={statusKey.toString()}
                style={[
                  styles.tabButton,
                  filterStatus === statusKey && styles.activeTab,
                ]}
                onPress={() => setFilterStatus(statusKey as ShippingStatus)}
              >
                <Text
                  style={[
                    styles.tabText,
                    filterStatus === statusKey && styles.activeTabText,
                  ]}
                >
                  {STATUS_MAP[statusKey as ShippingStatus].label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* DANH SÁCH */}
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ShippingNoteItem
              item={item}
              onPress={() => console.tron('Xem chi tiết:', item.code)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Icon source="truck-delivery-outline" size={60} color="#D1D5DB" />
              <Text style={styles.emptyText}>
                Không tìm thấy phiếu vận chuyển nào.
              </Text>
            </View>
          )}
        />

        {/* FAB TẠO MỚI */}
        <TouchableOpacity
          style={[styles.fabButton, { bottom: insets.bottom + 30 }]}
          onPress={() => router.push('/logistic/create-shipping-note')}
        >
          <Icon source="plus" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default ShippingManagementScreen;
