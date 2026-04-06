import { formatNumber } from '@common/utils';
import { TextInput } from '@components/ui';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShippingOptionItem, { ShippingOption } from './ShippingOptionItem';
import { styles } from './styles';

// --- 1. Dữ liệu giả định ---
const DUMMY_SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 's1',
    carrier: 'Sapo Express',
    service: 'Giao qua Shopee Xpress',
    deliveryTime: '(3 -4 ngày)',
    originalPrice: 20000,
    discountedPrice: 19500,
    isCheapest: true,
  },
  {
    id: 's2',
    carrier: 'Sapo Express',
    service: 'Giao qua GHN Express',
    deliveryTime: '(2 -3 ngày)',
    originalPrice: 31200,
    discountedPrice: 23900,
    isFastest: true,
  },
  {
    id: 's3',
    carrier: 'GHN Express',
    service: 'Cổng vận chuyển Sapo',
    deliveryTime: '2-3 ngày',
    originalPrice: 31200,
    discountedPrice: 23900,
    isRecommended: true,
  },
  {
    id: 's4',
    carrier: 'BEST Express',
    service: '',
    deliveryTime: '3-4 ngày',
    originalPrice: 23900,
    discountedPrice: 23900,
  },
  {
    id: 's5',
    carrier: 'J&T Express',
    service: '',
    deliveryTime: '3-4 ngày',
    originalPrice: 33540,
    discountedPrice: 33540,
  },
];

interface ShippingFeeDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (fee: number, carrier?: string) => void;
}
// --- 3. Dialog Chính ---
const ShippingFeeDialog: React.FC<ShippingFeeDialogProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [useFree, setUseFree] = useState(false);
  const [useFeeOther, setUseFeeOther] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(
    DUMMY_SHIPPING_OPTIONS[0],
  );

  const handleConfirm = () => {
    if (selectedOption) {
      onConfirm(selectedOption.discountedPrice, selectedOption.carrier);
      onClose();
    } else {
      onClose(); // Đóng nếu không chọn gì
    }
  };

  useEffect(() => {
    if (useFree) {
      onConfirm(0);
      onClose();
    }
  }, [useFree]);

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
            <Text style={styles.titleText}>Phí dự kiến</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* THÔNG TIN GIAO HÀNG */}
            <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>

            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => console.tron('Chỉnh sửa địa chỉ lấy hàng')}
            >
              <Text style={styles.infoLabel}>Địa chỉ lấy hàng</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                TP Hồ Chí Minh - Quận 12 - Phường Trung Mỹ...
              </Text>
              <Icon source="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {/* ĐỊA CHỈ MỚI */}
            <View style={styles.toggleRow}>
              <Text style={styles.infoLabel}>Địa chỉ mới</Text>
              <Switch
                onValueChange={setUseNewAddress}
                value={useNewAddress}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={'#FFFFFF'}
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.infoLabel}>Miễn phí giao hàng</Text>
              <Switch
                onValueChange={(value) => {
                  setUseFree(value);
                  if (value) {
                    setUseFeeOther(false);
                    onConfirm(0);
                    onClose();
                  }
                }}
                value={useFree}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={'#FFFFFF'}
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.infoLabel}>Phí giao hàng cố định</Text>
              <Switch
                onValueChange={(value) => {
                  setUseFeeOther(value);
                  if (value) {
                    setUseFree(false);
                  }
                }}
                value={useFeeOther}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={'#FFFFFF'}
              />
            </View>
            {useFeeOther && (
              <View style={styles.toggleRow}>
                <Text style={styles.infoLabel}>Phí vận chuyển</Text>
                <TextInput
                  style={styles.numberInput}
                  keyboardType="numeric"
                  returnKeyType="next"
                  returnKeyLabel='Xong'
                  onChangeText={(value: string) => {
                    setSelectedOption({
                      id: '1',
                      carrier: 'Phí cố định',
                      discountedPrice: Number(parseInt(value)),
                    });
                  }}
                />
              </View>
            )}

            {useNewAddress && (
              <TouchableOpacity
                style={styles.infoRow}
                onPress={() => console.tron('Chọn địa chỉ giao hàng')}
              >
                <Text style={styles.infoLabel}>Địa chỉ giao hàng</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  Hà Nội - Quận Ba Đình - Phường Trúc Bạch
                </Text>
                <Icon source="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}

            {!useFree && !useFeeOther && (
              <>
                <TouchableOpacity style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Thu hộ COD</Text>
                  <Text style={styles.infoValue}>439.500</Text>
                  <Icon source="chevron-right" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                {/* KHỐI LƯỢNG & KÍCH THƯỚC */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Khối lượng (g)</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={styles.smallInput}
                      value="100.0"
                      keyboardType="numeric"
                    />
                    <Icon source="chevron-right" size={20} color="#9CA3AF" />
                  </View>
                </View>
                <View style={[styles.infoRow, styles.lastInfoRow]}>
                  <View>
                    <Text style={styles.infoLabel}>Kích thước (cm)</Text>
                    <Text style={styles.sizeHint}>(dài x rộng x cao)</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput style={styles.smallInput} value="10 x 10 x 10" />
                    <Icon source="chevron-right" size={20} color="#9CA3AF" />
                  </View>
                </View>

                {/* PHÍ DỰ KIẾN */}
                <Text style={styles.sectionTitle}>Phí dự kiến trả đối tác</Text>

                <View style={styles.optionsContainer}>
                  {DUMMY_SHIPPING_OPTIONS.map((option) => (
                    <ShippingOptionItem
                      key={option.id}
                      option={option}
                      isSelected={selectedOption?.id === option.id}
                      onSelect={setSelectedOption}
                    />
                  ))}
                </View>
              </>
            )}
          </ScrollView>

          {/* FOOTER ACTION */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>
                Xác nhận phí: {formatNumber(selectedOption?.discountedPrice)}{' '}
                VNĐ
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default ShippingFeeDialog;
