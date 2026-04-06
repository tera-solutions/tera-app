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

  container: {
    paddingHorizontal: 10,
  },

  titleText: { fontSize: 18, fontWeight: '700', color: '#1F2937' },

  scrollContent: { paddingHorizontal: 0, paddingVertical: 10 },

  totalLabel: { color: '#e0e0e0', fontSize: 14 },
  totalValue: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  btnAction: {
    flex: 0.48,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btnText: { marginLeft: 8, color: '#333', fontWeight: '500' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#666',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    borderBottomColor: colors.grayLight,
    borderBottomWidth: 1,
  },
  tableName: { fontSize: 16, fontWeight: '600' },
  tableSub: { fontSize: 12, color: '#888' },
  tableSize: { fontWeight: 'bold', color: colors.primaryLight },
});
