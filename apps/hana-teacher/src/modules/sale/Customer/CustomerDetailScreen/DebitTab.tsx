import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from './styles';
// --- 1. Dữ liệu giả định ---
interface Transaction {
  id: string;
  date: string;
  time: string;
  description: 'Thanh toán' | 'Trả nợ' | 'Tôi đã nhận';
  amount: number; // Âm là chi, Dương là thu/ghi nhận nợ
  balance: number; // Số dư nợ/thu sau giao dịch
}

const MOCK_TRANSACTIONS: Transaction[] = [
  // Giao dịch mô phỏng hình a39.jpg
  {
    id: 't1',
    date: '10/12/25',
    time: '21:44',
    description: 'Trả nợ',
    amount: -1000000,
    balance: 0,
  },
  {
    id: 't2',
    date: '10/12/25',
    time: '21:44',
    description: 'Thanh toán',
    amount: 1000000,
    balance: 1000000,
  },

  // Thêm giao dịch giả lập khác
  {
    id: 't3',
    date: '01/12/25',
    time: '10:00',
    description: 'Tôi đã nhận',
    amount: 500000,
    balance: 2000000,
  },
  {
    id: 't4',
    date: '05/11/25',
    time: '15:30',
    description: 'Trả nợ',
    amount: -500000,
    balance: 1500000,
  },
];

const MOCK_DEBT_BALANCE = 0; // Số dư cuối cùng (0 đ như trong hình a39.jpg)

const formatCurrency = (num: number) => {
  // Định dạng số tiền, nếu âm thì thêm dấu trừ
  const sign = num < 0 ? '-' : '+';
  const absNum = Math.abs(num);
  return `${sign}${absNum.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}`;
};

// --- 2. Component Item Giao dịch ---
const TransactionItem: React.FC<{ item: Transaction }> = ({ item }) => {
  const isNegative = item.amount < 0;
  const amountColor = isNegative ? styles.negativeText : styles.positiveText;

  return (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => console.tron(`Xem giao dịch ${item.id}`)}
    >
      <View style={styles.dateCell}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>

      <View style={styles.descriptionCell}>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>

      <View style={styles.amountBalanceCell}>
        <Text style={[styles.amountText, amountColor]}>
          {formatCurrency(item.amount)}
        </Text>
        <Text style={styles.balanceText}>{formatCurrency(item.balance)}</Text>
      </View>
    </TouchableOpacity>
  );
};

// --- 3. Component Tab Sổ Nợ ---
export const DebitTab: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  const filteredTransactions = MOCK_TRANSACTIONS; // Tạm thời không lọc

  return (
    <View style={styles.scrollContent}>
      {/* TỔNG QUAN NỢ */}
      <View style={styles.debtSummary}>
        <Icon source="cash-multiple" size={20} color="#10B981" />
        <Text style={styles.debtTitle}>Thanh toán hết</Text>
        <Text style={styles.debtAmount}>
          {formatCurrency(MOCK_DEBT_BALANCE)} đ
        </Text>
      </View>

      {/* TAB FILTER */}
      <View style={styles.tabFilterContainer}>
        {/* Tab 'Tất cả' */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeFilter === 'Tất cả' && styles.activeTabButton,
          ]}
          onPress={() => setActiveFilter('Tất cả')}
        >
          <Text style={styles.tabText}>Tất cả</Text>
          {activeFilter === 'Tất cả' && (
            <View style={{ marginLeft: 5 }}>
              <Icon source="close-circle" size={16} color="#9CA3AF" />
            </View>
          )}
        </TouchableOpacity>

        {/* Thêm các tab khác nếu cần, ví dụ 'Chưa thanh toán' */}
      </View>

      {/* HEADER DANH SÁCH */}
      <View style={styles.listHeader}>
        <Text style={styles.headerCell}>Lịch sử chi tiết</Text>
        <Text style={styles.headerCellRight}>Ghi nhận</Text>
        <Text style={styles.headerCellRight}>Số dư</Text>
      </View>

      {/* DANH SÁCH GIAO DỊCH */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        contentContainerStyle={styles.listContent}
      />

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => console.tron('Tạo giao dịch nợ mới')}
      >
        <Icon source="plus" size={24} color="#FFFFFF" />
        <Text style={styles.fabText}>Điều chỉnh công nợ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DebitTab;
