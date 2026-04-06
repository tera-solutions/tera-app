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
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleText: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  scrollContent: { paddingBottom: 20 },

  // Input Section
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  inputLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 0,
  },
  passwordHint: {
    fontSize: 12,
    color: '#9CA3AF',
    paddingBottom: 10,
  },

  // Permission Section
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  dataPermissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 5,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 10,
  },
  permissionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  roleSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  roleLabel: { fontSize: 16, color: '#1F2937' },
  roleValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleValue: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 5,
  },

  // Data Toggle
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleLabel: { fontSize: 16, color: '#1F2937' },
});
