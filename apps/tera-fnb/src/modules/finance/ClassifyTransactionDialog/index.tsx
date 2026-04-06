import { TextInput } from '@components/ui';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { styles } from './styles';
// --- 1. Dữ liệu giả định ---
export interface ClassificationItem {
  id: string;
  label: string;
  description: string;
  isDebt: boolean;
}

const MOCK_CLASSIFICATIONS: ClassificationItem[] = [
  // CÔNG NỢ
  {
    id: 'TRA_NO_DON',
    label: 'Trả nợ đơn',
    description: 'Thanh toán cho đơn nhập chưa thanh toán hết',
    isDebt: true,
  },
  {
    id: 'TRA_NO_VAY',
    label: 'Trả nợ',
    description: 'Tạo giao dịch thanh toán cho khoản đi vay khách',
    isDebt: true,
  },
  {
    id: 'TOI_DA_DUA',
    label: 'Tôi đã đưa',
    description: 'Tạo giao dịch cho khách vay',
    isDebt: true,
  },

  // KHÁC
  { id: 'CHUA_PL', label: 'Chưa phân loại', description: '', isDebt: false },
  {
    id: 'CP_AN_UONG',
    label: 'Chi phí ăn uống, di chuyển',
    description: '',
    isDebt: false,
  },
  {
    id: 'CP_THUE_NHA',
    label: 'Thuê nhà, mặt bằng, văn phòng',
    description: '',
    isDebt: false,
  },
  {
    id: 'CP_DIEN_NUOC',
    label: 'Điện, nước, internet',
    description: '',
    isDebt: false,
  },
  {
    id: 'CP_THIET_BI',
    label: 'Thiết bị, dụng cụ, phần mềm',
    description: '',
    isDebt: false,
  },
  {
    id: 'CP_LUONG',
    label: 'Chi lương công nhân viên',
    description: '',
    isDebt: false,
  },
];

// --- 2. Xử lý nhóm phân loại ---
const DEBT_CLASSIFICATIONS = MOCK_CLASSIFICATIONS.filter((item) => item.isDebt);
const OTHER_CLASSIFICATIONS = MOCK_CLASSIFICATIONS.filter(
  (item) => !item.isDebt,
);

// --- 3. Component Item Phân loại ---
const ClassificationItem: React.FC<{
  item: ClassificationItem;
  selectedId: string;
  onSelect: (id: string) => void;
}> = ({ item, selectedId, onSelect }) => {
  const isSelected = item.id === selectedId;
  const radioIcon = isSelected ? 'radiobox-marked' : 'radiobox-blank';

  return (
    <TouchableOpacity style={styles.itemRow} onPress={() => onSelect(item.id)}>
      <View style={styles.radioIcon}>
        <Icon
          source={radioIcon}
          size={22}
          color={isSelected ? '#3B82F6' : '#9CA3AF'}
        />
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemLabel}>{item.label}</Text>
        {item.description ? (
          <Text style={styles.itemDescription}>{item.description}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

// --- 4. Màn hình chính (Modal) ---
const ClassifyTransactionDialog: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onSelectClassification: (classification: ClassificationItem) => void;
}> = ({ isVisible, onClose, onSelectClassification }) => {
  const insets = useSafeAreaInsets();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const selectedItem = MOCK_CLASSIFICATIONS.find((item) => item.id === id);
    if (selectedItem) {
      onSelectClassification(selectedItem);
      // onClose(); // Tùy chọn đóng modal sau khi chọn
    }
  };

  const handleCreateNew = () => {
    Alert.alert('Tạo mới', 'Chuyển đến màn hình tạo phân loại mới.');
    // Thêm logic điều hướng đến màn hình tạo phân loại
  };

  const handleEditOther = () => {
    Alert.alert('Sửa', 'Chuyển đến màn hình quản lý phân loại.');
    // Thêm logic điều hướng đến màn hình quản lý phân loại
  };

  const filteredClassifications = MOCK_CLASSIFICATIONS.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const filteredDebt = filteredClassifications.filter((item) => item.isDebt);
  const filteredOther = filteredClassifications.filter((item) => !item.isDebt);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.fullScreenContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon source="arrow-left" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.titleText}>Phân loại</Text>
            <TouchableOpacity onPress={handleCreateNew}>
              <Icon source="plus" size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {/* SEARCH BAR */}
          <View style={styles.searchContainer}>
            <TouchableOpacity
              onPress={() => console.tron('magnify')}
              style={{ marginRight: 8 }}
            >
              <Icon source="magnify" size={24} color="#9CA3AF" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm tên phân loại"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          <ScrollView style={styles.scrollView}>
            {/* NHÓM CÔNG NỢ */}
            <Text style={styles.groupHeader}>CÔNG NỢ</Text>
            {filteredDebt.map((item) => (
              <ClassificationItem
                key={item.id}
                item={item}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            ))}

            {/* NHÓM KHÁC */}
            <View style={styles.otherHeaderContainer}>
              <Text style={styles.groupHeader}>KHÁC</Text>
              <TouchableOpacity onPress={handleEditOther}>
                <View style={styles.editButton}>
                  <Icon source="pencil" size={16} color="#3B82F6" />
                  <Text style={styles.editText}>Sửa</Text>
                </View>
              </TouchableOpacity>
            </View>
            {filteredOther.map((item) => (
              <ClassificationItem
                key={item.id}
                item={item}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default ClassifyTransactionDialog;
