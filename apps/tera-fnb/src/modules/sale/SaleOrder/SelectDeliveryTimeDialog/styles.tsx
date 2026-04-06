import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Đẩy Dialog lên từ dưới (như Bottom Sheet)
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
    position: "relative",
    backgroundColor: 'white',
    width: '100%',
    height: "100%",
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

  // Input Rows
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  inputLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  inputValueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputValue: {
    fontSize: 16,
    color: '#1F2937',
    marginRight: 10,
    fontWeight: '600',
  },
  placeholderValue: {
      color: '#9CA3AF',
      fontWeight: '400',
  },
  
  // Reminder Picker (Dropdown nội tuyến)
  reminderPicker: {
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 8,
      marginVertical: 10,
  },
  pickerOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
  },
  pickerOptionText: {
      fontSize: 15,
      color: '#1F2937',
  },
  
  // Bottom Buttons
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: '#10B981', // Màu xanh lá cho Lưu
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});