import { formatNumber } from '@common/utils';
import { TextInput } from '@components/ui';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Switch } from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { styles } from './styles';

// --- Dữ liệu giả định ---
const MOCK_CARRIERS = ['GHN', 'GHTK', 'ViettelPost', 'J&T', 'Ahamove'];
const MOCK_PRODUCTS = [
  { id: 'p1', name: 'iPhone 15 Pro Max 256GB', quantity: 1, price: 29000000 },
  { id: 'p2', name: 'Ốp lưng Xanh', quantity: 2, price: 150000 },
];

// --- Component Item Sản phẩm ---
interface ProductItemProps {
  product: (typeof MOCK_PRODUCTS)[0];
}
const ProductItem: React.FC<ProductItemProps> = ({ product }) => (
  <View style={styles.productItem}>
    <Text style={styles.productName} numberOfLines={1}>
      {product.name}
    </Text>
    <Text style={styles.productQty}>x{product.quantity} Cái</Text>
  </View>
);

// --- Màn hình chính CreateShippingNoteScreen ---
export const CreateShippingNoteScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [recipientName, setRecipientName] = useState('Nguyễn Quốc Trường');
  const [recipientPhone, setRecipientPhone] = useState('0372136156');
  const [recipientAddress, setRecipientAddress] = useState(
    '82/14/8B, Quận 1, TP.HCM',
  );
  const [selectedCarrier, setSelectedCarrier] = useState(MOCK_CARRIERS[0]);
  const [codAmount, setCodAmount] = useState('0');
  const [isInsuranceEnabled, setIsInsuranceEnabled] = useState(true);

  const totalAmount = MOCK_PRODUCTS.reduce((sum, p) => sum + p.quantity, 0);

  const handleCreate = () => {
    if (!recipientName || !recipientAddress || !selectedCarrier) {
      Alert.alert(
        'Lỗi',
        'Vui lòng nhập đầy đủ thông tin người nhận và đơn vị vận chuyển.',
      );
      return;
    }

    // Logic gọi API tạo phiếu vận chuyển
    console.tron('Tạo phiếu vận chuyển với:', {
      recipientName,
      selectedCarrier,
      codAmount,
    });
    Alert.alert(
      'Thành công',
      `Đã tạo phiếu vận chuyển qua ${selectedCarrier}.`,
    );
    router.back();
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Tạo Phiếu Vận chuyển</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 1. THÔNG TIN NGƯỜI NHẬN */}
          <Text style={styles.sectionTitle}>Thông tin Người nhận</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Họ tên người nhận"
              value={recipientName}
              onChangeText={setRecipientName}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={recipientPhone}
              onChangeText={setRecipientPhone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={styles.inputAddress}
              onPress={() => console.tron('Chọn địa chỉ')}
            >
              <Text
                style={
                  recipientAddress ? styles.addressText : styles.placeholderText
                }
              >
                {recipientAddress || 'Chọn địa chỉ nhận hàng *'}
              </Text>
              <Icon source="map-marker-outline" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {/* 2. THÔNG TIN ĐƠN HÀNG/SẢN PHẨM */}
          <Text style={styles.sectionTitle}>
            Sản phẩm Vận chuyển ({MOCK_PRODUCTS.length})
          </Text>
          <View style={styles.card}>
            {MOCK_PRODUCTS.map((p) => (
              <ProductItem key={p.id} product={p} />
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => console.tron('Thêm sản phẩm')}
            >
              <Icon source="plus-circle-outline" size={20} color="#10B981" />
              <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
            </TouchableOpacity>
          </View>

          {/* 3. THIẾT LẬP VẬN CHUYỂN */}
          <Text style={styles.sectionTitle}>Thiết lập Vận chuyển</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.selectOption}
              onPress={() => console.tron('Chọn đơn vị Vận chuyển')}
            >
              <Text style={styles.selectLabel}>Đơn vị Vận chuyển</Text>
              <View style={styles.selectValue}>
                <Text style={styles.carrierText}>{selectedCarrier}</Text>
                <Icon source="chevron-right" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            <View style={styles.codRow}>
              <Text style={styles.codLabel}>Tiền thu hộ (COD)</Text>
              <TextInput
                style={styles.codInput}
                placeholder={totalAmount.toLocaleString('vi-VN') + ' đ'}
                value={codAmount}
                onChangeText={setCodAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Bảo hiểm hàng hóa</Text>
              <Switch
                value={isInsuranceEnabled}
                onValueChange={setIsInsuranceEnabled}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isInsuranceEnabled ? '#3B82F6' : '#f4f3f4'}
              />
            </View>
          </View>
        </ScrollView>

        {/* FOOTER - NÚT TẠO PHIẾU */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.totalLabel}>Tổng số lượng:</Text>
            <Text style={styles.totalValue}>{formatNumber(totalAmount)}</Text>
          </View>
          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.createButtonText}>Tạo Phiếu Vận chuyển</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CreateShippingNoteScreen;
