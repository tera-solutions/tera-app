import colors from '@tera/common/constants/colors';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerFull: {
    overflow: 'scroll',
    height: Platform.OS === 'web' ? height - 10 : '100%',
  },
 safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  
  scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingBottom: 20,
  },
  
  // Price Section
  priceSection: {
      alignItems: 'center',
      paddingVertical: 10,
  },
  priceLabel: {
      fontSize: 16,
      color: '#6B7280',
  },
  priceValue: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#3B82F6',
  },

  // Info Section
  infoSection: {
      marginTop: 20,
  },
  inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
  },
  inputLabel: {
      fontSize: 14,
      color: '#1F2937',
      width: 100, // Cố định chiều rộng cho label
  },
  costPriceLabel: {
      width: 60,
      textAlign: 'right',
      marginRight: 10,
  },
  textInput: {
      flex: 1,
      fontSize: 16,
      color: '#1F2937',
  },
  halfWidth: {
      flex: 0.5,
  },
  checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
  },
  checkbox: {
      marginRight: 5,
  },
  checkboxLabel: {
      fontSize: 14,
      color: '#4B5563',
  },

  // Keypad
  keypadContainer: {
      width: '100%',
      backgroundColor: '#F3F4F6',
      paddingVertical: 10,
  },
  keypadRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 1,
  },
  keypadButton: {
      width: (width - 4) / 3, // Chia đều 3 cột, trừ đi 4px cho margin
      height: (width - 4) / 3 * 0.45, // Chiều cao hợp lý
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderWidth: 0.5,
      borderColor: '#E5E7EB',
  },
  deleteButton: {
      backgroundColor: '#F3F4F6',
  },
  keypadText: {
      fontSize: 24,
      fontWeight: '300',
      color: '#1F2937',
  },

  // Bottom Bar
  bottomBar: {
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
  }
});
