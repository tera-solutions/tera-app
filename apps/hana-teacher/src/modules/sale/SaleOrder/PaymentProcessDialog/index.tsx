import { formatNumber } from '@tera/commons/utils';
import { TextInput } from '@components/ui';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
// --- 1. Dữ liệu giả định ---
const PAYMENT_METHODS = [
  { label: 'VIETQR', icon: 'qrcode', subtext: 'QR thanh toán' },
  { label: 'Tiền mặt', icon: 'cash' },
  { label: 'Ví điện tử', icon: 'wallet-outline' },
  { label: 'Ngân hàng', icon: 'bank-transfer-in' },
];

interface PaymentProcessDialogProps {
  isVisible: boolean;
  onClose: () => void;
  amountToPay: number; // Tổng tiền cần thu (đã trừ thanh toán trước)
  onCompletePayment: (
    paidAmount: number,
    method: string,
    isDebt: boolean,
  ) => void;
}

const PaymentProcessDialog: React.FC<PaymentProcessDialogProps> = ({
  isVisible,
  onClose,
  amountToPay,
  onCompletePayment,
}) => {
  const [customerPaid, setCustomerPaid] = useState(formatNumber(amountToPay));
  const [selectedMethod, setSelectedMethod] = useState('Tiền mặt');
  const [shippingType, setShippingType] = useState<
    'nhan_tai_cua_hang' | 'tu_goi_shipper' | 'day_don_qua_hang_van_chuyen'
  >('nhan_tai_cua_hang');
  const [isDebt, setIsDebt] = useState(false);

  // Chuyển đổi chuỗi input thành số (tương tự PrepaymentDialog)
  const numericPaidAmount =
    parseFloat(customerPaid.replace(/\./g, '').replace(/,/g, '.')) || 0;

  // Xử lý nhập liệu
  const handlePaidAmountChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    if (cleanedText) {
      const formatted = parseInt(cleanedText);
      setCustomerPaid(formatNumber(formatted));
    } else {
      setCustomerPaid('0');
    }
  };

  const handleConfirm = () => {
    // Logic xác nhận thanh toán (có thể kiểm tra tiền thừa, v.v.)
    onCompletePayment(numericPaidAmount, selectedMethod, isDebt);
    onClose();
  };

  const renderShippingOption = (
    type:
      | 'nhan_tai_cua_hang'
      | 'tu_goi_shipper'
      | 'day_don_qua_hang_van_chuyen',
    label: string,
  ) => (
    <TouchableOpacity
      key={type}
      style={styles.shippingRow}
      onPress={() => setShippingType(type)}
    >
      <Switch
        onValueChange={() => setShippingType(type)}
        value={shippingType === type}
        trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
        thumbColor={'#FFFFFF'}
      />
      <Text style={styles.shippingLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const renderPaymentMethod = (method: (typeof PAYMENT_METHODS)[0]) => (
    <TouchableOpacity
      key={method.label}
      style={[
        styles.methodButton,
        selectedMethod === method.label && styles.methodButtonSelected,
      ]}
      onPress={() => setSelectedMethod(method.label)}
    >
      {method.label === 'VIETQR' ? (
        <View style={styles.vietQRContent}>
          <Icon
            source={method.icon}
            size={18}
            color={selectedMethod === method.label ? '#FFFFFF' : '#3B82F6'}
          />
          <Text
            style={[
              styles.methodSubText,
              selectedMethod === method.label && styles.methodSubTextSelected,
            ]}
          >
            {method.subtext}
          </Text>
        </View>
      ) : (
        <Text
          style={[
            styles.methodText,
            selectedMethod === method.label && styles.methodTextSelected,
          ]}
        >
          {method.label}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenContainer}>
        <SafeAreaView style={styles.safeArea}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon source="arrow-left" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.titleText}>
              Thanh toán: {formatNumber(amountToPay)}
            </Text>
          </View>

          <View style={styles.contentContainer}>
            {/* KHÁCH TRẢ */}
            <View style={styles.paidInputContainer}>
              <Text style={styles.paidLabel}>Khách trả</Text>
              <TextInput
                style={styles.paidInput}
                value={customerPaid}
                onChangeText={handlePaidAmountChange}
                keyboardType="numeric"
                returnKeyType="done"
                placeholder={formatNumber(amountToPay)}
                onFocus={() => {
                  if (customerPaid === formatNumber(amountToPay))
                    setCustomerPaid('');
                }}
                onBlur={() => {
                  if (customerPaid === '')
                    setCustomerPaid(formatNumber(amountToPay));
                }}
              />
            </View>

            {/* GHI NỢ */}
            <View style={styles.debtRow}>
              <Switch
                onValueChange={setIsDebt}
                value={isDebt}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={'#FFFFFF'}
              />
              <Text style={styles.debtLabel}>Ghi nợ</Text>
            </View>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <View style={styles.paymentMethodsGrid}>
              {PAYMENT_METHODS.map(renderPaymentMethod)}
            </View>
            {/* TÙY CHỌN GIAO HÀNG/NHẬN HÀNG MỚI */}
            <View style={styles.shippingOptionsSection}>
              {renderShippingOption('nhan_tai_cua_hang', 'Nhận tại cửa hàng')}
              {renderShippingOption('tu_goi_shipper', 'Tự gọi shipper')}
              {renderShippingOption(
                'day_don_qua_hang_van_chuyen',
                'Đẩy đơn qua hãng vận chuyển',
              )}
            </View>
          </View>

          {/* FOOTER ACTION */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default PaymentProcessDialog;
