import { formatNumber } from '@tera/commons/utils';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import UpdateFundDialog, { FundSource } from '../UpdateFundDialog';
import { styles } from './styles';

// --- 1. Dữ liệu giả định ---
const MOCK_FUND_SOURCES: FundSource[] = [
  {
    id: '1',
    name: 'Tiền mặt',
    balance: 622150,
    iconName: 'minus-circle-outline',
  },
  { id: '2', name: 'Ví điện tử', balance: 0, iconName: 'minus-circle-outline' },
  { id: '3', name: 'Ngân hàng', balance: 0, iconName: 'minus-circle-outline' },
];

// --- 2. Component Item Nguồn Tiền ---
const FundSourceItem: React.FC<{
  item: FundSource;
  onEdit: (fund: FundSource) => void;
}> = ({ item, onEdit }) => (
  <View style={styles.fundItem}>
    <View style={styles.fundInfo}>
      <View style={{ marginRight: 10 }}>
        <Icon source={item.iconName} size={24} color="#9CA3AF" />
      </View>

      <View>
        <Text style={styles.fundName}>{item.name}</Text>
        <Text style={styles.fundBalance}>{formatNumber(item.balance)}</Text>
      </View>
    </View>

    <View style={styles.fundActions}>
      <TouchableOpacity
        onPress={() => onEdit(item)}
        style={{ marginRight: 15 }}
      >
        <Icon source="pencil" size={20} color="#6B7280" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.tron(`Sắp xếp ${item.name}`)}>
        <Icon source="arrow-all" size={24} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  </View>
);

// --- 3. Màn hình chính ---
const FundAccountScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fundSources, setFundSources] =
    useState<FundSource[]>(MOCK_FUND_SOURCES);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFund, setSelectedFund] = useState<FundSource | undefined>();

  const handleEdit = (fund: FundSource) => {
    setSelectedFund(fund);
    setIsModalVisible(true);
  };

  const handleConfirmUpdate = (fundId: string, newBalance: number) => {
    setFundSources((prevSources) =>
      prevSources.map((fund) =>
        fund.id === fundId ? { ...fund, balance: newBalance } : fund,
      ),
    );
    setSelectedFund(undefined);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Quản lý nguồn tiền</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* BANNER THÔNG BÁO LIÊN KẾT */}
          <View style={styles.notifyBanner}>
            <Text style={styles.notifyText}>
              Sổ Bán Hàng hỗ trợ thông báo tiền về đối với các ngân hàng đối
              tác.
              <Text
                style={styles.linkText}
                onPress={() =>
                  console.tron('Chuyển đến màn hình Liên kết ngân hàng')
                }
              >
                {' '}
                Liên kết ngay →
              </Text>
            </Text>
          </View>

          {/* NÚT CHUYỂN TIỀN */}
          <TouchableOpacity
            style={styles.transferButton}
            onPress={() => console.tron('Mở chức năng Chuyển tiền')}
          >
            <Icon source="swap-horizontal" size={20} color="#3B82F6" />
            <Text style={styles.transferButtonText}>Chuyển tiền</Text>
          </TouchableOpacity>

          {/* DANH SÁCH NGUỒN TIỀN */}
          <View style={styles.fundListSection}>
            {MOCK_FUND_SOURCES.map((source) => (
              <FundSourceItem
                key={source.id}
                item={source}
                onEdit={handleEdit}
              />
            ))}
          </View>
        </ScrollView>

        {/* FLOATING ACTION BUTTON */}
        <TouchableOpacity
          style={[styles.fabButton, { bottom: insets.bottom + 20 }]}
          onPress={() => console.tron('Thêm nguồn tiền mới')}
        >
          <Icon source="plus" size={24} color="#FFFFFF" />
          <Text style={styles.fabText}>Thêm nguồn tiền</Text>
        </TouchableOpacity>
        {/* MODAL CHỈNH SỬA NGUỒN TIỀN */}
        <UpdateFundDialog
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          currentFund={selectedFund}
          onConfirm={handleConfirmUpdate}
        />
      </SafeAreaView>
    </View>
  );
};

export default FundAccountScreen;
