import { useStates } from '@hooks/useStates';
import { formatNumber } from '@tera/common/utils';
import { useBusinessLocation } from '@databases/business_locations/hook/useBusinessLocation';
import { Href, useNavigation, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

// --- Component Item Cài đặt ---
interface SettingItemProps {
  title: string;
  sub_title?: string;
  iconName: string;
  onPress: () => void;
  isLast?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  sub_title,
  iconName,
  onPress,
  isLast = false,
}) => (
  <TouchableOpacity
    style={[styles.itemContainer, !isLast && styles.itemBorder]}
    onPress={onPress}
  >
    <View style={styles.itemIcon}>
      <Icon source={iconName} size={24} color="#3B82F6" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.itemTitle}>{title}</Text>
      {sub_title && <Text style={styles.itemSubTitle}>{sub_title}</Text>}
    </View>
    <Icon source="chevron-right" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

// --- Màn hình chính ---
const SettingStoreScreen: React.FC = () => {
  const {
    uiStore: { limit_location },
  } = useStates();
  const router = useRouter();
  const navigation = useNavigation();

  const { totalCount: totalLocations } = useBusinessLocation();

  const handleNavigation = (screenName: Href) => {
    console.tron(`Maps to: ${screenName}`);
    router.push(screenName);
  };

  const handelBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: '/(tabs)/more',
      });
    }
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handelBack}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Cài đặt chung</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 1. CỬA HÀNG */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Cửa hàng</Text>
            <SettingItem
              title="Thông tin cửa hàng"
              iconName="store-outline"
              onPress={() => handleNavigation('/portal/shop-info')}
            />
            <SettingItem
              title="Quản lý chi nhánh"
              sub_title={`Bạn đang sử dụng ${formatNumber(totalLocations)}/${formatNumber(limit_location)} chi nhánh`}
              iconName="store-marker"
              onPress={() => handleNavigation('/portal/business-location')}
            />
            <SettingItem
              title="Website bán hàng"
              iconName="web"
              onPress={() => handleNavigation('/operation/setting-general')}
            />
            <SettingItem
              title="Phương thức thanh toán"
              iconName="credit-card-outline"
              onPress={() => handleNavigation('/finance/payment-method')}
              isLast={true}
            />
          </View>

          {/* 2. TỐI ƯU BÁN HÀNG */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Tối ưu bán hàng</Text>
            <SettingItem
              title="Quy trình bán hàng"
              iconName="timeline-text-outline" // Thay thế icon a46.jpg
              onPress={() => handleNavigation('/operation/setting-general')}
            />
            <SettingItem
              title="Thông tin sản phẩm"
              iconName="package-variant-closed"
              onPress={() => handleNavigation('/operation/setting-general')}
            />
            <SettingItem
              title="Thiết lập hóa đơn"
              iconName="printer"
              onPress={() => handleNavigation('/operation/setting-general')}
            />
            <SettingItem
              title="Tích điểm khách hàng"
              iconName="point-of-sale" // Thay thế icon a46.jpg
              onPress={() => handleNavigation('/operation/setting-general')}
            />
            <SettingItem
              title="Cài đặt tin nhắn"
              iconName="send-outline"
              onPress={() => handleNavigation('/operation/setting-general')}
            />
            <SettingItem
              title="Quản lý phụ thu"
              iconName="cash-plus" // Thay thế icon a46.jpg
              onPress={() => handleNavigation('/operation/setting-general')}
              isLast={true}
            />
          </View>

          {/* 3. KẾT NỐI */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Kết nối</Text>
            <SettingItem
              title="Kết nối vận chuyển"
              iconName="truck-delivery-outline"
              onPress={() => handleNavigation('/operation/setting-general')}
            />
            <SettingItem
              title="Kết nối Facebook Fanpage"
              iconName="facebook"
              onPress={() => handleNavigation('/operation/setting-general')}
            />
            <SettingItem
              title="Sàn TMĐT"
              iconName="cart-outline"
              onPress={() => handleNavigation('/operation/setting-general')}
            />
            {/* Kết nối khác (Giả định) */}
            <SettingItem
              title="Cài đặt API & Webhook"
              iconName="code-json"
              onPress={() => handleNavigation('/operation/setting-general')}
              isLast={true}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Cấu hình máy</Text>
            <SettingItem
              title="Dung lượng lưu trữ"
              iconName="database"
              onPress={() => handleNavigation('/operation/storage-manager')}
            />
            <SettingItem
              title="Đồng bộ dữ liệu"
              iconName="database-sync"
              onPress={() => handleNavigation('/operation/setting-general')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SettingStoreScreen;
