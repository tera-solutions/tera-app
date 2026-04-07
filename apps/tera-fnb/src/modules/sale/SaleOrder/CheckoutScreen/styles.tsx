import { FONT_FAMILY } from '@tera/commons/constants/typography';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerFull: {
    overflow: 'scroll',
    height: Platform.OS === 'web' ? height - 10 : '100%',
  },
  safeArea: {
    flex: 1,
  },
  // Header
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  leftHeader: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  rightHeader: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.BOLD,
    color: '#1F2937',
  },
  iconText: {
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
    backgroundColor: '#F9FAFB',
  },

  // Add Product
  addProductContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: '#EBF4FF',
  },
  addProductText: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '600',
    marginLeft: 5,
  },
  // Cart List
  cartListContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  removeButton: {
    marginRight: 8,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIconWrapper: {
    marginRight: 8,
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  itemName: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
  },
  itemPrice: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginTop: 2,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    width: 85,
  },
  qtyButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  qtyButtonPlus: {
    color: '#10B981',
  },
  qtyText: {
    paddingHorizontal: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
  },
  prepaymentTextPaid: {
    color: '#10B981',
  },
  // Customer Select
  customerSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
  },
  customerSelectText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#4B5563',
    marginLeft: 10,
  },

  // Calculations
  calculationSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  calcLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calcLabelText: {
    fontSize: 15,
    color: '#1F2937',
  },
  calcValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calcValueText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalAmountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  negativeValue: {
    color: '#EF4444', // Màu đỏ cho giá trị âm (giảm giá)
  },
  calcBadge: {
    backgroundColor: '#D1FAE5',
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginLeft: 5,
  },
  discountBadgeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  subCalcRow: {
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 5,
  },
  prepaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  prepaymentText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 10,
  },

  // Note Section
  noteSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
  },
  noteInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingTop: 0,
    paddingBottom: 0,
  },
  imageButton: {
    marginLeft: 10,
    padding: 5,
  },

  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF4FF', // Nền màu xanh nhạt
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  customerPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },

  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 15,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#E5E7EB',
  },
  printButton: {
    backgroundColor: '#0047d4ff',
  },
  saveButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 16,
  },
  checkoutButton: {
    backgroundColor: '#10B981', // Màu xanh lá cho Thanh toán
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Cập nhật để chứa button VNĐ và % như a16.jpg
  discountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    paddingHorizontal: 5,
  },
  discountText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  discountUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 4,
  },

  // KHUYẾN MÃI (Promo Row)
  promoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  promoBadge: {
    backgroundColor: '#D1FAE5',
    color: '#10B981',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },

  // HẸN GIỜ GIAO
  timeScheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10, // Cách Note Section
  },
  scheduleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#4B5563',
    marginLeft: 10,
  },

  // NGÀY TẠO
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4B5563',
    marginLeft: 10,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },

  // THÊM THÔNG TIN
  addInfoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    marginHorizontal: 15,
    backgroundColor: '#EBF4FF', // Nền màu xanh nhạt
    borderRadius: 8,
    marginBottom: 15,
  },
  addInfoContent: {
    marginLeft: 10,
    flex: 1,
  },
  addInfoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  addInfoText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
});
