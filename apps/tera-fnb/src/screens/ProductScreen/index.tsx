import colors from '@tera/commons/constants/colors';
import { TextInput } from '@components/ui';
import { SaleStyles } from '@styles/SaleStyles';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// Định nghĩa cấu trúc cho các mục trong danh sách menu
interface MenuItem {
  id?: string;
  iconName: any;
  label: string;
  description?: string;
  action?: () => void;
}

const menuItems: MenuItem[] = [
  {
    id: 'list_product',
    iconName: 'format-list-bulleted',
    label: 'Danh sách sản phẩm',
  },
  {
    id: 'purchase_order',
    iconName: 'receipt-text-outline',
    label: 'Nhập hàng',
  },
  {
    id: 'inventory',
    iconName: 'checkbox-marked-circle-outline',
    label: 'Kiểm hàng',
  },
  { id: 'supplier', iconName: 'account-outline', label: 'Nhà cung cấp' },
  {
    id: 'barcode',
    iconName: 'barcode',
    label: 'In mã vạch',
  },
];

const ProductScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleSearch = (e: any) => {
    console.tron(e.target.metricValue);
  };

  const MenuItemRow: React.FC<MenuItem> = ({ iconName, label, id }) => (
    <TouchableOpacity style={SaleStyles.menuItem}>
      <Icon source={iconName} size={24} color={colors.gray} />
      <Text style={SaleStyles.menuLabel}>{label}</Text>
      <Icon source="chevron-right" size={20} color={colors.gray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={SaleStyles.safeArea} edges={['top']}>
      <View style={[SaleStyles.header]}>
        <TouchableOpacity
          style={SaleStyles.headerLeft}
          onPress={() => {
            router.back();
          }}
        >
          <Icon source="arrow-left" size={24} color={colors.gray} />
          <Text style={SaleStyles.headerTitle}>Sản phẩm</Text>
        </TouchableOpacity>

        <View style={SaleStyles.headerActions}>
          <TouchableOpacity style={SaleStyles.headerButton}>
            <Icon source="flash" size={24} color={colors.gray} />
            <Text style={SaleStyles.headerButtonText}>Kho hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={SaleStyles.headerButton}>
            <Icon source="clipboard-text" size={24} color={colors.gray} />
            <Text style={SaleStyles.headerButtonText}>Danh mục</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={SaleStyles.headerButton}
            onPress={() => {
              console.tron('more');
            }}
          >
            <Icon source="dots-vertical" size={24} color={colors.gray} />
            <Text style={SaleStyles.headerButtonText}>Thêm</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={SaleStyles.searchWrapper}>
        <View style={SaleStyles.searchBarContainer}>
          <Icon source="magnify" size={20} color="#888" />
          <TextInput
            style={SaleStyles.searchInput}
            placeholder="Tìm theo tên, barcode, SKU"
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={SaleStyles.barcodeScanner}>
          <Icon source="barcode-scan" size={30} color="#888" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={SaleStyles.container}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        {/* Khu vực tạo đơn hàng */}
        <View style={SaleStyles.createOrderCard}>
          <TouchableOpacity style={SaleStyles.createOrderButton}>
            <Icon source="plus" size={30} color="#FFF" />
          </TouchableOpacity>
          <Text style={SaleStyles.createOrderText}>Tạo sản phẩm</Text>
        </View>

        {/* Danh sách các chức năng quản lý đơn hàng */}
        <View style={SaleStyles.menuList}>
          {menuItems.map((item) => (
            <MenuItemRow key={item?.id} {...item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductScreen;
