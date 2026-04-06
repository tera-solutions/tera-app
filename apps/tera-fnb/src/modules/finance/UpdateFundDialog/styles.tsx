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
  // Dialog Header
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },

  // Input Fields
  inputArea: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 10,
  },
  textInput: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  balanceInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981', // Green color for balance
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    textAlign: 'left',
  },

  // Action Row (Quay lại / Xác nhận)
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9CA3AF',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmActionButton: {
    flex: 1,
    marginLeft: 0,
    backgroundColor: '#10B981', // Green confirm button
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmActionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Numpad Styles
  numpadContainer: {
    padding: 5,
    backgroundColor: '#F3F4F6',
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  numpadButton: {
    width: (width - 25) / 4, // 4 buttons + margin
    height: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 1,
    marginVertical: 1,
  },
  numpadText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#1F2937',
  },
  numpadTextSmall: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1F2937',
  },
  wideButton: {
    width: (width - 25) / 2, // 2 buttons per row
  },
  confirmButton: {
    backgroundColor: '#3B82F6', // Blue for OK/Confirm
  },
  confirmText: {
    color: '#FFFFFF',
  },
});
