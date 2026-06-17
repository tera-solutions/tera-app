import { useStates } from '@hooks/useStates';
import { Loading } from '@components/ui/Loading';
import { useGetBusiness } from '@hana/teacher/services/business.service';
import { useBluetooth } from '@hana/teacher/services/print_bluetooth.service';
import { PrintDeviceType } from 'src/states/_interface';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { styles } from './styles';

// --- Component Item Cài đặt ---
interface SettingItemProps {
  title: string;
  sub_title?: string;
  onPress: () => void;
  isLast?: boolean;
  checked?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  sub_title,
  onPress,
  isLast = false,
  checked = false,
}) => (
  <TouchableOpacity
    style={[styles.itemContainer, !isLast && styles.itemBorder]}
    onPress={onPress}
  >
    <View style={{ flex: 1 }}>
      <Text style={styles.itemTitle}>{title}</Text>
      {sub_title && <Text style={styles.itemSubTitle}>{sub_title}</Text>}
    </View>
    {checked && <Icon source="check-circle" size={20} color="#9CA3AF" />}
  </TouchableOpacity>
);

// --- Màn hình chính ---
const ScanPrintBluetoothScreen: React.FC = () => {
  const {
    printStore: { setDevice, setConnection },
  } = useStates();
  const router = useRouter();
  useGetBusiness();

  const { checkAndRequest, scanBluetoothDevice, printers, isConnecting } =
    useBluetooth();

  // Scan tìm máy in Bluetooth
  const handleScan = async () => {
    const hasPermission: boolean = await checkAndRequest();
    console.tron('hasPermission', hasPermission);
    if (hasPermission) {
      scanBluetoothDevice();
    } else {
      Alert.alert('Thông báo', 'Bạn cần cấp quyền Bluetooth để sử dụng máy in');
    }
  };

  // Khởi tạo và kết nối
  const connectPrinter = async (item: PrintDeviceType) => {
    try {
      console.tron('Connected printer', item);
      setDevice(item);
      setConnection('BT');
      Toast.show({
        type: 'success',
        text1: `Đã kết nối với máy in: ${item?.device_name}`,
      });
      router.back();
    } catch (e) {
      console.error('Connect error', e);
    }
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Tìm kiếm máy in bluetooth</Text>
          <View style={{ width: 24 }} />
        </View>
        <Loading isLoading={isConnecting}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {printers?.map((item) => (
              <SettingItem
                key={item?.inner_mac_address}
                title={item?.device_name}
                sub_title={item?.inner_mac_address}
                onPress={() => connectPrinter(item)}
              />
            ))}
          </ScrollView>
        </Loading>

        {/* FLOATING ACTION BUTTON */}
        <TouchableOpacity style={styles.fabButton} onPress={() => handleScan()}>
          <Icon source="magnify" size={20} color="#FFFFFF" />
          <Text style={styles.fabText}>Tìm kiếm</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default ScanPrintBluetoothScreen;
