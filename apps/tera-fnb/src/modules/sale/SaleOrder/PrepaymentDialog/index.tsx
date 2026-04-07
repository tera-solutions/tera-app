import { formatNumber } from '@tera/commons/utils';
import { TextInput } from '@components/ui';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from './styles';

// --- 1. Dữ liệu giả định ---
const PAYMENT_METHODS = [
  { label: 'Tiền mặt', icon: 'cash' },
  { label: 'Ví điện tử', icon: 'wallet-outline' },
  { label: 'Ngân hàng', icon: 'bank-transfer-in' },
];

interface PrepaymentDialogProps {
  isVisible: boolean;
  onClose: () => void;
  totalAmount: number;
  onConfirmPayment: (paidAmount: number, method: string) => void;
}

const { height, width } = Dimensions.get('window');
const MODAL_HEIGHT = height * 0.75;

const PrepaymentDialog: React.FC<PrepaymentDialogProps> = ({
  isVisible,
  onClose,
  totalAmount,
  onConfirmPayment,
}) => {
  const [paidAmount, setPaidAmount] = useState('0');
  const [selectedMethod, setSelectedMethod] = useState(
    PAYMENT_METHODS[0].label,
  );
  const [displayContent, setDisplayContent] = useState(isVisible);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const slideUpValue = height - MODAL_HEIGHT;

  // Chuyển đổi chuỗi input thành số
  const numericPaidAmount =
    parseFloat(paidAmount.replace(/\./g, '').replace(/,/g, '.')) || 0;

  const remainingDebt = totalAmount - numericPaidAmount;

  useEffect(() => {
    if (isVisible) {
      setDisplayContent(true);
      slideAnim.setValue(height);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!displayContent) return;
    if (isVisible) {
      // Khi Modal hiển thị: Trượt xuống từ trên cùng (y: 0)
      Animated.timing(slideAnim, {
        toValue: slideUpValue,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Khi Modal đóng: Trượt lên lại vị trí ban đầu (-MODAL_HEIGHT)
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setDisplayContent(false);
      });
    }
  }, [displayContent, isVisible, slideAnim, slideUpValue]);

  // Xử lý nhập liệu: chỉ cho phép số và định dạng VNĐ (dấu chấm)
  const handlePaidAmountChange = (text: string) => {
    // Loại bỏ mọi ký tự không phải số
    const cleanedText = text.replace(/[^0-9]/g, '');

    // Định dạng lại theo kiểu VNĐ (ví dụ: 65550 -> 65.550)
    if (cleanedText) {
      const formatted = parseInt(cleanedText);
      setPaidAmount(formatNumber(formatted));
    } else {
      setPaidAmount('0');
    }
  };

  const handleConfirm = () => {
    onConfirmPayment(numericPaidAmount, selectedMethod);
    onClose();
  };

  const renderPaymentMethod = (method: { label: string; icon: string }) => (
    <TouchableOpacity
      key={method.label}
      style={[
        styles.methodButton,
        selectedMethod === method.label && styles.methodButtonSelected,
      ]}
      onPress={() => setSelectedMethod(method.label)}
    >
      <Text
        style={[
          styles.methodText,
          selectedMethod === method.label && styles.methodTextSelected,
        ]}
      >
        {method.label}
      </Text>
    </TouchableOpacity>
  );

  if (!displayContent) {
    return null;
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={displayContent}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.modalContent,
          {
            transform: [{ translateY: slideAnim }],
            height: MODAL_HEIGHT,
          },
        ]}
      >
        <View style={styles.modalView}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.titleText}>Thanh toán trước</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon source="close" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          {/* TỔNG TIỀN */}
          <View style={styles.totalAmountContainer}>
            <Text style={styles.totalAmountText}>
              {formatNumber(totalAmount)}
            </Text>
          </View>

          {/* KHÁCH ĐÃ TRẢ */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Khách đã trả</Text>
            <TextInput
              style={styles.paidInput}
              value={paidAmount}
              onChangeText={handlePaidAmountChange}
              keyboardType="numeric"
              returnKeyType='done'
              placeholder="0"
              onFocus={() => {
                if (paidAmount === '0') setPaidAmount('');
              }}
              onBlur={() => {
                if (paidAmount === '') setPaidAmount('0');
              }}
            />
          </View>

          {/* KHÁCH CÒN NỢ */}
          <View style={styles.debtContainer}>
            <Text style={styles.debtLabel}>Khách còn nợ:</Text>
            <Text
              style={[
                styles.debtValue,
                remainingDebt > 0
                  ? styles.debtValuePositive
                  : styles.debtValueNegative,
              ]}
            >
              {formatNumber(remainingDebt)}
            </Text>
          </View>

          {/* NGUỒN TIỀN */}
          <Text style={styles.sourceLabel}>Nguồn tiền</Text>
          <View style={styles.paymentMethodsContainer}>
            {PAYMENT_METHODS.map(renderPaymentMethod)}
          </View>

          {/* FOOTER BUTTONS */}
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default PrepaymentDialog;
