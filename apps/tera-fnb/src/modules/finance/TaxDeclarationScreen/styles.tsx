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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: colors.primary, // Màu đỏ nổi bật
  },
  titleText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 100,
    backgroundColor: '#FFFFFF',
  },

  // Section Header
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    paddingVertical: 15,
    marginTop: 5,
  },

  // NNT Info
  personInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  personInfoLabel: { fontSize: 14, color: '#6B7280' },
  personInfoValue: { fontSize: 16, fontWeight: '600', color: '#1F2937' },

  // Input Fields
  inputContainer: { paddingVertical: 5 },
  inputLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 5,
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  taxIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  taxIdLabel: { fontSize: 14, color: '#6B7280' },
  taxIdValue: { fontSize: 16, fontWeight: '600', color: '#1F2937' },

  // Dropdown (Simplified)
  dropdownView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownText: { fontSize: 16, color: '#1F2937' },

  // Buttons
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 5,
    marginBottom: 10,
  },
  addButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },

  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkbox: {
    borderWidth: Platform.OS === 'web' ? 0 : 1,
    borderColor: '#dadada',
    borderRadius: 8,
  },
  checkboxLabel: { fontSize: 14, color: '#1F2937', marginLeft: 8 },

  // Time Input
  timeTitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 15,
    marginBottom: 5,
  },
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 10,
    paddingHorizontal: 15,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
