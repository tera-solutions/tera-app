import colors from '@tera/common/constants/colors';
import { FONT_FAMILY } from '@tera/common/constants/typography';
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
  titleText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.Medium,
    textAlign: 'center',
    color: '#1F2937',
  },

  scrollContent: { paddingHorizontal: 15, paddingTop: 10 },

  // Note
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE', // Màu xanh nhạt
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  noteText: {
    fontSize: 14,
    color: '#1F2937',
    flexShrink: 1,
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
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
});
