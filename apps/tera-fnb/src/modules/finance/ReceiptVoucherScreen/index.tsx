import colors from '@tera/common/constants/colors';
import { formatNumber } from '@tera/common/utils';
import { TextInput } from '@components/ui';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ClassifyTransactionDialog, {
  ClassificationItem,
} from '../ClassifyTransactionDialog';
import { styles } from './styles';

// --- 2. Component Keypad ---
interface KeypadProps {
  onKeyPress: (key: string) => void;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress }) => {
  const keys = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '000',
    '0',
    'backspace',
  ];

  return (
    <View style={styles.keypadContainer}>
      {keys.map((key) => (
        <TouchableOpacity
          key={key}
          style={styles.keypadButton}
          onPress={() => onKeyPress(key)}
        >
          {key === 'backspace' ? (
            <Icon source="backspace-outline" size={30} color="#1F2937" />
          ) : (
            <Text style={styles.keypadText}>{key}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// --- 3. Màn hình chính ---
const ReceiptVoucherScreen: React.FC = () => {
  const router = useRouter();

  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>('Phân loại');
  const [source, setSource] = useState<string>('Tiền mặt'); // Nguồn tiền
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);

  // --- MỚI: Dữ liệu chi tiết ---
  const [note, setNote] = useState<string>('');
  const [receiver, setReceiver] = useState<string>(''); // Người nhận/Nhà cung cấp
  const [attachmentCount, setAttachmentCount] = useState<number>(0); // Số lượng ảnh đính kèm

  const [isClassificationModalVisible, setIsClassificationModalVisible] =
    useState(false);

  const handleSelectClassification = (selectedItem: ClassificationItem) => {
    setCategory(selectedItem.label);
    setIsClassificationModalVisible(false); // Đóng Modal
  };

  // Xử lý nhập liệu từ Keypad
  const handleKeyPress = (key: string) => {
    let currentAmountStr = amount.toString();

    if (key === 'backspace') {
      if (currentAmountStr.length === 1) {
        setAmount(0);
      } else {
        setAmount(parseInt(currentAmountStr.slice(0, -1)));
      }
    } else if (key === '000') {
      // Giới hạn độ dài số tiền
      if (currentAmountStr.length < 15) {
        setAmount(parseInt(currentAmountStr + '000'));
      }
    } else {
      // Xử lý phím số (1-9, 0)
      const newAmountStr =
        currentAmountStr === '0' ? key : currentAmountStr + key;
      if (newAmountStr.length <= 15) {
        // Giới hạn độ dài
        setAmount(parseInt(newAmountStr));
      }
    }
  };

  // Hàm xử lý lưu
  const handleSave = (andNew: boolean) => {
    console.tron(
      `Lưu khoản chi: ${amount} VND. Ghi chú: ${note}. Người nhận: ${receiver}`,
    );
    // Logic gọi API lưu khoản chi
    if (andNew) {
      setAmount(0); // Reset để thêm mới
      setNote('');
      setReceiver('');
      setAttachmentCount(0);
    }
    // Thêm logic điều hướng/đóng màn hình
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => router.back()}
        >
          <Icon source="arrow-left" size={24} color={colors.gray} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Tạo khoản thu</Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Icon source="home-outline" size={28} color={colors.gray} />
        </TouchableOpacity>
      </View>

      {/* AMOUNT DISPLAY */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>{formatNumber(amount)}</Text>
        <View style={styles.underline} />
      </View>

      {/* QUICK ACTIONS & INFO FIELDS */}
      <View style={styles.infoRow}>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setIsClassificationModalVisible(true)} // Mở Modal
        >
          <Text style={styles.infoLabel}>+ {category}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => console.tron('Chọn Nguồn tiền')}
        >
          <Text style={styles.infoLabel}>Nguồn tiền</Text>
          <Text style={styles.infoValue}>{source}</Text>
        </TouchableOpacity>
      </View>

      {/* THÊM THÔNG TIN BUTTON */}
      <TouchableOpacity
        style={styles.moreInfoButton}
        onPress={() => setShowMoreInfo(!showMoreInfo)}
      >
        <Text style={styles.moreInfoText}>
          {showMoreInfo ? '- Rút gọn' : '+ Thêm thông tin'}
        </Text>
      </TouchableOpacity>
      {/* Màn hình nhỏ (nếu cần) */}
      {/* 🚀 MỚI: PANEL CHI TIẾT (More Info Panel) */}
      {showMoreInfo && (
        <View style={styles.moreInfoPanel}>
          {/* Người nhận */}
          <View style={styles.detailInputRow}>
            <View style={{ marginRight: 10 }}>
              <Icon
                source="account-multiple-outline"
                size={22}
                color="#6B7280"
              />
            </View>
            <TextInput
              style={styles.detailInput}
              placeholder="Tên người nhận/Nhà cung cấp"
              value={receiver}
              onChangeText={setReceiver}
            />
          </View>

          {/* Ghi chú */}
          <View style={styles.detailInputRow}>
            <View style={{ marginRight: 10 }}>
              <Icon source="note-text-outline" size={22} color="#6B7280" />
            </View>
            <TextInput
              style={styles.detailInput}
              placeholder="Ghi chú (Ví dụ: Trả lương nhân viên)"
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Ngày giờ (Mockup) */}
          <TouchableOpacity
            style={styles.detailInputRow}
            onPress={() => console.tron('Chọn Ngày giờ')}
          >
            <View style={{ marginRight: 10 }}>
              <Icon source="calendar-clock-outline" size={22} color="#6B7280" />
            </View>
            <Text style={styles.detailInputPlaceholder}>
              Ngày giao dịch: Hôm nay
            </Text>
            <Icon source="chevron-right" size={22} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Ảnh đính kèm */}
          <TouchableOpacity
            style={styles.detailInputRow}
            onPress={() => console.tron('Đính kèm ảnh')}
          >
            <View style={{ marginRight: 10 }}>
              <Icon source="image-outline" size={22} color="#6B7280" />
            </View>
            <Text style={styles.detailInputPlaceholder}>
              Đính kèm ảnh {attachmentCount > 0 ? `(${attachmentCount})` : ''}
            </Text>
            <Icon source="camera-outline" size={22} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      )}

      {/* KEYPAD */}
      <Keypad onKeyPress={handleKeyPress} />

      {/* FOOTER - LƯU VÀ THÊM MỚI / LƯU */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveAndNewButton}
          onPress={() => handleSave(true)}
        >
          <Text style={styles.saveAndNewText}>Lưu và thêm mới</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleSave(false)}
        >
          <Text style={styles.saveText}>Lưu</Text>
        </TouchableOpacity>
      </View>
      {isClassificationModalVisible && (
        <ClassifyTransactionDialog
          isVisible={isClassificationModalVisible}
          onClose={() => setIsClassificationModalVisible(false)}
          onSelectClassification={handleSelectClassification}
        />
      )}
    </SafeAreaView>
  );
};

export default ReceiptVoucherScreen;
