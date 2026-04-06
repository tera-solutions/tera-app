import { useStates } from '@hooks/useStates';
import { useLogout } from '@services/auth.service';
import { MoreStyles } from '@styles/MoreStyles';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { SectionList, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GridItem, GridItemType } from './GridItem';

// Định nghĩa kiểu dữ liệu cho một Section
export interface AppSection {
  title: string;
  data: GridItemType[];
}

// --- DATA CẤU HÌNH MENU KHO ỨNG DỤNG ---
export const APP_MODULE_SECTIONS: AppSection[] = [
  // 1. Quản lý tiền
  {
    title: 'Quản lý tiền',
    data: [
      {
        id: 'thu_chi',
        name: 'Thu chi',
        icon: 'swap-horizontal',
        route: '/app/money/thu-chi',
        color: '#8080ff',
      }, // Màu xanh dương/tím
      {
        id: 'ngan_hang',
        name: 'Ngân hàng',
        icon: 'bank',
        route: '/app/money/ngan-hang',
        color: '#ff8c00',
      }, // Màu cam
      {
        id: 'quy_tien',
        name: 'Quỹ tiền',
        icon: 'cash-multiple',
        route: '/app/money/quy-tien',
        color: '#008000',
      }, // Màu xanh lá
      {
        id: 'so_no',
        name: 'Sổ nợ',
        icon: 'cash-remove',
        route: '/app/money/so-no',
        color: '#ff4d4d',
      }, // Màu đỏ
    ],
  },

  // 2. Quản lý bán hàng
  {
    title: 'Quản lý bán hàng',
    data: [
      {
        id: 'ban_hang',
        name: 'Bán hàng',
        icon: 'cart-outline',
        route: '/app/sale/ban-hang',
        color: '#ff7f50',
      },
      {
        id: 'don_hang',
        name: 'Đơn hàng',
        icon: 'file-document-outline',
        route: '/app/sale/don-hang',
        color: '#ffa500',
      },
      {
        id: 'khach_hang',
        name: 'Khách hàng',
        icon: 'account-group-outline',
        route: '/app/sale/khach-hang',
        color: '#3cb371',
      },
      {
        id: 'khuyen_mai',
        name: 'Khuyến mãi',
        icon: 'tag-multiple-outline',
        route: '/app/sale/khuyen-mai',
        color: '#7b68ee',
      },
      {
        id: 'quan_ly_ban',
        name: 'Quản lý bàn',
        icon: 'table-chair',
        route: '/app/sale/ql-ban',
        color: '#4682b4',
      }, // Đặc trưng cho F&B
      {
        id: 'dat_ban',
        name: 'Đặt bàn',
        icon: 'calendar-clock-outline',
        route: '/app/sale/dat-ban',
        color: '#deb887',
      }, // Đặc trưng cho F&B
      {
        id: 'cai_dat_bh',
        name: 'Cài đặt bán hàng',
        icon: 'cog-outline',
        route: '/app/sale/cai-dat',
        color: '#a9a9a9',
      },
      // Không có mục thứ 8 trong hình, có thể bổ sung sau (ví dụ: Tích hợp TMĐT)
    ],
  },

  // 3. Hóa đơn - Thuế
  {
    title: 'Hóa đơn - Thuế',
    data: [
      {
        id: 'hd_dt',
        name: 'Hoá đơn điện tử',
        icon: 'file-send-outline',
        route: '/app/finance/hoa-don',
        color: '#8a2be2',
      },
      {
        id: 'ke_khai_thue',
        name: 'Kê khai thuế',
        icon: 'file-chart-outline',
        route: '/app/finance/ke-khai-thue',
        color: '#32cd32',
      },
    ],
  },

  // 4. Kiểm soát hàng hoá
  {
    title: 'Kiểm soát hàng hoá',
    data: [
      {
        id: 'san_pham',
        name: 'Sản phẩm',
        icon: 'package-variant-closed',
        route: '/app/inventory/san-pham',
        color: '#f08080',
      },
      {
        id: 'ton_kho',
        name: 'Tồn kho',
        icon: 'warehouse',
        route: '/app/inventory/ton-kho',
        color: '#6495ed',
      },
      {
        id: 'nguyen_lieu',
        name: 'Nguyên liệu',
        icon: 'food-apple-outline',
        route: '/app/inventory/nguyen-lieu',
        color: '#daa520',
      }, // Liên quan F&B
      {
        id: 'ql_kho',
        name: 'Quản lý kho',
        icon: 'tune-vertical-variant',
        route: '/app/inventory/ql-kho',
        color: '#40e0d0',
      },
    ],
  },
];

const NUM_COLUMNS = 4;

const MoreAppScreen = observer(() => {
  const {
    authStore: { user, clear },
  } = useStates();
  const insets = useSafeAreaInsets();

  const { mutate: onLogout, isPending } = useLogout();

  const handleItemPress = (item: GridItemType) => {
    console.tron(item);
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
      <View style={MoreStyles.row}>
        {itemsInRow.map((rowItem) =>
          rowItem.id.startsWith('spacer') ? (
            <View key={rowItem.id} style={MoreStyles.spacer} />
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
    <SafeAreaView style={MoreStyles.safeArea} edges={['top']}>
      {/* === HEADER (PROFILE & PREMIUM) === */}
      <View style={MoreStyles.header}>
        <View style={MoreStyles.profileContainer}>
          <View style={MoreStyles.avatar}>
            <Text style={MoreStyles.avatarText}>T</Text>
          </View>
          <View>
            <Text style={MoreStyles.username}>truong160196</Text>
            <Text style={MoreStyles.email}>truong160196@gmail.com</Text>
          </View>
          <TouchableOpacity
            style={MoreStyles.logoutButton}
            onPress={() => onLogout()}
          >
            <Icon source="location-exit" size={24} color="#eb1313ff" />
            <Text style={{ color: '#575757ff' }}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={MoreStyles.upgradeButton}>
          <Text style={MoreStyles.upgradeText}>Nâng cấp Premium</Text>
        </TouchableOpacity>

        <View style={MoreStyles.infoRow}>
          <View style={MoreStyles.infoItem}>
            <Icon source="currency-usd" size={20} color="#F59E0B" />
            <Text style={MoreStyles.infoText}>130 xu</Text>
          </View>
          <TouchableOpacity style={MoreStyles.infoItem}>
            <Icon source="share-variant-outline" size={20} color="#3B82F6" />
            <Text style={MoreStyles.infoText}>Mã chia sẻ: 3017899</Text>
            <Icon source="chevron-right" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* === TÍNH NĂNG === */}
      <SectionList
        sections={APP_MODULE_SECTIONS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        // Header cho từng Section (Ví dụ: 'Quản lý tiền')
        renderSectionHeader={({ section: { title } }) => (
          <Text style={MoreStyles.sectionTitle}>{title}</Text>
        )}
        renderItem={renderItem}
        style={MoreStyles.container}
        contentContainerStyle={MoreStyles.contentContainer}
      />

      {/* Nút hỗ trợ floating button (nếu cần) */}
      <TouchableOpacity style={MoreStyles.supportButton}>
        <Icon source="headphones" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
});

export default MoreAppScreen;
