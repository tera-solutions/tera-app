import colors from '@common/constants/colors';
import { FONT_FAMILY } from '@common/constants/typography';
import { formatNumber } from '@common/utils';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';

export interface IProps {
  visible: boolean;
  title?: string;
  itemCount?: number;
  onClose: () => void;
  onConfirm?: ((value: number, type: 'VNĐ' | '%') => void) | undefined;
  children?: React.ReactNode;
}

const { height, width } = Dimensions.get('window');
const MODAL_HEIGHT = 500;
const KEYBOARD_KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['000', '0', 'backspace'], // Sử dụng 'backspace' cho nút Xóa
];

const CalculatorDialog = ({ visible, onClose, onConfirm, title }: IProps) => {
  const [discountValue, setDiscountValue] = useState('0');
  const [discountType, setDiscountType] = useState<'VNĐ' | '%'>('VNĐ');
  const [displayContent, setDisplayContent] = useState(visible);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const slideUpValue = height - MODAL_HEIGHT;

  useEffect(() => {
    if (visible) {
      setDisplayContent(true);
      slideAnim.setValue(height);
    }
  }, [visible]);

  useEffect(() => {
    if (!displayContent) return;
    if (visible) {
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
  }, [displayContent, visible, slideAnim, slideUpValue]);

  // Xử lý logic bàn phím
  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      if (discountValue.length === 1 && discountValue !== '0') {
        setDiscountValue('0');
      } else if (discountValue.length > 1) {
        setDiscountValue((prev) => prev.slice(0, -1));
      }
    } else {
      let newValue = discountValue + key;
      // Loại bỏ số 0 ở đầu nếu không phải là input duy nhất
      if (discountValue === '0') {
        newValue = key;
      }

      // Giới hạn giá trị % tối đa là 100
      if (discountType === '%' && parseInt(newValue) > 100) {
        newValue = '100';
      }

      setDiscountValue(newValue);
    }
  };

  const handleConfirm = () => {
    const value = parseFloat(discountValue.replace(/\./g, '')) || 0;

    if (typeof onConfirm === 'function') {
      onConfirm(value, discountType);
    }
    onClose();
  };

  // Render từng nút bàn phím
  const renderKey = (key: string) => {
    let content;
    let style = styles.keyButton as any;

    if (key === 'backspace') {
      content = <Icon source="backspace-outline" size={30} color="#6B7280" />;
      style = [styles.keyButton, styles.backspaceKey];
    } else {
      content = <Text style={styles.keyText}>{key}</Text>;
    }

    return (
      <TouchableOpacity
        key={key}
        style={style}
        onPress={() =>
          key === 'backspace' ? handleKeyPress(key) : handleKeyPress(key)
        }
        onLongPress={() => key === 'backspace' && setDiscountValue('0')} // Giữ lâu để xóa tất cả
      >
        {content}
      </TouchableOpacity>
    );
  };

  // Tái tạo cấu trúc bàn phím
  const renderKeyboard = () => (
    <View style={styles.keyboardContainer}>
      {KEYBOARD_KEYS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.keyRow}>
          {row.map(renderKey)}
        </View>
      ))}
      {/* Hàng nút Thoát và Xác nhận */}
      <View style={styles.keyRow}>
        <TouchableOpacity
          style={[styles.keyButton, styles.actionKey, styles.exitKey]}
          onPress={onClose}
        >
          <Text style={styles.exitText}>Thoát</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.keyButton, styles.actionKey, styles.confirmKey]}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmText}>{title}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!displayContent) {
    return null;
  }

  return (
    <>
      <Modal
        animationType="none"
        transparent={true}
        visible={displayContent}
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
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
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.titleText}>Chiết khấu</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon source="close-circle-outline" size={30} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* GIÁ TRỊ CHIẾT KHẤU */}
          <View style={styles.discountValueContainer}>
            <Text style={styles.discountValueText}>
              {formatNumber(discountValue)}
              {discountType === '%' ? '%' : ''}
            </Text>
          </View>

          {/* CHỌN LOẠI CHIẾT KHẤU */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                discountType === 'VNĐ' && styles.typeButtonActive,
              ]}
              onPress={() => setDiscountType('VNĐ')}
            >
              <Text
                style={[
                  styles.typeText,
                  discountType === 'VNĐ' && styles.typeTextActive,
                ]}
              >
                Giá trị
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                discountType === '%' && styles.typeButtonActive,
              ]}
              onPress={() => setDiscountType('%')}
            >
              <Text
                style={[
                  styles.typeText,
                  discountType === '%' && styles.typeTextActive,
                ]}
              >
                %
              </Text>
            </TouchableOpacity>
          </View>

          {/* BÀN PHÍM */}
          {renderKeyboard()}
        </Animated.View>
      </Modal>
    </>
  );
};

export default CalculatorDialog;

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end', // Căn bottom
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Nền mờ
  },
  modalContent: {
    position: 'absolute',
    width: width,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  modalView: {
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 30, // Khoảng cách cho thanh Home Indicator
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  textStyle: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },

  // Discount Value Display
  discountValueContainer: {
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  discountValueText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3B82F6',
  },

  // Type Selector (VNĐ / %)
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 10
  },
  typeButton: {
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  typeText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  typeTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },

  // Custom Keyboard
  keyboardContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 5,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  keyButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    margin: 1, // Khoảng cách giữa các nút
  },
  keyText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#1F2937',
  },
  backspaceKey: {
    // Không có style đặc biệt về màu, chỉ chứa icon
  },
  actionKey: {
    flex: 0.5, // Chiếm 50% chiều rộng
  },
  exitKey: {
    backgroundColor: '#E5E7EB',
  },
  exitText: {
    fontSize: 18,
    color: '#4B5563',
    fontFamily: FONT_FAMILY.BOLD
  },
  confirmKey: {
    backgroundColor: '#10B981',
  },
  confirmText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.BOLD
  },
});
