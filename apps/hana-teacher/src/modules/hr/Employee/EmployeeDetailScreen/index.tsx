import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || '---'}</Text>
  </View>
);

const EmployeeDetailScreen: React.FC = () => {
  const router = useRouter();

  const employee = {
    // Dữ liệu giả định
    name: 'Nguyễn Quốc Trường',
    initials: 'NT',
    phone: '0372136156',
    email: 'truonghbc004@gmail.com',
    address: '228 Nam Kỳ Khởi Nghĩa, Q.3, TP.HCM',
    dob: '05/09/1995',
    role: 'Chủ cửa hàng',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon source="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Chi tiết nhân viên</Text>
        <TouchableOpacity onPress={() => console.tron('Chỉnh sửa')}>
          <Icon source="pencil" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* THÔNG TIN CƠ BẢN */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{employee.initials}</Text>
          </View>
          <Text style={styles.profileName}>{employee.name}</Text>
          <Text style={styles.profileContact}>{employee.phone}</Text>
          <Text style={styles.profileContact}>{employee.email}</Text>
        </View>

        {/* CONTACT ACTIONS */}
        <View style={styles.contactActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.tron('Nhắn tin')}
          >
            <Icon source="chat" size={28} color="#3B82F6" />
            <Text style={styles.actionText}>Nhắn tin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.tron('Gọi điện')}
          >
            <Icon source="phone" size={28} color="#3B82F6" />
            <Text style={styles.actionText}>Gọi điện</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.tron('Email')}
          >
            <Icon source="email" size={28} color="#3B82F6" />
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
        </View>

        {/* CHI TIẾT THÊM */}
        <View style={styles.detailSection}>
          <DetailItem label="Địa chỉ" value={employee.address} />
          <DetailItem label="Ngày sinh" value={employee.dob} />
        </View>

        {/* PHÂN QUYỀN */}
        <View style={styles.permissionSection}>
          <View style={styles.permissionHeader}>
            <Icon source="lock-check-outline" size={20} color="#3B82F6" />
            <Text style={styles.permissionTitle}>Phân quyền nhân viên</Text>
          </View>
          <View style={styles.roleRow}>
            <Text style={styles.roleLabel}>Vai trò</Text>
            <Text style={styles.roleValue}>{employee.role}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmployeeDetailScreen;
