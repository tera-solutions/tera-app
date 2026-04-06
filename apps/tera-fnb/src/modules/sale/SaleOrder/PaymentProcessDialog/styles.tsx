import colors from '@tera/common/constants/colors';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },

  contentContainer: {
    flex: 1,
    padding: 20,
  },

  // Paid Input
  paidInputContainer: {
    marginBottom: 15,
  },
  paidLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 10,
    textAlign: "center"
  },
  paidInput: {
    fontSize: 36, 
    height: 60,
    fontWeight: 'bold',
    color: '#3B82F6',
    textAlign: 'center',
  },

  // Debt Row
  debtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  debtLabel: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 10,
  },

  // Payment Methods Grid
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  methodButton: {
    width: (width * 0.9 - 40) / 3, // Khoảng 1/3 chiều rộng màn hình
    height: ((width * 0.9 - 40) / 3) * 0.6, // Tỷ lệ cho button
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    margin: 5,
    backgroundColor: '#FFFFFF',
  },
  methodButtonSelected: {
    backgroundColor: '#3B82F6', // Màu xanh dương nổi bật
    borderColor: '#3B82F6',
  },
  methodText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  methodTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // VietQR special style
  vietQRContent: {
    alignItems: 'center',
  },
  methodSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  methodSubTextSelected: {
    color: '#FFFFFF',
  },

  // Shipping Options Section (MỚI)
  shippingOptionsSection: {
      width: '100%',
      paddingHorizontal: 10,
  },
  shippingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  shippingLabel: {
    fontSize: 15,
    color: '#1F2937',
    marginLeft: 10,
  },

  // Bottom Bar
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: colors.primary,
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
