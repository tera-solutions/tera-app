import { FONT_FAMILY } from '@common/constants/typography';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerFull: {
    overflow: 'scroll',
    height: Platform.OS === 'web' ? height - 10 : '100%',
    backgroundColor: '#f5f5f5',
  },
  safeArea: {
    flex: 1,
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
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  headerInfo: {
    justifyContent: 'center',
  },
  locationNameHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
  },

  // Inner Tab Bar (Tổng quan/Số nợ)
  innerTabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0ff',
  },
  innerTab: {
    paddingVertical: 12,
    flex: 1,
  },
  innerTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 5,
    textAlign: 'center',
  },
  activeInnerTab: {
    color: '#3B82F6',
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },

  // Content Sections
  scrollContent: {
    paddingBottom: 80,
    paddingHorizontal: 10,
    minHeight: height * 0.8,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    paddingVertical: 10,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },

  // Revenue Stats
  revenueStats: {
    // Chỉ thêm padding trên/dưới nếu cần, nhưng 15 là đủ
    paddingVertical: 10,
  },
  timeFilterBar: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    marginBottom: 10,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTimeFilter: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  timeFilterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTimeFilterText: {
    color: '#1F2937',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  flexRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metricItem: {
    alignItems: 'center',
    paddingVertical: 5,
    // Dùng border nhẹ để phân tách 2 metric
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
    flex: 1,
    paddingHorizontal: 10,
  },
  metricLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 5,
    marginRight: 10,
  },
  metricValue: {
    fontSize: 20,
    fontFamily: FONT_FAMILY.BOLD,
    color: '#1F2937',
    marginTop: 5,
  },
  lastPurchase: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 5,
  },

  // Top Products Table
  productTable: {
    // ...
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableHeader: {
    backgroundColor: '#F9FAFB',
  },
  productCell: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '500',
  },
  productName: {
    textAlign: 'left',
    fontWeight: 'normal',
    color: '#1F2937',
  },

  // Recent Orders
  orderCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderDateTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  orderCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6', // Màu liên kết
    marginRight: 10,
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#D1FAE5', // Light Green
    color: '#065F46', // Dark Green
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  orderSummaryText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 2,
  },

  // Note Section
  noteSection: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  noteInput: {
    fontSize: 15,
    color: '#4B5563',
    minHeight: 30,
  },

  // Debt Summary
  debtSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#D1FAE5', // Light Green background
    marginHorizontal: 10,
    marginTop: 8,
    borderRadius: 8,
  },
  debtTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46', // Dark Green text
    marginLeft: 8,
    marginRight: 10,
  },
  debtAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065F46',
  },

  // Tab Filter
  tabFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  activeTabButton: {
    borderColor: '#9CA3AF',
    backgroundColor: '#E5E7EB',
  },
  tabText: {
    fontSize: 14,
    color: '#1F2937',
  },

  // List Header
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 5,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    flex: 2, // Cho phần mô tả
  },
  headerCellRight: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    flex: 1,
    textAlign: 'right',
  },

  // Transaction Item
  listContent: {
    paddingBottom: 80, // Dành chỗ cho FAB
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dateCell: {
    flex: 1,
    justifyContent: 'center',
  },
  descriptionCell: {
    flex: 2,
    justifyContent: 'center',
  },
  amountBalanceCell: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  descriptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '600',
  },
  balanceText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  // Colors
  negativeText: {
    color: '#EF4444', // Red (Chi/Trả nợ)
  },
  positiveText: {
    color: '#10B981', // Green (Thu/Ghi nhận nợ)
  },

  // Section Container
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  // Info Item Row
  infoItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 13,
    color: '#919191ff',
    marginBottom: 2,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 15,
    fontFamily: FONT_FAMILY.Medium,
    color: '#1F2937',
  },

  // Status Section
  statusSection: {
    paddingVertical: 15,
    alignItems: 'flex-start',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusActive: {
    backgroundColor: '#10B981', // Green
  },
  statusInactive: {
    backgroundColor: '#EF4444', // Red (Tạm dừng)
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },

  // Delete Button
  deleteButton: {
    marginTop: 20,
    marginHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  // Floating Action Button (FAB)

  fabButton: {
    position: 'absolute',
    width: width * 0.55,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    right: (width * 0.5) / 2 - 20,
    bottom: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },

  fabText: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.Medium,
    fontSize: 16,
    marginLeft: 8,
  },
});
