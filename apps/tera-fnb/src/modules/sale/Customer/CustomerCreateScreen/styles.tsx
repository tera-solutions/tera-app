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
    backgroundColor: '#FFFFFF',
  },
  mt10: {
    marginTop: 10,
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
  headerIcon: { width: 30, alignItems: 'center' },
  // Scroll Content
  scrollContent: {
    paddingBottom: 20,
  },

  // Input Section
  inputSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
  },

  // Simple Input Group
  inputGroup: {
    paddingVertical: 5,
  },
  inputLabel: {
    fontSize: 13,
    color: '#6B7280',
    paddingTop: 5,
    marginBottom: 5,
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
  },

  // Input Row (for 2 columns)
  inputGroupRow: {
    flexDirection: 'row',
  },

  // Picker Rows (for select fields)
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  pickerRowHalf: {
    flex: 1,
    paddingVertical: 5,
  },
  pickerLabel: {
    fontSize: 15,
    color: '#6B7280',
    flex: 1,
  },
  pickerValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginRight: 5,
    textAlign: 'right',
  },
  createNewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },

  // Switch Row (for toggle)
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 15,
    color: '#1F2937',
  },

  // Footer Actions
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  deleteButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    marginLeft: 0,
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
