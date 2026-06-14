import { TextInput } from '@components/ui';
import React, { useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomerItem, { Customer } from './CustomerItem';
import { styles } from './styles';

const DUMMY_CUSTOMERS: Customer[] = [
  { id: 'c0', name: 'Khách lẻ', phone: '0000000000' },
  { id: 'c1', name: 'Anh Trường', phone: '0982131312' }, // Tên từ hình a18.jpg
  { id: 'c2', name: 'Chị Linh', phone: '0901123456' },
];

// --- 3. Dialog Chính ---
interface AddCustomerDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectCustomer: (customer?: Customer) => void;
  onAddNewCustomer: () => void;
}

const SelectCustomerDialog: React.FC<AddCustomerDialogProps> = ({
  isVisible,
  onClose,
  onSelectCustomer,
  onAddNewCustomer,
}) => {
  const [searchText, setSearchText] = useState('');

  const filteredCustomers = DUMMY_CUSTOMERS.filter(
    (cust) =>
      cust.name.toLowerCase().includes(searchText.toLowerCase()) ||
      cust?.phone?.includes(searchText),
  );

  const handleSelect = (customer?: Customer) => {
    onSelectCustomer(customer);
    onClose();
  };

  const handleAddNew = () => {
    onAddNewCustomer(); // Chuyển sang màn hình tạo mới
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenContainer}>
        <SafeAreaView style={styles.safeArea}>
          {/* HEADER (Kết hợp Tìm kiếm và Đóng) */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Icon source="arrow-left" size={24} color="#1F2937" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Nhập tên hoặc số điện thoại"
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
          </View>

          {/* NÚT TẠO MỚI */}
          <TouchableOpacity style={styles.addNewRow} onPress={handleAddNew}>
            <Text style={styles.addNewLabel}>Tạo mới</Text>
            <Icon source="plus" size={24} color="#3B82F6" />
          </TouchableOpacity>

          {/* DANH SÁCH KHÁCH HÀNG */}
          <FlatList
            data={filteredCustomers}
            keyExtractor={(item) => item.id as string}
            renderItem={({ item }) => (
              <CustomerItem customer={item} onSelect={handleSelect} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default SelectCustomerDialog;
