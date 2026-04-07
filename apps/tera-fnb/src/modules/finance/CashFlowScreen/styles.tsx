import { FONT_FAMILY } from '@tera/commons/constants/typography';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
  },

  // Filter Bar
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#1F2937',
    marginRight: 2,
  },

  // Summary Cards
  summaryContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  balanceWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  balanceText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 22,
    fontFamily:FONT_FAMILY.BOLD,
    color: '#142235ff',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: (width - 40) / 2, // Tính toán để có 2 cột
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  expenseCard: {
    backgroundColor: '#FEF2F2', // Light Red
    borderColor: '#FEE2E2',
    marginRight: 10,
  },
  incomeCard: {
    backgroundColor: '#ECFDF5', // Light Green
    borderColor: '#A7F3D0',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 5,
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  expenseText: {
    color: '#EF4444', // Red
  },
  incomeText: {
    color: '#10B981', // Green
  },

  // Transaction List
  listContent: {
    paddingBottom: 80, // Dành chỗ cho FAB
    overflowY: 'scroll',
    height: Platform.OS === 'web' ? 500 : 'auto',
    minHeight: height / 2,
  },
  dateGroup: {
    marginBottom: 5,
  },
  dateHeader: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#E5E7EB', // Màu nền phân tách ngày
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemIcon: {
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  mainDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  subDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  itemAmountContainer: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentInfo: {
    flexDirection: 'row',
    marginTop: 2,
  },
  paymentMethod: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  transactionTime: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 4,
  },

  // Floating Action Buttons (FAB)
  fabContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  fabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 5,
  },
  fabExpense: {
    backgroundColor: '#FEE2E2', // Light Red background
  },
  fabIncome: {
    backgroundColor: '#A7F3D0', // Light Green background
  },
  fabText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
