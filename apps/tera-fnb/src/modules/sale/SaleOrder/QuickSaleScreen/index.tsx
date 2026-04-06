import { formatNumber } from '@tera/common/utils';
import { TextInput } from '@components/ui';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { styles } from './styles';

// --- 1. Dữ liệu và Cấu hình ---
const KEYPAD_LAYOUT = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['000', '0', 'X'], // X là nút xóa
];

const QuickSaleScreen: React.FC = () => {
  const router = useRouter();

  // Sử dụng state để lưu giá trị số thực tế (không có dấu chấm) để dễ tính toán
  const [priceValue, setPriceValue] = useState(5508);
  const [productName, setProductName] = useState('iPhone18');
  const [unit, setUnit] = useState('Cái');
  const [costPrice, setCostPrice] = useState('0'); // Giá vốn
  const [saveToCatalog, setSaveToCatalog] = useState(false); // Lưu vào danh mục sản phẩm

  // Giá hiển thị đã được định dạng
  const displayPrice = formatNumber(priceValue);

  // --- 2. Logic Bàn phím ---
  const handleKeypadPress = (key: string) => {
    let currentString = priceValue.toString();

    if (key === 'X') {
      // Xóa ký tự cuối cùng, nếu rỗng thì đặt lại là 0
      currentString = currentString.slice(0, -1);
      if (currentString.length === 0) {
        setPriceValue(0);
      } else {
        setPriceValue(parseInt(currentString));
      }
    } else if (key === '000') {
      // Thêm 3 số 0
      currentString += '000';
      setPriceValue(parseInt(currentString));
    } else {
      // Thêm số
      currentString += key;
      // Loại bỏ số 0 ở đầu nếu không phải là 0
      const newValue = parseInt(currentString);
      setPriceValue(newValue);
    }
  };

  const handleConfirm = () => {
    console.tron(
      `Bán nhanh: ${productName} - Giá: ${formatNumber(priceValue)} VNĐ. Lưu catalog: ${saveToCatalog}`,
    );
    router.push('/sale/checkout');
    // Logic chuyển sang màn hình Checkout với sản phẩm đã tạo
    // (Bạn có thể thêm logic tạo đơn hàng ở đây)
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Bán nhanh</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* KHU VỰC GIÁ BÁN */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Giá bán</Text>
            <Text style={styles.priceValue}>{displayPrice}</Text>
          </View>

          {/* THÔNG TIN SẢN PHẨM */}
          <View style={styles.infoSection}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Tên sản phẩm *</Text>
              <TextInput
                style={styles.textInput}
                value={productName}
                onChangeText={setProductName}
                placeholder="Nhập tên sản phẩm"
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Đơn vị</Text>
              <TextInput
                style={[styles.textInput, styles.halfWidth]}
                value={unit}
                onChangeText={setUnit}
                placeholder="Cái"
              />
              <Text style={[styles.inputLabel, styles.costPriceLabel]}>
                Giá vốn
              </Text>
              <TextInput
                style={[styles.textInput, styles.halfWidth]}
                value={costPrice}
                onChangeText={(text) => {
                  setCostPrice(text);
                }}
                keyboardType="numeric"
                returnKeyType="done"
                placeholder="Giá vốn"
              />
            </View>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setSaveToCatalog(!saveToCatalog)}
            >
              <View style={styles.checkbox}>
                <Icon
                  source={
                    saveToCatalog ? 'checkbox-marked' : 'checkbox-blank-outline'
                  }
                  size={20}
                  color={saveToCatalog ? '#0066ffff' : '#9CA3AF'}
                />
              </View>
              <Text style={styles.checkboxLabel}>
                Ghi lại vào danh mục sản phẩm
              </Text>
            </TouchableOpacity>
          </View>

          {/* VÙNG ĐỆM */}
          <View style={{ flex: 1 }} />
        </ScrollView>

        {/* KEYPAD */}
        <View style={styles.keypadContainer}>
          {KEYPAD_LAYOUT.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.keypadButton,
                    key === 'X' && styles.deleteButton,
                  ]}
                  onPress={() => handleKeypadPress(key)}
                  disabled={key !== 'X' && priceValue >= 999999999} // Giới hạn số
                >
                  {key === 'X' ? (
                    <Icon
                      source="backspace-outline"
                      size={24}
                      color="#6B7280"
                    />
                  ) : (
                    <Text style={styles.keypadText}>{key}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
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
  );
};

export default QuickSaleScreen;
