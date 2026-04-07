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
import { styles } from './styles';
import TableCard, { Table } from './TableCard';

const tabs = [
  {
    value: 'all',
    text: 'Tất cả',
  },
  {
    value: 'fill',
    text: 'Đang dùng',
    count: 1,
  },
  {
    value: 'empty',
    text: 'Còn trống',
    count: 6,
  },
];

const DUMMY_TABLES: Table[] = [
  {
    id: 't1',
    name: 'Bàn 1',
    status: 'using',
    timeUsage: 'vài giây',
    currentTotal: 57000,
    customerCount: 2,
  },
  { id: 't2', name: 'Bàn 2', status: 'available' },
  { id: 't3', name: 'Bàn 3', status: 'available' },
  {
    id: 't4',
    name: 'Bàn 4',
    status: 'using',
    timeUsage: '10 phút',
    currentTotal: 120000,
    customerCount: 4,
  },
  { id: 't5', name: 'Bàn 5', status: 'reserved' },
  { id: 't6', name: 'Bàn 6', status: 'available' },
  { id: 't7', name: 'Bàn 7', status: 'available' },
  { id: 't8', name: 'Bàn 8', status: 'available' },
  { id: 't9', name: 'Bàn 9', status: 'available' },
  { id: 't10', name: 'Bàn 10', status: 'available' },
  { id: 't11', name: 'Bàn 11', status: 'available' },
  { id: 't12', name: 'Bàn 12', status: 'available' },
];

// --- 3. Component Thêm Bàn Mới ---
const AddNewTableCard: React.FC = () => (
  <TouchableOpacity
    style={styles.tableCardAdd}
    onPress={() => console.tron('Thêm bàn mới')}
  >
    <Icon source="plus" size={30} color="#6B7280" />
    <Text style={styles.tableAddText}>Thêm bàn mới</Text>
  </TouchableOpacity>
);

const OrderFnBScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('all');
  const [selectedArea, setSelectedArea] = useState('area1');

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
          <Text style={styles.headerTitle}>Bán hàng</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/sale/quick-sale')}
          >
            <Icon source="flash" size={24} color={colors.gray} />
            <Text style={styles.headerButtonText}>Bán nhanh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/sale/order-list')}
          >
            <Icon source="clipboard-text" size={24} color={colors.gray} />
            <Text style={styles.headerButtonText}>Đơn hàng</Text>
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
      <View style={styles.tabsContainer}>
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
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* KHU VỰC CHỌN (Tất cả, Khu vực 1) */}
        <View style={styles.areaFilterContainer}>
          <TouchableOpacity
            style={[styles.areaButton, { backgroundColor: '#F3F4F6' }]}
          >
            <Icon source="view-grid-outline" size={18} color="#1F2937" />
            <Text style={styles.areaButtonText}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.areaButton, styles.areaButtonActive]}
          >
            <Text style={[styles.areaButtonText, styles.areaButtonTextActive]}>
              Khu Vực 1
            </Text>
          </TouchableOpacity>
        </View>
        {/* QUICK ACTIONS: MANG VỀ & GIAO HÀNG */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionCard}>
            <Icon source="shopping-outline" size={30} color="#059669" />
            <Text style={styles.quickActionText}>Mang về</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Icon source="truck-delivery-outline" size={30} color="#3B82F6" />
            <Text style={styles.quickActionText}>Giao hàng</Text>
          </TouchableOpacity>
        </View>

        {/* LIST BÀN THEO KHU VỰC */}
        <View style={styles.areaTitleWrapper}>
          <Text style={styles.areaTitle}>Khu Vực 1</Text>
          <Text style={styles.areaStatusText}>Còn trống: {6}</Text>
        </View>
        <FlatList
          data={[
            ...DUMMY_TABLES,
            { id: 'add_new', name: 'Thêm bàn mới', status: 'available' } as any,
          ]}
          renderItem={({ item }) => {
            if (item.id === 'add_new') {
              return <AddNewTableCard />;
            }
            return (
              <TableCard
                table={item}
                onPress={() => {
                  console.tron(`Open ${item.name}`);
                  router.push('/sale/checkout');
                }}
              />
            );
          }}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.tableListRow}
        />

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderFnBScreen;
