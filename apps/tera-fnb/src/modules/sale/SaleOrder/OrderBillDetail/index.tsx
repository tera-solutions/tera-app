import colors from '@tera/commons/constants/colors';
import { Loading } from '@components/ui/Loading';
import { useBluetooth } from '@services/print_bluetooth.service';
import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react';
import {
  PixelRatio,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';

import { useRouter } from 'expo-router';
import { styles } from './styles';

// Giả định dữ liệu hóa đơn (Mock Data)
const mockBillData = {
  storeName: 'Gia đình nhà sam',
  phone: '0372136156',
  ecomLink: 'taphoa.so',
  billId: 'VVMPVC',
  billTime: '08/12/25 22:46',
  customer: 'Khách lẻ',
  items: [
    { id: 1, name: 'Xì dầu - Cái', price: 18000, quantity: 1, total: 18000 },
    { id: 2, name: 'Nước mắm - Cái', price: 23000, quantity: 1, total: 23000 },
  ],
  subTotal: 41000,
  vatRate: '10%',
  vatAmount: 4100,
  hygieneRate: '5%',
  hygieneAmount: 2050,
  totalAmount: 47150,
  paidAmount: 47150,
};

// Hàm format tiền tệ (Đơn giản hóa)
const formatCurrency = (amount: number) => {
  return `${amount.toLocaleString('vi-VN')} đ`;
};

const renderBillInfo = () => {
  const { storeName, phone, ecomLink, billId, billTime, customer } =
    mockBillData;
  const pixelRatio = PixelRatio.get();
  const paymentUrl = 'http://192.168.1.4:4000';

  return (
    <View style={styles.billInfoContainer}>
      <View style={styles.qrCodePlaceholder}>
        <QRCode value={paymentUrl} size={120} quietZone={10} ecl="M" />
      </View>
      <View style={styles.storeDetails}>
        <Text style={styles.storeNameText}>{storeName}</Text>
        <Text style={styles.storeDetailText}>
          <Icon source="phone" size={14} color="#555" /> {phone}.{ecomLink}
        </Text>
        <Text style={styles.storeDetailText}>{phone}</Text>
      </View>
      <View style={styles.separator} />
      <Text style={styles.billTitle}>HÓA ĐƠN BÁN HÀNG</Text>
      <Text style={styles.billSubtitle}>
        {billId} - {billTime}
      </Text>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Khách:</Text>
        <Text style={styles.detailValue}>{customer}</Text>
      </View>
    </View>
  );
};

const renderItems = () => {
  const { items } = mockBillData;

  return (
    <View style={styles.itemsContainer}>
      <View style={[styles.itemRow, styles.itemHeader]}>
        <Text style={styles.itemNameHeader}>Đơn giá</Text>
        <Text style={styles.itemQuantityHeader}>SL</Text>
        <Text style={styles.itemTotalHeader}>T.tiền</Text>
      </View>
      {items.map((item, index) => (
        <View key={item.id} style={styles.itemRow}>
          <Text style={styles.itemNameText}>
            {index + 1}. {item.name}
          </Text>
          <Text style={styles.itemPriceText}>{formatCurrency(item.price)}</Text>
          <Text style={styles.itemQuantityText}>x{item.quantity}</Text>
          <Text style={styles.itemTotalText}>{formatCurrency(item.total)}</Text>
        </View>
      ))}
    </View>
  );
};

const renderTotals = () => {
  const {
    items,
    subTotal,
    vatRate,
    vatAmount,
    hygieneRate,
    hygieneAmount,
    totalAmount,
    paidAmount,
  } = mockBillData;
  return (
    <View style={styles.totalsContainer}>
      <View style={styles.line} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tạm tính</Text>
        <Text style={styles.totalValue}>{formatCurrency(subTotal)}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Vat ({vatRate})</Text>
        <Text style={styles.totalValue}>{formatCurrency(vatAmount)}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Vệ sinh ({hygieneRate})</Text>
        <Text style={styles.totalValue}>{formatCurrency(hygieneAmount)}</Text>
      </View>

      <View style={[styles.totalRow, styles.grandTotalRow]}>
        <Text style={styles.grandTotalLabel}>Tổng {items.length}SP</Text>
        <Text style={styles.grandTotalValue}>
          {formatCurrency(totalAmount)}
        </Text>
      </View>
    </View>
  );
};

// Component chính
const OrderBillDetail = observer(() => {
  const viewShotRef = useRef<any>(null);
  const { printAction, closeConnection } = useBluetooth();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const pixelRatio = PixelRatio.get();

  const handlePrint = async () => {
    try {
      console.tron('begin print bill', pixelRatio);
      const base64Image = await viewShotRef.current.capture();
      setIsLoading(true);
      await printAction(base64Image);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('print bill error: ', error);
    }
  };

  const handelDebug = async () => {
    await closeConnection();
  };

  console.tron('isLoading', isLoading);

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screenContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Icon source="arrow-left" size={24} color={colors.gray} />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => router.push('/operation/scan-print-bluetooth')}
              >
                <Icon source="printer-wireless" size={20} color={colors.gray} />
                <Text style={styles.headerButtonText}>Kết nối bluetooth</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace('/')}>
                <Icon source="home-outline" size={24} color={colors.gray} />
              </TouchableOpacity>
            </View>
          </View>
          <Loading isLoading={isLoading}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <ViewShot
                ref={viewShotRef}
                style={{ backgroundColor: '#FFFFFF' }}
                options={{ format: 'jpg', quality: 1.0, result: 'base64' }}
              >
                <View
                  style={[
                    styles.billContent,
                    Platform.OS === 'ios' && { width: 265 },
                  ]}
                >
                  {renderBillInfo()}
                  {renderItems()}
                  {renderTotals()}
                </View>
              </ViewShot>
            </ScrollView>
          </Loading>
          <View style={styles.footerContainer}>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handelDebug()}
              >
                <Icon source="arrow-right-circle" size={24} color="#007AFF" />
                <Text style={styles.actionText}>Test lỗi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handlePrint()}
              >
                <Icon source="printer" size={24} color="#007AFF" />
                <Text style={styles.actionText}>In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => console.tron('Gửi hóa đơn')}
              >
                <Icon source="send" size={24} color="#007AFF" />
                <Text style={styles.actionText}>Gửi</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.createBillButton}
              onPress={() => console.tron('Tạo đơn mới')}
            >
              <Text style={styles.createBillText}>Tạo đơn mới</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
});

export default OrderBillDetail;
