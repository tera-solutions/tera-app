import { PRINT_CONNECTION } from '@tera/common/constants';
import colors from '@tera/common/constants/colors';
import { useStates } from '@hooks/useStates';
import { Switch } from '@components/ui/Switch';
import { useGetBusiness } from '@services/business.service';
import { Href, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

// --- Component Item Cài đặt ---
interface SettingItemProps {
  title: string;
  sub_title?: string;
  onPress: () => void;
  is_active?: boolean;
  isLast?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  sub_title,
  is_active,
  onPress,
  isLast = false,
}) => (
  <TouchableOpacity
    style={[styles.itemContainer, !isLast && styles.itemBorder]}
    onPress={onPress}
  >
    <View style={{ flex: 1 }}>
      <Text style={styles.itemTitle}>{title}</Text>
      {sub_title && (
        <Text
          style={[
            styles.itemSubTitle,
            is_active && { color: colors.primaryLight },
          ]}
        >
          {sub_title}
        </Text>
      )}
    </View>
    <Icon source="chevron-right" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

const SettingItemSwitch: React.FC<SettingItemProps> = ({
  title,
  sub_title,
  onPress,
  isLast = false,
}) => (
  <View style={[styles.itemContainer, !isLast && styles.itemBorder]}>
    <View style={{ flex: 1 }}>
      <Text style={styles.itemTitle}>{title}</Text>
      {sub_title && <Text style={styles.itemSubTitle}>{sub_title}</Text>}
    </View>
    <Switch style={{ marginBottom: 0 }} />
  </View>
);

// --- Màn hình chính ---
const SettingPrintScreen = observer(() => {
  const {
    printStore: { device, connection },
  } = useStates();
  const router = useRouter();
  useGetBusiness();

  const handleNavigation = (screenName: Href) => {
    console.tron(`Maps to: ${screenName}`);
    router.push(screenName as any);
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Thiết lập in hóa đơn</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 1. CỬA HÀNG */}
          <SettingItemSwitch
            title="In hóa đơn khi tạo đơn hàng"
            onPress={() => handleNavigation('/portal/shop-info')}
          />
          <SettingItemSwitch
            title="Xem trước khi in đơn Online"
            sub_title="Áp dụng đối với in wifi/bluetooth"
            onPress={() => handleNavigation('/portal/shop-info')}
          />
          <SettingItemSwitch
            title="Xem trước khi in đơn tại quầy"
            sub_title="Áp dụng đối với in wifi/bluetooth"
            onPress={() => handleNavigation('/portal/shop-info')}
          />
          <SettingItemSwitch
            title="Tự động mở két khi in"
            onPress={() => handleNavigation('/portal/shop-info')}
          />
          <SettingItem
            title="Số bản in/Số liên"
            sub_title="1"
            onPress={() => handleNavigation('/portal/shop-info')}
          />
          <SettingItem
            title="Máy in Wifi/LAN"
            onPress={() => handleNavigation('/portal/shop-info')}
          />
          <SettingItem
            title="Máy in bluetooth"
            sub_title={device?.device_name}
            is_active={true}
            onPress={() => handleNavigation('/operation/scan-print-bluetooth')}
          />
          <SettingItem
            title="Phương thức in mặc định"
            sub_title={PRINT_CONNECTION[connection]}
            onPress={() => handleNavigation('/finance/payment-method')}
            isLast={true}
          />
          <SettingItem
            title="Điều chỉnh mẫu in hóa đơn K80"
            onPress={() => handleNavigation('/finance/payment-method')}
            isLast={true}
          />
          <SettingItem
            title="Điều chỉnh mẫu in hóa đơn K57/K58"
            onPress={() => handleNavigation('/finance/payment-method')}
            isLast={true}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
});

export default SettingPrintScreen;
