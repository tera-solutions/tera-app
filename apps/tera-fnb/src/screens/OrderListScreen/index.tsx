import colors from '@common/constants/colors';
import FloatButtonModal, {
  floatStyles,
} from '@components/shared/FloatButtonModal';
import { TextInput } from '@components/ui';
import { OrderStyles } from '@styles/OrderStyles';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrderListItem from './OrderListItem';

// Định nghĩa cấu trúc cho các mục trong danh sách order
export interface Order {
  id: string;
  customer: string;
  dateTime: string;
  code: string;
  total: number;
  status: 'Hoàn thành' | 'Đang giao dịch' | 'Trả hàng';
  contact?: string; // Tên khách hàng/số điện thoại (mới)
  address?: string; // Địa chỉ (mới)
  note: string; // Ghi chú
}

const mockOrders: Order[] = [
  {
    id: '1',
    customer: 'Khách lẻ',
    dateTime: '21:38',
    code: 'SON00018',
    total: 500000,
    status: 'Đang giao dịch',
    contact: '',
    address: '',
    note: '---',
  },
  {
    id: '2',
    customer: 'Anh Quyền',
    dateTime: '21:36',
    code: 'SON00017',
    total: 500000,
    status: 'Hoàn thành',
    contact: '0945945566',
    address: 'Quảng Bình, Quận Ba Đình, Hà Nội',
    note: '---',
  },
  {
    id: '3',
    customer: 'Khách lẻ',
    dateTime: '24/01/2021',
    code: 'SON00016',
    total: 277000,
    status: 'Hoàn thành',
    contact: '',
    address: '',
    note: '---',
  },
  {
    id: '4',
    customer: 'Khách lẻ',
    dateTime: '24/01/2021',
    code: 'SON00017',
    total: 577000,
    status: 'Hoàn thành',
    contact: '',
    address: '',
    note: '---',
  },
  {
    id: '5',
    customer: 'Khách lẻ',
    dateTime: '25/01/2021',
    code: 'SON00018',
    total: 377000,
    status: 'Hoàn thành',
    contact: '',
    address: '',
    note: '---',
  },
  {
    id: '6',
    customer: 'Khách lẻ',
    dateTime: '25/01/2021',
    code: 'SON00018',
    total: 677000,
    status: 'Hoàn thành',
    contact: '',
    address: '',
    note: '---',
  },
];

const tabs = [
  {
    value: 'all',
    text: 'Tất cả',
  },
  {
    value: 'confirm',
    text: 'Chờ xác nhận',
  },
  {
    value: 'process',
    text: 'Đang xử lý',
  },
];

const OrderListScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('all');
  const [showFloatModal, setShowFloatModal] = useState(false);

  const handleSearch = (e: any) => {
    console.tron(e.target.metricValue);
  };

  // Hàm render item cho FlatList
  const renderOrder = ({ item }: { item: Order }) => (
    <OrderListItem order={item} />
  );

  const handleScroll = (event: any) => {};

  const ListHeader = () => {
    return (
      <View>
        <View style={OrderStyles.searchWrapper}>
          <View style={OrderStyles.searchBarContainer}>
            <Icon source="magnify" size={20} color="#888" />
            <TextInput
              style={OrderStyles.searchInput}
              placeholder="Tìm theo tên, số điện thoại, SKU"
              onChangeText={handleSearch}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={OrderStyles.barcodeScanner}>
            <Icon source="barcode-scan" size={30} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={OrderStyles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              style={[
                OrderStyles.tab,
                activeTab === tab.value && OrderStyles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.value)}
            >
              <Text
                style={[
                  OrderStyles.tabText,
                  activeTab === tab.value && OrderStyles.activeTabText,
                ]}
              >
                {tab.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={OrderStyles.orderCountContainer}>
          <Text style={OrderStyles.orderCountText}>18 đơn hàng</Text>
        </View>
      </View>
    );
  };

  const onCreatePOS = () => {
    console.tron('onCreatePOS');
  };

  const onCreateOnline = () => {
    console.tron('onCreateOnline');
  };

  return (
    <>
      <View style={[OrderStyles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={OrderStyles.headerLeft}
          onPress={() => {
            router.replace('/');
          }}
        >
          <Icon source="arrow-left" size={24} color={colors.gray} />
          <Text style={OrderStyles.headerTitle}>Đơn hàng</Text>
        </TouchableOpacity>

        <View style={OrderStyles.headerActions}>
          <TouchableOpacity style={OrderStyles.headerButton}>
            <Icon source="format-list-bulleted" size={24} color={colors.gray} />
          </TouchableOpacity>
          <TouchableOpacity style={OrderStyles.headerButton}>
            <Icon source="filter" size={24} color={colors.gray} />
          </TouchableOpacity>
          <TouchableOpacity
            style={OrderStyles.headerButton}
            onPress={() => {
              console.tron('more');
            }}
          >
            <Icon source="dots-vertical" size={24} color={colors.gray} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={mockOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          ListHeaderComponent={<ListHeader />}
          contentContainerStyle={[
            OrderStyles.orderListContainer,
            { paddingBottom: insets.bottom + 70 },
          ]}
          onEndReachedThreshold={0.2}
          onEndReached={(e) => console.tron('onEndReached')}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
        {/* Nút Cộng (Floating Button) */}
        <TouchableOpacity
          onPress={() => setShowFloatModal(true)}
          style={[OrderStyles.floatingButton, { bottom: insets.bottom + 50 }]}
        >
          <Icon source="plus" size={30} color="#fff" />
        </TouchableOpacity>
        <FloatButtonModal
          visible={showFloatModal}
          onClose={() => setShowFloatModal(false)}
        >
          <TouchableOpacity style={floatStyles.menuItem} onPress={onCreatePOS}>
            <Text style={floatStyles.textStyle}>Tạo đơn POS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={floatStyles.menuItem}
            onPress={onCreateOnline}
          >
            <Text style={floatStyles.textStyle}>Tạo đơn Online</Text>
          </TouchableOpacity>
        </FloatButtonModal>
      </View>
    </>
  );
};

export default OrderListScreen;
