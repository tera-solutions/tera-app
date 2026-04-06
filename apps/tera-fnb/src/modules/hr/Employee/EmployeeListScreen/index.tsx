import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { styles } from './styles';

interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'Đang làm việc' | 'Nghỉ việc';
}

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Nguyễn Quốc Trường',
    phone: '0372136156',
    email: 'truonghbc004@gmail.com',
    status: 'Đang làm việc',
  },
  {
    id: '2',
    name: 'Trần Văn A',
    phone: '0901xxxxxx',
    email: 'vana@company.com',
    status: 'Đang làm việc',
  },
  {
    id: '3',
    name: 'Lê Thị B',
    phone: '0912xxxxxx',
    email: 'thib@company.com',
    status: 'Nghỉ việc',
  },
];

const EmployeeItem: React.FC<{ employee: Employee; onPress: () => void }> = ({
  employee,
  onPress,
}) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{employee.name.charAt(0)}</Text>
    </View>
    <View style={styles.info}>
      <Text style={styles.name}>{employee.name}</Text>
      <Text style={styles.contact}>{employee.phone}</Text>
      <Text style={styles.contact}>{employee.email}</Text>
    </View>
    <Text
      style={[
        styles.status,
        employee.status === 'Đang làm việc' && styles.statusActive,
      ]}
    >
      {employee.status}
    </Text>
  </TouchableOpacity>
);

const EmployeeListScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Hàm điều hướng đến màn hình Chi tiết nhân viên
  const handleViewDetail = (employeeId: string) => {
    router.push({
      pathname: '/hr/employee/[id]',
      params: { id: employeeId },
    });
  };

  // Hàm điều hướng đến màn hình Thêm mới nhân viên
  const handleAddNewEmployee = () => {
    router.push('/hr/employee/add-edit');
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Quản lý nhân viên</Text>
          <TouchableOpacity onPress={() => console.tron('Tìm kiếm')}>
            <Icon source="magnify" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* LIST */}
        <FlatList
          data={MOCK_EMPLOYEES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EmployeeItem
              employee={item}
              onPress={() => handleViewDetail(item?.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />

        {/* FLOATING ACTION BUTTON (Thêm mới) */}
        <TouchableOpacity
          style={[styles.fabButton, { bottom: insets.bottom + 20 }]}
          onPress={() => handleAddNewEmployee()}
        >
          <Icon source="plus" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default EmployeeListScreen;
