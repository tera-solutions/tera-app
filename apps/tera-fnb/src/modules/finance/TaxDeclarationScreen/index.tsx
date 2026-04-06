import { TextInput } from '@components/ui';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox, Icon } from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { styles } from './styles';

type checkboxStatus = 'checked' | 'unchecked' | 'indeterminate';

// --- Component Input Field ---
interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  isMandatory?: boolean;
  isReadOnly?: boolean;
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
  iconName?: string;
  style?: any;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  isMandatory = false,
  isReadOnly = false,
  keyboardType = 'default',
  iconName,
  style,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>
      {label} {isMandatory && <Text style={{ color: '#EF4444' }}>*</Text>}
    </Text>
    <TextInput
      style={[styles.textInput, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      editable={!isReadOnly}
      keyboardType={keyboardType}
      placeholderTextColor="#9CA3AF"
    />
  </View>
);

// --- Component Dropdown Field (Simplified) ---
const DropdownField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  isMandatory = false,
  iconName,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>
      {label} {isMandatory && <Text style={{ color: '#EF4444' }}>*</Text>}
    </Text>
    <View style={styles.dropdownView}>
      <Text style={styles.dropdownText}>{value || placeholder}</Text>
      <Icon source="chevron-down" size={20} color="#6B7280" />
    </View>
  </View>
);

// --- Màn hình chính Kê khai thuế ---
const TaxDeclarationScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 1. Thông tin NNT (a53.jpg)
  const [storeName, setStoreName] = useState('');
  const [taxId, setTaxId] = useState('066096020727'); // Readonly
  const [businessType, setBusinessType] = useState('Ngành nghề kinh doanh'); // Nông sản, F&B...
  const [area, setArea] = useState('');
  const [laborCount, setLaborCount] = useState('');
  const [timeFrom, setTimeFrom] = useState('00:00');
  const [timeTo, setTimeTo] = useState('00:00');
  const [changeInfo, setChangeInfo] = useState<checkboxStatus>('unchecked');
  const [isPayTax, setIsPayTax] = useState<checkboxStatus>('unchecked'); // Đi thuế

  // 2. Địa chỉ cư trú (a54.jpg)
  const [residentCity, setResidentCity] = useState('Thành phố Hồ Chí Minh');
  const [residentDistrict, setResidentDistrict] = useState('');
  const [residentAddress, setResidentAddress] = useState('82/14/8B');
  const [residentPhone, setResidentPhone] = useState('0372136156');
  const [residentEmail, setResidentEmail] = useState('truong160196@gmail.com');

  // 3. Địa chỉ kinh doanh (a55.jpg)
  const [isBusinessAddressSame, setIsBusinessAddressSame] =
    useState<checkboxStatus>('checked');
  const [businessCity, setBusinessCity] = useState('Thành phố Hồ Chí Minh');
  const [businessDistrict, setBusinessDistrict] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [isBorderBusiness, setIsBorderBusiness] =
    useState<checkboxStatus>('unchecked');
  const handleNextStep = () => {
    if (
      !storeName ||
      !area ||
      !timeFrom ||
      !timeTo ||
      !residentCity ||
      !residentAddress ||
      !businessCity
    ) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các trường bắt buộc (*).');
      return;
    }
    Alert.alert(
      'Kê khai thành công',
      'Thông tin đã được lưu và chuyển đến bước tiếp theo.',
    );
    // logic navigation: router.push('NextTaxStep');
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Mẫu số: 01/CNKD</Text>
          <TouchableOpacity onPress={() => router.replace('/')}>
            <Icon source="home-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 1. THÔNG TIN NGƯỜI NỘP THUẾ (NNT) - a53.jpg */}
          <Text style={styles.sectionTitle}>Thông tin NNT</Text>
          <View style={styles.personInfo}>
            <Text style={styles.personInfoLabel}>Người nộp thuế</Text>
            <Text style={styles.personInfoValue}>Nguyễn Quốc Trường</Text>
          </View>

          <InputField
            label="Tên cửa hàng/thương hiệu"
            placeholder="Nhập tên cửa hàng/thương hiệu"
            value={storeName}
            onChangeText={setStoreName}
            isMandatory={true}
          />
          <View style={styles.taxIdRow}>
            <Text style={styles.taxIdLabel}>Mã số thuế</Text>
            <Text style={styles.taxIdValue}>{taxId}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ngành nghề kinh doanh</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Thêm</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() =>
              setChangeInfo(
                changeInfo === 'unchecked' ? 'checked' : 'unchecked',
              )
            }
          >
            <View style={styles.checkbox}>
              <Checkbox status={changeInfo} />
            </View>
            <Text style={styles.checkboxLabel}>Thay đổi thông tin</Text>
          </TouchableOpacity>

          <InputField
            label="Diện tích kinh doanh"
            placeholder="Nhập diện tích kinh doanh"
            value={area}
            onChangeText={setArea}
            isMandatory={true}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() =>
              setIsPayTax(isPayTax === 'unchecked' ? 'checked' : 'unchecked')
            }
          >
            <View style={styles.checkbox}>
              <Checkbox status={isPayTax} />
            </View>
            <Text style={styles.checkboxLabel}>Đi thuế</Text>
          </TouchableOpacity>

          <InputField
            label="Số lượng lao động sử dụng thường xuyên"
            placeholder="Nhập số lượng lao động sử dụng thường..."
            value={laborCount}
            onChangeText={setLaborCount}
            keyboardType="numeric"
          />

          <Text style={styles.timeTitle}>Thời gian hoạt động trong ngày</Text>
          <View style={styles.timeInputRow}>
            <DropdownField
              label="Từ giờ"
              placeholder="00:00"
              value={timeFrom}
              onChangeText={setTimeFrom}
              isMandatory={true}
              style={{ flex: 1 }}
            />
            <View style={{ width: 20 }} />
            <DropdownField
              label="Đến giờ"
              placeholder="00:00"
              value={timeTo}
              onChangeText={setTimeTo}
              isMandatory={true}
              style={{ flex: 1 }}
            />
          </View>

          <View style={styles.separator} />

          {/* 2. ĐỊA CHỈ CƯ TRÚ (a54.jpg) */}
          <Text style={styles.sectionTitle}>Địa chỉ cư trú</Text>

          <DropdownField
            label="Tỉnh/Thành phố"
            placeholder="Chọn Tỉnh/Thành phố"
            value={residentCity}
            onChangeText={setResidentCity}
            isMandatory={true}
          />
          <DropdownField
            label="Xã/phường/đặc khu"
            placeholder="Chọn Xã/phường/đặc khu"
            value={residentDistrict}
            onChangeText={setResidentDistrict}
            isMandatory={true}
          />
          <InputField
            label="Số nhà, đường phố/xóm/ấp/thôn"
            placeholder="Nhập số nhà, đường phố/xóm/ấp/thôn"
            value={residentAddress}
            onChangeText={setResidentAddress}
            isMandatory={true}
          />
          <InputField
            label="Điện thoại"
            placeholder="Nhập số điện thoại"
            value={residentPhone}
            onChangeText={setResidentPhone}
          />
          <InputField
            label="Email"
            placeholder="Nhập Email"
            value={residentEmail}
            onChangeText={setResidentEmail}
          />

          <View style={styles.separator} />

          {/* 3. ĐỊA CHỈ KINH DOANH (a55.jpg) */}
          <Text style={styles.sectionTitle}>Địa chỉ kinh doanh</Text>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() =>
              setIsBusinessAddressSame(
                isBusinessAddressSame === 'unchecked' ? 'checked' : 'unchecked',
              )
            }
          >
            <View style={styles.checkbox}>
              <Checkbox status={isBusinessAddressSame} />
            </View>
            <Text style={styles.checkboxLabel}>Thay đổi thông tin</Text>
          </TouchableOpacity>

          {isBusinessAddressSame === 'checked' && (
            <>
              <DropdownField
                label="Tỉnh/Thành phố"
                placeholder="Chọn Tỉnh/Thành phố"
                value={businessCity}
                onChangeText={setBusinessCity}
                isMandatory={true}
              />
              <DropdownField
                label="Xã/phường/đặc khu"
                placeholder="Chọn Xã/phường/đặc khu"
                value={businessDistrict}
                onChangeText={setBusinessDistrict}
                isMandatory={true}
              />
              <InputField
                label="Số nhà, đường phố/xóm/ấp/thôn"
                placeholder="Nhập số nhà, đường phố/xóm/ấp/thôn"
                value={businessAddress}
                onChangeText={setBusinessAddress}
                isMandatory={true}
              />
            </>
          )}

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() =>
              setIsBorderBusiness(
                isBorderBusiness === 'unchecked' ? 'checked' : 'unchecked',
              )
            }
          >
            <View style={styles.checkbox}>
              <Checkbox status={isBorderBusiness} />
            </View>
            <Text style={styles.checkboxLabel}>Kinh doanh tại biên giới</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* FOOTER - Nút Tiếp tục */}
        <View style={[styles.footer, { bottom: insets.bottom }]}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleNextStep}
          >
            <Text style={styles.continueButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TaxDeclarationScreen;
