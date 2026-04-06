import colors from '@tera/common/constants/colors';
import { TextInput } from '@components/ui';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MenuCard, { MenuItem } from './MenuCard';
import { styles } from './styles';

const { width } = Dimensions.get('window');
// Tính toán chiều rộng cho Item 2 cột (cộng thêm padding/margin)
const ITEM_WIDTH = (width - 45) / 2;

const DUMMY_MENU: MenuItem[] = [
  {
    id: 'f1',
    name: 'Phở Bò Đặc Biệt',
    price: 65000,
    imageUri:
      'https://cuonnroll.com/wp-content/uploads/2019/11/xcgd-e1574422117749.jpeg.webp',
    category: 'Food',
  },
  {
    id: 'f2',
    name: 'Bánh Mì Xíu Mại',
    price: 30000,
    imageUri:
      'https://cuonnroll.com/wp-content/uploads/2019/11/vos-ck-800x800.jpg.webp',
    category: 'Food',
  },
  {
    id: 'd1',
    name: 'Cà Phê Sữa Đá',
    price: 25000,
    imageUri:
      'https://cuonnroll.com/wp-content/uploads/2019/11/don-ck-e1574422271793.jpg.webp',
    category: 'Drink',
  },
  {
    id: 'd2',
    name: 'Trà Đào Cam Sả',
    price: 40000,
    imageUri:
      'https://cuonnroll.com/wp-content/uploads/2019/11/haha-800x800.jpg.webp',
    category: 'Drink',
  },
  {
    id: 'p1',
    name: 'Combo Đôi',
    price: 100000,
    imageUri:
      'https://cuonnroll.com/wp-content/uploads/2019/11/papa-e1574422679598.jpg.webp',
    category: 'Promotion',
  },
  {
    id: 'f3',
    name: 'Bún Riêu Cua',
    price: 55000,
    imageUri:
      'https://cuonnroll.com/wp-content/uploads/2019/11/domino-e1574423025175.jpg.webp',
    category: 'Food',
  },
  {
    id: 'g1',
    name: 'Phở Bò Đặc Biệt',
    price: 65000,
    imageUri:
      'https://cuonnroll.com/wp-content/uploads/2019/11/xcgd-e1574422117749.jpeg.webp',
    category: 'Food',
  },
  {
    id: 'g2',
    name: 'Bánh Mì Xíu Mại',
    price: 30000,
    imageUri:
      'https://cuonnroll.com/wp-content/uploads/2019/11/vos-ck-800x800.jpg.webp',
    category: 'Food',
  },
  {
    id: 'g1',
    name: 'Cà Phê Sữa Đá',
    price: 25000,
    imageUri:
      'https://cuonnroll.com/wp-content/uploads/2019/11/don-ck-e1574422271793.jpg.webp',
    category: 'Drink',
  },
];

const CATEGORIES = [
  { key: 'all', name: 'Tất cả' },
  { key: 'Food', name: 'Đồ Ăn' },
  { key: 'Drink', name: 'Đồ Uống' },
  { key: 'Promotion', name: 'Khuyến mãi' },
];

// --- 3. Màn hình chính ---
export const MenuFnBScreen: React.FC = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredMenu = DUMMY_MENU.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory,
  );

  const handleSearch = (e: any) => {
    console.tron(e.target.metricValue);
  };

  const handleItemPress = (item: MenuItem) => {
    console.tron(`Open product details for: ${item.name}`);
    // Logic điều hướng tới màn hình chi tiết sản phẩm
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => {
            router.back();
          }}
        >
          <Icon source="arrow-left" size={24} color={colors.gray} />
          <Text style={styles.headerTitle}>Thực đơn</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/sale/order-list')}
          >
            <Icon source="cogs" size={24} color={colors.gray} />
            <Text style={styles.headerButtonText}>Cấu hình</Text>
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
      <View style={styles.searchWrapper}>
        <View style={styles.searchBarContainer}>
          <Icon source="magnify" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên, mã, danh mục,..."
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.barcodeScanner}>
          <Icon source="barcode-scan" size={30} color="#888" />
        </TouchableOpacity>
      </View>
      {/* TABS PHÂN LOẠI */}
      <View style={styles.categoryTabsWrapper}>
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryTab,
                item.key === activeCategory && styles.categoryTabActive,
              ]}
              onPress={() => setActiveCategory(item.key)}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  item.key === activeCategory && styles.categoryTabTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          horizontal={true} // BẬT SCROLL NGANG
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsContent}
        />
      </View>
      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MenuCard item={item} onPress={handleItemPress} />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.menuListRow}
        contentContainerStyle={styles.menuListContainer}
        ListFooterComponent={<View style={{ height: 50 }} />}
      />

      <View style={styles.cartBar}>
        <Text style={styles.cartInfoText}>1 đơn hàng | 2 món</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Xem đơn (125.000 VNĐ)</Text>
          <Icon source="chevron-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
