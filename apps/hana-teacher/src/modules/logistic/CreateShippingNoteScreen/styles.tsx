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
    justifyContent: 'flex-start',
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
    marginLeft: 15,
  },

  scrollContent: { padding: 15, paddingBottom: 80 },

  // Card & Section
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // 1. Recipient Info
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    fontSize: 16,
    marginBottom: 10,
  },
  inputAddress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  addressText: { fontSize: 16, color: '#1F2937', flex: 1, marginRight: 10 },
  placeholderText: { fontSize: 16, color: '#9CA3AF', flex: 1, marginRight: 10 },

  // 2. Products
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  productName: { flex: 3, fontSize: 15, color: '#1F2937' },
  productQty: {
    flex: 0.5,
    fontSize: 15,
    textAlign: 'center',
    color: '#4B5563',
  },
  productPrice: {
    flex: 2,
    fontSize: 15,
    textAlign: 'right',
    fontWeight: '500',
    color: '#10B981',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  addButtonText: {
    fontSize: 15,
    color: '#10B981',
    marginLeft: 8,
    fontWeight: '500',
  },

  // 3. Shipping Setup
  selectOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectLabel: { fontSize: 15, color: '#4B5563' },
  selectValue: { flexDirection: 'row', alignItems: 'center' },
  carrierText: { fontSize: 15, color: '#1F2937', marginRight: 5 },

  codRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  codLabel: { fontSize: 15, color: '#4B5563' },
  codInput: {
    width: 150,
    textAlign: 'right',
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: { fontSize: 15, color: '#4B5563' },

  // Footer
  footer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: { fontSize: 14, color: '#6B7280' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#EF4444' },
  createButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  createButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
});
