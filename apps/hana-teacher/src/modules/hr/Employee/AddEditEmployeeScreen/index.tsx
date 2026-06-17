import { TextInput } from '@components/ui';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: string;
  secureTextEntry?: boolean;
  isPassword?: boolean;
  isMultiline?: boolean;
  isMandatory?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
  isPassword = false,
  isMandatory = false,
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label} {isMandatory && <Text style={{ color: '#EF4444' }}>*</Text>}
      </Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={label === 'Số điện thoại' ? 'phone-pad' : 'default'}
        />
        {icon && (
          <TouchableOpacity onPress={() => console.tron(`Open ${label}`)}>
            <Icon source={icon} size={22} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        {isPassword && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
            <Icon
              source={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// --- Màn hình chính Thêm/Sửa Nhân viên ---
const AddEditEmployeeScreen: React.FC = () => {
  const router = useRouter();

  // States cho Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // States cho Phân quyền
  const [role, setRole] = useState('Nhân viên bán hàng');
  const [canViewCost, setCanViewCost] = useState(false);
  const [canViewShippingPrice, setCanViewShippingPrice] = useState(false);

  const handleSave = () => {
    if (!name || !email) {
      Alert.alert('Lỗi', 'Vui lòng điền Tên nhân viên và Email đăng nhập.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và Nhập lại mật khẩu không khớp.');
      return;
    }
    console.tron('--- API POST/PUT /api/employees ---');
    console.tron('Data saved:', {
      name,
      email,
      role,
      canViewCost,
      canViewShippingPrice,
    });
    // router.back();
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="close" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Thêm mới nhân viên</Text>
          <TouchableOpacity onPress={handleSave}>
            <Icon source="check" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* THÔNG TIN CÁ NHÂN */}
          <View style={styles.section}>
            <InputField
              label="Tên nhân viên"
              placeholder="Nhập tên"
              value={name}
              onChangeText={setName}
              isMandatory={true}
            />
            <InputField
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChangeText={setPhone}
            />
            <InputField
              label="Email đăng nhập"
              placeholder="Nhập email"
              value={email}
              onChangeText={setEmail}
              isMandatory={true}
            />
            <InputField
              label="Địa chỉ"
              placeholder="Nhập địa chỉ"
              value={address}
              onChangeText={setAddress}
            />
            <InputField
              label="Ngày sinh"
              placeholder="Chọn ngày"
              value={dob}
              onChangeText={setDob}
              icon="calendar-month-outline"
            />

            {/* Mật khẩu */}
            <InputField
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              isPassword={true}
              isMandatory={true}
            />
            <InputField
              label="Nhập lại mật khẩu"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              isPassword={true}
              isMandatory={true}
            />
            <Text style={styles.passwordHint}>
              Độ dài ít nhất 8 ký tự, chứa ít nhất 1 ký tự số, 1 ký tự chữ và 1
              ký tự đặc biệt
            </Text>
          </View>

          {/* PHÂN QUYỀN NHÂN VIÊN (VAI TRÒ) */}
          <View style={styles.section}>
            <View style={styles.permissionHeader}>
              <Text style={styles.permissionTitle}>Phân quyền nhân viên</Text>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Thông tin',
                    'Giới hạn chức năng sử dụng phù hợp với nhiệm vụ, vai trò của nhân viên trong cửa hàng.',
                  )
                }
              >
                <Icon source="information-outline" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            <Text style={styles.permissionDescription}>
              Giới hạn chức năng sử dụng phù hợp với nhiệm vụ, vai trò của nhân
              viên trong cửa hàng.
            </Text>
            <TouchableOpacity
              style={styles.roleSelection}
              onPress={() => console.tron('Chọn vai trò')}
            >
              <Text style={styles.roleLabel}>Chọn vai trò</Text>
              <View style={styles.roleValueContainer}>
                <Text style={styles.roleValue}>{role}</Text>
                <Icon source="chevron-right" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* PHÂN QUYỀN DỮ LIỆU */}
          <View style={styles.section}>
            <View style={styles.dataPermissionHeader}>
              <Icon source="database-check-outline" size={20} color="#3B82F6" />
              <Text style={styles.permissionTitle}>Phân quyền dữ liệu</Text>
            </View>
            <Text style={styles.permissionDescription}>
              Cho phép nhân viên xem dữ liệu chi tiết trong cửa hàng
            </Text>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Xem giá vốn, giá nhập</Text>
              <Switch
                onValueChange={setCanViewCost}
                value={canViewCost}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor={'#FFFFFF'}
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Xem giá chuyển hàng</Text>
              <Switch
                onValueChange={setCanViewShippingPrice}
                value={canViewShippingPrice}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AddEditEmployeeScreen;
