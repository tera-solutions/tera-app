import colors from '@common/constants/colors';
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
  headerIcon: { width: 30, alignItems: 'center' },
  titleText: { fontSize: 18, fontWeight: '700', color: '#1F2937' },

  scrollContent: { paddingHorizontal: 15, paddingTop: 10 },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 15,
    paddingVertical: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#1F2937',
  },
  eyeIcon: { paddingHorizontal: 10 },

  // Note Section
  noteContainer: {
    backgroundColor: '#FEE2E2', // Nền màu đỏ nhạt
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444', // Màu chữ đỏ
  },
  noteText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  saveButton: {
    backgroundColor: colors.primaryLight, // Green save button
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
