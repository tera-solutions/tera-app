import { useStores } from '@common/hooks/useStores';
import { useLogout } from '@services/auth.service';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { SectionList, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GridItem, GridItemType } from './GridItem';
import { styles } from './styles';

// Định nghĩa kiểu dữ liệu cho một Section
export interface AppSection {
  title: string;
  data: GridItemType[];
}

// --- DATA CẤU HÌNH MENU KHO ỨNG DỤNG ---
export const APP_MODULE_SECTIONS: AppSection[] = [
  {
    title: 'Quản lý tiền',
    data: [
      {
        id: 'thu_chi',
        name: 'Thu chi',
        icon: 'swap-horizontal',
        route: '/finance/cash-flow',
        color: '#8080ff',
      },
      {
        id: 'ngan_hang',
        name: 'Ngân hàng',
        icon: 'bank',
        route: '/finance/payment-method',
        color: '#ff8c00',
      },
      {
        id: 'quy_tien',
        name: 'Quỹ tiền',
        icon: 'cash-multiple',
        route: '/finance/fund-account',
        color: '#008000',
      },
      {
        id: 'so_no',
        name: 'Sổ nợ',
        icon: 'cash-remove',
        route: '/finance/debit',
        color: '#ff4d4d',
      },
    ],
  },
  {
    title: 'Quản lý bán hàng',
    data: [
      {
        id: 'ban_hang',
        name: 'Bán hàng',
        icon: 'cart-outline',
        route: '/sale/quick-sale',
        color: '#ff7f50',
      },
      {
        id: 'don_hang',
        name: 'Đơn hàng',
        icon: 'file-document-outline',
        route: '/sale/order-list',
        color: '#ffa500',
      },
      {
        id: 'khach_hang',
        name: 'Khách hàng',
        icon: 'account-group-outline',
        route: '/sale/customer',
        color: '#3cb371',
      },
      {
        id: 'san_pham',
        name: 'Vận chuyển',
        icon: 'package-variant-closed',
        route: '/logistic/create-shipping-note',
        color: '#f08080',
      },
      {
        id: 'khuyen_mai',
        name: 'Khuyến mãi',
        icon: 'tag-multiple-outline',
        route: '/sale/promotion',
        color: '#7b68ee',
      },
    ],
  },

  // 3. Hóa đơn - Thuế -> Module: finance
  {
    title: 'Hóa đơn - Thuế',
    data: [
      {
        id: 'hd_dt',
        name: 'Hoá đơn điện tử',
        icon: 'file-send-outline',
        route: '/finance/e-invoice', // Đã đổi từ EInvoice
        color: '#8a2be2',
      },
      {
        id: 'ke_khai_thue',
        name: 'Kê khai thuế',
        icon: 'file-chart-outline',
        route: '/finance/tax-declaration', // Đã đổi từ TaxDeclaration
        color: '#32cd32',
      },
    ],
  },

  // 4. Cài đặt -> Module: operation & hr
  {
    title: 'Cài đặt',
    data: [
      {
        id: 'cai_dat_bh',
        name: 'Cài đặt chung',
        icon: 'cog-outline',
        route: '/operation/setting-store', // Đã đổi từ SettingStore
        color: '#a9a9a9',
      },
      {
        id: 'web',
        name: 'Web quản lý',
        icon: 'tune-vertical-variant',
        route: '/operation/setting-general', // Đã đổi từ SettingGeneral
        color: '#a9a9a9',
      },
      {
        id: 'employee',
        name: 'Nhân viên',
        icon: 'account-multiple-outline', // Sửa lại icon cho đúng nhân viên
        route: '/hr/employee', // Đã đổi từ EmployeeList
        color: '#a9a9a9',
      },
      {
        id: 'notification', // Sửa typo botification -> notification
        name: 'Thông báo',
        icon: 'bell-outline', // Sửa lại icon cho đúng thông báo
        route: '/operation/notification', // Đã đổi từ Notification
        color: '#a9a9a9',
      },
    ],
  },
];

const NUM_COLUMNS = 4;

const MoreFnBApp = observer(() => {
  const {
    authStore: { user, clear },
  } = useStores();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { mutate: onLogout, isPending } = useLogout();

  const handleItemPress = (item: GridItemType) => {
    console.log(item);
    router.push(item.route as any);
  };
  // Hàm này giúp gom các GridItem thành các hàng 4 cột
  const renderItem = ({
    item,
    index,
    section,
  }: {
    item: GridItemType;
    index: number;
    section: AppSection;
  }) => {
    if (index % NUM_COLUMNS !== 0) return null; // Chỉ render 1 lần cho 4 items
    const itemsInRow: GridItemType[] = [];
    for (let i = 0; i < NUM_COLUMNS; i++) {
      const itemIndex = index + i;
      if (itemIndex < section.data.length) {
        itemsInRow.push(section.data[itemIndex]);
      } else {
        // Thêm View trống để giữ layout
        itemsInRow.push({
          id: `spacer-${itemIndex}`,
          name: '',
          icon: '',
          route: '',
        } as GridItemType);
      }
    }

    return (
      <View style={styles.row}>
        {itemsInRow.map((rowItem) =>
          rowItem.id.startsWith('spacer') ? (
            <View key={rowItem.id} style={styles.spacer} />
          ) : (
            <GridItem
              key={rowItem.id}
              item={rowItem}
              onPress={handleItemPress}
            />
          ),
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* === HEADER (PROFILE & PREMIUM) === */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.flexRow}
            onPress={() => router.push('/portal/profile')}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>T</Text>
            </View>
            <View>
              <Text style={styles.username}>{user?.full_name}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => onLogout()}
          >
            <Icon source="location-exit" size={24} color="#eb1313ff" />
            <Text style={{ color: '#575757ff' }}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* === TÍNH NĂNG === */}
      <SectionList
        sections={APP_MODULE_SECTIONS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        renderItem={renderItem}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      />

      {/* Nút hỗ trợ floating button (nếu cần) */}
      <TouchableOpacity style={styles.supportButton}>
        <Icon source="headphones" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
});

export default MoreFnBApp;
