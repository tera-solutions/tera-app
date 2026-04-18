import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Đẩy Dialog lên từ dưới
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    width: width,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 15,
  },
  modalView: {
    position: 'relative',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 30, // Khoảng cách cho thanh Home Indicator
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },

  // Total Amount
  totalAmountContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totalAmountText: {
    fontSize: 32, // Kích thước lớn
    fontWeight: 'bold',
    color: '#EF4444', // Màu cam/đỏ đậm như trong hình
  },

  // Input Khách đã trả
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 5,
  },
  paidInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    padding: 0,
    margin: 0,
  },

  // Khách còn nợ
  debtContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  debtLabel: {
    fontSize: 15,
    color: '#1F2937',
    marginRight: 5,
  },
  debtValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  debtValuePositive: {
    color: '#EF4444', // Màu đỏ nếu còn nợ
  },
  debtValueNegative: {
    color: '#10B981', // Màu xanh nếu trả đủ/thừa
  },

  // Payment Methods
  sourceLabel: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 10,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  methodButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 10,
  },
  methodButtonSelected: {
    backgroundColor: '#EBF4FF', // Nền xanh nhạt
    borderColor: '#3B82F6', // Viền xanh dương
  },
  methodText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  methodTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },

  // Bottom Buttons
  bottomActions: {
    // Chỉ có một nút, chiếm toàn bộ chiều rộng
  },
  confirmButton: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
