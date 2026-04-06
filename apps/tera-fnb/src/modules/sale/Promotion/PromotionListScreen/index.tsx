import { TextInput } from '@components/ui';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { styles } from './styles';

// --- Dữ liệu giả định ---
interface Promotion {
  id: string;
  name: string;
  type: 'Chiết khấu' | 'Tặng kèm';
  value: string;
  status: 'Đang áp dụng' | 'Sắp diễn ra' | 'Đã kết thúc';
}

const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'p1',
    name: 'Chiết khấu 10% dịp lễ 20/11',
    type: 'Chiết khấu',
    value: '10%',
    status: 'Đang áp dụng',
  },
  {
    id: 'p2',
    name: 'Mua 5 tặng 1 (Sản phẩm Bánh mứt)',
    type: 'Tặng kèm',
    value: 'Mua 5 Tặng 1',
    status: 'Sắp diễn ra',
  },
  {
    id: 'p3',
    name: 'Giảm 50k cho đơn hàng > 500k',
    type: 'Chiết khấu',
    value: '50.000 đ',
    status: 'Đang áp dụng',
  },
  {
    id: 'p4',
    name: 'Khuyến mãi cuối năm',
    type: 'Chiết khấu',
    value: '20%',
    status: 'Đã kết thúc',
  },
];

// --- Component Item Khuyến mãi ---
const PromotionItem: React.FC<{ item: Promotion; onPress: () => void }> = ({
  item,
  onPress,
}) => {
  const statusColor =
    item.status === 'Đang áp dụng'
      ? '#10B981'
      : item.status === 'Sắp diễn ra'
        ? '#FBBF24'
        : '#6B7280';
  const statusBg =
    item.status === 'Đang áp dụng'
      ? '#D1FAE5'
      : item.status === 'Sắp diễn ra'
        ? '#FFFBEB'
        : '#F3F4F6';

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemValue}>Áp dụng: {item.value}</Text>
        <Text style={styles.itemType}>{item.type}</Text>
      </View>
      <View style={styles.itemStatus}>
        <View style={[styles.statusTag, { backgroundColor: statusBg }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {item.status}
          </Text>
        </View>
        <Text style={styles.itemId}>{item.id}</Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Màn hình chính ---
const PromotionListScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('Đang áp dụng');

  const filteredPromotions = MOCK_PROMOTIONS.filter(
    (p) =>
      (activeTab === 'Tất cả' || p.status === activeTab) &&
      p.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleNavigateToCreate = () => {
    router.push('/sale/promotion/create');
  };

  const handleViewDetails = (promotion: Promotion) => {
    router.push({
      pathname: '/sale/promotion/create',
      params: {
        promotionId: promotion.id,
        isEditing: 1,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon source="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Danh sách Khuyến mãi</Text>
        <TouchableOpacity onPress={() => console.tron('Lọc/Sắp xếp')}>
          <Icon source="filter-menu-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <View style={styles.searchIcon}>
          <Icon source="magnify" size={20} color="#9CA3AF" />
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên khuyến mãi"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        {['Đang áp dụng', 'Sắp diễn ra', 'Tất cả'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        data={filteredPromotions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PromotionItem item={item} onPress={() => handleViewDetails(item)} />
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fabButton, { bottom: insets.bottom + 20 }]}
        onPress={handleNavigateToCreate}
      >
        <Icon source="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PromotionListScreen;
