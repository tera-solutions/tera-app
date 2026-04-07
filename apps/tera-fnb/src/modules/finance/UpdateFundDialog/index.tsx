import { formatNumber } from '@tera/commons/utils';
import { TextInput } from '@components/ui';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';

export interface FundSource {
  id: string;
  name: string;
  balance: number;
  iconName: string;
}

interface UpdateFundDialogProps {
  isVisible: boolean;
  onClose: () => void;
  currentFund?: FundSource;
  onConfirm: (fundID: string, newBalance: number) => void;
}

const NUMPAD_BUTTONS = [
  ['1', '2', '3', '÷'],
  ['4', '5', '6', 'x'],
  ['7', '8', '9', '+'],
  ['C', '0', '000', '-'],
];

// --- 1. Component Bàn phím số tùy chỉnh ---
const CustomNumpad: React.FC<{ onKey: (key: string) => void }> = ({
  onKey,
}) => {
  return (
    <View style={styles.numpadContainer}>
      {NUMPAD_BUTTONS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.numpadRow}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.numpadButton}
              onPress={() => onKey(key)}
            >
              <Text style={styles.numpadText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      {/* Hàng cuối cùng (000, 0, backspace, OK) */}
      <View style={styles.numpadRow}>
        <TouchableOpacity
          style={[styles.numpadButton, styles.wideButton]}
          onPress={() => onKey('622.150.000')}
        >
          <Text style={styles.numpadTextSmall}>622.150.000</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.numpadButton, styles.wideButton]}
          onPress={() => onKey('6.221.500.000')}
        >
          <Text style={styles.numpadTextSmall}>6.221.500.000</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.numpadRow}>
        <TouchableOpacity
          style={[styles.numpadButton]}
          onPress={() => onKey('00')}
        >
          <Text style={styles.numpadText}>00</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.numpadButton]}
          onPress={() => onKey('000')}
        >
          <Text style={styles.numpadText}>000</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.numpadButton}
          onPress={() => onKey('delete')}
        >
          <Icon source="backspace-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.numpadButton, styles.confirmButton]}
          onPress={() => onKey('OK')}
        >
          <Text style={[styles.numpadText, styles.confirmText]}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- 2. Component Dialog chính ---
const UpdateFundDialog: React.FC<UpdateFundDialogProps> = ({
  isVisible,
  onClose,
  currentFund,
  onConfirm,
}) => {
  const insets = useSafeAreaInsets();
  const [inputBalance, setInputBalance] = useState(
    formatNumber(currentFund?.balance || 0),
  );

  // Logic xử lý bàn phím số
  const handleKey = (key: string) => {
    let current = inputBalance === '0' ? '' : inputBalance;

    if (key === 'C') {
      setInputBalance('0');
      return;
    }

    if (key === 'delete') {
      current = current.slice(0, -1) || '0';
    } else if (key === 'OK') {
      // Logic xác nhận, gọi onConfirm
      const finalBalance = parseFloat(current.replace(/\./g, ''));
      if (!isNaN(finalBalance)) {
        if (currentFund?.id) {
          onConfirm(currentFund?.id, finalBalance);
        }
      } else {
        Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập số dư hợp lệ.');
      }
      return;
    } else if (key.match(/^[0-9]$|^000$|^00$/)) {
      // Chỉ cho phép nhập số
      current += key;
    } else if (key.includes('.')) {
      // Xử lý các nút giá trị nhanh (ví dụ: 622.150.000)
      current = key.replace(/\./g, '');
    } else if (key.match(/[\+\-\\x\÷]/)) {
      // Logic cho các phép tính (nếu cần tính toán ngay trên dialog)
      console.tron(`Phép toán: ${key}`);
      return;
    }

    // Định dạng lại hiển thị (thêm dấu chấm phân cách hàng nghìn)
    const numericValue = current.replace(/\./g, '');
    if (numericValue) {
      setInputBalance(formatNumber(numericValue));
    } else {
      setInputBalance('0');
    }
  };

  useEffect(() => {
    if (!currentFund) return;
    setInputBalance(formatNumber(currentFund?.balance));
  }, [currentFund]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.fullScreenContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.safeArea}>
          {/* Header Dialog */}
          <View style={styles.dialogHeader}>
            <Text style={styles.dialogTitle}>Chỉnh sửa nguồn tiền</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon source="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.inputArea}>
            <Text style={styles.inputLabel}>Tên nguồn tiền *</Text>
            <TextInput
              style={styles.textInput}
              value={currentFund?.name}
              editable={false} // Tên nguồn tiền thường không sửa trong dialog này
            />

            <Text style={styles.inputLabel}>Số dư ban đầu</Text>
            <TextInput
              style={styles.balanceInput}
              value={inputBalance}
              keyboardType="numeric"
              returnKeyType="done"
              onChangeText={(text) => {
                const valText = text
                  .replace(/\,/g, '')
                  .replace(/[^0-9\.]/g, '');
                setInputBalance(formatNumber(valText));
              }}
              placeholder="0"
              editable={true}
            />
          </View>

          {/* Actions và Numpad */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Quay lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmActionButton}
              onPress={() => handleKey('OK')} // Dùng hàm handleKey để xử lý logic xác nhận
            >
              <Text style={styles.confirmActionButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>

          <CustomNumpad onKey={handleKey} />
        </View>
      </View>
    </Modal>
  );
};

export default UpdateFundDialog;
