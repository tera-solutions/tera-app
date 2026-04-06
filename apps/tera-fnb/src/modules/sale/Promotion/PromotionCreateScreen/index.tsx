import { TextInput } from '@components/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

// --- Component Input/Picker ---
const InputRow: React.FC<{
  label: string;
  value: string;
  placeholder: string;
  isRequired?: boolean;
  onChangeText: (text: string) => void;
}> = ({ label, value, placeholder, isRequired = false, onChangeText }) => (
  <View style={styles.inputRow}>
    <Text style={styles.inputLabel}>
      {label} {isRequired && <Text style={{ color: '#EF4444' }}>*</Text>}
    </Text>
    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const PickerRow: React.FC<{
  label: string;
  value: string;
  iconName: string;
  onPress: () => void;
}> = ({ label, value, iconName, onPress }) => (
  <TouchableOpacity style={styles.pickerRow} onPress={onPress}>
    <Text style={styles.pickerLabel}>{label}</Text>
    <View style={styles.pickerValueContainer}>
      <Text style={styles.pickerValue}>{value}</Text>
      <Icon source={iconName} size={20} color="#9CA3AF" />
    </View>
  </TouchableOpacity>
);

// --- Màn hình chính ---
const PromotionCreateScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const isEditing = params?.isEditing || false;
  const promotionId = params?.promotionId;

  // States
  const [name, setName] = useState(
    isEditing ? 'Chiết khấu 10% dịp lễ 20/11' : '',
  );
  const [type, setType] = useState(isEditing ? 'Chiết khấu' : 'Chiết khấu');
  const [value, setValue] = useState(isEditing ? '10%' : '');
  const [startDate, setStartDate] = useState(
    isEditing ? '01/11/2025 00:00' : 'Chọn thời gian',
  );
  const [endDate, setEndDate] = useState(
    isEditing ? '20/11/2025 23:59' : 'Chọn thời gian',
  );
  const [applyToAllProducts, setApplyToAllProducts] = useState(true);

  const handleSave = () => {
    if (!name || !value) {
      Alert.alert('Lỗi', 'Vui lòng nhập Tên và Giá trị khuyến mãi.');
      return;
    }
    console.tron(isEditing ? `Cập nhật KM ${promotionId}` : 'Tạo mới KM:', {
      name,
      type,
      value,
      startDate,
    });
    Alert.alert(
      'Thành công',
      isEditing ? 'Đã cập nhật khuyến mãi.' : 'Đã tạo khuyến mãi mới.',
    );
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận Xóa',
      'Bạn có chắc chắn muốn xóa khuyến mãi này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: () => {
            console.tron(`Xóa KM ${promotionId}`);
            router.back();
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon source="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.titleText}>
          {isEditing ? 'Chỉnh sửa Khuyến mãi' : 'Thêm Khuyến mãi'}
        </Text>
        {isEditing && (
          <TouchableOpacity onPress={() => console.tron('Xem thêm KM')}>
            <Icon source="dots-horizontal" size={24} color="#1F2937" />
          </TouchableOpacity>
        )}
        {!isEditing && <View style={{ width: 24 }} />}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. THÔNG TIN CHUNG */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Thông tin chung</Text>

          <InputRow
            label="Tên chương trình"
            value={name}
            placeholder="Ví dụ: Giảm giá Black Friday"
            isRequired
            onChangeText={setName}
          />

          <PickerRow
            label="Loại khuyến mãi"
            value={type}
            iconName="chevron-down"
            onPress={() => console.tron('Chọn loại KM')}
          />

          <InputRow
            label="Giá trị áp dụng"
            value={value}
            placeholder="10% hoặc 50.000 đ"
            isRequired
            onChangeText={setValue}
          />
        </View>

        {/* 2. THỜI GIAN ÁP DỤNG */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Thời gian áp dụng</Text>

          <PickerRow
            label="Thời gian bắt đầu"
            value={startDate}
            iconName="calendar-month-outline"
            onPress={() => console.tron('Chọn ngày bắt đầu')}
          />

          <PickerRow
            label="Thời gian kết thúc"
            value={endDate}
            iconName="calendar-month-outline"
            onPress={() => console.tron('Chọn ngày kết thúc')}
          />
        </View>

        {/* 3. SẢN PHẨM/ĐỐI TƯỢNG ÁP DỤNG */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Đối tượng áp dụng</Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Áp dụng cho tất cả sản phẩm</Text>
            <Switch
              onValueChange={setApplyToAllProducts}
              value={applyToAllProducts}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {!applyToAllProducts && (
            <PickerRow
              label="Sản phẩm áp dụng"
              value="Chọn sản phẩm"
              iconName="chevron-right"
              onPress={() => console.tron('Chọn sản phẩm')}
            />
          )}

          <PickerRow
            label="Điều kiện áp dụng"
            value="Tổng hóa đơn > 100.000 đ"
            iconName="chevron-right"
            onPress={() => console.tron('Thiết lập điều kiện')}
          />
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Xóa chương trình</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Cập nhật' : 'Lưu'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PromotionCreateScreen;
