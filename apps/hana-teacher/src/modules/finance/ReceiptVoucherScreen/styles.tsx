import { Dimensions, StyleSheet } from 'react-native';

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
    borderBottomColor: '#F3F4F6',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },

  // Amount Display
  amountContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 10,
  },
  amountText: {
    fontSize: 48,
    fontWeight: '300', // Font nhẹ hơn cho số tiền lớn
    color: '#1F2937',
  },
  underline: {
    width: width * 0.2,
    height: 2,
    backgroundColor: '#3B82F6',
    marginTop: 5,
  },

  // Info Fields
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
  },

  // MỚI: More Info Panel (Chi tiết)
  moreInfoPanel: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
  },
  detailInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  detailInputPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  // Thêm thông tin
  moreInfoButton: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 10,
  },
  moreInfoText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  extraInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingVertical: 5,
    fontSize: 15,
    marginBottom: 10,
  },

  // Keypad
  keypadContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  keypadButton: {
    width: width / 3,
    height: (Dimensions.get('window').height - 500) / 4, // Chia phần còn lại cho 4 hàng
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  keypadText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#1F2937',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveAndNewButton: {
    flex: 1,
    marginRight: 5,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9CA3AF',
  },
  saveAndNewText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: '#3B82F6', // Màu xanh dương nổi bật
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
