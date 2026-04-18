import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

interface Transaction {
  id: number;
  date: string;
  description: string;
  customer: string;
  amount: number; // Dương là Thu, Âm là Chi
  type: 'INCOME' | 'EXPENSE' | 'DEBT_PAYMENT' | 'DEBT_COLLECTION';
  paymentMethod: string;
  time: string;
  orderCode?: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    date: '10/12/2025',
    description: 'Trả nợ',
    customer: 'Anh Cườnghf',
    amount: -1000000,
    type: 'DEBT_PAYMENT',
    paymentMethod: 'Tiền mặt',
    time: '21:45',
  },
  {
    id: 2,
    date: '10/12/2025',
    description: 'Tôi đã nhận',
    customer: 'Anh Cườnghf',
    amount: 1000000,
    type: 'DEBT_COLLECTION',
    paymentMethod: 'Tiền mặt',
    time: '21:44',
  },
  {
    id: 3,
    date: '08/12/2025',
    description: 'Bán hàng',
    customer: 'Khách lẻ',
    amount: 47150,
    type: 'INCOME',
    paymentMethod: 'Tiền mặt',
    time: '22:46',
    orderCode: 'VVMPVC',
  },
  {
    id: 4,
    date: '07/12/2025',
    description: 'Bán hàng',
    customer: 'Khách lẻ',
    amount: 100000,
    type: 'INCOME',
    paymentMethod: 'Tiền mặt',
    time: '00:53',
    orderCode: 'SCDQST',
  },
  {
    id: 5,
    date: '07/12/2025',
    description: 'Mua hàng',
    customer: 'Nhà CC A',
    amount: -50000,
    type: 'EXPENSE',
    paymentMethod: 'Ngân hàng',
    time: '10:00',
  },
  {
    id: 6,
    date: '08/12/2025',
    description: 'Bán hàng',
    customer: 'Khách lẻ',
    amount: 47150,
    type: 'INCOME',
    paymentMethod: 'Tiền mặt',
    time: '15:46',
    orderCode: 'VVMPVC',
  },
  {
    id: 7,
    date: '07/12/2025',
    description: 'Bán hàng',
    customer: 'Khách lẻ',
    amount: 100000,
    type: 'INCOME',
    paymentMethod: 'Tiền mặt',
    time: '12:53',
    orderCode: 'SCDQST',
  },
  {
    id: 8,
    date: '07/12/2025',
    description: 'Mua hàng',
    customer: 'Nhà CC A',
    amount: -50000,
    type: 'EXPENSE',
    paymentMethod: 'Ngân hàng',
    time: '4:00',
  },
];

const MOCK_SUMMARY = {
  totalExpense: 1046000,
  totalIncome: 1668150,
  balance: 622150,
};

const formatCurrency = (num: number) => {
  return num.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
};

// --- 2. Xử lý nhóm giao dịch theo ngày ---
const groupTransactionsByDate = (transactions: Transaction[]) => {
  return transactions.reduce(
    (groups: { [key: string]: Transaction[] }, item) => {
      const date = item.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    },
    {},
  );
};

const CashFlowScreen: React.FC = () => {
  const router = useRouter();

  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const groupedTransactions = groupTransactionsByDate(transactions);

  // --- 3. Render Card Tổng quan Thu Chi ---
  const RenderSummaryCards = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.balanceWrapper}>
        <Text style={styles.balanceText}>SỐ DƯ</Text>
        <Text style={styles.balanceValue}>
          {formatCurrency(MOCK_SUMMARY.balance)} đ
        </Text>
      </View>

      <View style={styles.cardRow}>
        {/* Tổng Chi */}
        <View style={[styles.summaryCard, styles.expenseCard]}>
          <Icon source="arrow-up-circle-outline" size={20} color="#EF4444" />
          <Text style={styles.cardTitle}>TỔNG CHI</Text>
          <Text style={[styles.cardAmount, styles.expenseText]}>
            {formatCurrency(MOCK_SUMMARY.totalExpense)}
          </Text>
        </View>
        {/* Tổng Thu */}
        <View style={[styles.summaryCard, styles.incomeCard]}>
          <Icon source="arrow-down-circle-outline" size={20} color="#10B981" />
          <Text style={styles.cardTitle}>TỔNG THU</Text>
          <Text style={[styles.cardAmount, styles.incomeText]}>
            {formatCurrency(MOCK_SUMMARY.totalIncome)}
          </Text>
        </View>
      </View>
    </View>
  );

  // --- 4. Render Item Giao dịch ---
  const renderTransactionItem = (item: Transaction) => {
    const isIncome = item.amount > 0;
    const iconName = isIncome
      ? 'arrow-down-circle-outline'
      : 'arrow-up-circle-outline';
    const amountStyle = isIncome ? styles.incomeText : styles.expenseText;

    // Xử lý mô tả giao dịch theo hình a35.jpg
    const mainDesc = item.customer || item.description;
    const subDesc = item.orderCode
      ? `Thanh toán đơn hàng ${item.orderCode}`
      : item.description;

    return (
      <TouchableOpacity
        key={item?.id}
        style={styles.transactionItem}
        onPress={() => console.tron(`Chi tiết GD ${item.id}`)}
      >
        <TouchableOpacity
          style={styles.itemIcon}
          onPress={() => console.tron('iconName')}
        >
          <Icon
            source={iconName}
            size={24}
            color={isIncome ? '#10B981' : '#EF4444'}
          />
        </TouchableOpacity>

        <View style={styles.itemDetails}>
          <Text style={styles.mainDescription}>{mainDesc}</Text>
          <Text style={styles.subDescription}>{subDesc}</Text>
        </View>

        <View style={styles.itemAmountContainer}>
          <Text style={[styles.itemAmount, amountStyle]}>
            {formatCurrency(Math.abs(item.amount))}
          </Text>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>
            <Text style={styles.transactionTime}>| {item.time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // --- 5. Render Danh sách Giao dịch theo Ngày ---
  const renderTransactionList = () => {
    const sortedDates = Object.keys(groupedTransactions).sort(
      (a, b) => new Date(b)!.getTime() - new Date(a)!.getTime(),
    );

    return (
      <FlatList
        data={sortedDates}
        keyExtractor={(item) => item}
        ListHeaderComponent={<RenderSummaryCards />}
        renderItem={({ item: date }) => (
          <View key={date} style={styles.dateGroup}>
            {/* Header Ngày */}
            <View style={styles.dateHeader}>
              <Text style={styles.dateText}>{date}</Text>
              {/* Tổng thu/chi trong ngày (Nếu cần) */}
            </View>

            {/* Danh sách giao dịch trong ngày */}
            {groupedTransactions[date].map(renderTransactionItem)}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  // --- 6. Component chính ---
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
          onPress={() => router.back()}
        >
          <Icon source="arrow-left" size={24} color="#1F2937" />
          <Text style={styles.titleText}>Thu chi</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => console.tron('magnify')}
          >
            <Icon source="magnify" size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => console.tron('currency')}
          >
            <Icon source="currency-usd" size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => console.tron('chart')}
          >
            <Icon source="chart-bar" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* FILTER BAR */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Tháng này</Text>
          <Icon source="chevron-down" size={18} color="#1F2937" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Khách hàng</Text>
          <Icon source="chevron-down" size={18} color="#1F2937" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Phân loại</Text>
          <Icon source="chevron-down" size={18} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* TRANSACTION LIST */}
      <View style={{ flex: 1 }}>{renderTransactionList()}</View>

      {/* FLOATING ACTION BUTTONS */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fabButton, styles.fabExpense]}
          onPress={() => router.push('/finance/payment-voucher')}
        >
          <Icon source="arrow-up" size={24} color="#EF4444" />
          <Text style={styles.fabText}>Khoản chi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fabButton, styles.fabIncome]}
          onPress={() => router.push('/finance/receipt-voucher')}
        >
          <Icon source="arrow-down" size={24} color="#10B981" />
          <Text style={styles.fabText}>Khoản thu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CashFlowScreen;
