import { useStates } from '@hooks/useStates';
import { useState } from 'react';
import { Alert, PermissionsAndroid, PixelRatio, Platform } from 'react-native';
import { BLEPrinter } from 'react-native-thermal-receipt-printer-image-qr';
import Toast from 'react-native-toast-message';

export const requestBluetoothPermission = async () => {
  if (Platform.OS === 'ios') return true;

  if (Platform.OS === 'android') {
    if (Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      return (
        result['android.permission.BLUETOOTH_CONNECT'] ===
        PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
  }
  return false;
};

export const useBluetooth = () => {
  const {
    printStore: { setPermissionBluetooth, device },
  } = useStates();
  const [isAllowed, setIsAllowed] = useState(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [printers, setPrinters] = useState<any[]>([]);

  const checkStatusPermission = async () => {
    if (Platform.OS === 'ios') return true;

    if (Platform.OS === 'android') {
      const apiLevel = Platform.Version;
      const permissions =
        apiLevel >= 31
          ? [
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]
          : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

      const checkPermissions = await Promise.all(
        permissions.map((p) => PermissionsAndroid.check(p)),
      );

      if (checkPermissions.every((status) => status === true)) {
        return true; // Đã có đủ quyền
      }
    }
    return false;
  };

  const checkAndRequest = async () => {
    const status: boolean = await requestBluetoothPermission();
    setPermissionBluetooth(status);
    setIsAllowed(status);
    return status;
  };

  const scanBluetoothDevice = async () => {
    console.tron('Begin scanning...');
    setIsConnecting(true);
    try {
      if (Platform.OS === 'android') {
        await BLEPrinter.init();
        setTimeout(async () => {
          const deviceList = await BLEPrinter.getDeviceList();
          console.tron('Danh sách máy in BLE:', deviceList);
          if (deviceList && deviceList.length > 0) {
            setPrinters(deviceList);
          } else {
            console.tron(
              'Vẫn không tìm thấy máy in. Hãy thử Pair thủ công trong Settings.',
            );
          }
          setIsConnecting(false);
        }, 1000);
      } else if (Platform.OS === 'ios') {
        await BLEPrinter.init();
        const deviceList = await BLEPrinter.getDeviceList();
        console.tron('Danh sách máy in BLE:', deviceList);
        if (deviceList && deviceList.length > 0) {
          setPrinters(deviceList);
        } else {
          console.tron(
            'Vẫn không tìm thấy máy in. Hãy thử Pair thủ công trong Settings.',
          );
        }
        setIsConnecting(false);
      }
    } catch (e) {
      setIsConnecting(false);
      console.error('Scan error:', e);
      Toast.show({
        type: 'error',
        text1: 'Không tìm thấy thiết bị máy in nào qua bluetooth',
      });
    }
  };

  const printAndroid = async (base64Data: string) => {
    try {
      // 1. Thực hiện kết nối trước khi in
      console.tron('Connecting print android...');
      setIsConnecting(true);
      const result = await BLEPrinter.connectPrinter(
        device.inner_mac_address as string,
      );

      if (result) {
        console.tron('Máy in đang mở và sẵn sàng');

        // 2. Thực hiện in ảnh
        const cleanBase64 = base64Data.replace(
          /^data:image\/(png|jpg|jpeg);base64,/,
          '',
        );

        await BLEPrinter.printRaw('1B40');
        await BLEPrinter.printRaw('1B3310');
        await BLEPrinter.printRaw('1B3318');
        await BLEPrinter.printImageBase64(String(cleanBase64).trim(), {
          imageWidth: 384,
          paddingX: 0,
        });

        // 3. Feed giấy
        await BLEPrinter.printRaw('1B32');
        await BLEPrinter.printRaw('1B6403');

        setIsConnecting(false);
        console.tron('Print success!');
      } else {
        Alert.alert(
          'Thông báo',
          'Máy in của bạn chưa MỞ (ON)! Vui lòng thử khởi động lại thiết bị hoặc kết nối lại bluetooth',
        );
      }
    } catch (error) {
      setIsConnecting(false);
      Toast.show({
        type: 'error',
        text1: 'Lỗi xảy ra khi in hóa đơn',
      });
      console.error('Print failed:', error);
    } finally {
      console.tron('Close connection bluetooth');
      setIsConnecting(false);
      // 4. LUÔN LUÔN ngắt kết nối sau khi hoàn tất (hoặc lỗi)
      await closeConnection();
    }
  };

  const printIOS = async (base64Data: string) => {
    const pixelRatio = PixelRatio.get();
    try {
      // 1. Thực hiện kết nối trước khi in
      console.tron('Connecting print IOS...');
      setIsConnecting(true);
      const result = await BLEPrinter.connectPrinter(
        device.inner_mac_address as string,
      );

      if (result) {
        console.tron('Máy in đang mở và sẵn sàng');
        // 2. Thực hiện in ảnh
        const cleanBase64 = base64Data.replace(
          /^data:image\/(png|jpg|jpeg);base64,/,
          '',
        );

        await BLEPrinter.printImageBase64(String(cleanBase64).trim(), {
          imageWidth: 384 * pixelRatio,
          paddingX: 0,
        });

        // 3. Feed giấy
        await BLEPrinter.printRaw('1B6403');

        setIsConnecting(false);
        console.tron('Print success!');
      } else {
        Alert.alert(
          'Thông báo',
          'Máy in của bạn chưa MỞ (ON)! Vui lòng thử khởi động lại thiết bị hoặc kết nối lại bluetooth',
        );
      }
    } catch (error) {
      setIsConnecting(false);
      Toast.show({
        type: 'error',
        text1: 'Lỗi xảy ra khi in hóa đơn',
      });
      console.error('Print failed:', error);
    } finally {
      console.tron('Close connection bluetooth');
      setIsConnecting(false);
      // 4. LUÔN LUÔN ngắt kết nối sau khi hoàn tất (hoặc lỗi)
      await closeConnection();
    }
  };

  const printAction = async (base64Data: string) => {
    const hasPermission: boolean = await checkStatusPermission();
    if (hasPermission) {
      if (!device.inner_mac_address) {
        Toast.show({
          type: 'error',
          text1: 'Không tìm thấy thiết bị máy in nào qua bluetooth',
        });
        return;
      }

      if (Platform.OS === 'ios') {
        printIOS(base64Data);
        return;
      } else if (Platform.OS === 'android') {
        printAndroid(base64Data);
        return;
      }
    }
  };

  // Hàm Disconnect thủ công
  const closeConnection = async () => {
    try {
      await BLEPrinter.closeConn();
      console.tron('Disconnected bluetooth.');
    } catch (error) {
      console.warn('Disconnect error (có thể đã ngắt từ trước):', error);
    }
  };

  return {
    printers,
    isConnecting,
    allow_bluetooth: isAllowed,
    checkStatusPermission,
    checkAndRequest,
    scanBluetoothDevice,
    printAction,
    closeConnection,
  };
};
